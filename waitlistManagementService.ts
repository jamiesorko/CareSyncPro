import { geoService } from './geoService';
import { Referral } from './referralManagementService';

export interface PrioritizedReferral extends Referral {
  gravityScore: number; // 0-100 (Higher = Urgent + Efficient)
  rank: number;
}

export class WaitlistManagementService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Ranks the waitlist by combining clinical priority and travel efficiency.
   */
  async optimizeQueue(pending: Referral[]): Promise<PrioritizedReferral[]> {
    console.log(`[WAITLIST_OPTIMIZER]: Recalculating gravity for ${pending.length} leads.`);
    
    return pending.map((ref, idx) => {
      const acuityWeight = ref.acuityLevel === 'CRITICAL' ? 50 : 20;
      const proximityWeight = 30; // In real app, calculate distance to nearest active staff
      
      return {
        ...ref,
        gravityScore: acuityWeight + proximityWeight,
        rank: idx + 1
      };
    }).sort((a, b) => b.gravityScore - a.gravityScore);
  }
}

export const waitlistManagementService = new WaitlistManagementService();