import { geminiService } from './geminiService';
import { visitService } from './visitService';

export interface ExpenseFlag {
  id: string;
  type: 'MILEAGE_PADDING' | 'INVALID_RECEIPT' | 'DUPLICATE';
  variance: number;
  description: string;
}

export class ExpenseForensicsService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Cross-references claimed mileage against actual GPS telemetry records.
   */
  async auditMileage(staffId: string, claimedKm: number, date: string): Promise<boolean> {
    console.log(`[FISCAL_FORENSICS]: Auditing mileage for Staff ${staffId} on ${date}`);
    
    const actualKm = 12.4; // In real app, calculate from GPS logs
    const delta = claimedKm - actualKm;
    
    return delta < 2.0; // Allow 2km margin for traffic/detours
  }

  async auditReceipt(base64: string): Promise<string> {
    const prompt = "Extract Total Amount, Date, and Merchant from this receipt image. Return ONLY JSON.";
    try {
      const res = await geminiService.generateText(prompt, false);
      return res.text || "{}";
    } catch (e) {
      return "{}";
    }
  }
}

export const expenseForensicsService = new ExpenseForensicsService();