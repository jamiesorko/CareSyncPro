import { supabase } from '../lib/supabase';
import { telemetryService } from './telemetryService';
import { clinicalService } from './clinicalService';
import { billingService } from './billingService';
import { auditService } from './auditService';
import { Client, StaffMember } from '../types';

export class VisitService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Initializes a visit with geofence validation.
   */
  async startVisit(staffId: string, client: Client, lat: number, lng: number): Promise<boolean> {
    const isAtLocation = await telemetryService.validateGeofence(staffId, lat, lng, client.address);
    
    if (!isAtLocation) {
      console.warn(`[VISIT_CORE]: Geofence violation for Staff ${staffId} at Client ${client.id}`);
      // In a real app, this might block the clock-in or flag for manual verification.
    }

    if (supabase && this.companyId) {
      await supabase.from('visits').insert([{
        company_id: this.companyId,
        staff_id: staffId,
        client_id: client.id,
        start_time: new Date().toISOString(),
        status: 'IN_PROGRESS',
        geofence_verified: isAtLocation
      }]);
    }

    return true;
  }

  /**
   * Finalizes a visit, triggers audits, and prepares billing data.
   */
  async endVisit(visitId: string, staff: StaffMember, tasksCompleted: string[], durationMinutes: number) {
    console.log(`[VISIT_CORE]: Finalizing visit ${visitId}. Duration: ${durationMinutes}m`);
    
    // 1. Audit integrity
    await auditService.runIntegrityCheck(staff.id);

    // 2. Prepare payroll vector
    const payrollData = billingService.calculateVisitPayroll(staff.role as any, durationMinutes, staff.hourlyRate || 25);

    if (supabase && this.companyId) {
      await supabase.from('visits').update({
        status: 'COMPLETED',
        end_time: new Date().toISOString(),
        tasks_completed: tasksCompleted,
        duration_minutes: durationMinutes,
        calculated_payroll: payrollData
      }).eq('id', visitId);
    }
  }
}

export const visitService = new VisitService();