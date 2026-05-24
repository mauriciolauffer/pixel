export interface Pixel {
  id: number;
  color: string;
  link: string;
  updated_at?: string;
}

export const BILLBOARD_WIDTH = 1000;
export const BILLBOARD_HEIGHT = 1000;
export const TOTAL_PIXELS = BILLBOARD_WIDTH * BILLBOARD_HEIGHT;

export interface APIError {
  error: string;
}

export interface APISuccess {
  success: boolean;
}
