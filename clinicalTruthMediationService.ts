import { GoogleGenAI } from "@google/genai";
import { Client, TruthMediationCase } from '../types';

export class ClinicalTruthMediationService {
  /**
   * Mediates signals between conflicting field reports.
   */
  async mediateSignals(client: Client, reports: { staffName: string; role: string; note: string }[]): Promise<TruthMediationCase> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a Lead Clinical Forensic Arbiter.
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Observations: ${JSON.stringify(reports)}
      
      Task: Resolve discrepancies between human reports. 
      Identify if one report is likely inaccurate due to lack of training or context. 
      Forge the "Absolute Clinical Truth" based on safety priority.
      Provide a Directive for the Director of Care.
      
      Return JSON: { 
        "truth": "Professional consensus", 
        "prob": 0-100, 
        "safety": "STABLE|WATCH|CRITICAL", 
        "directive": "string" 
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
        divergentSignals: reports,
        aiSynthesizedTruth: data.truth || "Baseline maintenance confirmed.",
        discrepancyProbability: data.prob || 0,
        safetyPriorityLevel: data.safety || 'STABLE',
        suggestedDirective: data.directive || "Continue standard care path."
      };
    } catch (e) {
      return {
        clientId: client.id,
        divergentSignals: reports,
        aiSynthesizedTruth: "Nexus error during truth mediation.",
        discrepancyProbability: 100,
        safetyPriorityLevel: 'WATCH',
        suggestedDirective: "Manual supervisor chart review mandatory."
      };
    }
  }
}

export const clinicalTruthMediationService = new ClinicalTruthMediationService();