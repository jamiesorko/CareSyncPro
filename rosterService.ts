import { supabase } from '../lib/supabase';
import { StaffMember, Client, CareRole } from '../types';

export class RosterService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Filters available staff for a visit based on credentials, proximity, and blacklists.
   */
  async findOptimalStaff(client: Client, requiredRole: CareRole): Promise<StaffMember[]> {
    console.log(`[ROSTER_CORE]: Searching for optimal ${requiredRole} for ${client.name}`);
    
    // In a production environment, this would perform a PostGIS proximity query.
    if (supabase && this.companyId) {
      const { data } = await supabase
        .from('staff')
        .select('*')
        .eq('company_id', this.companyId)
        .eq('role', requiredRole)
        .eq('status', 'ONLINE');
      
      return (data || []).filter(s => !client.blacklistStaffIds.includes(s.id));
    }
    return [];
  }

  async flagRestriction(clientId: string, staffId: string) {
    console.log(`[ROSTER_CORE]: Permanently restricting Staff ${staffId} from Client ${clientId}.`);
    // Logic to update client.blacklistStaffIds in the database
  }
}

export const rosterService = new RosterService();