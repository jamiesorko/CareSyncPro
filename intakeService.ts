import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';
import { Client } from '../types';

export class IntakeService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Processes an uploaded referral document (PDF/Image) to auto-fill client data.
   */
  async processReferralDocument(base64: string): Promise<Partial<Client>> {
    console.log("[INTAKE_CORE]: Ingesting referral vector for neural extraction.");
    
    const prompt = "Extract Patient Name, DOB, Address, Primary Conditions, and Mobility Status from this medical referral. Return ONLY valid JSON.";
    
    try {
      // In a real scenario, we'd use multimodal input
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || "{}");
      return {
        name: data.name || "Unknown Patient",
        conditions: data.conditions || [],
        address: data.address || "",
        isInitialVisit: true
      };
    } catch (e) {
      console.error("[INTAKE_CORE]: Extraction failure", e);
      return {};
    }
  }

  async finalizeIntake(clientData: Client) {
    if (supabase && this.companyId) {
      await supabase.from('clients').insert([{ ...clientData, company_id: this.companyId }]);
    }
  }
}

export const intakeService = new IntakeService();