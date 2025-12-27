import { geminiService } from './geminiService';
import { StaffMember, Client } from '../types';

export class SchedulingOptimizationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini 3.0 Pro to solve "The Impossible Wednesday" (complex overlapping shift constraints).
   */
  async solveConstraints(pool: StaffMember[], tasks: Client[]): Promise<string> {
    console.log(`[NEURAL_SOLVER]: Synthesizing optimal deployment for ${tasks.length} targets.`);
    
    const context = {
      staffCount: pool.length,
      availableRoles: pool.map(p => p.role),
      patientAcuity: tasks.map(t => t.conditions),
      travelMatrix: "Simulated Sector 4 Grid"
    };

    const prompt = `Solve this healthcare workforce puzzle: ${JSON.stringify(context)}. 
    Create an optimal 8-hour shift plan that minimizes travel and ensures RN coverage for Level 4 acuity. 
    Return a formal deployment directive.`;

    try {
      const response = await geminiService.generateText(prompt, false);
      return response.text || "Solver failure: Manual scheduling required.";
    } catch (e) {
      return "Neural core logic bottleneck detected.";
    }
  }
}

export const schedulingOptimizationService = new SchedulingOptimizationService();