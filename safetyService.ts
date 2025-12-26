import { supabase } from '../lib/supabase';
import { clinicalService } from './clinicalService';

export interface SafetyHazard {
  id: string;
  clientId: string;
  reporterId: string;
  type: 'TRIP_HAZARD' | 'FIRE_RISK' | 'SANITATION' | 'AGGRESSION';
  description: string;
  imageUrl?: string;
  status: 'OPEN' | 'MITIGATED';
}

export class SafetyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async reportHazard(hazard: Omit<SafetyHazard, 'id' | 'status'>) {
    console.log(`[SAFETY_SENTINEL]: New hazard reported at Client ${hazard.clientId}: ${hazard.type}`);
    
    await clinicalService.createIncident({
      clientId: hazard.clientId,
      type: 'UNSAFE_ENV',
      note: `Safety Signal: ${hazard.type} - ${hazard.description}`,
      escalationTarget: 'BOTH'
    });

    if (supabase && this.companyId) {
      await supabase.from('safety_hazards').insert([{
        ...hazard,
        company_id: this.companyId,
        status: 'OPEN'
      }]);
    }
  }

  async getClientSafetySummary(clientId: string) {
    return {
      hazardCount: 2,
      riskLevel: 'MODERATE',
      recentIncidents: 1
    };
  }
}

export const safetyService = new SafetyService();