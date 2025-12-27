import { supabase } from '../lib/supabase';
import { Client } from '../types';

export interface CareGap {
  id: string;
  clientId: string;
  missingTask: string;
  severity: 'LOW' | 'MED' | 'HIGH';
  occurrenceCount: number;
}

export class CareGapService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes visit execution data to find "Care Gaps" (authorized tasks never checked off).
   */
  async identifyGaps(client: Client): Promise<CareGap[]> {
    console.log(`[GAP_SENTINEL]: Analyzing care plan adherence for ${client.name}`);
    // In a real app, this would query visit_tasks table and compare with care_plans
    return [
      { id: 'gap-1', clientId: client.id, missingTask: 'Range of Motion Exercises', severity: 'MED', occurrenceCount: 3 }
    ];
  }

  async flagGapForReview(gap: CareGap) {
    if (supabase && this.companyId) {
      await supabase.from('care_gaps').insert([{
        company_id: this.companyId,
        client_id: gap.clientId,
        task: gap.missingTask,
        severity: gap.severity,
        status: 'OPEN'
      }]);
    }
  }
}

export const careGapService = new CareGapService();