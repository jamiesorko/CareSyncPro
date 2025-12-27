import { geminiService } from './geminiService';

export interface OptimizationResult {
  claimId: string;
  acceptanceProbability: number;
  missingKeywords: string[];
  suggestedPhrasing: string;
  estimatedDelta: number;
}

export class ClaimOptimizationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to review a claim vector against common payor denial triggers.
   */
  async optimizeClaim(claimData: any, clinicalSummary: string): Promise<OptimizationResult> {
    console.log(`[REV_OPTIMIZER]: Running neural claim audit.`);
    
    const prompt = `Review this clinical summary: "${clinicalSummary}" for an insurance claim of $${claimData.amount}.
    Identify clinical keywords required by major payors to avoid denials.
    Return JSON: { "probability": number, "missing": string[], "phrasing": "string", "delta": number }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        claimId: claimData.id || 'new-claim',
        acceptanceProbability: data.probability || 0.85,
        missingKeywords: data.missing || [],
        suggestedPhrasing: data.phrasing || "Maintain standard documentation.",
        estimatedDelta: data.delta || 0
      };
    } catch (e) {
      return { claimId: 'err', acceptanceProbability: 0.5, missingKeywords: [], suggestedPhrasing: "Error", estimatedDelta: 0 };
    }
  }
}

export const claimOptimizationService = new ClaimOptimizationService();