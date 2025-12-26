import { supabase } from '../lib/supabase';

export interface VaultAsset {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  status: 'QUEUED' | 'INDEXING' | 'SECURED';
  tags: string[];
}

export class StorageService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async registerAsset(asset: Omit<VaultAsset, 'id'>) {
    console.log(`[VAULT_INDEXER]: Registering asset: ${asset.name}`);
    if (supabase && this.companyId) {
      await supabase.from('vault_assets').insert([{
        ...asset,
        company_id: this.companyId,
        created_at: new Date().toISOString()
      }]);
    }
  }

  async getIndexingQueue(): Promise<VaultAsset[]> {
    if (!supabase || !this.companyId) return [];
    const { data } = await supabase.from('vault_assets').select('*').eq('status', 'INDEXING');
    return data || [];
  }
}

export const storageService = new StorageService();