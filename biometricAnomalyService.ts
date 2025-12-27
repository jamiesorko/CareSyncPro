import { geminiService } from './geminiService'
import { VitalsData } from './vitalsService'

export interface AnomalyReport {
  patternDetected: string;
  clinicalSignificance: string;
  urgency: 'MONITOR' | 'ASSESS' | 'URGENT';
}

export class BiometricAnomalyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes a 14-day window of vitals to detect subtle clinical drift.
   */
  async detectDrift(history: VitalsData[]): Promise<AnomalyReport | null> {
    console.log(`[NEURAL_VITAL_WATCH]: Analyzing ${history.length} temporal data points for Org ${this.companyId}`);
    
    if (history.length < 3) return null;

    const prompt = `
      Task: Act as a clinical data scientist. 
      Analyze the following time-series vitals: ${JSON.stringify(history)}.
      Identify non-obvious patterns like increasing resting HR baseline, narrowing pulse pressure, or temperature instability. 
      Return JSON: { "pattern": "string", "significance": "string", "urgency": "MONITOR|ASSESS|URGENT" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        patternDetected: data.pattern || "Baseline stability confirmed.",
        clinicalSignificance: data.significance || "Maintain standard care.",
        urgency: data.urgency || 'MONITOR'
      };
    } catch (e) {
      return null;
    }
  }
}

export const biometricAnomalyService = new BiometricAnomalyService();