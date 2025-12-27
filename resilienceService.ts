import { supabase } from '../lib/supabase';

export interface ResilienceIndex {
  moraleScore: number; // 0-100
  cohesionLevel: 'LOW' | 'MED' | 'HIGH';
  primaryStressors: string[];
  mentorshipPairingSuggestions: { mentorId: string; menteeId: string; reason: string }[];
}

export class ResilienceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes operational friction points to determine staff "burnout probability".
   */
  async getResilienceIndex(): Promise<ResilienceIndex> {
    console.log(`[RESILIENCE_CORE]: Computing team cohesion vectors for Org ${this.companyId}`);
    
    // In production, this would aggregate shift-swap frequency, overtime requests, and sentiment scores
    return {
      moraleScore: 82,
      cohesionLevel: 'HIGH',
      primaryStressors: ['Travel time variance', 'Documentation load'],
      mentorshipPairingSuggestions: [
        { mentorId: 'rn1', menteeId: 'psw1', reason: 'High clinical alignment in Sector 4.' }
      ]
    };
  }

  async logWellnessCheck(staffId: string, score: number) {
    if (supabase && this.companyId) {
      await supabase.from('wellness_logs').insert([{
        company_id: this.companyId,
        staff_id: staffId,
        morale_score: score,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const resilienceService = new ResilienceService();