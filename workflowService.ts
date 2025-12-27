import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';
import { CareRole } from '../types';

export interface WorkflowStep {
  id: string;
  name: string;
  assignedRole: CareRole;
  status: 'PENDING' | 'COMPLETED';
}

export class WorkflowService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Initializes a "Major Incident" workflow across departments.
   */
  async startIncidentWorkflow(incidentId: string, description: string) {
    console.log(`[WORKFLOW_ENGINE]: Initializing critical response for Incident ${incidentId}`);
    
    const steps: Omit<WorkflowStep, 'id'>[] = [
      { name: 'Clinical Assessment', assignedRole: CareRole.RN, status: 'PENDING' },
      { name: 'Family Notification', assignedRole: CareRole.COORDINATOR, status: 'PENDING' },
      { name: 'Insurance Notification', assignedRole: CareRole.ACCOUNTANT, status: 'PENDING' },
      { name: 'Director Review', assignedRole: CareRole.DOC, status: 'PENDING' }
    ];

    if (supabase && this.companyId) {
      await supabase.from('workflow_instances').insert([{
        company_id: this.companyId,
        entity_id: incidentId,
        type: 'INCIDENT_RESPONSE',
        steps: JSON.stringify(steps),
        status: 'ACTIVE'
      }]);
    }

    await notificationService.broadcastSignal({
      type: 'CLINICAL',
      content: `WORKFLOW_ALERT: Major Incident ${incidentId} requires immediate department-wide coordination.`
    }, [CareRole.RN, CareRole.DOC, CareRole.ACCOUNTANT]);
  }
}

export const workflowService = new WorkflowService();