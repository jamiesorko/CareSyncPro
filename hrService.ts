import { supabase } from '../lib/supabase';
import { TrainingRecord, LeaveRequest, AlertType } from '../types';

export class HRService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async submitHRRequest(request: { type: AlertType; details: string; staffId: string }): Promise<void> {
    console.log(`[HR_MATRIX]: Signal [${request.type}] received for Staff ${request.staffId}`);
    
    if (supabase && this.companyId) {
      const { error } = await supabase.from('hr_requests').insert([{
        company_id: this.companyId,
        staff_id: request.staffId,
        request_type: request.type,
        details: request.details,
        status: 'SUBMITTED'
      }]);
      if (error) throw error;
    }
  }

  async getTrainingCompliance(staffId: string): Promise<TrainingRecord[]> {
    // Demo implementation for field staff
    return [
      { id: 'tr-01', companyId: 'demo', staffId, staffName: 'User', moduleName: 'Infection Control 2025', isMandatory: true, isCompleted: true, dueDate: '2025-12-31' },
      { id: 'tr-02', companyId: 'demo', staffId, staffName: 'User', moduleName: 'Safe Lifts & Hoyer Protocol', isMandatory: true, isCompleted: false, dueDate: '2025-10-25' }
    ];
  }

  async getTaxDocuments(staffId: string) {
    return [
      { id: 't4-2024', name: '2024 T4 Statement', type: 'T4_REQUEST', year: 2024 },
      { id: 't4-2023', name: '2023 T4 Statement', type: 'T4_REQUEST', year: 2023 }
    ];
  }
}

export const hrService = new HRService();
