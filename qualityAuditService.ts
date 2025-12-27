import { GoogleGenAI } from "@google/genai";
import { Client, StaffMember } from '../types';

export interface DefensibilityReport {
  score: number;
  gaps: string[];
  legislation: string;
  status: 'CERTIFIED' | 'NEEDS_REVISION';
}

export class QualityAuditService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async auditDefensibility(staff: StaffMember, client: Client, note: string): Promise<DefensibilityReport> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Lead Regulatory Quality Auditor.
      Context: ${client.name}, ${staff.role}
      Note: "${note}"
      
      Task: Perform a Forensic Documentation Audit.
      1. Defensibility Score (0-100).
      2. Identify 3 'Critical Silences'.
      3. Cross-reference Ontario Health Law.
      
      Return JSON: { "score": number, "gaps": [], "legislation": "", "status": "CERTIFIED|NEEDS_REVISION" }
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
        score: data.score || 0,
        gaps: data.gaps || [],
        legislation: data.legislation || "General care standards.",
        status: data.status || 'NEEDS_REVISION'
      };
    } catch (e) {
      throw e;
    }
  }
}

export const qualityAuditService = new QualityAuditService();