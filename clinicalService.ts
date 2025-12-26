import { supabase } from '../lib/supabase';
import { Client, CareRole, AlertType } from '../types';
import { MOCK_CLIENTS } from '../data/careData';

export class ClinicalService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getClients(): Promise<Client[]> {
    if (!supabase || !this.companyId) return MOCK_CLIENTS;
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', this.companyId);
    if (error) return MOCK_CLIENTS;
    return data || MOCK_CLIENTS;
  }

  /**
   * Routes incident signals with specific PSW-requested logic.
   */
  async createIncident(incident: { 
    clientId: string; 
    type: AlertType; 
    note: string; 
    escalationTarget?: 'COORDINATOR' | 'SUPERVISOR' | 'BOTH';
  }): Promise<void> {
    let target: 'COORDINATOR' | 'SUPERVISOR' | 'BOTH' | 'HR' | 'ACCOUNTING';

    if (incident.escalationTarget) {
      target = incident.escalationTarget as any;
    } else {
      switch (incident.type) {
        case 'NOT_SEEN':
        case 'BOOK_OFF':
        case 'AVAILABILITY':
          target = 'COORDINATOR';
          break;
        case 'BEDSORES':
        case 'SWELLING':
        case 'CLINICAL':
          target = 'SUPERVISOR';
          break;
        case 'FALL':
        case 'BURN':
        case 'CHOKING':
        case 'MEDICAL':
        case 'UNSAFE_ENV':
        case 'UNSAFE_FOR_STAFF':
          target = 'BOTH';
          break;
        case 'VACATION':
        case 'LOA':
        case 'INSURANCE_Q':
        case 'T4_REQUEST':
          target = 'HR' as any;
          break;
        case 'SUPPLY_REQ':
        case 'PAYROLL_DISPUTE':
          target = 'ACCOUNTING' as any;
          break;
        default:
          target = 'COORDINATOR';
      }
    }

    console.log(`[NEURAL_SIGNAL]: Routing ${incident.type} to ${target}`);
    
    if (supabase && this.companyId) {
      const { error } = await supabase.from('incidents').insert([{
        company_id: this.companyId,
        client_id: incident.clientId,
        type: incident.type,
        note: incident.note,
        escalation_target: target,
        status: 'PENDING'
      }]);
      if (error) throw error;
    }
  }

  async auditVisitDuration(clientId: string, durationMinutes: number): Promise<boolean> {
    const client = MOCK_CLIENTS.find(c => c.id === clientId);
    if (!client) return true;
    const taskCount = client.carePlans[CareRole.PSW]?.length || 0;
    const expectedMinimum = taskCount * 8; 

    if (durationMinutes < expectedMinimum) {
      await this.createIncident({
        clientId,
        type: 'INTEGRITY_AUDIT',
        note: `AI Flag: Duration (${durationMinutes}m) insufficient for ${taskCount} tasks.`
      });
      return false;
    }
    return true;
  }
}

export const clinicalService = new ClinicalService();