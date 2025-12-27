import { supabase } from '../lib/supabase';

export interface ServiceContract {
  id: string;
  payorName: string;
  ratePerUnit: number;
  unitType: 'HOUR' | 'VISIT';
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL';
  expiryDate: string;
}

export class ContractService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getActiveContracts(): Promise<ServiceContract[]> {
    if (!supabase || !this.companyId) return [
      { id: 'con-1', payorName: 'Ministry of Health', ratePerUnit: 45.00, unitType: 'HOUR', status: 'ACTIVE', expiryDate: '2026-12-31' },
      { id: 'con-2', payorName: 'Blue Cross Private', ratePerUnit: 120.00, unitType: 'VISIT', status: 'ACTIVE', expiryDate: '2025-06-30' }
    ];

    const { data } = await supabase.from('contracts').select('*').eq('company_id', this.companyId);
    return data || [];
  }

  async updateRateCard(contractId: string, newRate: number) {
    console.log(`[FINANCIAL_OPS]: Updating Rate Card for Contract ${contractId} to $${newRate}`);
    if (supabase) {
      await supabase.from('contracts').update({ rate_per_unit: newRate }).eq('id', contractId);
    }
  }
}

export const contractService = new ContractService();