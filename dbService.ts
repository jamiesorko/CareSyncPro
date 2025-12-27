
import { Company, AppTab } from "../types";

export class DBService {
  async getCompanies(): Promise<Company[]> {
    return [{ 
      id: 'csp-demo', 
      name: 'CareSync Neural Demo', 
      brandColor: '#6366f1', 
      activeModules: Object.values(AppTab)
    }];
  }

  async getStaff() { return []; }
  async getClients() { return []; }

  // Fix: Added missing updateCompanySettings method
  async updateCompanySettings(id: string, settings: Partial<Company>): Promise<void> {
    console.log(`[DB_SERVICE]: Updating settings for company ${id}`, settings);
  }
}

export const dbService = new DBService();
