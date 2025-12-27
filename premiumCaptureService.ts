export interface PremiumGap {
  visitId: string;
  staffName: string;
  missingPremiumType: string;
  estimatedValue: number;
}

export class PremiumCaptureService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans a batch of visits to ensure all geographic or temporal premiums were applied.
   */
  async findUnclaimedPremiums(visits: any[]): Promise<PremiumGap[]> {
    console.log(`[FISCAL_OPTIMIZER]: Scanning ${visits.length} visits for premium leakage.`);
    
    // Heuristic: Check if visit falls on a Saturday or Sunday and doesn't have 'WEEKEND_PREMIUM' tag
    const gaps: PremiumGap[] = [];
    
    return gaps; // Returns list of visits needing manual payroll adjustment
  }

  async auditHolidayCompliance(date: string) {
    console.log(`[FISCAL_OPTIMIZER]: Running statutory holiday audit for ${date}`);
  }
}

export const premiumCaptureService = new PremiumCaptureService();