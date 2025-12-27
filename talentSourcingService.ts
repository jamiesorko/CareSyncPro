import { GoogleGenAI, Type } from "@google/genai";

export interface TalentThreat {
  competitorName: string;
  attritionSignal: string;
  detectedPainPoints: string[];
  suggestedMessaging: string;
  priorityScore: number;
}

export class TalentSourcingService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Scans regional labor markets for competitor instability.
   */
  async scanForCompetitorFriction(region: string): Promise<TalentThreat[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const query = `Healthcare staffing agency employee reviews, layoff news, and nursing strikes in ${region}, Ontario October 2025. Identification of staff dissatisfaction at specific agencies.`;
    
    const prompt = `
      Act as a Lead Strategic Recruitment Intelligence Officer. 
      Market Intel: ${query}
      
      Task: Identify 3 agencies where staff are likely looking to leave.
      Assign:
      1. Attrition Signal (e.g., Recent strike, 2.1 star Glassdoor rating, high turnover report).
      2. 3 Specific Pain Points (e.g., Poor travel pay, management silo).
      3. A targeted "CareSync Pro" recruitment message that addresses these points.
      4. Priority Score (0-100).
      
      Return JSON array: [ { "competitor": "string", "signal": "string", "pains": [], "message": "string", "score": number } ]
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

      const data = JSON.parse(response.text || '[]');
      return data.map((d: any) => ({
        competitorName: d.competitor,
        attritionSignal: d.signal,
        detectedPainPoints: d.pains,
        suggestedMessaging: d.message,
        priorityScore: d.score
      }));
    } catch (e) {
      return [];
    }
  }
}

export const talentSourcingService = new TalentSourcingService();