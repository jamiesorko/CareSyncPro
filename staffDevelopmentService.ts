import { geminiService } from './geminiService';
import { StaffMember } from '../types';

export interface GrowthPlan {
  staffId: string;
  focusArea: string;
  recommendedModules: string[];
  mentorshipGoal: string;
  aiRationale: string;
}

export class StaffDevelopmentService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Generates a custom career development vector using Gemini Pro.
   */
  async curateGrowthPath(staff: StaffMember, kpis: any): Promise<GrowthPlan> {
    console.log(`[NEURAL_COACH]: Synthesizing development path for ${staff.name}`);
    
    const prompt = `
      Professional: ${staff.name} (Role: ${staff.role})
      Performance Data: ${JSON.stringify(kpis)}
      
      Task: Create a 3-month clinical development plan. 
      Identify 1 primary focus area, 2 specific training modules, and a mentorship objective.
      Return JSON: { "focus": "string", "modules": ["string"], "goal": "string", "rationale": "string" }
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      const data = JSON.parse(res.text || '{}');
      return {
        staffId: staff.id,
        focusArea: data.focus || "Clinical Excellence",
        recommendedModules: data.modules || [],
        mentorshipGoal: data.goal || "Shadow Senior RN",
        aiRationale: data.rationale || "Based on consistent field performance."
      };
    } catch (e) {
      return { staffId: staff.id, focusArea: "Standard Path", recommendedModules: [], mentorshipGoal: "TBD", aiRationale: "Neural coach offline." };
    }
  }
}

export const staffDevelopmentService = new StaffDevelopmentService();