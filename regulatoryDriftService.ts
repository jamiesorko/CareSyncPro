import { geminiService } from './geminiService';
import { protocolService } from './protocolService';

export interface DriftAlert {
  policyId: string;
  regulatorySource: string;
  driftLevel: 'LOW' | 'MED' | 'HIGH';
  gapAnalysis: string;
  recommendedUpdate: string;
}

export class RegulatoryDriftService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Compares internal protocol text against new legislative signals to detect "Compliance Drift".
   */
  async scanForDrift(currentPolicyText: string, newRegulationText: string): Promise<DriftAlert | null> {
    console.log(`[REGULATORY_DRIFT]: Cross-referencing agency SOPs with new legislative vectors.`);
    
    const prompt = `Compare our internal policy: "${currentPolicyText}" against this new regulation: "${newRegulationText}".
    Identify gaps. Return JSON: { "drift": "LOW|MED|HIGH", "gap": "string", "recommendation": "string" }`;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      
      if (data.drift !== 'LOW') {
        return {
          policyId: 'SOP-01',
          regulatorySource: 'CNO/Bill-124-Mod',
          driftLevel: data.drift || 'MED',
          gapAnalysis: data.gap || "Sub-optimal alignment detected.",
          recommendedUpdate: data.recommendation || "Initiate SOP revision cycle."
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

export const regulatoryDriftService = new RegulatoryDriftService();