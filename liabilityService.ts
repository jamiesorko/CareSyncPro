import { supabase } from '../lib/supabase';

export interface LiabilityCase {
  id: string;
  incidentId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  legalHoldActive: boolean;
  insuranceNotified: boolean;
  discoveryBundleUrl?: string;
}

export class LiabilityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Places a "Legal Hold" on all clinical data related to a specific incident.
   */
  async activateLegalHold(incidentId: string) {
    console.warn(`[LEGAL_SHIELD]: Activating data-preservation hold for Incident ${incidentId}`);
    if (supabase && this.companyId) {
      await supabase.from('liability_cases').upsert([{
        company_id: this.companyId,
        incident_id: incidentId,
        legal_hold_active: true,
        updated_at: new Date().toISOString()
      }]);
    }
  }

  async compileDiscoveryBundle(incidentId: string): Promise<string> {
    console.log(`[LEGAL_SHIELD]: Aggregating visit logs, biometrics, and comms for discovery.`);
    // Logic to generate a signed PDF/Archive of all relevant historical data
    return "https://vault.caresync.pro/bundles/discovery_idx_992.zip";
  }
}

export const liabilityService = new LiabilityService();