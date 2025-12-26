import { PayrollRecord } from '../data/accountingData';
import { CareRole } from '../types';

export class BillingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Converts visit minutes into a gross payroll amount with basic tax deductions.
   */
  calculateVisitPayroll(role: CareRole, minutes: number, rate: number): Partial<PayrollRecord> {
    const hours = minutes / 60;
    const gross = hours * rate;
    
    // Simplified Canadian Tax Logic (approximate)
    const taxFed = gross * 0.15;
    const taxProv = gross * 0.10;
    const cpp = gross * 0.0595;
    const ei = gross * 0.0163;
    
    return {
      hours,
      rate,
      grossPay: gross,
      taxFederal: taxFed,
      taxProvincial: taxProv,
      cpp,
      ei,
      netPay: gross - (taxFed + taxProv + cpp + ei)
    };
  }

  async generateClientInvoice(clientId: string, visits: any[]): Promise<number> {
    // Sums up billable units for the billing cycle
    return visits.reduce((acc, v) => acc + (v.duration / 60) * 45, 0); // $45/hr mock rate
  }
}

export const billingService = new BillingService();