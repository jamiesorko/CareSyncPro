import { GoogleGenAI } from "@google/genai";
import { ReclamationCase } from '../types';

export class FiscalReclamationService {
  /**
   * Harvests supporting clinical evidence from the vault to refute a denial.
   */
  async harvestEvidenceForClaim(claimId: string, denialReason: string, clientDossier: string): Promise<ReclamationCase> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const query = `Medical insurance appeal requirements for denial reason: "${denialReason}". Specific documentation needed by Ontario payors October 2025.`;
    
    const prompt = `
      Act as a Senior Forensic Medical Billing Advocate.
      Claim: ${claimId}
      Denial: "${denialReason}"
      Client History: "${clientDossier}"
      
      Task: Resolve the fiscal gap.
      1. Use Search Grounding to find exactly what the payor requires to reverse this denial.
      2. Harvest 3 clinical proof points from the provided dossier (Notes, Vitals, GPS).
      3. Calculate 'Success Probability' (0-100).
      4. Draft a formal, legally firm appeal brief.
      
      Return JSON: { 
        "id": "string", 
        "code": "string", 
        "evidence": [], 
        "prob": number, 
        "appeal": "Draft text" 
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 24576 }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: claimId,
        denialCode: data.code || 'UNKNOWN',
        denialReason: denialReason,
        evidenceHarvested: data.evidence || [],
        successProbability: data.prob || 50,
        draftedAppeal: data.appeal || "Pending manual review.",
        status: 'READY'
      };
    } catch (e) {
      console.error("Reclamation failed:", e);
      throw e;
    }
  }
}

export const fiscalReclamationService = new FiscalReclamationService();