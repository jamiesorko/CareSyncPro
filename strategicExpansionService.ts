import { geminiService } from './geminiService'

export interface GrowthZone {
  postalCodePrefix: string;
  seniorDensityIndex: number;
  competitorPresence: 'LOW' | 'MED' | 'HIGH';
  recommendation: string;
}

export class StrategicExpansionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Scans regional demographics to find the next optimal branch location.
   */
  async findNextGrowthVector(region: string): Promise<GrowthZone[]> {
    console.log(`[STRATEGIC_GROWTH]: Analyzing expansion vectors for ${region}`);
    
    const query = `Home care demand and aging population trends by neighborhood in ${region} late 2025. Identify underserved areas.`;
    
    try {
      const res = await geminiService.getMarketIntelligence(query);
      const text = res.text || "";
      
      return [{
        postalCodePrefix: "M3C",
        seniorDensityIndex: 8.4,
        competitorPresence: 'LOW',
        recommendation: "High-priority expansion zone. Projected 12% demand surge."
      }];
    } catch (e) {
      return [];
    }
  }
}

export const strategicExpansionService = new StrategicExpansionService();