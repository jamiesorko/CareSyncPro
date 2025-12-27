import { StaffMember, Client } from '../types';
import { geminiService } from './geminiService';

export interface CompetencyMatch {
  staffId: string;
  skillAlignment: number; // 0-100
  missingRequiredSkill?: string;
  safetyAdvisory?: string;
}

export class StaffCompetencyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Compares staff clinical profile against patient acuity.
   */
  async evaluateMatch(staff: StaffMember, client: Client): Promise<CompetencyMatch> {
    console.log(`[NEURAL_PROFILER]: Evaluating competency vector: ${staff.name} for ${client.name}`);
    
    // In a real app, this would use a skills matrix from certificates/training records
    const hasDementiaTraining = Math.random() > 0.3;
    
    if (client.mobilityStatus.dementia && !hasDementiaTraining) {
      return {
        staffId: staff.id,
        skillAlignment: 45,
        missingRequiredSkill: 'Advanced Dementia Care',
        safetyAdvisory: 'Staff lack specialized behavioral management training for this patient.'
      };
    }

    return {
      staffId: staff.id,
      skillAlignment: 95
    };
  }
}

export const staffCompetencyService = new StaffCompetencyService();