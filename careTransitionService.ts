import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface TransitionCase {
  id: string;
  clientId: string;
  sourceFacility: string;
  dischargeDate: string;
  readmissionRisk: number;
  medicationReconciliationComplete: boolean;
  homeSafetyAuditComplete: boolean;
  status: 'PENDING' | 'IN_TRANSITION' | 'STABILIZED';
}

export class CareTransitionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async initiateTransition(clientId: string, facility: string) {
    console.log(`[TRANSITION_GATEWAY]: New hospital-to-home vector initialized for Client ${clientId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('care_transitions').insert([{
        company_id: this.companyId,
        client_id: clientId,
        source_facility: facility,
        status: 'PENDING',
        created_at: new Date().toISOString()
      }]);
    }

    await notificationService.broadcastSignal({
      type: 'CLINICAL',
      content: `TRANSITION_ALERT: New discharge pending from ${facility}. RN reconciliation protocol required.`
    }, [CareRole.RN, CareRole.COORDINATOR]);
  }

  async getTransitionMetrics() {
    return {
      activeTransitions: 4,
      avgStabilizationTimeDays: 5.2,
      preventionRate: 98.1
    };
  }
}

export const careTransitionService = new CareTransitionService();