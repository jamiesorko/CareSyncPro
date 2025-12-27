import { geminiService } from './geminiService';

export interface RevenueOpportunity {
  visitId: string;
  detectedActivity: string;
  suggestedBillingCode: string;
  estimatedUpside: number;
}

export class RevenueCaptureService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans narrative notes for clinical interventions that weren't in the structured care plan.
   */
  async scanForHiddenBilling(visitId: string, notes: string): Promise<RevenueOpportunity[]> {
    console.log(`[FISCAL_OPTIMIZER]: Scanning visit ${visitId} for revenue leakage.`);
    
    const prompt = `
      Context: Healthcare Revenue Cycle Management.
      Staff Note: "${notes}"
      
      Task: Identify any specialized clinical labor (e.g. complex wound care, counseling, respiratory support) 
      mentioned in the note that represents billable value.
      Return JSON: { "opportunities": [ { "activity": "string", "code": "string", "value": number } ] }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return (data.opportunities || []).map((o: any) => ({
        visitId,
        detectedActivity: o.activity,
        suggestedBillingCode: o.code,
        estimatedUpside: o.value
      }));
    } catch (e) {
      return [];
    }
  }
}

export const revenueCaptureService = new RevenueCaptureService();