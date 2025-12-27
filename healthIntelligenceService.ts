import { geminiService } from './geminiService';

export interface RegionalHealthAlert {
  type: 'OUTBREAK' | 'ENVIRONMENTAL' | 'REGULATORY';
  severity: 'WATCH' | 'WARNING' | 'CRITICAL';
  description: string;
  sourceUrls: string[];
}

export class HealthIntelligenceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Google Search grounding to pull live public health data relevant to the agency's region.
   */
  async fetchRegionalIntelligence(location: string): Promise<RegionalHealthAlert[]> {
    console.log(`[HEALTH_INTEL]: Scanning regional health vectors for ${location}`);
    
    const query = `Current public health alerts, flu trends, and respiratory virus outbreaks in ${location} for October 2025. List any active warnings.`;
    
    try {
      const res = await geminiService.getMarketIntelligence(query);
      const groundingChunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const urls = groundingChunks.map((c: any) => c.web?.uri).filter(Boolean);

      return [{
        type: 'OUTBREAK',
        severity: 'WATCH',
        description: res.text || "Regional signal stable.",
        sourceUrls: urls
      }];
    } catch (e) {
      return [];
    }
  }
}

export const healthIntelligenceService = new HealthIntelligenceService();