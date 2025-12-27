import { GoogleGenAI } from "@google/genai";
import { StrategicScenario } from '../types';

export class BusinessSimulationService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async runScenarioSimulation(prompt: string): Promise<StrategicScenario> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const requestPrompt = `
      Act as a Lead Healthcare CFO.
      Scenario: "${prompt}"
      
      Task: Perform 12-month Monte Carlo simulation.
      1. Predict Revenue, Burn, Retention monthly.
      2. Fatal Failure Point.
      3. Mitigation strategy.
      4. Risk Index (0-100).
      
      Return JSON: { "title": "", "projection": [], "failurePoint": "", "mitigation": "", "risk": number }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: requestPrompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 24576 } 
        }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        id: Math.random().toString(36).substring(7),
        title: data.title || "Scenario",
        projection: data.projection?.map((p: any) => ({
          month: p.month,
          revenue: p.rev,
          burnRate: p.burn,
          staffRetention: p.retention,
          netReserve: p.reserve
        })) || [],
        failurePoint: data.failurePoint || "Stable horizon.",
        mitigationStrategy: data.mitigation || "Maintain buffers.",
        riskIndex: data.risk || 0
      };
    } catch (e) {
      throw e;
    }
  }
}

export const businessSimulationService = new BusinessSimulationService();