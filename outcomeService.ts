import { supabase } from '../lib/supabase';

export interface ClinicalOutcome {
  id: string;
  clientId: string;
  goalType: 'MOBILITY' | 'COGNITIVE' | 'WOUND_HEALING';
  startValue: number;
  currentValue: number;
  targetValue: number;
  lastUpdated: string;
}

export class OutcomeService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async trackProgress(clientId: string, goalType: string, newValue: number) {
    console.log(`[CLINICAL_OUTCOMES]: Updating ${goalType} for Client ${clientId} to ${newValue}`);
    if (supabase && this.companyId) {
      await supabase.from('outcomes').upsert([{
        company_id: this.companyId,
        client_id: clientId,
        goal_type: goalType,
        current_value: newValue,
        updated_at: new Date().toISOString()
      }]);
    }
  }

  async getOutcomeAnalytics(clientId: string): Promise<ClinicalOutcome[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase.from('outcomes').select('*').eq('client_id', clientId);
    return data || [];
  }
}

export const outcomeService = new OutcomeService();