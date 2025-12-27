import { supabase } from '../lib/supabase';

export interface ShiftBid {
  id: string;
  shiftId: string;
  staffId: string;
  bidPrice?: number;
  neuralMatchScore: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export class ShiftBiddingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async placeBid(shiftId: string, staffId: string) {
    console.log(`[SHIFT_MARKET]: Staff ${staffId} placing bid on open shift ${shiftId}`);
    
    // Neural match score would be calculated based on staff proficiency vs client acuity
    const matchScore = 75 + Math.floor(Math.random() * 25);

    if (supabase && this.companyId) {
      await supabase.from('shift_bids').insert([{
        company_id: this.companyId,
        shift_id: shiftId,
        staff_id: staffId,
        neural_match_score: matchScore,
        status: 'PENDING'
      }]);
    }
  }

  async getBidsForShift(shiftId: string): Promise<ShiftBid[]> {
    if (!supabase) return [];
    const { data } = await supabase.from('shift_bids').select('*').eq('shift_id', shiftId);
    return (data || []).map(d => ({
      id: d.id,
      shiftId: d.shift_id,
      staffId: d.staff_id,
      neuralMatchScore: d.neural_match_score,
      status: d.status
    }));
  }
}

export const shiftBiddingService = new ShiftBiddingService();