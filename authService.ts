import { supabase } from '../lib/supabase';
import { CareRole, UserProfile } from '../types';

export class AuthService {
  async getCurrentUser(): Promise<UserProfile | null> {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('staff')
      .select('id, company_id, role, name')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      companyId: profile.company_id,
      role: profile.role as CareRole,
      fullName: profile.name
    };
  }

  async signOut() {
    if (supabase) await supabase.auth.signOut();
    window.location.reload();
  }
}

export const authService = new AuthService();
