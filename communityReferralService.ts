import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';

export interface CommunityPartner {
  id: string;
  name: string;
  specialty: string;
  contactEmail: string;
}

export class CommunityReferralService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async referClientToPartner(clientId: string, partnerId: string, reason: string) {
    console.log(`[PARTNER_BRIDGE]: Referring client ${clientId} to partner ${partnerId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('community_referrals').insert([{
        company_id: this.companyId,
        client_id: clientId,
        partner_id: partnerId,
        reason,
        status: 'SENT',
        timestamp: new Date().toISOString()
      }]);
    }

    await notificationService.sendEmail(
      'partner@example.com',
      `New Referral: CareSync Pro Node`,
      `A clinical referral has been initialized for client ${clientId}.`
    );
  }

  async getPartnerList(): Promise<CommunityPartner[]> {
    return [
      { id: 'p1', name: 'Downtown Physiotherapy', specialty: 'PT', contactEmail: 'pt@example.com' },
      { id: 'p2', name: 'City Nutritionists', specialty: 'Dietetics', contactEmail: 'diet@example.com' }
    ];
  }
}

export const communityReferralService = new CommunityReferralService();