import { supabase } from '../lib/supabase';
import { clinicalService } from './clinicalService';

export interface VitalsData {
  heartRate: number;
  systolic: number;
  diastolic: number;
  temp?: number;
  oxygenSaturation?: number;
}

export class VitalsService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async recordVitals(clientId: string, staffId: string, data: VitalsData) {
    console.log(`[VITALS_CORE]: Logging vitals for Client ${clientId}`);
    
    // Safety Logic: Tachycardia or Hypertension check
    if (data.heartRate > 120 || data.systolic > 160) {
      await clinicalService.createIncident({
        clientId,
        type: 'CLINICAL',
        note: `Vitals Alert: Pulse ${data.heartRate} BPM, BP ${data.systolic}/${data.diastolic}. Immediate assessment required.`,
        escalationTarget: 'SUPERVISOR'
      });
    }

    if (supabase && this.companyId) {
      await supabase.from('vitals_history').insert([{
        ...data,
        client_id: clientId,
        staff_id: staffId,
        company_id: this.companyId,
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getHistoricalTrends(clientId: string) {
    return [
      { date: '2023-10-10', bpm: 72 },
      { date: '2023-10-11', bpm: 75 },
      { date: '2023-10-12', bpm: 115 } // Sharp increase
    ];
  }
}

export const vitalsService = new VitalsService();