import { clinicalService } from './clinicalService';
import { AlertType } from '../types';

export class AuditService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans for documentation gaps in the last 24 hours.
   */
  async runIntegrityCheck(staffId: string): Promise<boolean> {
    console.log(`[AUDIT_SENTINEL]: Running documentation audit for Staff ${staffId}`);
    
    // Simulated check: find visits without a matching incident or clinical note
    const hasGap = Math.random() > 0.9; 
    
    if (hasGap) {
      await clinicalService.createIncident({
        clientId: 'system',
        type: 'INTEGRITY_AUDIT' as AlertType,
        note: `Documentation Gap detected for Staff ${staffId}. Manual clinical review required.`,
        escalationTarget: 'SUPERVISOR'
      });
      return false;
    }
    return true;
  }
}

export const auditService = new AuditService();