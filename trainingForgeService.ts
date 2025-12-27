import { GoogleGenAI, Type } from "@google/genai";
import { TrainingModule, StaffMember } from '../types';

export class TrainingForgeService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Synthesizes a custom training lesson from a detected clinical gap.
   */
  async forgeModule(staff: StaffMember, gapDescription: string): Promise<TrainingModule> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Clinical Educator. 
      Staff: ${staff.name} (Role: ${staff.role})
      Identified Gap: "${gapDescription}"
      
      Task: Forge a 3-minute remedial 'Mastery Lesson'.
      1. Write a catchy title.
      2. Provide a 'Concept Brief' (The "Must-Know" clinical principle).
      3. Create 2 interactive multiple-choice questions.
      
      Return JSON: { 
        "title": "", 
        "brief": "", 
        "quiz": [ { "q": "", "a": ["opt1", "opt2", "opt3"], "correct": 0 } ] 
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: Math.random().toString(36).substring(7),
        title: data.title || "Clinical Mastery Protocol",
        targetSkill: gapDescription,
        conceptBrief: data.brief || "Focus on documentation integrity.",
        questions: data.quiz || [],
        masteryTarget: 100
      };
    } catch (e) {
      console.error("Forge failure:", e);
      throw e;
    }
  }
}

export const trainingForgeService = new TrainingForgeService();