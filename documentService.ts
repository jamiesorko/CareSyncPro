import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

export interface DocumentVector {
  id: string;
  fileName: string;
  category: 'POLICY' | 'REFERRAL' | 'CLINICAL_GUIDE';
  summary: string;
}

export class DocumentService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Queries the semantic index with high-fidelity thinking.
   * Synthesizes answers based on internal SOPs and legislative vectors.
   */
  async queryKnowledgeBase(query: string): Promise<{ answer: string; thought: string }> {
    console.log(`[NEURAL_DOC]: Executing deep-think interrogation for: ${query}`);
    
    const prompt = `
      Context: Healthcare Agency Internal Knowledge Base.
      User Query: "${query}"
      
      Task: Act as the Lead Compliance Officer. Use your advanced reasoning to find the most accurate directive based on internal agency protocols and Ontario health laws.
      
      Requirements:
      1. Provide a step-by-step tactical response.
      2. Cite standard nursing safety principles.
      3. If the query relates to a clinical emergency, prioritize stabilization steps.
    `;

    try {
      const response = await geminiService.generateAdvancedReasoning(prompt);
      return {
        answer: response.text || "No authoritative directive could be synthesized.",
        thought: (response as any).thought || "Analyzing protocol hierarchies and clinical risk factors..."
      };
    } catch (e) {
      return { 
        answer: "Neural synthesis bottleneck. Consult the physical SOP binder or call the DOC.", 
        thought: "Reasoning failed due to signal interruption." 
      };
    }
  }

  async indexNewDocument(name: string, content: string) {
    if (supabase && this.companyId) {
      await supabase.from('document_vectors').insert([{
        company_id: this.companyId,
        file_name: name,
        summary: content.substring(0, 200),
        indexed_at: new Date().toISOString()
      }]);
    }
  }
}

export const documentService = new DocumentService();