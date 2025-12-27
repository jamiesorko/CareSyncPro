import { geminiService } from './geminiService';
import { Client } from '../types';

export interface SDOHMetric {
  category: 'ISOLATION' | 'FOOD_SECURITY' | 'HOUSING' | 'TRANSPORTATION';
  riskScore: number; // 0-10
  observations: string[];
  interventionRequired: boolean;
}

export class SDOHService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans field notes for indicators of social risk factors.
   */
  async assessSocialRisks(client: Client, fieldNotes: string[]): Promise<SDOHMetric[]> {
    console.log(`[SOCIAL_DETERMINANTS]: Analyzing social vectors for ${client.name}`);
    
    const prompt = `
      Patient: ${client.name}
      Field Notes: "${fieldNotes.join(' | ')}"
      
      Task: Identify risks in Loneliness/Isolation, Food Security, and Housing Stability.
      Return JSON: [ { "category": "ISOLATION|FOOD|HOUSING", "score": 0-10, "obs": ["string"], "urgent": boolean } ]
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '[]');
      return data.map((d: any) => ({
        category: d.category,
        riskScore: d.score,
        observations: d.obs,
        interventionRequired: d.urgent
      }));
    } catch (e) {
      return [];
    }
  }
}

export const sdohService = new SDOHService();