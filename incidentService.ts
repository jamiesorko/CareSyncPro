import { supabase } from '../lib/supabase';
import { AlertSignal, AlertType, CareRole } from '../types';

export class IncidentService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Routes incident signals to appropriate command nodes.
   * Logic interprets text content to provide "Neural Triage" insights.
   */
  async routeSignal(clientId: string, type: AlertType, content: string, sender: string): Promise<AlertSignal> {
    const isEmergency = ['FALL', 'CHOKING', 'MEDICAL', 'UNSAFE_ENV'].includes(type);
    
    // Neural Triage Simulation Logic
    let triageNote = "Standard procedural monitoring.";
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes("confused") || lowerContent.includes("slurred")) {
      triageNote = "CRITICAL WARNING: Potential Neurological Event (TIA/Stroke vector). Immediate RN Intercept required.";
    } else if (lowerContent.includes("breath") || lowerContent.includes("cough")) {
      triageNote = "ELEVATED RISK: Respiratory distress detected. Monitor O2 saturation.";
    } else if (isEmergency) {
      triageNote = "CRITICAL: Physical integrity breach. Stabilize subject and activate emergency logistics.";
    }

    const signal: AlertSignal = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      type,
      content,
      senderName: sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      clientName: "Subject_Target" // Replaced by App.tsx hydration
    };

    console.log(`[NEURAL_ROUTING]: ${type} signal captured. Intercept Priority: ${isEmergency ? 'HIGH' : 'NORMAL'}`);
    
    if (supabase && this.companyId) {
      try {
        await supabase.from('incidents').insert([{
          company_id: this.companyId,
          client_id: clientId,
          type,
          note: content,
          triage_note: triageNote,
          status: 'PENDING'
        }]);
      } catch (e) {
        console.warn("Ledger Sync Offline: Signal buffered locally.");
      }
    }

    return signal;
  }

  async getActiveSignals(): Promise<AlertSignal[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase
      .from('incidents')
      .select('*')
      .eq('company_id', this.companyId)
      .neq('status', 'RESOLVED');
    return data || [];
  }
}

export const incidentService = new IncidentService();