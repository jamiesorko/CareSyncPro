import { GoogleGenAI } from "@google/genai";
import { Client, BioSocialSignal, NeighborhoodImmunity } from '../types';

export class BioSocialService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async synthesizeBioSocialPulse(client: Client, rawNotes: string[]): Promise<BioSocialSignal> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Bio-Social Health Strategist.
      Patient: ${client.name}
      Notes: "${rawNotes.join(' | ')}"
      
      Task: Perform Determinant Synthesis.
      1. Isolation Score (0-100).
      2. Nutrition Drift (STABLE|WARNING|CRITICAL).
      3. Environmental Integrity (0-100).
      4. Synthesis note.
      5. Recommended social intercept.
      
      Return JSON: { "isolation": number, "nutrition": "", "environment": number, "synthesis": "", "intercept": "" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 10000 } 
        }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        clientId: client.id,
        isolationScore: data.isolation || 0,
        nutritionDrift: data.nutrition || 'STABLE',
        environmentalIntegrity: data.environment || 100,
        aiSynthesis: data.synthesis || "Baseline maintenance.",
        recommendedSocialIntercept: data.intercept || "Standard monitoring."
      };
    } catch (e) {
      throw e;
    }
  }

  async scanNeighborhoodThreats(postalCode: string): Promise<NeighborhoodImmunity> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const query = `Real-time public health data for ${postalCode}, Ontario October 2025.`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze regional health vectors for ${postalCode}. Query: ${query}. Return JSON: { "threat": "FLU|RSV|COVID|NONE", "intensity": 0-100, "mandate": "" }`,
        config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        postalCode,
        threatType: data.threat || 'NONE',
        intensity: data.intensity || 0,
        mandateUpdate: data.mandate || "Standard protocol."
      };
    } catch (e) { return { postalCode, threatType: 'NONE', intensity: 0, mandateUpdate: "Global baseline." }; }
  }
}

export const bioSocialService = new BioSocialService();