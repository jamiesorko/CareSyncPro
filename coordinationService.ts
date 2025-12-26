import { supabase } from '../lib/supabase';

export class CoordinationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async signalBookOff(data: { staffId: string; reason: string; isUrgent: boolean }): Promise<void> {
    console.log(`[DISPATCH_GRID]: Book-Off Alert Received. Urgent: ${data.isUrgent}`);
    
    if (supabase && this.companyId) {
      await supabase.from('alerts').insert([{
        company_id: this.companyId,
        sender_id: data.staffId,
        type: data.isUrgent ? 'URGENT_BOOK_OFF' : 'BOOK_OFF',
        content: data.reason,
        status: 'PENDING'
      }]);
    }
  }
}

export const coordinationService = new CoordinationService();
