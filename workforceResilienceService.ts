import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember } from "../types";

export interface MentorshipPairing {
  mentorId: string;
  menteeId: string;
  synergyScore: number;
  reason: string;
  focusArea: string;
}

export class WorkforceResilienceService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Analyzes staff performance and sentiment to suggest optimal mentorship links.
   */
  async calculateSynergy(staffPool: StaffMember[]): Promise<MentorshipPairing[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    // In production, we'd pull real documentation samples for each staff member
    const prompt = `
      Act as a Neural Workforce Strategist. 
      Staff Pool: ${JSON.stringify(staffPool.map(s => ({ id: s.id, name: s.name, role: s.role, weeklyHours: s.weeklyHours })))}
      
      Task: Perform a "Mastery-Alignment" analysis. 
      1. Pair senior staff (Mentors) with junior staff (Mentees) based on complementary roles and load.
      2. Calculate a Synergy Score (0-100).
      3. Identify exactly 1 focus area for the pair.
      
      Return JSON array: [ { "mentorId": "", "menteeId": "", "score": number, "reason": "", "focus": "" } ]
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 10000 }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (e) {
      return [];
    }
  }
}

export const workforceResilienceService = new WorkforceResilienceService();