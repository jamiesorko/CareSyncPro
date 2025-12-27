import { geminiService } from './geminiService';
import { Client } from '../types';

export interface FamilyGuide {
  title: string;
  observationChecklist: string[];
  emergencyTriggers: string[];
  comfortStrategies: string[];
}

export class CareEducationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Generates a custom guide for families based on the client's current clinical profile.
   */
  async generateFamilyGuide(client: Client): Promise<FamilyGuide> {
    console.log(`[CARE_EDUCATOR]: Synthesizing personalized guide for ${client.name}'s advocates.`);
    
    const prompt = `
      Patient Conditions: ${client.conditions.join(', ')}
      Mobility: ${client.mobilityStatus.transferMethod}
      
      Task: Generate a 'Family Survival Guide' for this patient's care advocates.
      Return JSON: { "title": "string", "checklist": ["string"], "triggers": ["string"], "strategies": ["string"] }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        title: data.title || "Home Care Essentials",
        observationChecklist: data.checklist || [],
        emergencyTriggers: data.triggers || [],
        comfortStrategies: data.strategies || []
      };
    } catch (e) {
      return { title: 'Basic Home Safety', observationChecklist: ['Ensure hydration'], emergencyTriggers: ['Sudden confusion'], comfortStrategies: ['Consistent routine'] };
    }
  }
}

export const careEducationService = new CareEducationService();