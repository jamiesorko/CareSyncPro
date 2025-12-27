import { geminiService } from './geminiService'
import { Client } from '../types'

export interface BehavioralPattern {
  trigger: string;
  temporalCorrelation: string; // e.g., "Late afternoon / Sunset"
  severity: 'LOW' | 'MED' | 'HIGH';
  mitigation: string;
}

export class BehavioralInsightService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans client history for repeating behavioral triggers in dementia patients.
   */
  async analyzeBehaviors(client: Client, rawNotes: string[]): Promise<BehavioralPattern[]> {
    console.log(`[COGNITIVE_CORE]: Running behavior vector analysis for ${client.name}`);
    
    if (rawNotes.length === 0) return [];

    const prompt = `
      Patient: ${client.name} (Dementia Diagnosis: ${client.mobilityStatus.dementia})
      Conditions: ${client.conditions.join(', ')}
      Source Material: "${rawNotes.join(' | ')}"
      
      Task: Identify repeating behavioral triggers, 'Sundowning' patterns, or agitation vectors.
      Return JSON: { "patterns": [ { "trigger": "string", "correlation": "string", "severity": "LOW|MED|HIGH", "mitigation": "string" } ] }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return data.patterns || [];
    } catch (e) {
      return [];
    }
  }
}

export const behavioralInsightService = new BehavioralInsightService();