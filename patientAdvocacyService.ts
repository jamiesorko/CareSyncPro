import { geminiService } from './geminiService';
import { Client } from '../types';

export interface AdvocacyAlert {
  clientId: string;
  issueType: 'DIGNITY' | 'CONSENT' | 'PRIVACY';
  severity: 'LOW' | 'MED' | 'HIGH';
  observation: string;
  remediationPath: string;
}

export class PatientAdvocacyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans clinical notes for subtle indicators of dignity or consent violations.
   */
  async auditDignityCompliance(client: Client, encounterNotes: string): Promise<AdvocacyAlert[]> {
    console.log(`[ADVOCACY_CORE]: Running dignity audit for Client ${client.name}`);
    
    const prompt = `Analyze these clinical notes for violations of patient dignity, choice, or privacy: "${encounterNotes}".
    Return JSON: { "alerts": [ { "type": "DIGNITY|CONSENT|PRIVACY", "severity": "LOW|MED|HIGH", "observation": "string", "remediation": "string" } ] }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return (data.alerts || []).map((a: any) => ({
        clientId: client.id,
        issueType: a.type,
        severity: a.severity,
        observation: a.observation,
        remediationPath: a.remediation
      }));
    } catch (e) {
      return [];
    }
  }
}

export const patientAdvocacyService = new PatientAdvocacyService();