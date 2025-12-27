import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

export interface FraudAlert {
  id: string;
  type: 'BILLING_ANOMALY' | 'GPS_SPOOF' | 'CLINICAL_COPIER';
  severity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  description: string;
  actorId: string;
}

export class FraudDetectionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans ledger entries for improbable visit densities.
   */
  async scanForAnomalies(dataset: any[]): Promise<FraudAlert[]> {
    console.log(`[INTEGRITY_SHIELD]: Scanning neural vectors for financial improbable events.`);
    
    const prompt = `Analyze this visit/billing dataset for fraud (overlapping shifts, impossible travel times): ${JSON.stringify(dataset)}. 
    Return JSON: { "alerts": [ { "type": "string", "severity": "string", "description": "string", "actorId": "string" } ] }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return data.alerts || [];
    } catch (e) {
      return [];
    }
  }

  async flagSuspiciousActivity(alert: Omit<FraudAlert, 'id'>) {
    if (supabase && this.companyId) {
      await supabase.from('fraud_alerts').insert([{
        ...alert,
        company_id: this.companyId,
        timestamp: new Date().toISOString(),
        status: 'OPEN'
      }]);
    }
  }
}

export const fraudDetectionService = new FraudDetectionService();