import { GoogleGenAI } from "@google/genai";
import { IconStyle } from "../types";

// Initialize with a fallback to prevent crash on load if key is missing
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy_key' });

const getStyleDetails = (style: IconStyle): string => {
  // Group styles to provide specific aesthetic guidance
  if (style === IconStyle.MINIMALIST || style === IconStyle.CORPORATE) {
    return `
    - COLOR PALETTE: Strictly limited to 2-3 main colors. Use bold, flat colors or very subtle gradients. High contrast between subject and background.
    - COMPOSITION: Utilize negative space effectively. Reduce complex shapes to their simplest geometric forms.
    - TEXTURE: Matte, flat, no noise. Clean lines.`;
  }
  if (style === IconStyle.NEUMORPHIC || style === IconStyle.CLAYMORPHIC) {
    return `
    - COLOR PALETTE: Soft pastels, off-whites, or low-saturation greys. Low contrast between elements.
    - COMPOSITION: Focus on soft shadows (inner and outer) to create depth (extruded or impressed). Soft rounded corners.
    - TEXTURE: Smooth, tactile, plastic or clay-like finish. No harsh outlines.`;
  }
  if (style === IconStyle.CYBERPUNK || style === IconStyle.FUTURISTIC_UI || style === IconStyle.HOLOGRAPHIC) {
    return `
    - COLOR PALETTE: Deep dark backgrounds (Black, Midnight Blue) with neon accents (Cyan, Magenta, Electric Green).
    - COMPOSITION: Angular geometric shapes, glowing edges, tech lines, potential glitch effects.
    - TEXTURE: Glossy, metallic, emissive (glowing) elements. High contrast.`;
  }
  if (style === IconStyle.PIXEL_ART) {
    return `
    - COLOR PALETTE: Limited palette (16 or 32 colors). High saturation.
    - COMPOSITION: Strict pixel-grid alignment. Blocky shapes. Distinct outlines.
    - TEXTURE: No anti-aliasing, no blur. Sharp square pixels. Retro aesthetic.`;
  }
  if (style === IconStyle.VINTAGE_BADGE || style === IconStyle.WOOD_CARVED || style === IconStyle.SKETCH || style === IconStyle.CHALKBOARD) {
    return `
    - COLOR PALETTE: Earth tones, desaturated colors, sepia, or monochrome (white on black for chalkboard).
    - COMPOSITION: Emblematic, centered, symmetrical. Classic badge aesthetics.
    - TEXTURE: High texture focus (wood grain, paper grain, chalk dust, grunge/weathering).`;
  }
  if (style === IconStyle.GRADIENT || style === IconStyle.GLASSMORPHISM) {
    return `
    - COLOR PALETTE: Vibrant, highly saturated spectrums. Analogous color blending.
    - COMPOSITION: Fluid shapes, translucency, blurring, layered depth.
    - TEXTURE: Glassy, smooth, ethereal. Light diffraction effects.`;
  }
  if (style === IconStyle.ISOMETRIC || style === IconStyle.REALISTIC || style === IconStyle.GUMMY || style === IconStyle.ORIGAMI) {
    return `
    - COLOR PALETTE: Realistic lighting influence. Subsurface scattering colors for gummy/glass.
    - COMPOSITION: 3D perspective (45 degrees for isometric). Focus on volume, weight, and physical properties.
    - TEXTURE: High fidelity rendering, specular highlights, realistic shadows.`;
  }
  
  // Default fallback for other styles (Pop Art, Kawaii, etc)
  return `
    - COLOR PALETTE: Professional and harmonious color scheme matching the visual style description: "${style}".
    - COMPOSITION: Balanced and iconic.`;
};

export const generateAppIcon = async (
  prompt: string, 
  style: IconStyle,
  seedImage?: string
): Promise<string> => {
  try {
    const styleInstructions = getStyleDetails(style);

    const textPrompt = `
      Design a professional, high-end mobile application icon optimized for iOS, Android Adaptive Icons, and Android Splash Screens.
      
      CORE SUBJECT: ${prompt}
      VISUAL STYLE: ${style}
      
      STYLE SPECIFIC GUIDELINES:
      ${styleInstructions}
      
      CRITICAL COMPOSITION RULES (ADAPTIVE & SPLASH STANDARD):
      1. **Central Safe Zone**: The main subject/logo MUST be strictly centered and contained within the central 50-60% of the canvas. It must NOT touch the edges. This is crucial for circular masking and splash screen animations where the outer areas are cropped.
      2. **Iconic, Not Scenic**: Create a distinct object, symbol, or mascot that "floats" in the center. Do NOT create a full rectangular scene or complex illustration that fills the frame. The subject must be distinct from the background.
      3. **Full Bleed Background**: The background (color/gradient/texture) must extend to the very edges of the square canvas with no borders, frames, or outlines.
      4. **Masking Safety**: Important details must be visible when the image is cropped to a circle (Android) or a squircle (iOS). Do not place elements in corners.
      
      AESTHETIC GUIDELINES:
      - The icon should be a single, cohesive unit.
      - Silhouettes must be sharp and recognizable at small sizes (home screen test) and large sizes (splash screen).
      - ABSOLUTELY NO TEXT, labels, or letters inside the icon artwork unless explicitly requested as a logo.
      - Ensure professional color harmony and lighting.
    `;

    const parts: any[] = [];

    if (seedImage) {
      // Extract base64 data
      const base64Data = seedImage.split(',')[1];
      const mimeType = seedImage.split(';')[0].split(':')[1];
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
      
      parts.push({ 
        text: textPrompt + "\n\nINSTRUCTION: Use the attached image as a visual reference for the composition and subject matter, but reimagine it completely in the requested VISUAL STYLE and COLOR PALETTE. MOST IMPORTANTLY: Center the main subject and ensure there is ample background padding around it so it is safe for circular masking and splash screens. Do not crop the subject tightly." 
      });
    } else {
      parts.push({ text: textPrompt });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const editIconBackground = async (
  base64Image: string,
): Promise<string> => {
  try {
    // Extract base64 data without the prefix
    const data = base64Image.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: 'image/png',
            },
          },
          {
            text: "Please remove the background of this icon, keeping only the main subject. Make the background a pure, solid, flat white color or transparent-ready silhouette. Do not change the subject itself.",
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Editing failed");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};