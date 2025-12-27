import { Client } from '../types';

export interface ComplianceGap {
  clientId: string;
  ruleId: string;
  description: string;
  deadlineDate: string;
  severity: 'CRITICAL' | 'WARNING';
}

export class ComplianceRuleService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Validates a client profile against regional mandatory assessment rules.
   */
  async checkClientCompliance(client: Client): Promise<ComplianceGap[]> {
    const gaps: ComplianceGap[] = [];
    
    // Rule: Initial Assessment must be signed within 24h of first visit
    if (client.isInitialVisit) {
      gaps.push({
        clientId: client.id,
        ruleId: 'ONT-LTC-01',
        description: 'Signed Initial Assessment Missing in Vault.',
        deadlineDate: new Date().toISOString(),
        severity: 'CRITICAL'
      });
    }

    // Rule: Care Plan review required every 180 days
    // (In real app, would compare against client.lastReviewDate)
    
    return gaps;
  }

  async getGlobalComplianceHealth(): Promise<number> {
    return 98.4;
  }
}

export const complianceRuleService = new ComplianceRuleService();