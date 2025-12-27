import { GoogleGenAI } from "@google/genai";
import { Client, HuddleSignal } from '../types';

export class ClinicalTruthFusionService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async fusePatientSignals(client: Client, transcript: string, vitals: any): Promise<HuddleSignal> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Lead Clinical Diagnostic Auditor.
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Vitals: ${JSON.stringify(vitals)}
      Transcript: "${transcript}"
      
      Task: Perform a Multimodal Signal Fusion.
      1. Synthesize the "Total Clinical Truth".
      2. Detect contradictions between human report and telemetry.
      3. Identify subtle "Biometric Drift".
      4. Issue exactly one remediation directive.
      
      Return JSON: { "truth": "", "contradiction": boolean, "drift": "", "directive": "", "confidence": number }
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
        truthSynthesis: data.truth || "Stability maintained.",
        contradictionDetected: !!data.contradiction,
        biometricDrift: data.drift || "Nominal baseline.",
        remediationDirective: data.directive || "Continue standard care.",
        confidence: data.confidence || 0.9
      };
    } catch (e) {
      throw e;
    }
  }
}

export const clinicalTruthFusionService = new ClinicalTruthFusionService();