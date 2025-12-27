import { geminiService } from './geminiService';

export interface RiskHotspot {
  sector: string;
  incidentDensity: number;
  primaryRiskType: string;
  peakRiskHours: string;
}

export class IncidentTrendService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes historical incident vectors to identify "Risk Hotspots".
   */
  async analyzeTrends(incidents: any[]): Promise<RiskHotspot[]> {
    console.log(`[NEURAL_SENTINEL]: Analyzing incident clustering for Org ${this.companyId}`);
    
    const prompt = `Analyze this incident log: ${JSON.stringify(incidents.slice(0, 10))}.
    Identify geographic or temporal clusters. 
    Return JSON: { "hotspots": [ { "sector": "string", "density": number, "type": "string", "hours": "string" } ] }`;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return data.hotspots || [];
    } catch (e) {
      return [{ sector: 'Global', incidentDensity: 0.1, primaryRiskType: 'Stable', peakRiskHours: 'N/A' }];
    }
  }
}

export const incidentTrendService = new IncidentTrendService();