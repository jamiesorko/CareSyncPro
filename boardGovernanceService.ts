import { GoogleGenAI } from "@google/genai";
import { ChairmanMandate } from '../types';

export class BoardGovernanceService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async synthesizeInstitutionalVitality(metrics: any): Promise<ChairmanMandate> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as the Chairman of the Board for a multi-national healthcare agency.
      Operational Data: ${JSON.stringify(metrics)}
      
      Task: Synthesize Institutional Vitality.
      1. Calculate a Strategic Risk Index (0-100).
      2. Identify 3 'Fragility Points' where the agency is at risk of regulatory or fiscal collapse.
      3. Issue 3 'Non-Negotiable Directives' for the executive team.
      4. Grounded Market Sentiment: Use search to find current nursing liability trends in Ontario.
      
      Return JSON: { "risk": number, "fragility": [], "directives": [{ "title": "", "action": "", "impact": "" }], "sentiment": "" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        stateOfAgency: "Synthesis complete. Vitality vectors aligned.",
        institutionalFragilityPoints: data.fragility || [],
        nonNegotiableDirectives: data.directives || [],
        strategicRiskIndex: data.risk || 0,
        marketSentimentGrounded: data.sentiment || "Market signal stable."
      };
    } catch (e) {
      console.error("Board intelligence bottleneck:", e);
      throw e;
    }
  }
}

export const boardGovernanceService = new BoardGovernanceService();