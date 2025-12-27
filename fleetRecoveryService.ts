import { GoogleGenAI, Type } from "@google/genai";
import { RecoveryVector, StaffMember } from '../types';

export class FleetRecoveryService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Calculates emergency rescue vectors for incapacitated staff.
   */
  async computeRecoveryVector(failedStaff: StaffMember, location: string, availableStaff: StaffMember[]): Promise<RecoveryVector> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const query = `Certified auto repair, towing, and emergency clinics near ${location}, Ontario October 2025. Identification of 24-hour response teams.`;
    
    const prompt = `
      Act as an Emergency Fleet Logistics Director. 
      Situation: Staff Member ${failedStaff.name} is incapacitated at ${location}.
      Fleet Availability: ${JSON.stringify(availableStaff.map(s => ({ id: s.id, name: s.name, role: s.role })))}
      
      Task: Resolve the field gap.
      1. Use Grounded Search to find exactly 1 nearby 24h repair/towing shop.
      2. Identify the absolute best rescuer from the pool to finish the visits.
      3. Calculate estimated intercept time.
      
      Return JSON: { "shop": "", "rescuerId": "", "eta": number, "type": "MECHANICAL|MEDICAL|COMMS" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json" 
        }
      });

      const data = JSON.parse(response.text || '{}');
      const rescuer = availableStaff.find(s => s.id === data.rescuerId) || availableStaff[0];

      return {
        staffId: failedStaff.id,
        staffName: failedStaff.name,
        failureType: data.type || 'MECHANICAL',
        nearestRepairShop: data.shop || "Searching sector network...",
        rescueEtaMinutes: data.eta || 30,
        reassignedStaffId: rescuer?.id || 'backup-001',
        reassignedStaffName: rescuer?.name || 'Emergency Backup Node'
      };
    } catch (e) {
      console.error("Recovery vector calculation error:", e);
      throw e;
    }
  }
}

export const fleetRecoveryService = new FleetRecoveryService();