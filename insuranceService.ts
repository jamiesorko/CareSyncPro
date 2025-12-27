import { supabase } from '../lib/supabase';

export interface ClaimRecord {
  id: string;
  clientId: string;
  payorId: string;
  amount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  submissionDate?: string;
}

export class InsuranceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async verifyEligibility(clientId: string, payorId: string): Promise<boolean> {
    console.log(`[INSURANCE_BRIDGE]: Verifying eligibility for Client ${clientId} with Payor ${payorId}`);
    // Simulated EDI 270/271 transaction
    return Math.random() > 0.1;
  }

  async submitClaim(claim: Omit<ClaimRecord, 'id' | 'status'>) {
    console.log(`[INSURANCE_BRIDGE]: Executing EDI 837 claim submission for ${claim.amount}`);
    if (supabase && this.companyId) {
      await supabase.from('insurance_claims').insert([{
        ...claim,
        company_id: this.companyId,
        status: 'SUBMITTED',
        submission_date: new Date().toISOString()
      }]);
    }
  }

  async getPendingClaims(): Promise<ClaimRecord[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase
      .from('insurance_claims')
      .select('*')
      .eq('company_id', this.companyId)
      .eq('status', 'SUBMITTED');
    return data || [];
  }
}

export const insuranceService = new InsuranceService();