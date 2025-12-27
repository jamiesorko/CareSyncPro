import { GoogleGenAI, Type } from "@google/genai";
import { Client, NexusConsensus } from '../types';

export class ClinicalInterdisciplinaryService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Synthesizes cross-discipline directives into a unified care vector.
   */
  async synthesizeConsensus(client: Client, rawInputs: { role: string; note: string }[]): Promise<NexusConsensus> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const context = {
      patient: client.name,
      conditions: client.conditions,
      disciplineInputs: rawInputs
    };

    const prompt = `
      Act as a Lead Interdisciplinary Case Manager.
      Context: ${JSON.stringify(context)}
      
      Task: Perform a Neural Discipline Synthesis.
      1. Analyze directives from Nursing, Dietetics, Physiotherapy, and Occupational Therapy.
      2. Identify "Discipline Conflicts" (e.g., PT recommending high mobility while Nursing flags a fall risk).
      3. Identify "Clinical Synergies" (e.g., Nutritional support accelerating wound healing).
      4. Forge a 'Unified Care Vector'—the absolute #1 priority for all disciplines today.
      5. Issue a 'Critical Synergy Alert' if disciplines are misaligned.
      6. Calculate a Consensus Score (0-100).
      
      Return JSON: { 
        "directives": [ { "role": "", "dir": "", "conflict": boolean } ], 
        "vector": "string", 
        "alert": "string?", 
        "score": number 
      }
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
        id: Math.random().toString(36).substring(7),
        clientId: client.id,
        specialistInputs: data.directives?.map((d: any) => ({ role: d.role, directive: d.dir, conflict: d.conflict })) || [],
        unifiedCareVector: data.vector || "Maintenance protocol.",
        criticalSynergyAlert: data.alert || null,
        consensusScore: data.score || 100
      };
    } catch (e) {
      console.error("Consensus failure:", e);
      throw e;
    }
  }
}

export const clinicalInterdisciplinaryService = new ClinicalInterdisciplinaryService();