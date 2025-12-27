import { supabase } from '../lib/supabase';
import { TrainingRecord } from '../types';

export class TrainingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getStaffTrainings(staffId: string): Promise<TrainingRecord[]> {
    if (!supabase || !this.companyId) {
      return [
        { id: 'tr-01', companyId: 'demo', staffId, staffName: 'Staff Member', moduleName: 'Infection Control 2025', isMandatory: true, isCompleted: true, dueDate: '2025-12-31' },
        { id: 'tr-02', companyId: 'demo', staffId, staffName: 'Staff Member', moduleName: 'Hoyer Lift Protocol v2', isMandatory: true, isCompleted: false, dueDate: '2025-10-25' }
      ];
    }
    const { data } = await supabase.from('training_records').select('*').eq('staff_id', staffId);
    return data || [];
  }

  async markAsCompleted(staffId: string, moduleId: string) {
    console.log(`[TRAINING_HUB]: Finalizing certification for Staff ${staffId}, Module ${moduleId}`);
    if (supabase && this.companyId) {
      await supabase.from('training_records').update({ is_completed: true, completion_date: new Date().toISOString() }).eq('id', moduleId);
    }
  }
}

export const trainingService = new TrainingService();