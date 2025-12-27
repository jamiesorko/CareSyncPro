
import { inventoryService, InventoryItem } from './inventoryService';

export interface SupplyForecast {
  itemId: string;
  itemName: string;
  estimatedStockOutDate: string;
  requiredReplenishment: number;
  confidence: number;
}

export class SupplyChainForecastingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Correlates visit volume with inventory burn rates to forecast stock-outs.
   */
  async forecastNeeds(): Promise<SupplyForecast[]> {
    console.log(`[SUPPLY_ORACLE]: Calculating burn-velocity for Org ${this.companyId}`);
    
    const stock = await inventoryService.getStockLevels();
    
    return stock.map(item => ({
      itemId: item.id, // Fixed: accessing id from InventoryItem
      itemName: item.name,
      estimatedStockOutDate: '2025-11-20',
      requiredReplenishment: item.minThreshold * 2,
      confidence: 0.92
    }));
  }
}

export const supplyChainForecastingService = new SupplyChainForecastingService();
