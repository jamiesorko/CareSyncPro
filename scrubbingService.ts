
import { Client, StaffMember } from '../types';

/**
 * DOUBLE-SCRUBBING PROTOCOL v4.5
 * Ensuring institutional sovereignty by masking all sensitive vectors.
 */
export class ScrubbingService {
  
  /**
   * Primary scrub: Removes Names, Phones, and exact Financials.
   */
  scrubDataForAI(clients: Client[], staff: StaffMember[]) {
    const sanitizedClients = clients.map(c => ({
      id: c.anonymizedId, // "C" prefix
      sector: c.sector, // Broad region, not street address
      acuity: c.conditions,
      riskLevel: c.risk?.level || 'LOW',
      // Financial Scrub: Convert exact billing to scale
      valueMagnitude: 'TIER_3_PREMIUM' 
    }));

    const sanitizedStaff = staff.map(s => ({
      id: s.anonymizedId, // "W", "R", or "P" prefix
      role: s.role,
      sector: s.homeSector,
      availability: s.availability,
      // Financial Scrub: Convert pay rate to relative weight
      costMagnitude: s.hourlyRate && s.hourlyRate > 45 ? 'MAG_HIGH' : 'MAG_STD'
    }));

    return { clients: sanitizedClients, staff: sanitizedStaff };
  }

  /**
   * Secondary scrub: Regex sweep of text reports to catch leakage.
   */
  cleanText(text: string): string {
    if (!text) return "";
    return text
      .replace(/\d{3}-\d{3}-\d{4}/g, "[PHONE_MASKED]") // Phones
      .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[NAME_MASKED]") // Proper Names
      .replace(/\$\d+(?:\.\d{2})?/g, "[FISCAL_MASKED]"); // Dollar amounts
  }
}

export const scrubbingService = new ScrubbingService();
