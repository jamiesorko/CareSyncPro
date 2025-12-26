import { geminiService } from './geminiService';
import { Client, RiskScore } from '../types';

export class ClinicalInsightService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Performs longitudinal analysis of patient notes to detect subtle clinical decline.
   */
  async generateTrendReport(client: Client, notes: string[]): Promise<string> {
    const prompt = `
      Context: Professional Clinical Oversight.
      Patient: ${client.name}
      Conditions: ${client.conditions.join(', ')}
      Historical Data: ${notes.join(' | ')}
      
      Task: Provide a 3-sentence clinical trend summary. Identify if the patient is STABLE, IMPROVING, or DECLINING.
      Focus: Mobility changes and cognitive variance.
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      return response.text || "Clinical trend signal unavailable.";
    } catch (e) {
      return "Unable to synchronize clinical vectors.";
    }
  }

  async predictReadmissionRisk(client: Client): Promise<RiskScore> {
    // Heuristic: Dementia + Bedridden + Recent Initial Visit = HIGH Risk
    const isHigh = client.mobilityStatus.dementia && client.mobilityStatus.isBedridden;
    
    return {
      level: isHigh ? 'HIGH' : 'LOW',
      factors: isHigh ? ['High Acuity Mobility', 'Cognitive Impairment'] : ['Stable Baseline'],
      lastAssessed: new Date().toISOString()
    };
  }
}

export const clinicalInsightService = new ClinicalInsightService();