import { supabase } from '../lib/supabase';
import { Certificate, TrainingRecord } from '../types';

export class ComplianceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getStaffCompliance(staffId: string) {
    // Logic to aggregate certs and training status
    return {
      isSuspensionRisk: false,
      missingModules: ['Workplace Violence v2'],
      expiringCerts: []
    };
  }

  async updateCertificate(cert: Partial<Certificate>) {
    console.log(`[COMPLIANCE_GUARD]: Updating certificate record for ${cert.staffName}`);
    if (supabase && this.companyId) {
      await supabase.from('certificates').upsert([{ ...cert, company_id: this.companyId }]);
    }
  }

  async logTrainingCompletion(record: Partial<TrainingRecord>) {
    console.log(`[TRAINING_VAULT]: Logged completion: ${record.moduleName}`);
    if (supabase && this.companyId) {
      await supabase.from('training_records').insert([{ ...record, company_id: this.companyId }]);
    }
  }
}

export const complianceService = new ComplianceService();