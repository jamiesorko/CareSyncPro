import { supabase } from '../lib/supabase';
import { MOCK_PAYROLL, PayrollRecord } from '../data/accountingData';

export class FinancialService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async submitSupplyRequest(data: { staffId: string; item: string; quantity: number }): Promise<void> {
    console.log(`[ACCOUNTING_SYNC]: Supply requisition logged for procurement.`, data);
    if (supabase && this.companyId) {
      await supabase.from('financial_alerts').insert([{
        company_id: this.companyId,
        staff_id: data.staffId,
        type: 'SUPPLY_REQ',
        content: `Item: ${data.item}, Quantity: ${data.quantity}`,
        status: 'PENDING'
      }]);
    }
  }

  async submitPayrollDispute(data: { staffId: string; details: string }): Promise<void> {
    console.log(`[ACCOUNTING_SYNC]: Payroll dispute signal sent to Financial Specialist.`, data);
    if (supabase && this.companyId) {
      await supabase.from('financial_alerts').insert([{
        company_id: this.companyId,
        staff_id: data.staffId,
        type: 'PAYROLL_DISPUTE',
        content: data.details,
        status: 'PENDING'
      }]);
    }
  }

  async getPersonalPaystubs(staffId: string): Promise<PayrollRecord[]> {
    return MOCK_PAYROLL;
  }
}

export const financialService = new FinancialService();