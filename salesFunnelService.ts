import { geminiService } from './geminiService';

export interface LeadProfile {
  source: string;
  patientAcuity: string;
  estimatedWeeklyHours: number;
}

export interface ConversionPrediction {
  probability: number; // 0-1
  estimatedLtv: number;
  strategicMove: string;
}

export class SalesFunnelService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to predict the success probability of a new referral lead.
   */
  async predictConversion(lead: LeadProfile): Promise<ConversionPrediction> {
    console.log(`[GROWTH_ENGINE]: Analyzing intake vector from ${lead.source}`);
    
    const prompt = `
      Lead Source: ${lead.source}
      Acuity: ${lead.patientAcuity}
      Hours: ${lead.estimatedWeeklyHours}
      
      Task: Predict conversion probability (0-1) and provide 1 follow-up strategy for a Sales Manager.
      Return JSON: { "prob": number, "ltv": number, "strategy": "string" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        probability: data.prob || 0.6,
        estimatedLtv: data.ltv || (lead.estimatedWeeklyHours * 45 * 52), // Avg rate $45
        strategicMove: data.strategy || "Standard clinical intake protocol."
      };
    } catch (e) {
      return { probability: 0.5, estimatedLtv: 0, strategicMove: "Manual review required." };
    }
  }
}

export const salesFunnelService = new SalesFunnelService();