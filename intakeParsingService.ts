import { GoogleGenAI } from "@google/genai";
import { Client } from '../types';

export class IntakeParsingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini Vision to parse handwritten or low-quality referral documents.
   */
  async parseReferralImage(base64: string): Promise<Partial<Client>> {
    console.log(`[INTAKE_VISION]: Extracting clinical data from hospital referral...`);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: 'image/jpeg' } },
            { text: "Extract Patient Name, DOB, Primary Diagnosis, and Mobility Needs into JSON format." }
          ]
        }
      });

      const text = response.text || '{}';
      const data = JSON.parse(text);
      
      return {
        name: data.name || "Unknown Patient",
        conditions: [data.diagnosis || "TBD"],
        isInitialVisit: true,
        address: "TBD"
      };
    } catch (e) {
      console.error("[INTAKE_VISION_FAILURE]:", e);
      return {};
    }
  }
}

export const intakeParsingService = new IntakeParsingService();