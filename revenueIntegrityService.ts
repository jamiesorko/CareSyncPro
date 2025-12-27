import { GoogleGenAI } from "@google/genai";
import { Client, StaffMember } from '../types';

export interface IntegrityAudit {
  visitId: string;
  integrityScore: number;
  leakageType: 'GHOST_VISIT' | 'UPCODING' | 'LOST_CAPITAL' | 'NONE';
  findings: string[];
  reclaimValue: number;
}

export class RevenueIntegrityService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async performIntegrityAudit(client: Client, staff: StaffMember, visitData: any): Promise<IntegrityAudit> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Lead Medical Auditor.
      Patient: ${client.name}, Staff: ${staff.name}
      Data: ${JSON.stringify(visitData)}
      
      Task: Perform Triple-Vector Reconciliation (GPS, Audio, Billing).
      Identify inconsistencies and calculate reclamation value.
      Return JSON: { "score": number, "type": "GHOST_VISIT|UPCODING|LOST_CAPITAL|NONE", "findings": [], "reclaim": number }
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
        visitId: visitData.id,
        integrityScore: data.score || 100,
        leakageType: data.type || 'NONE',
        findings: data.findings || [],
        reclaimValue: data.reclaim || 0
      };
    } catch (e) {
      throw e;
    }
  }
}

export const revenueIntegrityService = new RevenueIntegrityService();