import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../src/index';

// Mock Better Auth
vi.mock('./auth', () => ({
  getAuth: vi.fn(() => ({
    api: {
      getSession: vi.fn(),
    },
    handler: vi.fn(),
  })),
}));

import { getAuth } from './auth';

describe('Hono app with Auth', () => {
  const mockEnv = {
    DB: {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue({ results: [] }),
      run: vi.fn().mockResolvedValue({ success: true }),
    },
    BETTER_AUTH_SECRET: 'test-secret',
    BETTER_AUTH_URL: 'http://localhost:3000',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all pixels from DB (unauthenticated)', async () => {
    const res = await app.request('/pixels', {}, mockEnv as any);
    expect(res.status).toBe(200);
  });

  it('should return 401 for unauthenticated pixel update', async () => {
    const mockAuth = {
      api: {
        getSession: vi.fn().mockResolvedValue(null),
      },
    };
    (getAuth as any).mockReturnValue(mockAuth);

    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 123, color: '#0000ff', link: 'https://test.com' }),
      },
      mockEnv as any
    );

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should update a pixel for authenticated user', async () => {
    const mockAuth = {
      api: {
        getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1' } }),
      },
    };
    (getAuth as any).mockReturnValue(mockAuth);

    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 123, color: '#0000ff', link: 'https://test.com' }),
      },
      mockEnv as any
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });
});
