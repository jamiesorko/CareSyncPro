import { geminiService } from './geminiService';

export interface RegulatoryUpdate {
  id: string;
  source: 'CNO' | 'WSIB' | 'CRA' | 'HEALTH_CANADA';
  title: string;
  impactLevel: 'LOW' | 'MED' | 'HIGH';
  aiSummary: string;
  actionRequired: string;
}

export class RegulatoryService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Interprets complex regulatory text into actionable agency directives.
   */
  async interpretNewPolicy(rawUpdateText: string): Promise<RegulatoryUpdate> {
    console.log(`[NEURAL_COMPLIANCE]: Interpreting regulatory signal.`);
    
    const prompt = `Analyze this healthcare regulatory update: "${rawUpdateText}". 
    Identify the impact on a home care agency. Return JSON: { "title": string, "impact": "LOW|MED|HIGH", "summary": string, "action": string }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        id: Math.random().toString(),
        source: 'CNO',
        title: data.title || "Policy Change",
        impactLevel: data.impact || 'MED',
        aiSummary: data.summary || "Interpretive failure.",
        actionRequired: data.action || "Consult legal team."
      };
    } catch (e) {
      return { id: 'err', source: 'CNO', title: 'Parse Error', impactLevel: 'MED', aiSummary: 'Neural error.', actionRequired: 'Review manually.' };
    }
  }
}

export const regulatoryService = new RegulatoryService();