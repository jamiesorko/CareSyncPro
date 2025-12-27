import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

export interface Referral {
  id: string;
  source: string;
  patientName: string;
  acuityLevel: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'TRIAGED' | 'ACCEPTED' | 'REJECTED';
  triageNotes?: string;
  receivedAt: string;
}

export class ReferralManagementService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to perform initial clinical triage on raw referral text.
   */
  async triageIncomingReferral(rawText: string): Promise<Partial<Referral>> {
    console.log(`[TRIAGE_NODE]: Executing neural triage on hospital vector.`);
    
    const prompt = `Analyze this hospital discharge/referral text: "${rawText}". 
    Assign an acuity level (LOW, MED, HIGH, CRITICAL) and provide a 1-sentence triage note.
    Return JSON: { "acuity": "string", "note": "string" }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        acuityLevel: data.acuity || 'MED',
        triageNotes: data.note || 'Baseline intake suggested.',
        status: 'TRIAGED'
      };
    } catch (e) {
      return { status: 'NEW' };
    }
  }

  async getPipeline(): Promise<Referral[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase.from('referrals').select('*').eq('company_id', this.companyId);
    return data || [];
  }
}

export const referralManagementService = new ReferralManagementService();