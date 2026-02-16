import { GoogleGenAI } from "@google/genai";
import { ThumbnailRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateThumbnail = async (request: ThumbnailRequest): Promise<string> => {
  try {
    // Helper to clean base64
    const clean = (b64: string) => b64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
Create a premium, modern, high-end, professional Fiverr gig thumbnail image for a frontend web developer that looks like a top-rated marketplace thumbnail with clean composition, strong visual hierarchy, modern tech aesthetic, and cinematic product showcase depth.
Canvas must be exactly 1280 × 769 pixels (5:3 aspect ratio) with ultra-high clarity, marketplace-ready sharpness, zero compression artifacts, zero pixelation, and balanced safe margins on all edges.
Set Device Pixel Ratio (DPR) = 2.0 for high-resolution output. Render final image at full resolution.

Use ONLY the four provided screenshots as real screen content.
Device slots: scale screenshots to fit container without losing resolution.
Strictly NEVER redraw, restyle, enhance, blur, color-correct, crop, regenerate, extend, distort, or reinterpret any screenshot. 
Preserve original screenshot quality: no stretching, no resampling, no distortion.

Exactly four screenshots are provided in the following order and must follow strict mapping with zero guessing:
1. First Image (Main desktop website) → Laptop #1 screen only
2. Second Image (Responsive mobile version) → Smartphone screen only
3. Third Image (Code editor) → LEFT HALF of Laptop #2
4. Fourth Image (Responsive output) → RIGHT HALF of Laptop #2
Never swap mappings and never duplicate any screenshot into another device.

Build a premium tech showcase layout using two modern non-branded laptops and one smartphone with realistic flat-illustration frames and soft depth. Enforce real 3D staged perspective (not flat front view):
- Laptop #1 centered main anchor, ~52% width, rotated 12–18° with slight downward tilt
- Smartphone front-left foreground, ~22% width, rotated 18–25° vertically tilted
- Laptop #2 right-back layer, ~38% width, rotated 15–22° toward center
- Laptop #2 screen must be split into two equal vertical halves with a thin subtle divider showing the Third Image (Code) on the left and Fourth Image (Output) on the right, both perfectly fitted and readable.

Apply strict Z-depth layering: smartphone front, main laptop mid, tailwind laptop back. No device may block more than 15% of another screen. If any screen visibility drops below 80%, auto-adjust spacing and rotation instead of stacking.
Use triangular composition between devices and preserve negative space on far left and right for side panels.

Background must be soft glassmorphism tech style with clean light gradients, frosted glass layers, subtle blur depth, airy atmosphere, and soft white + light blue + soft violet palette. Background must remain fully separate from screenshots.

Top centered heading text:
"${request.heading}"

Typography rules:
- Modern sans-serif, Bold, clean, high contrast
- No glow, no outline, no heavy shadow
- Tight letter spacing
- Optimized for small thumbnail readability
- Perfectly centered and aligned
- Must remain readable at small preview size

Left side (18% width strip) floating glass cards listing:
${request.services.map(s => `- ${s}`).join('\n')}

Right side (18% width strip) rounded code-style panels listing:
${request.skills.map(s => `- ${s}`).join('\n')}

Follow a 12-column grid:
- Main laptop columns 4–9
- Smartphone columns 2–4 lower foreground
- Laptop #2 columns 8–12
- Heading top 15% height band
- Minimum 4% outer safe margin
- Device visuals must occupy 72–78% of canvas for strong CTR while keeping all text readable at small preview.

Lighting rules:
- Soft contact shadows aligned with device angles
- Subtle upper-left rim light
- Mild floor reflection
- No harsh shadows
- No top-down or perfectly straight camera angle

Strictly forbid Fiverr logos, watermarks, understood rating stars, stock badges, fake UI chrome, brand marks, clutter text, or price tags.
Output must look like a high-end, conversion-focused, professional Fiverr gig thumbnail.
Reject generation if layout rules are violated.
Return ONLY the generated image.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: clean(request.laptopImage) } },
          { inlineData: { mimeType: 'image/png', data: clean(request.mobileImage) } },
          { inlineData: { mimeType: 'image/png', data: clean(request.codeImage) } },
          { inlineData: { mimeType: 'image/png', data: clean(request.outputImage) } },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '16:9'
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const parts = candidates[0].content.parts;
    let imageBase64 = '';

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
      const textPart = parts.find(p => p.text);
      if (textPart && textPart.text) {
        console.warn("Model returned text:", textPart.text);
      }
      throw new Error("No image generated. The model might have refused the request or returned text only.");
    }

    return `data:image/png;base64,${imageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate thumbnail.");
  }
};