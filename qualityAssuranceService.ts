import { supabase } from '../lib/supabase';

export interface QualityAudit {
  id: string;
  type: 'CLINICAL' | 'OPERATIONAL' | 'SAFETY';
  score: number;
  findings: string[];
  auditorId: string;
  timestamp: string;
}

export class QualityAssuranceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async logAudit(audit: Omit<QualityAudit, 'id' | 'timestamp'>) {
    console.log(`[QA_SENTINEL]: Logging ${audit.type} audit with score ${audit.score}`);
    if (supabase && this.companyId) {
      await supabase.from('quality_audits').insert([{
        ...audit,
        company_id: this.companyId,
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getHistoricalPerformance() {
    // Return mock data for dashboard trends
    return [
      { date: '2025-01', score: 88 },
      { date: '2025-02', score: 92 },
      { date: '2025-03', score: 95 }
    ];
  }
}

export const qualityAssuranceService = new QualityAssuranceService();