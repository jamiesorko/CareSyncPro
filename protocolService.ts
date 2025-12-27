import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

export interface Protocol {
  id: string;
  title: string;
  content: string;
  category: 'CLINICAL' | 'SAFETY' | 'OPERATIONAL';
  version: string;
}

export class ProtocolService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getProtocolByContext(scenario: string): Promise<string> {
    console.log(`[PROTOCOL_CORE]: Fetching SOP for scenario: ${scenario}`);
    
    const prompt = `As a Director of Care, explain the mandatory protocol for: ${scenario}. Use professional clinical language.`;
    
    try {
      const response = await geminiService.generateText(prompt, false);
      return response.text || "Standard protocol not found. Contact DOC.";
    } catch (e) {
      return "Protocol retrieval error.";
    }
  }

  async saveNewProtocol(protocol: Omit<Protocol, 'id'>) {
    if (supabase && this.companyId) {
      await supabase.from('protocols').insert([{
        ...protocol,
        company_id: this.companyId,
        created_at: new Date().toISOString()
      }]);
    }
  }
}

export const protocolService = new ProtocolService();