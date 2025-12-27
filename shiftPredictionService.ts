import { StaffMember } from '../types';
import { sentimentService } from './sentimentService';

export interface ShiftRiskReport {
  staffId: string;
  failureProbability: number; // 0-1
  riskFactors: string[];
  suggestedBackupStaffId?: string;
}

export class ShiftPredictionService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Calculates the stability of an upcoming shift assignment.
   */
  async predictAbsenceRisk(staff: StaffMember): Promise<ShiftRiskReport> {
    console.log(`[STABILITY_ORACLE]: Assessing shift reliability for ${staff.name}`);
    
    // Heuristic: Risk increases with high hours and declining sentiment
    const hoursFactor = staff.weeklyHours > 44 ? 0.4 : 0.1;
    const pulse = await sentimentService.analyzePulse("Daily work is becoming physically demanding.");
    const sentimentFactor = pulse.isBurnoutRisk ? 0.3 : 0.05;

    const totalRisk = Math.min(0.95, hoursFactor + sentimentFactor + (Math.random() * 0.1));

    return {
      staffId: staff.id,
      failureProbability: totalRisk,
      riskFactors: totalRisk > 0.4 ? ['High Weekly Volume', 'Burnout Markers Detected'] : ['Stable Vector'],
      suggestedBackupStaffId: 'rn-standby-01'
    };
  }
}

export const shiftPredictionService = new ShiftPredictionService();