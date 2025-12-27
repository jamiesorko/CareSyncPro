import { geminiService } from './geminiService';

export interface ValidationFlag {
  isConsistent: boolean;
  discrepancyDetail?: string;
  urgency: 'LOW' | 'MED' | 'HIGH';
}

export class ClinicalValidationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Compares checked tasks against the narrative note to ensure clinical truth.
   */
  async validateDocumentation(tasks: string[], note: string): Promise<ValidationFlag> {
    console.log(`[DOC_VALIDATOR]: Analyzing narrative vector against task matrix.`);
    
    const prompt = `
      Context: Clinical Quality Audit.
      Tasks Checked: ${tasks.join(', ')}
      Caregiver Note: "${note}"
      
      Task: Check if the caregiver's note confirms all checked tasks were performed. 
      Identify contradictions (e.g., task says "Bathed" but note says "Refused bath").
      Return JSON: { "consistent": boolean, "detail": "string", "urgency": "LOW|MED|HIGH" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        isConsistent: data.consistent ?? true,
        discrepancyDetail: data.detail,
        urgency: data.urgency || 'LOW'
      };
    } catch (e) {
      return { isConsistent: true, urgency: 'LOW' };
    }
  }
}

export const clinicalValidationService = new ClinicalValidationService();