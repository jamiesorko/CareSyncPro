import { GoogleGenAI } from "@google/genai";
import { Client, EthicsConsult } from '../types';

export class ClinicalEthicsAdvisoryService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Performs an ethical equilibrium analysis using Gemini 3 Pro.
   */
  async arbitrateDilemma(client: Client, scenario: string): Promise<EthicsConsult> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Bio-Ethicist. 
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Scenario: "${scenario}"
      
      Task: Resolve the moral conflict between Patient Autonomy and Clinical Duty of Care.
      1. Define the primary moral conflict.
      2. Analyze perspectives for Patient, Caregiver, and Agency.
      3. Forge a 'Consensus Directive' maximizing safety and dignity.
      4. Reference one Ontario health law guardrail.
      
      Return JSON: { "conflict": "", "perspectives": [ { "entity": "", "focus": "", "risk": "" } ], "directive": "", "guardrail": "" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 24576 } 
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        dilemma: scenario,
        moralConflict: data.conflict || "Conflict detected.",
        stakeholderPerspectives: data.perspectives || [],
        consensusDirective: data.directive || "Follow baseline protocol.",
        legislativeGuardrail: data.guardrail || "Standard clinical standards apply."
      };
    } catch (e) {
      throw e;
    }
  }
}

export const clinicalEthicsAdvisoryService = new ClinicalEthicsAdvisoryService();