import { geminiService } from './geminiService'
import { Client } from '../types'

export interface DecisionSupportResult {
  potentialCauses: string[];
  recommendedAssessments: string[];
  urgencyLevel: 'MONITOR' | 'ASSESS_NOW' | 'EMERGENCY_TRANSFER';
  rationale: string;
}

export class ClinicalDecisionSupportService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes complex patient symptoms against clinical history to suggest differential diagnoses.
   */
  async getDiagnosticSupport(client: Client, symptoms: string): Promise<DecisionSupportResult> {
    console.log(`[NEURAL_CDS]: Processing clinical diagnostic vector for ${client.name}...`);
    
    const context = {
      patient: client.name,
      conditions: client.conditions,
      mobility: client.mobilityStatus,
      newObservations: symptoms
    };

    const prompt = `
      Act as a Senior Clinical Nurse Consultant. 
      Analyze patient state: ${JSON.stringify(context)}.
      Provide: 3 potential causes for these symptoms, 2 immediate assessments to perform, and a priority level.
      Return JSON: { "causes": string[], "assessments": string[], "urgency": "MONITOR|ASSESS_NOW|EMERGENCY_TRANSFER", "rationale": "string" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        potentialCauses: data.causes || [],
        recommendedAssessments: data.assessments || [],
        urgencyLevel: data.urgency || 'MONITOR',
        rationale: data.rationale || "Inconclusive neural signal."
      };
    } catch (e) {
      return { 
        potentialCauses: [], 
        recommendedAssessments: [], 
        urgencyLevel: 'MONITOR', 
        rationale: "Decision support engine synchronized but unresponsive." 
      };
    }
  }
}

export const clinicalDecisionSupportService = new ClinicalDecisionSupportService();