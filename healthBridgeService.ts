
import { GoogleGenAI } from "@google/genai";
import { Client } from '../types';

export class HealthBridgeService {
  /**
   * Translates agency-specific notes into standardized FHIR resources.
   */
  async generateFHIRResource(client: Client, rawNote: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a Lead Health Informatics Engineer. 
      Task: Translate the following agency note into a valid FHIR R4 Observation or CarePlan JSON resource.
      
      Patient: ${client.name}
      Note: "${rawNote}"
      
      Requirements:
      1. Use correct FHIR R4 schema.
      2. Map symptoms to SNOMED-CT codes where possible.
      3. Ensure the JSON is strictly compliant for ingestion by hospital EHRs (Epic/Cerner).
      
      Return ONLY the raw JSON string.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json" 
        }
      });

      return response.text || "{}";
    } catch (e) {
      console.error("Health Bridge desync:", e);
      return "{}";
    }
  }

  /**
   * Maps generic agency data string to FHIR R4 standard.
   */
  async mapToFHIR(data: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a Lead Health Informatics Engineer. 
      Task: Translate the following clinical data packet into a valid FHIR R4 JSON resource.
      Data: "${data}"
      
      Return ONLY the raw JSON string.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json" 
        }
      });

      return response.text || "{}";
    } catch (e) {
      console.error("Health Bridge mapping failure:", e);
      return "{}";
    }
  }
}

export const healthBridgeService = new HealthBridgeService();
