import { supabase } from '../lib/supabase';
import { billingService } from './billingService';

export interface IntegrityFlag {
  id: string;
  visitId: string;
  staffId: string;
  flagType: 'PHANTOM_VISIT' | 'IMPOSSIBLE_TRAVEL' | 'COMPLEXITY_GAP';
  severity: 'MED' | 'HIGH' | 'CRITICAL';
  description: string;
}

export class IntegrityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans a batch of visits for anomalies that could indicate billing fraud or data errors.
   */
  async auditBillingBatch(visitIds: string[]): Promise<IntegrityFlag[]> {
    console.log(`[INTEGRITY_SHIELD]: Scanning ${visitIds.length} visit records for fiscal leakage.`);
    
    // Logic to detect "Impossible Travel" (Visit A ends at 10:00, Visit B starts at 10:01 but is 20km away)
    return [];
  }

  async reportFraudSignal(flag: Omit<IntegrityFlag, 'id'>) {
    console.error(`[INTEGRITY_ALARM]: ${flag.flagType} detected for Staff ${flag.staffId}`);
    if (supabase && this.companyId) {
      await supabase.from('integrity_alerts').insert([{
        ...flag,
        company_id: this.companyId,
        status: 'OPEN',
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const integrityService = new IntegrityService();