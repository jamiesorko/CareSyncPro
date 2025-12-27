import { supabase } from '../lib/supabase';
import { workflowService } from './workflowService';

export interface OnboardingChecklist {
  id: string;
  targetId: string; // Staff or Client ID
  type: 'STAFF' | 'CLIENT';
  steps: { task: string; completed: boolean }[];
}

export class OnboardingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async initializeOnboarding(targetId: string, type: 'STAFF' | 'CLIENT') {
    console.log(`[ONBOARDING_HUB]: Starting ${type} onboarding for ${targetId}`);
    
    const steps = type === 'STAFF' 
      ? [{ task: 'Background Check', completed: false }, { task: 'Credentials Verification', completed: false }, { task: 'Mobile App Setup', completed: false }]
      : [{ task: 'Initial Assessment', completed: false }, { task: 'Home Safety Audit', completed: false }, { task: 'Medication Review', completed: false }];

    if (supabase && this.companyId) {
      await supabase.from('onboarding_sessions').insert([{
        company_id: this.companyId,
        target_id: targetId,
        type,
        steps: JSON.stringify(steps),
        status: 'ACTIVE'
      }]);
    }
  }

  async completeStep(targetId: string, taskName: string) {
    console.log(`[ONBOARDING_HUB]: Completing task "${taskName}" for ${targetId}`);
    // Logic to update JSON steps in Supabase
  }
}

export const onboardingService = new OnboardingService();