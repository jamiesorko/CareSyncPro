import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';
import { Applicant } from '../types';

export class RecruitmentService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Evaluates a candidate's resume or interview notes for clinical alignment.
   */
  async scoreCandidate(applicant: Applicant, notes: string): Promise<number> {
    console.log(`[RECRUITMENT_AI]: Evaluating ${applicant.name} for ${applicant.role}`);
    
    const prompt = `Analyze this candidate (${applicant.role}) based on interview notes: "${notes}". 
    Rate their clinical proficiency and culture fit from 0-100. Return ONLY the number for the overall score.`;
    
    try {
      const response = await geminiService.generateText(prompt, false);
      const score = parseInt(response.text?.trim() || "0");
      return isNaN(score) ? 50 : score;
    } catch (e) {
      return 0;
    }
  }

  async updateApplicantStatus(id: string, status: string) {
    if (supabase) {
      await supabase.from('applicants').update({ status }).eq('id', id);
    }
  }

  async getPipeline(): Promise<Applicant[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase.from('applicants').select('*').eq('company_id', this.companyId);
    return data || [];
  }
}

export const recruitmentService = new RecruitmentService();