import { supabase } from '../lib/supabase'
import { Company, StaffMember, AppTab, Client } from '../types'

export class DBService {
  private companyId: string | null = null;

  setCompanyContext(id: string) {
    this.companyId = id;
  }

  async getCompanies(): Promise<Company[]> {
    if (!supabase) return [{ 
      id: 'demo-1', 
      name: 'CareSync Neural Demo', 
      brandColor: '#0ea5e9', 
      activeModules: Object.values(AppTab)
    }];
    
    const { data, error } = await supabase.from('companies').select('*');
    if (error) return [];
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      brandColor: d.brand_color,
      activeModules: d.active_modules
    }));
  }

  async getStaff(): Promise<StaffMember[]> {
    if (!supabase || !this.companyId) return [];
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('company_id', this.companyId);
    
    if (error) throw error;
    return data || [];
  }

  async getClients(): Promise<Client[]> {
    if (!supabase || !this.companyId) return [];
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', this.companyId);
    
    if (error) return [];
    return data || [];
  }

  async updateCompanySettings(id: string, settings: Partial<Company>): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from('companies').update({
      name: settings.name,
      brand_color: settings.brandColor,
      active_modules: settings.activeModules
    }).eq('id', id);
    if (error) throw error;
  }
}

export const dbService = new DBService();