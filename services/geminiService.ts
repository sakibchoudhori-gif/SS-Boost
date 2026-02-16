
import { GoogleGenAI } from "@google/genai";

export async function generateStrategy(niche: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Act as a world-class social media strategist. 
  The user is in the niche: "${niche}".
  Generate a concise but high-impact 7-day social media growth strategy.
  Include:
  1. What types of content to post (Reels, Carousels, Stories).
  2. One specific viral hook idea.
  3. How they can use SMM services (like likes, views, followers) strategically to boost these posts.
  
  Format the output clearly with day headers. Keep it under 250 words total.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "Failed to generate strategy. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
