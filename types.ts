export enum IconStyle {
  MINIMALIST = 'Minimalist, flat design, clean lines',
  NEUMORPHIC = 'Neumorphic, soft shadows, 3D feel',
  GRADIENT = 'Vibrant gradient, modern, abstract',
  PIXEL_ART = 'Pixel art, retro, 8-bit style',
  REALISTIC = 'Realistic, 3D render, highly detailed',
  SKETCH = 'Hand-drawn sketch, artistic, rough lines'
}

export interface GeneratedIcon {
  id: string;
  imageUrl: string;
  prompt: string;
  style: IconStyle;
  createdAt: number;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}
