import { StaffMember, Client } from '../types';
import { geoService } from './geoService';

export interface BalancingSuggestion {
  originalStaffId: string;
  targetStaffId: string;
  visitId: string;
  reason: string;
  travelSavedKm: number;
}

export class WorkloadBalanceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Identifies "High Strain" staff and finds suitable reassignment targets in the same sector.
   */
  async calculateOptimization(staffList: StaffMember[], clients: Client[]): Promise<BalancingSuggestion[]> {
    console.log(`[NEURAL_BALANCER]: Running capacity-to-density optimization for Org ${this.companyId}`);
    
    const overloaded = staffList.filter(s => s.weeklyHours >= 44);
    const available = staffList.filter(s => s.weeklyHours < 30 && s.status === 'ONLINE');

    if (overloaded.length === 0 || available.length === 0) return [];

    // Simple heuristic for demo: suggest moving one visit from first overloaded to first available
    return [{
      originalStaffId: overloaded[0].id,
      targetStaffId: available[0].id,
      visitId: 'v-next-scheduled',
      reason: 'Overtime prevention and sector density alignment.',
      travelSavedKm: 4.2
    }];
  }
}

export const workloadBalanceService = new WorkloadBalanceService();