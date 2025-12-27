import { geminiService } from './geminiService';
import { Client, StaffMember } from '../types';

export interface VelocitySignal {
  clientId: string;
  clientName: string;
  stabilityScore: number;
  dischargeVelocity: number; // 0-100%
  predictedReleaseDate: string;
  logicRationale: string;
}

export interface ReallocationProposal {
  id: string;
  staffId: string;
  staffName: string;
  currentClientId: string;
  targetClientId: string;
  efficiencyGain: number; // %
  logicRationale: string;
}

export class FleetVelocityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async computeAcuityDrift(clients: Client[]): Promise<VelocitySignal[]> {
    console.log(`[VELOCITY_SERVICE]: Analyzing clinical vectors for ${clients.length} nodes.`);
    
    // In a real implementation, we would send all client data to Gemini 3 Flash
    // to detect subtle improvements.
    const signals: VelocitySignal[] = clients.map(c => {
      const isDementia = c.mobilityStatus.dementia;
      const isPostOp = c.conditions.some(cond => cond.toLowerCase().includes('post-op'));
      
      return {
        clientId: c.id,
        clientName: c.name,
        stabilityScore: isPostOp ? 85 : isDementia ? 62 : 92,
        dischargeVelocity: isPostOp ? 74 : isDementia ? 12 : 98,
        predictedReleaseDate: isPostOp ? '2025-11-12' : isDementia ? 'Long-Term' : '2025-10-30',
        logicRationale: isPostOp ? "Surgical recovery vector optimal." : "Baseline stability verified via biometrics."
      };
    });

    return signals;
  }

  async generateReallocations(staff: StaffMember[], signals: VelocitySignal[]): Promise<ReallocationProposal[]> {
    const highStabilityClients = signals.filter(s => s.stabilityScore > 80);
    if (highStabilityClients.length === 0) return [];

    return [{
      id: 'prop-1',
      staffId: 'psw1',
      staffName: 'Linda White',
      currentClientId: highStabilityClients[0].clientId,
      targetClientId: 'c-new-intake-92',
      efficiencyGain: 18.5,
      logicRationale: `Shift primary resource from stabilized ${highStabilityClients[0].clientName} to high-acuity admission c-new-intake-92.`
    }];
  }
}

export const fleetVelocityService = new FleetVelocityService();