import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPixels, updatePixel } from './api';

describe('API service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('fetchPixels returns data on success', async () => {
    const mockData = [{ id: 1, color: '#ff0000', link: '' }];
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchPixels();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/pixels'));
  });

  it('fetchPixels throws error on failure', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    await expect(fetchPixels()).rejects.toThrow('Failed to fetch pixels');
  });

  it('updatePixel sends POST request', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
    });

    const pixel = { id: 1, color: '#00ff00', link: 'http://test.com' };
    await updatePixel(pixel);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/pixels'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(pixel),
      })
    );
  });
});
