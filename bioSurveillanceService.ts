
import { GoogleGenAI } from "@google/genai";
import { OutbreakZone } from '../types';

export class BioSurveillanceService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async scanOutbreaks(region: string): Promise<OutbreakZone[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const query = `Real-time respiratory illness surges in ${region}, Ontario October 2025. Identification of neighborhood flu alerts.`;
    const prompt = `
      Act as a Lead Epidemiologist. 
      Analyze: ${query}
      Task: Identify 3 high-risk postal code sectors.
      Return JSON array: [ { "postalCode": "", "threatType": "FLU|RSV|COVID", "severity": "SAFE|WARNING|CRITICAL", "intensity": number, "ppe": [], "advisory": "" } ]
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
      // Fix: Mapped ppe field from JSON to mandatoryPPE field expected by the OutbreakZone interface.
      return data.map((d: any) => ({
        ...d,
        mandatoryPPE: d.ppe || []
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async verifyPPEComplaince(base64: string, requiredPPE: string[]): Promise<{ verified: boolean; missing: string[] }> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: 'image/jpeg' } },
            { text: `Verify if wearing: ${requiredPPE.join(', ')}. Return JSON: { "verified": boolean, "missing": [] }` }
          ]
        }
      });
      const data = JSON.parse(response.text || '{}');
      return { verified: !!data.verified, missing: data.missing || [] };
    } catch (e) {
      return { verified: false, missing: requiredPPE };
    }
  }
}

export const bioSurveillanceService = new BioSurveillanceService();
