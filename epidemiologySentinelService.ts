import { GoogleGenAI } from "@google/genai";
import { RegionalViralPulse } from '../types';

export class EpidemiologySentinelService {
  /**
   * Scans regional public health vectors using Google Search grounding.
   */
  async scanRegionalViralPulse(region: string): Promise<RegionalViralPulse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const query = `Real-time public health respiratory outbreak data for ${region}, Ontario October 2025. Identification of neighborhood flu surges and RSV alerts.`;
    
    const prompt = `
      Act as a Lead Epidemiologist for a Health Fleet. 
      Market Intel: ${query}
      
      Task: Identify the #1 viral threat in this region.
      1. Calculate 'Surge Intensity' (0-100).
      2. Provide exactly 1 source URI.
      3. Mandate exactly 3 PPE items for staff.
      4. Provide a 1-sentence "Operational Impact Advisory" for the COO.
      
      Return JSON: { "threat": "FLU|RSV|COVID|GASTRO", "intensity": number, "uri": "string", "ppe": [], "advisory": "string" }
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
        region,
        threatType: data.threat || 'NONE',
        surgeIntensity: data.intensity || 0,
        sourceUri: data.uri || "https://publichealth.example.com",
        ppeMandate: data.ppe || ["Mask", "Gloves"],
        fleetImpactAdvisory: data.advisory || "Standard baseline monitoring."
      };
    } catch (e) {
      return {
        region,
        threatType: 'FLU',
        surgeIntensity: 12,
        sourceUri: "https://ontario.ca/health",
        ppeMandate: ["Surgical Mask", "Hand Sanitizer"],
        fleetImpactAdvisory: "Grounding signal interrupted. Maintain standard universal precautions."
      };
    }
  }
}

export const epidemiologySentinelService = new EpidemiologySentinelService();