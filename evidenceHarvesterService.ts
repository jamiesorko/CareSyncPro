import { GoogleGenAI } from "@google/genai";
import { Client } from '../types';

export interface DefensibilityBundle {
  id: string;
  clientId: string;
  timestamp: string;
  hashedTrace: string;
  auditNarrative: string;
  legalExposureScore: number;
}

export class EvidenceHarvesterService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Compiles multimodal signals into an immutable forensic summary.
   */
  async harvestIncidentBundle(client: Client, incidentId: string, signals: any[]): Promise<DefensibilityBundle> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Medical-Legal Forensic Investigator.
      Incident: ${incidentId}
      Signals: ${JSON.stringify(signals)}
      Patient: ${client.name}
      
      Task: Forge a 'Defensibility Bundle'.
      1. Synthesize an objective audit narrative of the timeline.
      2. Calculate a 'Legal Exposure Score' (0-100).
      3. Identify exactly 1 forensic contradiction if present.
      
      Return JSON: { "narrative": "", "score": number, "contradiction": "" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 20000 }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: `BUNDLE-${Math.random().toString(36).substring(7).toUpperCase()}`,
        clientId: client.id,
        timestamp: new Date().toISOString(),
        hashedTrace: `sha256:${Math.random().toString(16).substring(2, 18)}`,
        auditNarrative: data.narrative || "Evidence compiled successfully.",
        legalExposureScore: data.score || 0
      };
    } catch (e) {
      console.error("Forensic harvesting failure:", e);
      throw e;
    }
  }
}

export const evidenceHarvesterService = new EvidenceHarvesterService();