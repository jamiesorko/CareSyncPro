import { GoogleGenAI } from "@google/genai";
import { Client } from '../types';

export interface ChronoSimulation {
  clientId: string;
  horizonDays: number;
  crisisProbability: number;
  failureVector: string;
  reasoningChain: string[];
  suggestedDirective: string;
}

export class NeuralSentinelService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async simulatePatientHorizon(client: Client, recentVitals: any[], recentNotes: string[]): Promise<ChronoSimulation> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Predictive Clinical Data Scientist.
      Patient: ${client.name}
      Data: ${JSON.stringify(recentVitals)}
      Notes: "${recentNotes.join(' | ')}"
      
      Task: Predict clinical stability in 7 days.
      1. Crisis Probability (0-100%).
      2. Primary Failure Vector.
      3. Reasoning Chain (3 points).
      4. Prevention Action.
      
      Return JSON: { "prob": number, "vector": "", "chain": [], "directive": "" }
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
        clientId: client.id,
        horizonDays: 7,
        crisisProbability: data.prob || 0,
        failureVector: data.vector || "Stability",
        reasoningChain: data.chain || [],
        suggestedDirective: data.directive || "Follow standard protocol."
      };
    } catch (e) {
      throw e;
    }
  }
}

export const neuralSentinelService = new NeuralSentinelService();