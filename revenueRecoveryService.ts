import { GoogleGenAI, Type } from "@google/genai";
import { Client } from "../types";

export interface RecoveryCase {
  id: string;
  claimId: string;
  patientName: string;
  billedAmount: number;
  paidAmount: number;
  denialCode: string;
  denialReason: string;
  evidenceFound: string[];
  recoveryProbability: number;
  draftedAppeal: string;
  status: 'PENDING_HARVEST' | 'READY_FOR_APPEAL' | 'SUBMITTED' | 'RECOVERED';
}

export class RevenueRecoveryService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Parses raw "Remittance Advice" text and identifies underpayments.
   */
  async analyzeRemittance(rawAdvice: string): Promise<RecoveryCase[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Forensic Healthcare Accountant. 
      Input Advice: "${rawAdvice}"
      
      Task: Identify 3 claims that were denied or underpaid.
      For each, identify the denial code and reason.
      Return JSON array of objects: { "id": "string", "claimId": "string", "name": "string", "billed": number, "paid": number, "code": "string", "reason": "string" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '[]');
      return data.map((d: any) => ({
        ...d,
        patientName: d.name,
        billedAmount: d.billed,
        paidAmount: d.paid,
        denialCode: d.code,
        denialReason: d.reason,
        status: 'PENDING_HARVEST',
        evidenceFound: [],
        recoveryProbability: 0,
        draftedAppeal: ""
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Harvests clinical evidence from the Neural Vault to support an appeal.
   */
  async harvestEvidence(caseData: RecoveryCase, clientContext: string): Promise<Partial<RecoveryCase>> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Clinical Evidence Harvester.
      Claim: ${caseData.claimId}
      Denial Reason: "${caseData.denialReason}"
      Client History: "${clientContext}"
      
      Task: 
      1. Find 3 clinical proof points (GPS, vitals, or specific notes) that refute the denial.
      2. Calculate Recovery Probability (0-100).
      3. Draft a formal, firm appeal letter to the Payor.
      
      Return JSON: { "evidence": [], "prob": number, "letter": "string" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 12000 }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        evidenceFound: data.evidence || [],
        recoveryProbability: data.prob || 50,
        draftedAppeal: data.letter || "Pending manual draft.",
        status: 'READY_FOR_APPEAL'
      };
    } catch (e) {
      return { status: 'PENDING_HARVEST' };
    }
  }
}

export const revenueRecoveryService = new RevenueRecoveryService();