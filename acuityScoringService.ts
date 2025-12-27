import { Client, RiskScore } from '../types';

export class AcuityScoringService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Dynamically calculates a real-time acuity score (1-10) based on multiple clinical vectors.
   */
  calculateAcuity(client: Client, recentIncidentsCount: number): number {
    let score = 1;

    // Mobility Vector
    if (client.mobilityStatus.isBedridden) score += 3;
    if (client.mobilityStatus.dementia) score += 2;
    if (client.mobilityStatus.transferMethod === 'Mechanical') score += 1;

    // Condition Complexity Vector
    if (client.conditions.length > 3) score += 1;

    // Recent Clinical Activity Vector
    score += Math.min(3, recentIncidentsCount);

    return Math.min(10, score);
  }

  /**
   * Maps numeric acuity to human-readable priority for Dispatchers.
   */
  getPriorityLabel(score: number): 'ROUTINE' | 'ELEVATED' | 'CRITICAL' {
    if (score >= 8) return 'CRITICAL';
    if (score >= 5) return 'ELEVATED';
    return 'ROUTINE';
  }
}

export const acuityScoringService = new AcuityScoringService();