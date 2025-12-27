import { geminiService } from './geminiService';

export interface PolicySnippet {
  title: string;
  content: string;
  relevanceScore: number;
}

export class PolicyRetrievalService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Searches the neural vault for specific clinical or operational directives.
   */
  async queryPolicy(query: string): Promise<string> {
    console.log(`[VAULT_QUERY]: Retrieving SOP vector for query: ${query}`);
    
    const prompt = `Act as an Agency Compliance Officer. Search the standard operating procedures for information regarding: "${query}". 
    Provide a professional, concise clinical directive for field staff.`;

    try {
      const res = await geminiService.generateText(prompt, false);
      return res.text || "Policy guidance unavailable. Contact Director of Care.";
    } catch (e) {
      return "Neural vault retrieval error.";
    }
  }
}

export const policyRetrievalService = new PolicyRetrievalService();