import { supabase } from '../lib/supabase';

export interface PerformanceMetric {
  staffId: string;
  punctualityScore: number;
  documentationCompliance: number;
  patientSatisfaction: number;
  bonusEligibility: boolean;
}

export class PerformanceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Calculates the core performance matrix for a staff member.
   */
  async getStaffKPIs(staffId: string): Promise<PerformanceMetric> {
    console.log(`[PERFORMANCE_CORE]: Computing KPI vectors for Staff ${staffId}`);
    // Simulated calculation from historical visit and audit data
    return {
      staffId,
      punctualityScore: 98.2,
      documentationCompliance: 94.5,
      patientSatisfaction: 4.9,
      bonusEligibility: true
    };
  }

  async recordPeerReview(reviewerId: string, targetId: string, rating: number, notes: string) {
    if (supabase && this.companyId) {
      await supabase.from('performance_reviews').insert([{
        company_id: this.companyId,
        reviewer_id: reviewerId,
        target_id: targetId,
        rating,
        notes,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const performanceService = new PerformanceService();