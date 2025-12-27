
import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface WSIBClaim {
  id: string;
  staffId: string;
  incidentDate: string;
  type: 'FALL' | 'STRAIN' | 'NEEDLESTICK' | 'EXPOSURE';
  status: 'REPORTED' | 'ADJUDICATING' | 'APPROVED' | 'CLOSED';
  expectedReturnDate?: string;
}

export class WSIBService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async reportInjury(claim: Omit<WSIBClaim, 'id' | 'status'>) {
    console.warn(`[SAFETY_OFFICER]: New WSIB claim initiated for Staff ${claim.staffId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('wsib_claims').insert([{
        ...claim,
        company_id: this.companyId,
        status: 'REPORTED'
      }]);
    }

    await notificationService.broadcastSignal({
      // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
      type: 'CLINICAL',
      content: `WSIB_ALERT: Staff injury reported. return-to-work protocol required for Staff ${claim.staffId}.`
    }, [CareRole.HR_SPECIALIST, CareRole.CEO]);
  }

  async getClaimHistory(staffId: string): Promise<WSIBClaim[]> {
    return [];
  }
}

export const wsibService = new WSIBService();
