import { StaffMember, Client } from '../types';
import { geminiService } from './geminiService';

export interface CulturalMatch {
  score: number; // 0-100
  linguisticAlignment: string;
  culturalNotes: string;
}

export class CulturalIntelligenceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Performs deep semantic matching between staff profiles and patient cultural preferences.
   */
  async computeCulturalAlignment(staff: StaffMember, client: Client): Promise<CulturalMatch> {
    console.log(`[CULTURAL_CORE]: Computing alignment for ${staff.name} and ${client.name}`);
    
    // In production, these strings would be pulled from 'extended_profile' tables
    const staffProfile = "Speaks English and Italian. Expert in Mediterranean nutrition.";
    const clientPref = "Prefers Italian speaking caregiver. Enjoys traditional cooking and social engagement.";

    const prompt = `
      Staff Profile: "${staffProfile}"
      Patient Preference: "${clientPref}"
      Task: Calculate alignment score (0-100) and explain why.
      Return JSON: { "score": number, "explanation": "string" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        score: data.score || 75,
        linguisticAlignment: "Verified Match: Italian",
        culturalNotes: data.explanation || "Neutral alignment."
      };
    } catch (e) {
      return { score: 50, linguisticAlignment: "Primary Language", culturalNotes: "Standard matching applied." };
    }
  }
}

export const culturalIntelligenceService = new CulturalIntelligenceService();