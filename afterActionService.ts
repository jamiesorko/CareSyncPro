import { GoogleGenAI } from "@google/genai";
import { Client, AfterActionReview } from '../types';

export class AfterActionService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async neuralizeIncident(client: Client, incidentLog: string): Promise<AfterActionReview> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Lead Clinical Educator.
      Incident: "${incidentLog}"
      Patient: ${client.name}
      
      Task: Perform a deep After-Action Review (AAR).
      1. Define Observed vs Optimal Path.
      2. Identify 3 decision nodes.
      3. Forge 2 micro-training questions.
      
      Return JSON: { "observed": "", "optimal": "", "nodes": [], "forge": [] }
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
        eventId: Math.random().toString(36).substring(7),
        observedPath: data.observed || "Standard response.",
        optimalPath: data.optimal || "Enhanced intercept.",
        decisionNodes: data.nodes || [],
        trainingForge: data.forge || []
      };
    } catch (e) {
      throw e;
    }
  }
}

export const afterActionService = new AfterActionService();