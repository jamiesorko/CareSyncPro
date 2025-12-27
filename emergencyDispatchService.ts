import { geoService } from './geoService';
import { MOCK_STAFF } from '../data/careData';
import { CareRole, StaffMember } from '../types';

export interface DispatchResponse {
  responder: StaffMember;
  estimatedArrivalMinutes: number;
  distanceKm: number;
}

export class EmergencyDispatchService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Finds the absolute closest Clinical Operative (RN/RPN) to a target location.
   */
  async findFastestResponder(targetAddress: string): Promise<DispatchResponse | null> {
    console.log(`[TAC_DISPATCH]: Calculating intercept vector for ${targetAddress}`);
    
    // Filter for clinical field staff currently online
    const clinicalPool = MOCK_STAFF.filter(s => 
      [CareRole.RN, CareRole.RPN].includes(s.role as CareRole) && s.status !== 'OFFLINE'
    );

    if (clinicalPool.length === 0) return null;

    // Logic: In production, this would query a PostGIS spatial index.
    // Here we simulate distance calculations via geoService.
    const results = clinicalPool.map(staff => {
      const dist = geoService.calculateDistance(staff.id, targetAddress);
      return {
        responder: staff,
        distanceKm: dist,
        estimatedArrivalMinutes: Math.ceil(dist * 3) // Assuming 20km/h average urban speed
      };
    });

    return results.sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }
}

export const emergencyDispatchService = new EmergencyDispatchService();