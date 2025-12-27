import { GoogleGenAI } from "@google/genai";

export interface SectorIntel {
  sector: string;
  riskScore: number;
  environmentalHazard: string;
  vocalSentiment: 'STRESS' | 'NORMAL' | 'POSITIVE';
  aiDirective: string;
}

export class CommandBridgeService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async synthesizeFleetStatus(sector: string, hardware: any[], staffSentiment: string): Promise<SectorIntel> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const query = `Real-time public health and safety alerts for ${sector}, Ontario today October 2025.`;
    const prompt = `
      Sector: ${sector}
      Live Hardware: ${JSON.stringify(hardware)}
      Sentiment: "${staffSentiment}"
      
      Task: Correlate hardware faults with regional risk.
      Identify crisis probability and intercept directive.
      Return JSON: { "score": number, "hazard": "", "sentiment": "STRESS|NORMAL|POSITIVE", "directive": "" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json" 
        }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        sector,
        riskScore: data.score || 0,
        environmentalHazard: data.hazard || "No significant drift.",
        vocalSentiment: data.sentiment || 'NORMAL',
        aiDirective: data.directive || "Standard monitoring."
      };
    } catch (e) {
      throw e;
    }
  }
}

export const commandBridgeService = new CommandBridgeService();