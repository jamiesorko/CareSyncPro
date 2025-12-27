import { supabase } from '../lib/supabase';

export interface AIFeedback {
  taskId: string;
  sourceText: string;
  generatedText: string;
  isAccurate: boolean;
  correction?: string;
  userId: string;
}

export class FeedbackService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async logCorrection(feedback: AIFeedback) {
    console.log(`[RLHF_LOOP]: Ingesting user correction for Task ${feedback.taskId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('ai_feedback_logs').insert([{
        ...feedback,
        company_id: this.companyId,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const feedbackService = new FeedbackService();