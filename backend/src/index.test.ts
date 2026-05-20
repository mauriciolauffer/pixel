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
    expect(mockDB.prepare).toHaveBeenCalledWith('SELECT id, color, link FROM pixels');
  });

  it('should update a pixel in DB', async () => {
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
    const data = await res.json();
    expect(data).toEqual({ success: true });
    expect(mockDB.prepare).toHaveBeenCalled();
    expect(mockDB.bind).toHaveBeenCalledWith(123, '#0000ff', 'https://test.com');
  });

  it('should return 400 for invalid pixel ID', async () => {
    const res = await app.request(
      '/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: -1, color: '#0000ff', link: '' }),
      }
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid pixel ID');
  });
});
