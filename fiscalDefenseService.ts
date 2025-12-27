import { GoogleGenAI } from "@google/genai";
import { ReclamationCase } from '../types';

export class FiscalDefenseService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Forges an appeal brief by interrogating the Neural Vault for evidence.
   */
  async forgeDenialAppeal(caseId: string, reason: string, history: string[]): Promise<Partial<ReclamationCase>> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Senior Forensic Medical Billing Advocate.
      Denial Reason: "${reason}"
      Available Evidence Log: "${history.join(' | ')}"
      
      Task:
      1. Identify 3 specific clinical proof points refuting the denial.
      2. Draft a formal appeal letter to the Insurer.
      3. Calculate success probability (0-100).
      
      Return JSON: { "evidence": [], "letter": "", "prob": number }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 15000 } 
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        evidenceHarvested: data.evidence || [],
        draftedAppeal: data.letter || "Appeal draft pending.",
        successProbability: data.prob || 50,
        status: 'READY'
      };
    } catch (e) {
      return { status: 'QUEUED' };
    }
  }
}

export const fiscalDefenseService = new FiscalDefenseService();