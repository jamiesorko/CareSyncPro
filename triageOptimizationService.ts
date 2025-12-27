import { GoogleGenAI } from "@google/genai";
import { TriageReferral } from '../types';

export class TriageOptimizationService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async rankWaitlist(referrals: any[]): Promise<TriageReferral[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Act as a Strategic Intake Coordinator.
      Referrals: ${JSON.stringify(referrals)}
      
      Task: Calculate a 'Gravity Score' (0-100) for each.
      Rank by Clinical Urgency and Logistical Fit.
      Return JSON array: [ { "id": "", "gravity": number, "acuity": "LOW|MED|HIGH|CRITICAL", "fit": number, "rationale": "" } ]
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '[]');
      return data.map((d: any) => ({
        id: d.id,
        patientName: referrals.find(r => r.id === d.id)?.patientName || "Unknown",
        source: referrals.find(r => r.id === d.id)?.source || "Unknown",
        gravityScore: d.gravity,
        clinicalAcuity: d.acuity,
        logisticalFit: d.fit,
        aiRationale: d.rationale,
        status: 'NEW'
      }));
    } catch (e) {
      return [];
    }
  }

  async predictDischargeVelocity(clients: any[]): Promise<any[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `Active Clients: ${JSON.stringify(clients.map(c => ({ id: c.id, conditions: c.conditions })))}. Predict discharge velocity 0-100. Return JSON array: [ { "id": "", "velocity": number, "date": "YYYY-MM-DD", "hours": number, "reason": "" } ]`;
    try {
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
      return JSON.parse(response.text || '[]');
    } catch (e) { return []; }
  }
}

export const triageOptimizationService = new TriageOptimizationService();