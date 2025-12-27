import { supabase } from '../lib/supabase';

export interface SafetySignal {
  sectorId: string;
  riskType: 'WEATHER' | 'TRAFFIC' | 'SECURITY';
  severity: 'MED' | 'HIGH' | 'CRITICAL';
  directive: string;
}

export class StaffSafetyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Monitors active sectors for danger vectors.
   */
  async getLiveSafetyAlerts(): Promise<SafetySignal[]> {
    console.log(`[SAFETY_SHIELD]: Scanning environmental vectors for Org ${this.companyId}`);
    
    // In production, this would ingest feeds from Weather APIs, Police Data, and Traffic sensors.
    return [
      { sectorId: 'sector-4', riskType: 'WEATHER', severity: 'MED', directive: 'Ice advisory in effect. All staff to utilize heavy-traction boots for patio approaches.' }
    ];
  }

  async broadcastSafetyWarning(alert: SafetySignal) {
    console.warn(`[SAFETY_SHIELD]: BROADCASTING ${alert.severity} ${alert.riskType} alert to ${alert.sectorId}`);
    if (supabase && this.companyId) {
      await supabase.from('safety_broadcasts').insert([{
        company_id: this.companyId,
        ...alert,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const staffSafetyService = new StaffSafetyService();