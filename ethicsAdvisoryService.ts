import { GoogleGenAI, Type } from "@google/genai";
import { EthicsConsult, Client } from '../types';

export class EthicsAdvisoryService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Performs an ethical interrogation of a care dilemma.
   */
  async consultEthics(client: Client, dilemma: string): Promise<EthicsConsult> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Bio-Ethicist and Clinical Risk Director. 
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Dilemma: "${dilemma}"
      
      Task: Perform an Ethical Equilibrium Analysis.
      1. Define the core "Moral Conflict" (e.g., Autonomy vs. Safety).
      2. Analyze perspectives from 3 stakeholders: Patient, Caregiver, and Agency Authority.
      3. Forge a 'Consensus Directive' that maximizes safety without violating fundamental rights.
      4. Cite exactly one "Legislative Guardrail" from Ontario healthcare law.
      
      Return JSON: { 
        "conflict": "", 
        "perspectives": [ { "entity": "", "focus": "", "risk": "" } ], 
        "directive": "", 
        "guardrail": "" 
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 32768 } 
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        dilemma,
        moralConflict: data.conflict || "Patient-Caregiver Friction.",
        stakeholderPerspectives: data.perspectives || [],
        consensusDirective: data.directive || "Maintain current care vector.",
        legislativeGuardrail: data.guardrail || "Ontario Health Care Consent Act."
      };
    } catch (e) {
      console.error("Ethics sync failure:", e);
      throw e;
    }
  }
}

export const ethicsAdvisoryService = new EthicsAdvisoryService();