import { geminiService } from './geminiService';
import { Client } from '../types';

export interface ClinicalIntervention {
  id: string;
  type: 'PREVENTATIVE' | 'REACTIVE';
  action: string;
  justification: string;
  assignedRole: string;
}

export class InterventionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Recommends clinical interventions when stability index thresholds are breached.
   */
  async recommendInterventions(client: Client, stabilityIndex: number): Promise<ClinicalIntervention[]> {
    console.log(`[INTERVENTION_ENGINE]: Synthesizing response plan for ${client.name} (Index: ${stabilityIndex})`);
    
    const prompt = `Patient ${client.name} has a clinical stability index of ${stabilityIndex}/100. 
    Conditions: ${client.conditions.join(', ')}. 
    Suggest 2 preventative interventions for a PSW. 
    Return JSON: { "interventions": [ { "type": "string", "action": "string", "reason": "string" } ] }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return (data.interventions || []).map((i: any) => ({
        id: Math.random().toString(),
        type: i.type,
        action: i.action,
        justification: i.reason,
        assignedRole: 'PSW'
      }));
    } catch (e) {
      return [];
    }
  }
}

export const interventionService = new InterventionService();