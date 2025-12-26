
import { Client, StaffMember, RiskScore } from '../types';
import { geminiService } from './geminiService';

class SystemService {
  private offlineQueue: any[] = [];

  /**
   * Predictive Risk Engine: Uses Gemini to detect patterns of decline.
   */
  async analyzeClinicalRisk(client: Client, notes: string[]): Promise<RiskScore> {
    const prompt = `Analyze these caregiver notes for ${client.name} (${client.conditions.join(', ')}): 
    Notes: "${notes.join(' | ')}"
    Predict the risk of hospital readmission. Categorize as LOW, MED, HIGH, or CRITICAL. 
    List exactly 2 clinical risk factors.`;

    try {
      // Fixed: generateText returns a response object; access the text property
      const response = await geminiService.generateText(prompt, false);
      const text = response.text || "LOW";
      return {
        level: text.includes('CRITICAL') ? 'CRITICAL' : text.includes('HIGH') ? 'HIGH' : text.includes('MED') ? 'MED' : 'LOW',
        factors: [text.split('\n')[1] || "Stable", text.split('\n')[2] || "Monitor"],
        lastAssessed: new Date().toISOString()
      };
    } catch (e) {
      return { level: 'LOW', factors: ['Error in Risk Engine'], lastAssessed: new Date().toISOString() };
    }
  }

  /**
   * Manages the Offline Data Buffer for Vercel stability.
   */
  queueSignal(signal: any) {
    this.offlineQueue.push({ ...signal, timestamp: Date.now() });
    localStorage.setItem('caresync_offline_queue', JSON.stringify(this.offlineQueue));
    console.log(`[RESILIENCE]: Signal buffered. Queue size: ${this.offlineQueue.length}`);
  }

  async processOfflineQueue(): Promise<number> {
    if (this.offlineQueue.length === 0) return 0;
    // Simulate re-syncing to Supabase
    const processed = this.offlineQueue.length;
    this.offlineQueue = [];
    localStorage.removeItem('caresync_offline_queue');
    return processed;
  }

  getAgencyHealthMetrics(clients: Client[], staff: StaffMember[]) {
    // Fixed: currentVisitStatus property now exists on Client type
    const activeVisits = clients.filter(c => c.currentVisitStatus === 'IN_PROGRESS').length;
    const completedCount = clients.filter(c => c.currentVisitStatus === 'COMPLETED').length;
    const completionRate = clients.length > 0 ? (completedCount / clients.length) * 100 : 0;
    
    return {
      healthScore: 90 + (completionRate / 10),
      activeVisits,
      utilization: staff.length > 0 ? (staff.filter(s => s.status === 'IN_FIELD').length / staff.length) * 100 : 0,
      offlineQueueSize: this.offlineQueue.length
    };
  }

  async performChronoBackup(state: any): Promise<string> {
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem(`caresync_backup_${timestamp}`, JSON.stringify(state));
      return timestamp;
    } catch (e) {
      return "BACKUP_FAILURE";
    }
  }
}

export const systemService = new SystemService();
