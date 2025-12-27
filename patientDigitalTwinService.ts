import { GoogleGenAI } from "@google/genai";
import { Client, PatientTwinSim } from '../types';

export class PatientDigitalTwinService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Simulates the 30-day stability outcome of a care plan amendment.
   * Uses Gemini 3 Pro to model physiological and logistical drift.
   */
  async simulatePlanChange(client: Client, proposedChange: string): Promise<PatientTwinSim> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Predictive Clinical Modeler.
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Current Care Plan Summary: ${JSON.stringify(client.carePlans)}
      Proposed Change: "${proposedChange}"
      
      Task: Simulate the next 30 days of this patient's clinical life.
      1. Predict daily stability score (0-100) for the next 30 days.
      2. Identify the peak 'Complication Risk' (%).
      3. Calculate the impact on staff workload (hours per week delta).
      4. Provide a reasoning-heavy clinical advisory.
      
      Return JSON: { 
        "stability": [number x 30], 
        "complicationRisk": number, 
        "workloadDelta": number, 
        "advisory": "string" 
      }
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
        clientId: client.id,
        changeDescription: proposedChange,
        predictedStability: data.stability || Array(30).fill(80),
        complicationRisk: data.complicationRisk || 15,
        staffWorkloadImpact: data.workloadDelta || 2,
        clinicalAdvisory: data.advisory || "Maintain standard supervision."
      };
    } catch (e) {
      console.error("Twin simulation failure:", e);
      throw e;
    }
  }
}

export const patientDigitalTwinService = new PatientDigitalTwinService();