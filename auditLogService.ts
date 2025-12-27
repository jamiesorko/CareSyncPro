import { supabase } from '../lib/supabase';

export class AuditLogService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async logAction(actorId: string, action: string, details: any) {
    console.log(`[COMPLIANCE_TRAIL]: ${action} by ${actorId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('audit_logs').insert([{
        company_id: this.companyId,
        actor_id: actorId,
        action,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString()
      }]);
    }
  }

  async getChangeHistory(entityId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .filter('details', 'ilike', `%${entityId}%`)
      .order('timestamp', { ascending: false });
    return data || [];
  }
}

export const auditLogService = new AuditLogService();