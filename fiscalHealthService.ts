import { GoogleGenAI } from "@google/genai";
import { LeakageSignal } from '../types';

export class FiscalHealthService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Scans large batches of visit data to find improbable financial patterns.
   */
  async detectMicroLeakage(batchData: any[]): Promise<LeakageSignal[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Forensic Financial Intelligence Unit for a Health Agency.
      Visit Data Fragment: ${JSON.stringify(batchData)}
      
      Task: Detect Micro-Leakage Patterns.
      Identify:
      1. Mileage Padding (GPS vs Claimed).
      2. Supply Shrinkage (Unbilled high-value kits mentioned in logs).
      3. Overlapping Visits (Impossibility logic).
      4. Lost Capital (Upcoding missed despite complexity).
      
      Return JSON array: [ { "type": "MILEAGE|SUPPLY|HOURS|UPCODING", "confidence": number, "estimatedLoss": number, "involvedStaff": "Name", "rationale": "string" } ]
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json" 
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Fiscal scan failure:", e);
      return [];
    }
  }
}

export const fiscalHealthService = new FiscalHealthService();