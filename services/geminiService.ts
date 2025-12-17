
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, MarketSector } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeMarketSentiment(query: string = "major global markets"): Promise<AnalysisResult> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze current market sentiment for ${query}. Focus on: ${Object.values(MarketSector).join(', ')}. 
        Provide a detailed sentiment analysis. Return the data strictly in the following JSON structure:
        {
          "sentiments": [
            { "category": "Stocks", "score": 75, "summary": "...", "keyDrivers": ["...", "..."] },
            ...
          ],
          "globalOutlook": "Brief overview of the day"
        }
        The score should be 0 (extremely bearish) to 100 (extremely bullish).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    summary: { type: Type.STRING },
                    keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["category", "score", "summary", "keyDrivers"]
                }
              },
              globalOutlook: { type: Type.STRING }
            },
            required: ["sentiments", "globalOutlook"]
          }
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      
      // Extract grounding sources
      const sources: any[] = [];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || 'Market News Source',
              uri: chunk.web.uri
            });
          }
        });
      }

      return {
        ...parsed,
        sources,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      throw error;
    }
  }
}
