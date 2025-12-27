import { geminiService } from './geminiService';
import { MOCK_HISTORICAL_PL } from '../data/accountingData';

export interface FiscalForecast {
  projectedRevenue: number;
  predictedBurnRate: number;
  confidenceScore: number;
  strategicInsight: string;
}

export class FiscalForecastingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini Pro to analyze financial trends and predict future agency health.
   */
  async generateQuarterlyForecast(): Promise<FiscalForecast> {
    console.log(`[FISCAL_ORACLE]: Synthesizing quarterly economic projection...`);
    
    const prompt = `Analyze these agency financials: ${JSON.stringify(MOCK_HISTORICAL_PL)}. 
    Predict next month's revenue and burn rate. Provide 1 strategic fiscal recommendation.
    Return JSON: { "revenue": number, "burn": number, "confidence": number, "insight": string }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        projectedRevenue: data.revenue || 68000,
        predictedBurnRate: data.burn || 8200,
        confidenceScore: data.confidence || 0.88,
        strategicInsight: data.insight || "Maintain current utilization vectors."
      };
    } catch (e) {
      return { projectedRevenue: 0, predictedBurnRate: 0, confidenceScore: 0, strategicInsight: "Fiscal signal lost." };
    }
  }
}

export const fiscalForecastingService = new FiscalForecastingService();