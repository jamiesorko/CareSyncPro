import { GoogleGenAI } from "@google/genai";

export interface TacticalThreat {
  region: string;
  type: 'WEATHER' | 'TRANSIT' | 'SECURITY';
  severity: 'MED' | 'HIGH' | 'CRITICAL';
  description: string;
  impactedStaffCount: number;
  tacticalDirective: string;
}

export class RegionalTacticalService {
  /**
   * Scans for external "Logistics Impedance" signals.
   */
  async scanRegionalThreats(region: string): Promise<TacticalThreat[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const query = `Current road closures, transit delays, and weather warnings in ${region}, Ontario today. Identification of hazardous conditions for mobile workers.`;
    
    const prompt = `
      Act as a Tactical Logistics Interceptor. 
      Market Intel: ${query}
      
      Task: Identify exactly 1 major impedance threat for field healthcare staff.
      Define: 
      1. Severity level.
      2. Specific description of hazard.
      3. Precise directive for a mobile worker (e.g., 'Utilize Sector 4 bypass').
      
      Return JSON: { "type": "WEATHER|TRANSIT|SECURITY", "severity": "MED|HIGH|CRITICAL", "desc": "", "directive": "" }
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
      return [{
        region,
        type: data.type || 'WEATHER',
        severity: data.severity || 'MED',
        description: data.desc || "Signal baseline nominal.",
        impactedStaffCount: 12,
        tacticalDirective: data.directive || "Follow standard route parameters."
      }];
    } catch (e) {
      return [];
    }
  }
}

export const regionalTacticalService = new RegionalTacticalService();