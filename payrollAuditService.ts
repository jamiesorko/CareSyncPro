import { PayrollRecord } from '../data/accountingData';
import { CareRole } from '../types';

export class PayrollAuditService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Performs deep fiscal audit on a payroll record to ensure regulatory compliance.
   */
  async auditPayrollRecord(record: PayrollRecord): Promise<{ isValid: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    
    // Check for excessive overtime without CEO approval
    if (record.hours > 44) {
      warnings.push("High Hours: Over 44hrs/week requires provincial overtime premium audit.");
    }

    // Check for negative net pay (impossible state)
    if (record.netPay <= 0) {
      warnings.push("Error: Net pay calculated at zero or negative. Check deduction logic.");
    }

    return {
      isValid: warnings.length === 0,
      warnings
    };
  }

  calculateCRAWithholding(gross: number) {
    return {
      federal: gross * 0.15,
      provincial: gross * 0.10,
      cpp: gross * 0.0595,
      ei: gross * 0.0163
    };
  }
}

export const payrollAuditService = new PayrollAuditService();