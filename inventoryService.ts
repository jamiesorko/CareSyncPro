
import { supabase } from '../lib/supabase';
import { BaseEntity } from '../types';

export interface InventoryItem extends BaseEntity {
  name: string;
  category: 'PPE' | 'HARDWARE' | 'CLINICAL';
  stockLevel: number;
  unit: string;
  minThreshold: number;
}

export class InventoryService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getStockLevels(): Promise<InventoryItem[]> {
    if (!supabase || !this.companyId) {
      return [
        { id: 'inv-1', companyId: 'demo', name: 'N95 Masks', category: 'PPE', stockLevel: 450, unit: 'boxes', minThreshold: 100 },
        { id: 'inv-2', companyId: 'demo', name: 'Hoyer Slings (Medium)', category: 'HARDWARE', stockLevel: 12, unit: 'units', minThreshold: 5 },
        { id: 'inv-3', companyId: 'demo', name: 'Nitrile Gloves', category: 'PPE', stockLevel: 80, unit: 'boxes', minThreshold: 150 },
      ];
    }
    const { data } = await supabase.from('inventory').select('*').eq('company_id', this.companyId);
    return data || [];
  }

  async triggerLowStockAlert(item: InventoryItem) {
    console.log(`[SUPPLY_CHAIN_ALARM]: Low stock detected for ${item.name}. Level: ${item.stockLevel} ${item.unit}`);
    // This would typically trigger an automated purchase order signal
  }

  async fulfillRequisition(staffId: string, itemId: string, quantity: number) {
    console.log(`[INVENTORY_CORE]: Fulfilling request for ${quantity} units of ${itemId} to Staff ${staffId}`);
    // Logic to decrement stock levels in DB
  }
}

export const inventoryService = new InventoryService();
