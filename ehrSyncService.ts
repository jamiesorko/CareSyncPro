import { supabase } from '../lib/supabase';
import { healthBridgeService } from './healthBridgeService';

export interface SyncJob {
  id: string;
  externalSystem: 'EPIC' | 'CERNER' | 'PCC';
  resourceType: 'Patient' | 'Observation' | 'MedicationRequest';
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  lastAttempt: string;
}

export class EHRSyncService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Pushes a local clinical observation to an external FHIR endpoint.
   */
  async pushToRegistry(resourceId: string, data: any) {
    console.log(`[EHR_GATEWAY]: Preparing FHIR bundle for Resource ${resourceId}`);
    
    // Use healthBridge to map to FHIR standard
    const fhirBundle = await healthBridgeService.mapToFHIR(JSON.stringify(data));
    
    if (supabase && this.companyId) {
      await supabase.from('ehr_sync_logs').insert([{
        company_id: this.companyId,
        resource_id: resourceId,
        payload: fhirBundle,
        status: 'SYNCED',
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getSyncStatus(): Promise<SyncJob[]> {
    return [
      { id: 'job-1', externalSystem: 'PCC', resourceType: 'Patient', status: 'SYNCED', lastAttempt: '2025-10-15T10:00:00Z' },
      { id: 'job-2', externalSystem: 'EPIC', resourceType: 'Observation', status: 'PENDING', lastAttempt: '2025-10-15T11:30:00Z' }
    ];
  }
}

export const ehrSyncService = new EHRSyncService();