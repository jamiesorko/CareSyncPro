
import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface SOSSignal {
  id: string;
  staffId: string;
  coords: { lat: number; lng: number };
  timestamp: string;
  status: 'ACTIVE' | 'RESPONDED' | 'RESOLVED';
}

export class EmergencyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Triggers a high-priority SOS alert across the agency.
   */
  async triggerSOS(staffId: string, lat: number, lng: number) {
    console.error(`[EMERGENCY_CORE]: SOS Signal received from Staff ${staffId} at [${lat}, ${lng}]`);
    
    const signal: Omit<SOSSignal, 'id'> = {
      staffId,
      coords: { lat, lng },
      timestamp: new Date().toISOString(),
      status: 'ACTIVE'
    };

    if (supabase && this.companyId) {
      await supabase.from('emergency_alerts').insert([{
        ...signal,
        company_id: this.companyId
      }]);
    }

    await notificationService.broadcastSignal({
      // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
      type: 'CLINICAL',
      content: `CRITICAL SOS: Staff Member ${staffId} has triggered an emergency signal. Coordinates: ${lat}, ${lng}.`
    }, [CareRole.CEO, CareRole.COO, CareRole.COORDINATOR]);
  }

  async resolveEmergency(id: string) {
    if (supabase) {
      await supabase.from('emergency_alerts').update({ status: 'RESOLVED' }).eq('id', id);
    }
  }
}

export const emergencyService = new EmergencyService();
