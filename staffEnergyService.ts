import { GoogleGenAI } from "@google/genai";
import { StaffMember } from '../types';

export interface BurnoutPrediction {
  staffId: string;
  riskScore: number; // 0-100
  vocalFatigueDetected: boolean;
  loadVariance: number;
  recommendation: string;
  horizonDays: number;
}

export class StaffEnergyService {
  /**
   * Correlates operational load with psychological sentiment.
   */
  async calculateBurnoutRisk(staff: StaffMember, lastSentiment: string): Promise<BurnoutPrediction> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const context = {
      weeklyHours: staff.weeklyHours,
      lastSeen: staff.lastSeen,
      role: staff.role,
      sentiment: lastSentiment
    };

    const prompt = `
      Act as a Lead Resource Psychologist. 
      Professional Profile: ${JSON.stringify(context)}
      
      Task: Predict the "Turnover Horizon".
      1. Calculate Burnout Risk (0-100).
      2. Detect 'Vocal Fatigue' markers in the sentiment text.
      3. Recommend exactly one retention maneuver.
      4. Estimate days until potential resignation.
      
      Return JSON: { "risk": number, "fatigue": boolean, "maneuver": "", "horizon": number }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        staffId: staff.id,
        riskScore: data.risk || 0,
        vocalFatigueDetected: !!data.fatigue,
        loadVariance: staff.weeklyHours > 40 ? 1.2 : 1.0,
        recommendation: data.maneuver || "Standard supervision.",
        horizonDays: data.horizon || 365
      };
    } catch (e) {
      return {
        staffId: staff.id,
        riskScore: 10,
        vocalFatigueDetected: false,
        loadVariance: 1.0,
        recommendation: "Maintain standard engagement.",
        horizonDays: 365
      };
    }
  }
}

export const staffEnergyService = new StaffEnergyService();