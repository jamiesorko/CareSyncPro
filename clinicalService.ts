
import { Client, AlertType, CareRole } from "../types";

export class ClinicalService {
  async createIncident(incident: {
    clientId: string;
    type: AlertType;
    note: string;
    escalationTarget: 'COORDINATOR' | 'SUPERVISOR' | 'BOTH';
  }) {
    console.log(`[CLINICAL_CORE]: Routing ${incident.type} for Client ${incident.clientId} to ${incident.escalationTarget}`);
    // Persistence logic here (Supabase)
  }

  async auditVisitDuration(clientId: string, durationMinutes: number) {
    const minExpected = 15; 
    if (durationMinutes < minExpected) {
      console.warn(`[AUDIT_SENTINEL]: Short visit detected for ${clientId}: ${durationMinutes}m`);
    }
  }
}

export const clinicalService = new ClinicalService();
