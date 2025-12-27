import { sentimentService } from './sentimentService';
import { StaffMember } from '../types';

export interface StabilityPrediction {
  shiftId: string;
  reliabilityScore: number; // 0-100
  riskReason?: string;
  shouldShadowBook: boolean;
}

export class ShiftStabilityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Predicts if a staff member will successfully fulfill an assigned shift.
   */
  async predictStability(staff: StaffMember, shiftId: string): Promise<StabilityPrediction> {
    console.log(`[STABILITY_ORACLE]: Running reliability simulation for Staff ${staff.id}`);
    
    // Heuristic: Check for burnout markers and high OT
    const burnout = staff.weeklyHours > 48;
    const score = burnout ? 60 : 95;

    return {
      shiftId,
      reliabilityScore: score,
      riskReason: burnout ? "Critical burnout threshold reached." : undefined,
      shouldShadowBook: score < 70
    };
  }
}

export const shiftStabilityService = new ShiftStabilityService();