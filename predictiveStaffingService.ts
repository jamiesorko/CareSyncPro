import { geminiService } from './geminiService'
import { MOCK_STAFF } from '../data/careData'

export interface StaffingForecast {
  region: string;
  projectedDemandIncrease: number; // Percentage
  criticalHiringWindow: string;
  recommendedRoleFocus: string[];
  strategicRationale: string;
}

export class PredictiveStaffingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Synthesizes labor market trends with internal turnover data to predict hiring needs.
   */
  async generateHiringRoadmap(region: string, pipelineCount: number): Promise<StaffingForecast> {
    console.log(`[STRATEGIC_HR]: Synthesizing 6-month labor roadmap for ${region}`);
    
    const context = {
      currentStaffCount: MOCK_STAFF.length,
      averageTurnover: "12%",
      regionFocus: region,
      activeReferrals: pipelineCount
    };

    const prompt = `
      Act as a Healthcare Operations Strategist. 
      Analyze: ${JSON.stringify(context)}.
      Task: Predict staffing demand for next quarter.
      Return JSON: { "demandIncrease": number, "window": "string", "roles": string[], "rationale": "string" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        region,
        projectedDemandIncrease: data.demandIncrease || 15,
        criticalHiringWindow: data.window || "Next 60-90 Days",
        recommendedRoleFocus: data.roles || ["RN", "PSW"],
        strategicRationale: data.rationale || "Stable expansion projected."
      };
    } catch (e) {
      return { 
        region, 
        projectedDemandIncrease: 0, 
        criticalHiringWindow: "TBD", 
        recommendedRoleFocus: [], 
        strategicRationale: "Staffing signal offline." 
      };
    }
  }
}

export const predictiveStaffingService = new PredictiveStaffingService();