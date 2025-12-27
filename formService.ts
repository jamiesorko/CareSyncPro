import { supabase } from '../lib/supabase';

export interface FormSubmission {
  id: string;
  clientId: string;
  staffId: string;
  formType: string;
  data: any;
  isSigned: boolean;
  signatureUrl?: string;
}

export class FormService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async submitForm(submission: Omit<FormSubmission, 'id'>) {
    console.log(`[FORM_CORE]: Received ${submission.formType} submission for Client ${submission.clientId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('form_submissions').insert([{
        ...submission,
        company_id: this.companyId,
        created_at: new Date().toISOString()
      }]);
    }
  }

  async getMandatoryFormsForVisit(clientId: string) {
    // Returns list of forms that MUST be completed (e.g., Risk Assessment)
    return [
      { type: 'WOUND_ASSESSMENT', mandatory: true },
      { type: 'SAFE_TRANSFER_CHECK', mandatory: true }
    ];
  }
}

export const formService = new FormService();