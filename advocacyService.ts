
import { geminiService } from './geminiService';
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface AdvocacyCase {
  id: string;
  clientId: string;
  detectedIssue: string;
  priority: 'ROUTINE' | 'URGENT';
  status: 'MONITORING' | 'INTERVENTION_REQUIRED';
}

export class AdvocacyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to detect if patient autonomy or rights are being compromised in clinical notes.
   */
  async scanForRightsViolation(notes: string, clientId: string): Promise<AdvocacyCase | null> {
    console.log(`[ADVOCACY_CORE]: Scanning signal for autonomy vectors...`);
    
    const prompt = `Analyze this caregiver note for patient advocacy issues (lack of choice, disrespect, privacy concerns): "${notes}". 
    Return JSON: { "issueDetected": boolean, "description": string, "priority": "ROUTINE|URGENT" }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      
      if (data.issueDetected) {
        await notificationService.broadcastSignal({
          // Fix: Changed 'INTEGRITY_AUDIT' to 'OPERATIONAL' to align with AlertSignal type definition
          type: 'OPERATIONAL',
          content: `ADVOCACY_ALARM: Potential rights violation for Client ${clientId}. ${data.description}`
        }, [CareRole.DOC, CareRole.CEO]);

        return {
          id: Math.random().toString(),
          clientId,
          detectedIssue: data.description,
          priority: data.priority,
          status: 'INTERVENTION_REQUIRED'
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

export const advocacyService = new AdvocacyService();
