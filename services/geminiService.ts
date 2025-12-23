import { GoogleGenAI } from "@google/genai";
import { IconStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppIcon = async (
  prompt: string, 
  style: IconStyle
): Promise<string> => {
  try {
    const enhancedPrompt = `
      Design a professional mobile application icon.
      Subject: ${prompt}
      Style: ${style}
      
      Requirements:
      - High quality, high resolution.
      - Centered composition.
      - Simple background (solid color or subtle gradient).
      - Distinctive silhouette.
      - Must look good as a small icon on a phone screen.
      - Vector-like aesthetics if not specified otherwise.
      - No text inside the icon.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};