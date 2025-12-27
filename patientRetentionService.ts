import { continuityService } from './continuityService';
import { Client } from '../types';

export interface RetentionAnalysis {
  clientId: string;
  churnProbability: number; // 0-1
  primaryRiskFactor: string;
  mitigationStrategy: string;
}

export class PatientRetentionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes continuity vectors and sentiment to predict potential service termination.
   */
  async analyzeChurnRisk(client: Client): Promise<RetentionAnalysis> {
    console.log(`[RETENTION_CORE]: Calculating churn probability for ${client.name}`);
    
    const continuity = await continuityService.computeClientContinuity(client.id);
    
    // Heuristic: Churn risk increases as continuity score decreases.
    let risk = (100 - continuity.continuityScore) / 100;
    
    // If patient is in "Initial Visit" phase, risk is naturally slightly higher due to onboarding friction
    if (client.isInitialVisit) risk += 0.15;

    return {
      clientId: client.id,
      churnProbability: Math.min(0.95, risk),
      primaryRiskFactor: continuity.continuityScore < 70 ? "Low Staff Consistency" : "Onboarding Friction",
      mitigationStrategy: risk > 0.4 ? "Schedule DOC Quality Call" : "Standard Monitoring"
    };
  }
}

export const patientRetentionService = new PatientRetentionService();