import { Client, StaffMember } from '../types';

export interface AnonymizedScheduleEntry {
  clientId: string;
  staffId: string;
  scheduledTime: string;
  reasoning: string;
}

export interface HydratedScheduleEntry {
  clientName: string;
  clientId: string;
  clientAddress: string;
  staffName: string;
  staffId: string;
  staffRole: string;
  scheduledTime: string;
  reasoning: string;
  weeklyLoad: number;
}

export class AnonymizationService {
  prepareAnonymizedPayload(clients: Client[], staff: StaffMember[]) {
    const clientMap: Record<string, Client> = {};
    const staffMap: Record<string, StaffMember> = {};

    const scrubbedClients = clients.map(c => {
      clientMap[c.anonymizedId] = c;
      return {
        id: c.anonymizedId,
        sector: c.sector,
        serviceRequired: c.conditions.join(', '),
        preferredTime: c.time,
        blacklist: c.blacklistStaffIds.map(sid => staff.find(st => st.id === sid)?.anonymizedId || 'UNK')
      };
    });

    const scrubbedStaff = staff.map(s => {
      staffMap[s.anonymizedId] = s;
      return {
        id: s.anonymizedId,
        role: s.role,
        sector: s.homeSector,
        currentWeeklyUnits: s.weeklyHours || 0, // In this system, units = hours/minutes
        availability: s.availability,
        restrictedClients: s.restrictedClientIds.map(cid => clients.find(cl => cl.id === cid)?.anonymizedId || 'UNK')
      };
    });

    return { 
      payload: { scrubbedClients, scrubbedStaff }, 
      lookups: { clientMap, staffMap } 
    };
  }

  hydrateSchedule(anonymizedOutput: AnonymizedScheduleEntry[], lookups: { clientMap: Record<string, Client>, staffMap: Record<string, StaffMember> }): HydratedScheduleEntry[] {
    return anonymizedOutput.map(entry => {
      const client = lookups.clientMap[entry.clientId];
      const staff = lookups.staffMap[entry.staffId];

      return {
        clientName: client?.name || "Unknown Client",
        clientId: entry.clientId,
        clientAddress: client?.address || "Address Scrubbed",
        staffName: staff?.name || "Unknown Staff",
        staffId: entry.staffId,
        staffRole: staff?.role || "Field Operative",
        scheduledTime: entry.scheduledTime,
        reasoning: entry.reasoning,
        weeklyLoad: staff?.weeklyHours || 0
      };
    });
  }
}

export const anonymizationService = new AnonymizationService();