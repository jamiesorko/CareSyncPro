import { geminiService } from './geminiService';
import { clinicalService } from './clinicalService';
import { dbService } from './dbService';

export class SearchService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Executes a cross-domain semantic search. 
   * Finds patients, staff, and policy matches based on natural language.
   */
  async globalSearch(query: string) {
    console.log(`[NEURAL_SEARCH]: Interpreting query vector: "${query}"`);
    
    // In a real environment, this would combine pgvector results from Supabase 
    // with a Gemini interpretation of the user's intent.
    const prompt = `
      User Query: "${query}"
      Context: Healthcare ERP Search.
      Task: Identify if this query is seeking a PERSON (Patient/Staff), a POLICY (SOP), or a METRIC.
      Return a JSON classification.
    `;

    try {
      const classification = await geminiService.generateText(prompt, false);
      // Logic would then route to specific DB tables
      return {
        query,
        classification: classification.text || "GENERAL",
        results: [] // Results would be populated by clinical/db services
      };
    } catch (e) {
      return { query, results: [], error: true };
    }
  }
}

export const searchService = new SearchService();