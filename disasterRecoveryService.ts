
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface CrisisMode {
  isActive: boolean;
  type: 'ENVIRONMENTAL' | 'TECHNICAL' | 'SECURITY';
  severity: 'ELEVATED' | 'CRITICAL' | 'TOTAL_BLACKOUT';
  directive: string;
}

export class DisasterRecoveryService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Triggers agency-wide Disaster Protocol.
   */
  async triggerDisasterProtocol(mode: CrisisMode) {
    console.error(`[DISASTER_HUB]: Protocol ${mode.type} activated for Org ${this.companyId}`);
    
    await notificationService.broadcastSignal({
      // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
      type: 'CLINICAL',
      content: `MASS_ALERT: ${mode.type} Protocol Active. Directive: ${mode.directive}`,
    }, [CareRole.CEO, CareRole.COO, CareRole.COORDINATOR, CareRole.RN]);

    // Simulated Logic: Switch to offline-first data sync
    localStorage.setItem('caresync_disaster_mode', 'TRUE');
  }

  async getSafeZones(): Promise<string[]> {
    return ['Sector 1 HQ', 'Sector 4 Backup Station'];
  }
}

export const disasterRecoveryService = new DisasterRecoveryService();
