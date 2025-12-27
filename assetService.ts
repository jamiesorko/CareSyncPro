import { supabase } from '../lib/supabase';

export interface MedicalAsset {
  id: string;
  clientId: string;
  type: 'LIFT' | 'OXYGEN' | 'BED' | 'WHEELCHAIR';
  serialNumber: string;
  lastMaintenance: string;
  status: 'FUNCTIONAL' | 'REQUIRES_SERVICE';
}

export class AssetService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async trackAssetDeployment(clientId: string, type: string, serial: string) {
    console.log(`[ASSET_LOGISTICS]: Deploying ${type} to Client ${clientId}`);
    if (supabase && this.companyId) {
      await supabase.from('assets').insert([{
        company_id: this.companyId,
        client_id: clientId,
        type,
        serial_number: serial,
        last_maintenance: new Date().toISOString(),
        status: 'FUNCTIONAL'
      }]);
    }
  }

  async getAssetsAtResidence(clientId: string): Promise<MedicalAsset[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase
      .from('assets')
      .select('*')
      .eq('client_id', clientId);
    return data || [];
  }
}

export const assetService = new AssetService();