import { GoogleGenAI } from "@google/genai";
import { MarketThreat, StaffLoyaltyRisk, StaffMember } from '../types';

export class RetentionIntelligenceService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async scanMarketThreats(region: string): Promise<MarketThreat[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const query = `Home care PSW and RN wage rates, signing bonuses in ${region}, Ontario October 2025. Top hiring competitors.`;
    const prompt = `Act as a Lead Strategist. Analyze: ${query}. Identify 3 hiring threats. Return JSON: [ { "competitor": "", "wageOffer": "", "bonus": "", "sector": "" } ]`;
    try {
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" } });
      return JSON.parse(response.text || '[]');
    } catch (e) { return []; }
  }

  async calculateLoyaltyRisk(staff: StaffMember, threats: MarketThreat[]): Promise<StaffLoyaltyRisk> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const prompt = `
      Staff: ${staff.name}, Role: ${staff.role}, Hours: ${staff.weeklyHours}
      Threats: ${JSON.stringify(threats)}
      Task: Predict resignation likelihood (30 days). Recommend monthly stability premium.
      Return JSON: { "level": "LOW|MED|HIGH|CRITICAL", "factors": [], "premium": number, "rationale": "" }
    `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 10000 }
        }
      });
      const d = JSON.parse(response.text || '{}');
      return { staffId: staff.id, riskLevel: d.level || 'LOW', vulnerabilityFactors: d.factors || [], suggestedPremium: d.premium || 0, rationale: d.rationale || "Maintain engagement." };
    } catch (e) { throw e; }
  }
}

export const retentionIntelligenceService = new RetentionIntelligenceService();