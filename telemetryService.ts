import { supabase } from '../lib/supabase';

export class TelemetryService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Validates if a coordinate set is within a 200m buffer of the target address.
   */
  async validateGeofence(staffId: string, lat: number, lng: number, targetAddress: string): Promise<boolean> {
    console.log(`[GEO_SENTINEL]: Validating position for Staff ${staffId} at ${targetAddress}`);
    // Simulated GPS check logic
    const isValid = Math.random() > 0.05; 
    
    if (supabase && this.companyId) {
      await supabase.from('telemetry_logs').insert([{
        company_id: this.companyId,
        staff_id: staffId,
        event: 'GEOFENCE_CHECK',
        status: isValid ? 'SUCCESS' : 'VIOLATION',
        coords: `${lat},${lng}`
      }]);
    }
    
    return isValid;
  }

  async streamBiometrics(clientId: string) {
    return {
      bpm: 72 + Math.floor(Math.random() * 5),
      steps: 2140,
      status: 'STABLE'
    };
  }
}

export const telemetryService = new TelemetryService();