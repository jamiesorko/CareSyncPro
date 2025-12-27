import { supabase } from '../lib/supabase';

export interface IncentiveRecord {
  staffId: string;
  clinicalExcellencePoints: number;
  operationalStreakDays: number;
  availableRewards: string[];
}

export class StaffIncentiveService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Logs performance milestones that trigger automated rewards or bonuses.
   */
  async awardMilestone(staffId: string, type: 'PUNCTUALITY' | 'DOCUMENTATION' | 'CLIENT_PRAISE') {
    console.log(`[INCENTIVE_CORE]: Recording ${type} milestone for Staff ${staffId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('staff_incentives').upsert([{
        company_id: this.companyId,
        staff_id: staffId,
        last_milestone: type,
        updated_at: new Date().toISOString()
      }]);
    }
  }

  async getStaffPoints(staffId: string): Promise<IncentiveRecord> {
    return {
      staffId,
      clinicalExcellencePoints: 450,
      operationalStreakDays: 14,
      availableRewards: ['Gas Card (CAD 25)', 'Extra Flex Day']
    };
  }
}

export const staffIncentiveService = new StaffIncentiveService();