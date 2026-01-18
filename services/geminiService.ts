import { GoogleGenAI } from "@google/genai";
import { IconStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppIcon = async (
  prompt: string, 
  style: IconStyle,
  seedImage?: string
): Promise<string> => {
  try {
    const textPrompt = `
      Design a professional, high-end mobile application icon optimized for iOS and Android adaptive standards.
      
      CORE SUBJECT: ${prompt}
      VISUAL STYLE: ${style}
      
      CRITICAL COMPOSITION RULES (ADAPTIVE ICON STANDARD):
      1. **Central Safe Zone**: The main subject/logo MUST be strictly centered and contained within the central 60% of the canvas. It must NOT touch the edges.
      2. **Full Bleed Background**: The background (color/gradient/texture) must extend to the very edges of the square canvas with no borders, frames, or outlines.
      3. **Masking Safety**: Important details must be visible when the image is cropped to a circle (Android) or a squircle (iOS). Do not place elements in corners.
      
      AESTHETIC GUIDELINES:
      - The icon should be a single, cohesive unit.
      - Silhouettes must be sharp and recognizable at small sizes (home screen test).
      - ABSOLUTELY NO TEXT, labels, or letters inside the icon artwork unless explicitly requested as a logo.
      - Ensure professional color harmony and lighting.
      - If 3D, ensure soft shadows and high-fidelity rendering.
      - If 2D, ensure clean vectors and modern proportions.
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
        text: textPrompt + "\n\nINSTRUCTION: Use the attached image as a visual reference for the composition and subject matter, but reimagine it completely in the requested VISUAL STYLE. MOST IMPORTANTLY: Center the main subject and ensure there is ample background padding around it so it is safe for circular masking. Do not crop the subject tightly." 
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