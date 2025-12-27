
import { geminiService } from './geminiService';
import { notificationService } from './notificationService';
import { CareRole, Client } from '../types';

export interface OutbreakAlert {
  id: string;
  type: 'RESPIRATORY' | 'ENTERIC' | 'UNKNOWN';
  severity: 'MONITOR' | 'ACTIVE_OUTBREAK';
  affectedClientCount: number;
  recommendation: string;
}

export class OutbreakService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to analyze clinical notes for keyword clustering (e.g., "fever", "cough", "diarrhea").
   */
  async detectClusters(clients: Client[], notes: string[]): Promise<OutbreakAlert | null> {
    console.log(`[EPIDEMIOLOGY_HUB]: Running cluster detection on ${clients.length} patients.`);
    
    const prompt = `Analyze these symptoms reported today across multiple patients: "${notes.join(' | ')}". 
    Is there a statistical cluster suggesting an outbreak? 
    Return JSON { "isCluster": boolean, "type": "string", "severity": "MONITOR|ACTIVE", "recommendation": "string" }`;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      
      if (data.isCluster) {
        await notificationService.broadcastSignal({
          // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
          type: 'CLINICAL',
          content: `OUTBREAK_DETECTION: Potential ${data.type} cluster detected. Vector control initiated.`
        }, [CareRole.RN, CareRole.DOC]);

        return {
          id: Math.random().toString(),
          type: data.type || 'UNKNOWN',
          severity: data.severity || 'MONITOR',
          affectedClientCount: 3, // Simulated count
          recommendation: data.recommendation || "Contact Public Health."
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

export const outbreakService = new OutbreakService();
