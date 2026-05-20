// In production, the API is served from the same origin as the frontend.
// In development, Vite will proxy or we can use an environment variable.
const API_URL = import.meta.env.VITE_API_URL || '';

export interface Pixel {
  id: number;
  color: string;
  link: string;
}

export const fetchPixels = async (): Promise<Pixel[]> => {
  const response = await fetch(`${API_URL}/pixels`);
  if (!response.ok) {
    throw new Error('Failed to fetch pixels');
  }
  return response.json();
};

export const updatePixel = async (pixel: Omit<Pixel, 'updated_at'>): Promise<void> => {
  const response = await fetch(`${API_URL}/pixels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pixel),
  });
  if (!response.ok) {
    throw new Error('Failed to update pixel');
  }
};
