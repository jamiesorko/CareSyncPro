import { supabase } from '../lib/supabase';

export interface OfficeBranch {
  id: string;
  name: string;
  address: string;
  managerId: string;
  securityStatus: 'SECURE' | 'MAINTENANCE_REQUIRED';
  lastInspection: string;
}

export class FacilityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getBranches(): Promise<OfficeBranch[]> {
    return [
      { id: 'br-1', name: 'Toronto North HQ', address: '42 Wallaby Way', managerId: 'doc1', securityStatus: 'SECURE', lastInspection: '2025-01-15' },
      { id: 'br-2', name: 'Downtown Satellite', address: '101 Bay St', managerId: 'coo1', securityStatus: 'SECURE', lastInspection: '2025-02-10' }
    ];
  }

  async logMaintenanceRequest(branchId: string, description: string) {
    console.log(`[FACILITY_MGMT]: Logging maintenance for branch ${branchId}: ${description}`);
    // Logic to insert into facility_tickets
  }
}

export const facilityService = new FacilityService();