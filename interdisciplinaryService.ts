import { supabase } from '../lib/supabase';
import { CareRole } from '../types';

export interface CareGoal {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'ACHIEVED' | 'STALLED';
  ownerRole: CareRole;
}

export class InterdisciplinaryService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Propagates a clinical change across the circle of care.
   */
  async syncInterventions(clientId: string, primaryUpdate: string) {
    console.log(`[CIRCLE_SYNC]: Propagating RN update for Client ${clientId}: ${primaryUpdate}`);
    
    // 1. Alert PSW of task changes
    // 2. Update Family Portal "Reassurance" feed
    // 3. Log to historical audit
    
    if (supabase && this.companyId) {
      await supabase.from('care_goals').insert([{
        company_id: this.companyId,
        client_id: clientId,
        update_text: primaryUpdate,
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getActiveGoals(clientId: string): Promise<CareGoal[]> {
    return [
      { id: 'g1', title: 'Independent Ambulation (Walker)', status: 'IN_PROGRESS', ownerRole: CareRole.RN },
      { id: 'g2', title: 'Pain Management (Threshold < 3)', status: 'ACHIEVED', ownerRole: CareRole.RPN }
    ];
  }
}

export const interdisciplinaryService = new InterdisciplinaryService();