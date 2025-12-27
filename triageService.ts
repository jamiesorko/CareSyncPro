import { geminiService } from './geminiService';

export interface TriageResult {
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  suggestedAction: string;
  clinicalJustification: string;
}

export class TriageService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to analyze referral text and assign an emergency priority level.
   */
  async triageReferral(text: string): Promise<TriageResult> {
    console.log(`[NEURAL_TRIAGE]: Analyzing incoming clinical signal...`);
    
    const prompt = `
      Act as a Triage Nurse. Analyze this text: "${text}".
      Assign Priority: P1 (Life Threat), P2 (Urgent), P3 (Stable), P4 (Routine).
      Return JSON: { "priority": "P1|P2|P3|P4", "action": "string", "reason": "string" }
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      return {
        priority: data.priority || 'P3',
        suggestedAction: data.action || 'Standard intake.',
        clinicalJustification: data.reason || 'Baseline assessment indicated.'
      };
    } catch (e) {
      return { priority: 'P3', suggestedAction: 'Manual review required.', clinicalJustification: 'AI processing error.' };
    }
  }
}

export const triageService = new TriageService();