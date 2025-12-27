import { geminiService } from './geminiService';
import { Client } from '../types';

export interface PathwayPhase {
  weekRange: string;
  focus: string;
  milestones: string[];
  interventionStrategy: string;
}

export class PathwayService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Synthesizes a longitudinal clinical roadmap based on intake conditions.
   */
  async designPathway(client: Client): Promise<PathwayPhase[]> {
    console.log(`[PATHWAY_ARCHITECT]: Designing 12-week recovery vector for ${client.name}`);
    
    const prompt = `
      Patient: ${client.name}
      Conditions: ${client.conditions.join(', ')}
      Mobility: ${client.mobilityStatus.transferMethod}
      
      Task: Design a 3-phase clinical pathway (Weeks 1-4, 5-8, 9-12).
      Return JSON: { "phases": [ { "weeks": "string", "focus": "string", "milestones": ["string"], "strategy": "string" } ] }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return (data.phases || []).map((p: any) => ({
        weekRange: p.weeks,
        focus: p.focus,
        milestones: p.milestones,
        interventionStrategy: p.strategy
      }));
    } catch (e) {
      return [{ weekRange: '1-12', focus: 'Standard Care', milestones: ['Baseline maintenance'], interventionStrategy: 'Follow standard care plan.' }];
    }
  }
}

export const pathwayService = new PathwayService();