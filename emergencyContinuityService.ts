
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface ContinuityPlan {
  originalStaffId: string;
  visitId: string;
  failureType: 'CAR_BREAKDOWN' | 'PERSONAL_EMERGENCY' | 'SIGNAL_LOSS';
  recoveryResponderId: string;
  estimatedDelayMinutes: number;
}

export class EmergencyContinuityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Triggers an immediate recovery plan when a field staff member is incapacitated.
   */
  async initiateRecovery(staffId: string, visitId: string, type: ContinuityPlan['failureType']) {
    console.error(`[CONTINUITY_RED]: Field failure detected for Staff ${staffId} - Protocol: ${type}`);
    
    await notificationService.broadcastSignal({
      // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
      type: 'CLINICAL',
      content: `CRITICAL CONTINUITY: Staff ${staffId} reported ${type}. Automated recovery protocol active.`,
    }, [CareRole.COORDINATOR, CareRole.COO]);

    return {
      originalStaffId: staffId,
      visitId,
      failureType: type,
      recoveryResponderId: 'backup-rn-01',
      estimatedDelayMinutes: 25
    };
  }
}

export const emergencyContinuityService = new EmergencyContinuityService();
