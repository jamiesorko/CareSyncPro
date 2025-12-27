
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export class CrisisService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Triggers a 'Code Red' broadcast across all neural channels.
   */
  async triggerLockdown(reason: string, location: string) {
    console.error(`[CRISIS_PROTOCOL]: LOCKDOWN INITIATED - ${reason} at ${location}`);
    
    await notificationService.broadcastSignal({
      // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
      type: 'CLINICAL',
      content: `CRITICAL ALERT: Lockdown protocol active at ${location}. Reason: ${reason}. Awaiting clinical clearance.`,
    }, [CareRole.CEO, CareRole.DOC, CareRole.COO, CareRole.COORDINATOR]);
  }

  async signalEvacuation(clientId: string) {
    console.log(`[CRISIS_PROTOCOL]: Evacuation signal sent to emergency contacts for Client ${clientId}`);
    // Integrates with local EMS dispatch via simulation
  }
}

export const crisisService = new CrisisService();
