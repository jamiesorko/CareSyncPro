import { geminiService } from './geminiService';
import { StaffMember, Client } from '../types';

export interface MatchResult {
  staffId: string;
  fitScore: number;
  reasoning: string;
}

export class MatchingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to calculate a "Neural Fit" between a staff member and a client.
   */
  async calculateMatch(staff: StaffMember, client: Client): Promise<MatchResult> {
    console.log(`[NEURAL_MATCH]: Computing fit for ${staff.name} → ${client.name}`);
    
    const prompt = `
      Compare Staff [Role: ${staff.role}] with Patient [Conditions: ${client.conditions.join(', ')}].
      Client History: ${client.description}
      Task: Calculate compatibility score (0-100) and provide a 1-sentence reason.
      Format: JSON { "score": number, "reason": "string" }
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{"score":0, "reason": "Error"}');
      return {
        staffId: staff.id,
        fitScore: data.score || 50,
        reasoning: data.reason || "Standard clinical match."
      };
    } catch (e) {
      return { staffId: staff.id, fitScore: 0, reasoning: "Matching engine timeout." };
    }
  }

  async findBestAvailable(client: Client, candidates: StaffMember[]): Promise<MatchResult[]> {
    const results = await Promise.all(candidates.map(s => this.calculateMatch(s, client)));
    return results.sort((a, b) => b.fitScore - a.fitScore);
  }
}

export const matchingService = new MatchingService();