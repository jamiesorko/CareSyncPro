import { GoogleGenAI, Type } from "@google/genai";
import { ChairmanMandate } from '../types';

export class BoardDirectorService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Synthesizes all agency metrics and market grounded signals into a Chairman's Mandate.
   */
  async synthesizeMandate(agencyMetrics: any, region: string): Promise<ChairmanMandate> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    // Search Grounding for macro-economic/regulatory outlook
    const query = `Healthcare labor market trends, insurance reimbursement shifts, and nursing liability laws in ${region}, Ontario October 2025.`;
    
    const prompt = `
      Act as the Board of Directors Chairman for a Neural-Enabled Healthcare Fleet.
      Agency Stats: ${JSON.stringify(agencyMetrics)}
      Regional Intel Query: ${query}
      
      Task: Perform a Systemic Institutional Audit.
      1. Synthesize the "State of the Agency" (Tone: Formal, Strategic).
      2. Identify 3 points of "Institutional Fragility" (Where will the agency break if unchecked?).
      3. Issue 3 "Non-Negotiable Directives" for the CEO.
      4. Calculate a Strategic Risk Index (0-100).
      
      Return JSON: { 
        "state": "", 
        "fragility": [], 
        "directives": [ { "title": "", "action": "", "impact": "" } ],
        "risk": number,
        "sentiment": "Market outlook grounded summary"
      }
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
        stateOfAgency: data.state || "Stable operational baseline.",
        institutionalFragilityPoints: data.fragility || ["Information silo risk."],
        nonNegotiableDirectives: data.directives || [],
        strategicRiskIndex: data.risk || 12,
        marketSentimentGrounded: data.sentiment || "Regional health vectors are evolving."
      };
    } catch (e) {
      console.error("Board Director synthesis failure:", e);
      throw e;
    }
  }
}

export const boardDirectorService = new BoardDirectorService();