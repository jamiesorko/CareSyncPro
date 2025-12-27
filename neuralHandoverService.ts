import { geminiService } from './geminiService';
import { Client } from '../types';

export interface HandoverBrief {
  clientId: string;
  summary: string;
  criticalFocus: string;
  stabilityIndicator: 'STABLE' | 'WATCH' | 'CRITICAL';
}

export class NeuralHandoverService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Synthesizes 24 hours of data into a handover vector for clinical continuity.
   */
  async generateShiftBriefing(client: Client, rawNotes: string[]): Promise<HandoverBrief> {
    console.log(`[NEURAL_HANDOVER]: Synthesizing context for ${client.name}`);
    
    const prompt = `
      Context: Healthcare Shift Handover.
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Notes: ${rawNotes.join(' | ')}
      
      Task: Provide a 2-sentence summary and 1 'Critical Focus' point for the next nurse.
      Return JSON: { "summary": "string", "focus": "string", "stability": "STABLE|WATCH|CRITICAL" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        clientId: client.id,
        summary: data.summary || "No significant events in last cycle.",
        criticalFocus: data.focus || "Follow standard care plan.",
        stabilityIndicator: data.stability || 'STABLE'
      };
    } catch (e) {
      return { clientId: client.id, summary: "Briefing unavailable.", criticalFocus: "Review full chart.", stabilityIndicator: 'WATCH' };
    }
  }
}

export const neuralHandoverService = new NeuralHandoverService();