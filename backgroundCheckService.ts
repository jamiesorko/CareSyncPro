import { supabase } from '../lib/supabase';

export interface ScreeningStatus {
  id: string;
  applicantId: string;
  checkType: 'CRIMINAL' | 'VULNERABLE_SECTOR' | 'DRIVING';
  status: 'PENDING' | 'IN_PROGRESS' | 'CLEARED' | 'FLAGGED';
  reportUrl?: string;
  completedAt?: string;
}

export class BackgroundCheckService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Initiates an external screening request via simulated third-party API (e.g., Sterling, Checkr).
   */
  async initiateCheck(applicantId: string, type: ScreeningStatus['checkType']): Promise<string> {
    console.log(`[SCREENING_CORE]: Initiating ${type} check for Applicant ${applicantId}`);
    
    if (supabase && this.companyId) {
      const { data } = await supabase.from('background_checks').insert([{
        company_id: this.companyId,
        applicant_id: applicantId,
        check_type: type,
        status: 'IN_PROGRESS'
      }]).select().single();
      return data?.id || 'demo-check-id';
    }
    return 'demo-check-id';
  }

  async getStatus(applicantId: string): Promise<ScreeningStatus[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase
      .from('background_checks')
      .select('*')
      .eq('applicant_id', applicantId);
    return data || [];
  }
}

export const backgroundCheckService = new BackgroundCheckService();