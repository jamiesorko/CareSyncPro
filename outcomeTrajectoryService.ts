import { GoogleGenAI, Type } from "@google/genai";
import { Client, BioTrajectory } from '../types';

export class OutcomeTrajectoryService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Correlates 30-day clinical signals to predict discharge readiness.
   */
  async computeIndependenceHorizon(client: Client, trendData: any[]): Promise<BioTrajectory> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Predictive Outcomes Researcher.
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      30-Day Clinical Adherence: ${JSON.stringify(trendData)}
      
      Task: Perform a Neural Trajectory Synthesis.
      1. Calculate 'Recovery Velocity' (0-100% speed toward baseline).
      2. Predict 'Independence Horizon' (The date home care can safely terminate).
      3. Predict 'Stagnation Probability' (Chance of clinical plateau).
      4. List 3 key recovery milestones.
      
      Return JSON: { 
        "velocity": number, "horizon": "YYYY-MM-DD", "stagnation": number, 
        "milestones": [ { "title": "", "status": "ACHIEVED|PENDING|AT_RISK" } ],
        "rationale": "" 
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
        recoveryVelocity: data.velocity || 50,
        predictedIndependenceDate: data.horizon || "TBD",
        stagnationProbability: data.stagnation || 10,
        milestones: data.milestones || [],
        clinicalRationale: data.rationale || "Stability baseline maintained."
      };
    } catch (e) {
      throw e;
    }
  }
}

export const outcomeTrajectoryService = new OutcomeTrajectoryService();