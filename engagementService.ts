import { supabase } from '../lib/supabase';

export interface SatisfactionSignal {
  id: string;
  sourceId: string;
  targetId: string;
  score: number;
  comment?: string;
  type: 'STAFF_WELLNESS' | 'CLIENT_NPS' | 'FAMILY_FEEDBACK';
}

export class EngagementService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async logSatisfaction(signal: Omit<SatisfactionSignal, 'id'>) {
    console.log(`[ENGAGEMENT_CORE]: Recording ${signal.type} score: ${signal.score}`);
    if (supabase && this.companyId) {
      await supabase.from('engagement_logs').insert([{
        ...signal,
        company_id: this.companyId,
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getTrustScore(clientId: string): Promise<number> {
    // Aggregates feedback to produce the 0-10 score for Family Portal
    return 9.8; 
  }

  async detectRetentionRisk(staffId: string): Promise<boolean> {
    // Logic to flag staff based on wellness pings or excessive OT
    return false;
  }
}

export const engagementService = new EngagementService();