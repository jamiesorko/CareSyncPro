import { GoogleGenAI } from "@google/genai";
import { Client, CrisisResource } from '../types';

export interface CrisisBrief {
  summary: string;
  context: string;
  action: string;
  resources: CrisisResource[];
}

export class FamilyCrisisService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async synthesizeCrisisBrief(client: Client, incidentDetail: string): Promise<CrisisBrief> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Family Advocate.
      Incident: "${incidentDetail}" for ${client.name}
      
      Task: Crisis synthesis.
      1. Calm 2-sentence summary.
      2. Context (Explain the "Why").
      3. Immediate Family Action.
      4. Grounded Search: Find nearest hospital wait times near ${client.address}.
      
      Return JSON: { "summary": "", "context": "", "action": "", "resources": [] }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json" 
        }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        summary: data.summary || "Team is providing care.",
        context: data.context || "Stabilization protocol active.",
        action: data.action || "Stay by your phone.",
        resources: data.resources || []
      };
    } catch (e) {
      throw e;
    }
  }
}

export const familyCrisisService = new FamilyCrisisService();