import { supabase } from '../lib/supabase';
import { coordinationService } from './coordinationService';

export interface ShiftSwapRequest {
  id: string;
  shiftId: string;
  requesterId: string;
  targetStaffId?: string; // If null, it's an "Open Shift"
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'OPEN';
  reason: string;
}

export class ShiftSwapService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async createSwapRequest(request: Omit<ShiftSwapRequest, 'id' | 'status'>) {
    console.log(`[SHIFT_SWAP]: New swap request from ${request.requesterId} for shift ${request.shiftId}`);
    
    if (supabase && this.companyId) {
      await supabase.from('shift_swaps').insert([{
        ...request,
        company_id: this.companyId,
        status: request.targetStaffId ? 'PENDING' : 'OPEN'
      }]);
    }

    await coordinationService.signalBookOff({
      staffId: request.requesterId,
      reason: `Shift Swap Request: ${request.reason}`,
      isUrgent: false
    });
  }

  async acceptSwap(swapId: string, acceptorId: string) {
    console.log(`[SHIFT_SWAP]: Swap ${swapId} accepted by ${acceptorId}`);
    // Logic to update shift assignment and notify coordination
  }
}

export const shiftSwapService = new ShiftSwapService();