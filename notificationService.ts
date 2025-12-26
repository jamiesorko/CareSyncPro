import { supabase } from '../lib/supabase';
import { AlertSignal, CareRole } from '../types';

export class NotificationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Broadcasts a signal burst to a specific group of personas.
   */
  async broadcastSignal(signal: Partial<AlertSignal>, targetRoles: CareRole[]): Promise<void> {
    console.log(`[SIGNAL_BURST]: Broadcasting ${signal.type} to [${targetRoles.join(', ')}]`);
    
    // In a production environment, this would trigger AWS SNS, Twilio, or SendGrid.
    if (supabase && this.companyId) {
      const { error } = await supabase.from('notifications').insert([{
        company_id: this.companyId,
        type: signal.type,
        content: signal.content,
        target_roles: targetRoles,
        status: 'DISPATCHED',
        timestamp: new Date().toISOString()
      }]);
      if (error) throw error;
    }
  }

  async sendSMS(phone: string, message: string) {
    console.log(`[SMS_GATEWAY]: Outbound to ${phone}: "${message}"`);
  }

  async sendEmail(email: string, subject: string, body: string) {
    console.log(`[SMTP_RELAY]: Outbound to ${email}: "${subject}"`);
  }
}

export const notificationService = new NotificationService();