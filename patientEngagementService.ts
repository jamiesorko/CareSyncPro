import { geminiService } from './geminiService';

export interface EngagementPulse {
  clientId: string;
  loyaltyScore: number; // 0-100
  churnRisk: 'LOW' | 'MED' | 'HIGH';
  keyFrustration?: string;
  suggestedRetentionAction: string;
}

export class PatientEngagementService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to analyze family portal comments and support tickets for churn signals.
   */
  async analyzeLoyalty(clientId: string, interactions: any[]): Promise<EngagementPulse> {
    console.log(`[ENGAGEMENT_CORE]: Computing churn probability vector for Client ${clientId}`);
    
    const prompt = `Analyze these family portal interactions for churn risk: ${JSON.stringify(interactions)}.
    Return JSON: { "loyalty": number, "risk": "LOW|MED|HIGH", "frustration": "string", "action": "string" }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        clientId,
        loyaltyScore: data.loyalty || 80,
        churnRisk: data.risk || 'LOW',
        keyFrustration: data.frustration,
        suggestedRetentionAction: data.action || "Continue standard care path."
      };
    } catch (e) {
      return { clientId, loyaltyScore: 50, churnRisk: 'MED', suggestedRetentionAction: "Manual check-in required." };
    }
  }
}

export const patientEngagementService = new PatientEngagementService();