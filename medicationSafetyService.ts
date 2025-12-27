import { geminiService } from './geminiService';
import { Client, Medication } from '../types';

export interface SafetyFlag {
  severity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
}

export class MedicationSafetyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to audit a client's medication list for dangerous interactions.
   */
  async auditMedicationSafety(client: Client): Promise<SafetyFlag[]> {
    console.log(`[NEURAL_PHARM]: Auditing interaction matrix for ${client.name}`);
    
    const context = {
      conditions: client.conditions,
      medications: client.medications.map(m => `${m.name} ${m.dosage}`),
    };

    const prompt = `
      Context: Healthcare Safety Audit.
      Patient Conditions: ${context.conditions.join(', ')}
      Current Meds: ${context.medications.join(', ')}
      
      Task: Identify potential drug-drug or drug-condition interactions.
      Return JSON: { "flags": [ { "severity": "CRITICAL|HIGH|MED|LOW", "description": "string", "rec": "string" } ] }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return data.flags || [];
    } catch (e) {
      return [];
    }
  }
}

export const medicationSafetyService = new MedicationSafetyService();