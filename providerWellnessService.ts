import { supabase } from '../lib/supabase';
import { StaffMember } from '../types';

export interface WellnessDirective {
  staffId: string;
  recommendation: string;
  requiresSupervisorAction: boolean;
}

export class ProviderWellnessService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Evaluates recent shift difficulty and sentiment to prevent burnout.
   */
  async assessStaffLoad(staffId: string, recentIncidentCount: number): Promise<WellnessDirective> {
    console.log(`[WELLNESS_CORE]: Monitoring load vector for Staff ${staffId}`);
    
    const isOverloaded = recentIncidentCount > 2;

    return {
      staffId,
      recommendation: isOverloaded 
        ? "Post-incident recovery suggested. Add 15-min documentation buffer to next 3 shifts." 
        : "Load balanced. Continue standard support.",
      requiresSupervisorAction: isOverloaded
    };
  }

  async logWellnessSession(staffId: string, feedback: string) {
    if (supabase && this.companyId) {
      await supabase.from('wellness_logs').insert([{
        company_id: this.companyId,
        staff_id: staffId,
        feedback,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const providerWellnessService = new ProviderWellnessService();