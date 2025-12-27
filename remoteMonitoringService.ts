
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface TelemetryPacket {
  deviceId: string;
  clientId: string;
  vitals: {
    hr: number;
    spo2: number;
    temp: number;
  };
  timestamp: number;
}

export class RemoteMonitoringService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Processes a stream of biometric data and triggers alerts on deviation from baseline.
   */
  async ingestTelemetry(packet: TelemetryPacket) {
    const { hr, spo2 } = packet.vitals;
    
    // Anomaly Detection Logic
    if (hr > 130 || spo2 < 92) {
      console.warn(`[REMOTE_GUARD]: Critical vital deviation detected for Client ${packet.clientId}`);
      
      await notificationService.broadcastSignal({
        // Fix: Changed 'MEDICAL' to 'CLINICAL' to align with AlertSignal type definition
        type: 'CLINICAL',
        content: `DEVICE_ALERT: Client ${packet.clientId} vital threshold violation. HR: ${hr}, SpO2: ${spo2}.`
      }, [CareRole.RN, CareRole.DOC]);
    }
  }

  async syncDeviceStatus(deviceId: string) {
    console.log(`[REMOTE_GUARD]: Syncing heartbeat for IoT device ${deviceId}`);
  }
}

export const remoteMonitoringService = new RemoteMonitoringService();
