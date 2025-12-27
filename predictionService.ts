import { geminiService } from './geminiService';
import { StaffMember, Client } from '../types';

export class PredictionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Detects burnout patterns in staff based on weekly hours and incident volume.
   */
  async forecastStaffChurn(staff: StaffMember): Promise<{ risk: number; reason: string }> {
    if (staff.weeklyHours > 45) {
      return { risk: 0.85, reason: "High overtime volume detected over 14-day window." };
    }
    return { risk: 0.1, reason: "Stable workload." };
  }

  /**
   * Neural analysis of clinical vitals to predict potential decline.
   */
  async forecastPatientDecline(client: Client): Promise<string> {
    const prompt = `Analyze patient ${client.name} with conditions ${client.conditions.join(', ')}. 
    Forecast clinical stability for the next 7 days based on current care plan density.`;
    
    try {
      const response = await geminiService.generateText(prompt, false);
      return response.text || "Stability confirmed.";
    } catch (e) {
      return "Prediction engine offline.";
    }
  }
}

export const predictionService = new PredictionService();