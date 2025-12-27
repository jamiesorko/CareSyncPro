import { geminiService } from './geminiService';
import { StaffMember } from '../types';

export interface BurnoutRisk {
  staffId: string;
  riskScore: number; // 0-100
  indicators: string[];
  recommendation: string;
}

export class BurnoutDetectionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Neural analysis of staff operational load and communication sentiment.
   */
  async assessRisk(staff: StaffMember, sentimentScore: number): Promise<BurnoutRisk> {
    console.log(`[NEURAL_HR]: Assessing burnout vectors for ${staff.name}`);
    
    const context = {
      weeklyHours: staff.weeklyHours,
      role: staff.role,
      lastSeen: staff.lastSeen,
      sentimentPulse: sentimentScore
    };

    const prompt = `Analyze burnout risk for this healthcare professional: ${JSON.stringify(context)}. 
    Calculate a risk score (0-100), list 2 key indicators, and provide a 1-sentence retention strategy. 
    Format: JSON { "score": number, "indicators": string[], "strategy": string }`;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      return {
        staffId: staff.id,
        riskScore: data.score || 0,
        indicators: data.indicators || [],
        recommendation: data.strategy || "Maintain standard supervision."
      };
    } catch (e) {
      return { staffId: staff.id, riskScore: 0, indicators: [], recommendation: "Analysis unavailable." };
    }
  }
}

export const burnoutDetectionService = new BurnoutDetectionService();