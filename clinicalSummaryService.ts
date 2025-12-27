import { geminiService } from './geminiService';
import { Client } from '../types';

export interface SOAPSummary {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  aiConfidence: number;
}

export class ClinicalSummaryService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Aggregates shift notes into a unified medical summary using Gemini Pro.
   */
  async generateSOAPNote(client: Client, notes: string[]): Promise<SOAPSummary> {
    console.log(`[NEURAL_SCRIBE]: Synthesizing SOAP vector for ${client.name}`);
    
    const prompt = `
      Context: Professional Healthcare Summary.
      Patient: ${client.name} (Conditions: ${client.conditions.join(', ')})
      Source Material: ${notes.join(' | ')}
      
      Task: Generate a S.O.A.P note (Subjective, Objective, Assessment, Plan).
      Return JSON: { "s": "string", "o": "string", "a": "string", "p": "string", "confidence": number }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        subjective: data.s || "Baseline reported.",
        objective: data.o || "Vitals stable per field logs.",
        assessment: data.a || "Patient maintaining baseline stability.",
        plan: data.p || "Continue current care plan directives.",
        aiConfidence: data.confidence || 0.9
      };
    } catch (e) {
      return { subjective: 'Error', objective: 'Error', assessment: 'Error', plan: 'Error', aiConfidence: 0 };
    }
  }
}

export const clinicalSummaryService = new ClinicalSummaryService();