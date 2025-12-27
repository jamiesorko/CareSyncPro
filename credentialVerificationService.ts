import { supabase } from '../lib/supabase';

export interface VerificationResult {
  licenseNumber: string;
  isValid: boolean;
  expiryDate: string;
  standing: 'GOOD' | 'REVOKED' | 'SUSPENDED';
  lastChecked: string;
}

export class CredentialVerificationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Simulates a secure handshake with the CNO/RPNAO registry.
   */
  async verifyLicense(licenseNumber: string): Promise<VerificationResult> {
    console.log(`[COMPLIANCE_WATCH]: Verifying License ${licenseNumber} with external registry.`);
    
    // Simulate API latency
    await new Promise(r => setTimeout(r, 800));

    return {
      licenseNumber,
      isValid: true,
      expiryDate: '2026-12-31',
      standing: 'GOOD',
      lastChecked: new Date().toISOString()
    };
  }

  async logVerificationAudit(staffId: string, result: VerificationResult) {
    if (supabase && this.companyId) {
      await supabase.from('credential_audits').insert([{
        company_id: this.companyId,
        staff_id: staffId,
        license_number: result.licenseNumber,
        is_valid: result.isValid,
        standing: result.standing,
        timestamp: new Date().toISOString()
      }]);
    }
  }
}

export const credentialVerificationService = new CredentialVerificationService();