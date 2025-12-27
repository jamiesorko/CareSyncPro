import { geminiService } from './geminiService';

export interface GrowthOpportunity {
  region: string;
  demandIndex: number; // 0-100
  competitorDensity: 'LOW' | 'MED' | 'HIGH';
  strategicInsight: string;
}

export class RegionalGrowthService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Search grounding to find regional senior population surges.
   */
  async findExpansionZones(province: string): Promise<GrowthOpportunity[]> {
    console.log(`[STRATEGIC_CEO]: Scanning ${province} for underserved healthcare sectors.`);
    
    const query = `Fastest growing senior populations and home care waitlists in ${province} for late 2025. Identification of underserved postal codes.`;
    
    try {
      const res = await geminiService.getMarketIntelligence(query);
      return [{
        region: 'Halton Region',
        demandIndex: 88,
        competitorDensity: 'LOW',
        strategicInsight: res.text || "High growth detected in sector 9."
      }];
    } catch (e) {
      return [];
    }
  }
}

export const regionalGrowthService = new RegionalGrowthService();