import { supabase } from '../lib/supabase';
import { engagementService } from './engagementService';

export interface WellnessUpdate {
  id: string;
  clientId: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  mood: 'HAPPY' | 'CALM' | 'TIRED' | 'UNWELL';
}

export class FamilyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async postWellnessUpdate(update: Omit<WellnessUpdate, 'id'>) {
    console.log(`[FAMILY_MIRROR]: Posting wellness update for Client ${update.clientId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('wellness_updates').insert([{
        ...update,
        company_id: this.companyId,
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async recordSatisfaction(clientId: string, score: number, comment: string) {
    await engagementService.logSatisfaction({
      sourceId: 'family-portal',
      targetId: clientId,
      score,
      comment,
      type: 'FAMILY_FEEDBACK'
    });
  }
}

export const familyService = new FamilyService();