import { supabase } from '../lib/supabase';
import { AlertSignal, AlertType } from '../types';

export class AlertService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Fetches a consolidated feed of all clinical, financial, and operational alerts.
   */
  async getUnifiedCommandFeed(): Promise<AlertSignal[]> {
    if (!supabase || !this.companyId) return [];

    const { data } = await supabase
      .from('unified_alerts')
      .select('*')
      .eq('company_id', this.companyId)
      .order('timestamp', { ascending: false })
      .limit(50);

    return data || [];
  }

  async pushSignal(type: AlertType, content: string, priority: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL') {
    console.log(`[SIGNAL_DISPATCH]: Pushing ${type} signal to Command Feed. Priority: ${priority}`);
    
    if (supabase && this.companyId) {
      await supabase.from('unified_alerts').insert([{
        company_id: this.companyId,
        type,
        content,
        priority,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      }]);
    }
  }
}

export const alertService = new AlertService();