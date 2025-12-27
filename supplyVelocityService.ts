import { Client } from '../types';

export interface DepletionRisk {
  itemId: string;
  daysRemaining: number;
  isCritical: boolean;
}

export class SupplyVelocityService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Forecasts when specific supplies will run out at a patient residence.
   */
  async forecastDepletion(clientId: string, recentVisits: any[]): Promise<DepletionRisk[]> {
    console.log(`[LOGISTICS_ORACLE]: Calculating burn-rate for Client ${clientId}`);
    
    // Heuristic: If Wound Care is performed daily, dressing kits drop by 1 per day.
    // In a real app, this would query a 'residence_inventory' table.
    
    return [
      { itemId: 'NITRILE_GLOVES_M', daysRemaining: 4, isCritical: true },
      { itemId: 'WOUND_DRESSING_XL', daysRemaining: 12, isCritical: false }
    ];
  }

  async autoReorder(clientId: string, itemId: string) {
    console.warn(`[LOGISTICS_ORACLE]: AUTO-REORDER TRIGGERED for ${itemId} at Residence ${clientId}`);
  }
}

export const supplyVelocityService = new SupplyVelocityService();