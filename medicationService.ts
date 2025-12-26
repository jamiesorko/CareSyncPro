import { supabase } from '../lib/supabase';
import { Client, Medication } from '../types';
import { clinicalService } from './clinicalService';

export class MedicationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async recordAdministration(clientId: string, medId: string, staffId: string, status: 'GIVEN' | 'REFUSED' | 'MISSED') {
    console.log(`[MED_MIRROR]: Recording ${status} for Med ${medId} at Client ${clientId}`);
    
    if (status !== 'GIVEN') {
      await clinicalService.createIncident({
        clientId,
        type: 'CLINICAL',
        note: `Medication Alert: [${medId}] was ${status}. Immediate supervisor review required.`,
        escalationTarget: 'SUPERVISOR'
      });
    }

    if (supabase && this.companyId) {
      await supabase.from('medication_logs').insert([{
        company_id: this.companyId,
        client_id: clientId,
        medication_id: medId,
        staff_id: staffId,
        status,
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getAdherenceRate(clientId: string): Promise<number> {
    // Mocking adherence telemetry
    return 94.2;
  }
}

export const medicationService = new MedicationService();