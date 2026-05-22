import { describe, it, expect, vi } from 'vitest';
import app from '../src/index';

describe('Hono app', () => {
  it('should fetch all pixels from DB', async () => {
    const mockPixels = [
      { id: 1, color: '#ff0000', link: 'http://example.com' },
      { id: 2, color: '#00ff00', link: '' },
    ];

    const mockDB = {
      prepare: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue({ results: mockPixels }),
    };

    const res = await app.request('/pixels', {}, { DB: mockDB as any });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockPixels);
  });

  it('should update a pixel with valid data', async () => {
    const mockDB = {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      run: vi.fn().mockResolvedValue({ success: true }),
    };

    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 123, color: '#0000ff', link: 'https://test.com' }),
      },
      { DB: mockDB as any }
    );

    expect(res.status).toBe(200);
    expect(mockDB.bind).toHaveBeenCalledWith(123, '#0000ff', 'https://test.com');
  });

  it('should return 400 for invalid color format', async () => {
    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1, color: 'red', link: '' }),
      }
    );

    expect(res.status).toBe(400);
  });

  it('should return 400 for invalid URL', async () => {
    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1, color: '#ffffff', link: 'not-a-url' }),
      }
    );

    expect(res.status).toBe(400);
  });

  it('should return 400 for out of range ID', async () => {
    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1000000, color: '#ffffff', link: '' }),
      }
    );

    expect(res.status).toBe(400);
  });
});
