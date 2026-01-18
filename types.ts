export enum IconStyle {
  MINIMALIST = 'Minimalist, flat design, clean lines',
  NEUMORPHIC = 'Neumorphic, soft shadows, 3D feel',
  GRADIENT = 'Vibrant gradient, modern, abstract',
  PIXEL_ART = 'Pixel art, retro, 8-bit style',
  REALISTIC = 'Realistic, 3D render, highly detailed',
  SKETCH = 'Hand-drawn sketch, artistic, rough lines',
  GLASSMORPHISM = 'Glassmorphism, frosted glass, translucent layers, vibrant colorful background',
  CLAYMORPHIC = 'Claymorphic, soft 3D clay effect, rounded corners, pastel colors',
  CYBERPUNK = 'Cyberpunk, neon lights, high contrast, futuristic dark chrome',
  ISOMETRIC = 'Isometric 3D perspective, geometric precision, architectural',
  KAWAII = 'Kawaii, Japanese cute aesthetic, soft pastel, adorable character feel',
  CORPORATE = 'Corporate Sleek, professional luxury, minimalist branding, high-end finish',
  VINTAGE_BADGE = 'Vintage badge, retro typography style, weathered texture, classic emblem',
  STAINED_GLASS = 'Stained glass, colorful translucent segments, black lead outlines, gothic aesthetic',
  ORIGAMI = 'Origami, folded paper style, sharp creases, clean geometric shadows',
  WATERCOLOR = 'Watercolor painting, soft bleeding edges, artistic paper texture, fluid colors',
  HOLOGRAPHIC = 'Holographic, iridescent sheen, shifting rainbow colors, futuristic pearlescent',
  CHALKBOARD = 'Chalkboard, hand-drawn white chalk on dark slate texture, dusty effect',
  POP_ART = 'Pop art, Roy Lichtenstein style, halftone dots, bold black outlines, primary colors',
  WOOD_CARVED = 'Wood carved, natural grain texture, engraved details, rustic organic feel',
  FUTURISTIC_UI = 'Futuristic UI, data visualization style, glowing blue circuits, tech dashboard aesthetic',
  GUMMY = 'Gummy candy, translucent jelly texture, glossy highlights, chewy vibrant look'
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