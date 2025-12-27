import { geminiService } from './geminiService';

export interface FieldPolicySummary {
  policyName: string;
  criticalSteps: string[];
  safetyWarnings: string[];
}

export class PolicyBridgeService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Matches a task to a policy and provides a "Simplified Field View".
   */
  async getFieldDirective(taskName: string, clientContext: string): Promise<FieldPolicySummary> {
    console.log(`[POLICY_BRIDGE]: Synthesizing directive for: ${taskName}`);
    
    const prompt = `
      Internal SOP: Standard Handling & Transfers.
      Current Task: ${taskName}
      Patient Context: ${clientContext}
      
      Task: Summarize this policy into 3 bullet points for a mobile device. 
      Include exactly 1 Bold Safety Warning.
      Return JSON: { "name": "string", "steps": ["string"], "warnings": ["string"] }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        policyName: data.name || "Standard Care Protocol",
        criticalSteps: data.steps || ["Follow standard lift instructions."],
        safetyWarnings: data.warnings || ["Maintain clinical focus."]
      };
    } catch (e) {
      return { policyName: 'Standard SOP', criticalSteps: ['Review full chart'], safetyWarnings: ['Safety First'] };
    }
  }
}

export const policyBridgeService = new PolicyBridgeService();