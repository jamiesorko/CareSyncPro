import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

export interface TelehealthSession {
  id: string;
  clientId: string;
  staffId: string;
  startTime: string;
  endTime?: string;
  summary?: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
}

export class TelehealthSessionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async initializeSession(clientId: string, staffId: string): Promise<string> {
    console.log(`[VIRTUAL_CARE]: Initializing secure telehealth bridge for Client ${clientId}`);
    
    if (supabase && this.companyId) {
      const { data } = await supabase.from('telehealth_sessions').insert([{
        company_id: this.companyId,
        client_id: clientId,
        staff_id: staffId,
        status: 'LIVE',
        start_time: new Date().toISOString()
      }]).select().single();
      return data?.id || 'session-v-01';
    }
    return 'session-v-01';
  }

  async generateSessionSummary(transcript: string): Promise<string> {
    const prompt = `Summarize this virtual clinical visit transcript: "${transcript}". Provide 3 key findings and 1 action item.`;
    try {
      const res = await geminiService.generateText(prompt, false);
      return res.text || "Summary unavailable.";
    } catch (e) {
      return "Neural summarization failed.";
    }
  }
}

export const telehealthSessionService = new TelehealthSessionService();