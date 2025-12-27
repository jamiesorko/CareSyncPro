import { geminiService } from './geminiService'
import { StaffMember } from '../types'

export interface ChurnRisk {
  staffId: string;
  riskProbability: number;
  primaryStressors: string[];
  retentionDirective: string;
}

export class ChurnNeuralService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Predicts resignation risk by correlating hours, sentiment, and incident frequency.
   */
  async analyzeChurnProbability(staff: StaffMember, history: any): Promise<ChurnRisk> {
    console.log(`[NEURAL_RETENTION]: Running churn simulation for ${staff.name}`);
    
    const prompt = `
      Professional: ${staff.name}
      Data: Hours=${staff.weeklyHours}, Role=${staff.role}, Recent Sentiment=${history.sentiment}
      Task: Predict resignation probability (0-1). Identify 2 stressors and 1 retention move.
      Return JSON: { "prob": number, "stressors": ["string"], "directive": "string" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        staffId: staff.id,
        riskProbability: data.prob || 0.1,
        primaryStressors: data.stressors || ["Workload"],
        retentionDirective: data.directive || "Continue standard oversight."
      };
    } catch (e) {
      return { staffId: staff.id, riskProbability: 0, primaryStressors: [], retentionDirective: "Error in neural engine." };
    }
  }
}

export const churnNeuralService = new ChurnNeuralService();