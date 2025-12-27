import { supabase } from '../lib/supabase';

export interface BiometricStream {
  clientId: string;
  heartRate: number;
  oxygenSaturation: number;
  stepsToday: number;
  status: 'STABLE' | 'STRESS' | 'CRITICAL';
  timestamp: string;
}

export class BiometricService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getLiveStream(clientId: string): Promise<BiometricStream> {
    // Simulated biometric telemetry for the demo
    return {
      clientId,
      heartRate: 72 + Math.floor(Math.random() * 10),
      oxygenSaturation: 98,
      stepsToday: 2140 + Math.floor(Math.random() * 100),
      status: 'STABLE',
      timestamp: new Date().toISOString()
    };
  }

  async recordBiometricTick(data: Omit<BiometricStream, 'timestamp'>) {
    console.log(`[BIOMETRIC_PULSE]: Recording telemetry for Client ${data.clientId}`);
    if (supabase && this.companyId) {
      await supabase.from('biometric_logs').insert([{
        ...data,
        company_id: this.companyId,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const biometricService = new BiometricService();