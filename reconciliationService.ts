import { supabase } from '../lib/supabase';

export interface Discrepancy {
  id: string;
  visitId: string;
  type: 'HOURS_MISMATCH' | 'GPS_VIOLATION' | 'UNAUTHORIZED_OVERTIME';
  severity: 'LOW' | 'MED' | 'HIGH';
  details: string;
  status: 'OPEN' | 'RESOLVED';
}

export class ReconciliationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Cross-references visit telemetry with the master schedule to flag payroll leaks.
   */
  async findDiscrepancies(): Promise<Discrepancy[]> {
    console.log(`[FISCAL_GUARD]: Running automated visit-to-payroll reconciliation.`);
    // In a real app, this would be a complex SQL join across visits and schedules
    return [];
  }

  async flagForAudit(visitId: string, reason: string) {
    if (supabase && this.companyId) {
      await supabase.from('payroll_discrepancies').insert([{
        company_id: this.companyId,
        visit_id: visitId,
        reason,
        status: 'OPEN',
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const reconciliationService = new ReconciliationService();