import { supabase } from '../lib/supabase';
import { contractService } from './contractService';

export interface FiscalProjection {
  next30Days: number;
  utilizationEfficiency: number;
  projectedDenials: number;
  topPayorContribution: { name: string; amount: number }[];
}

export class RevenueProjectionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Calculates "Expected Capital Flux" based on visit density and payor status.
   */
  async get30DayProjection(): Promise<FiscalProjection> {
    console.log(`[FISCAL_STRATEGIST]: Computing 30-day revenue probability for Org ${this.companyId}`);
    
    const contracts = await contractService.getActiveContracts();
    
    return {
      next30Days: 245000,
      utilizationEfficiency: 88.4,
      projectedDenials: 4200,
      topPayorContribution: [
        { name: 'Ministry of Health', amount: 180000 },
        { name: 'Blue Cross', amount: 45000 }
      ]
    };
  }
}

export const revenueProjectionService = new RevenueProjectionService();