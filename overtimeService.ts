
import { CareRole } from '../types';
import { notificationService } from './notificationService';

export interface OTRequest {
  id: string;
  staffId: string;
  staffName: string;
  units: number;
  opsLock: boolean;
  fiscalLock: boolean;
  status: 'PENDING' | 'AUTHORIZED' | 'DENIED';
}

class OvertimeService {
  private requests: OTRequest[] = [];

  async initRequest(staffId: string, name: string, units: number) {
    const req: OTRequest = {
      id: Math.random().toString(36).substring(7),
      staffId,
      staffName: name,
      units,
      opsLock: false,
      fiscalLock: false,
      status: 'PENDING'
    };
    this.requests.push(req);
    await notificationService.broadcastSignal({
      type: 'FISCAL',
      content: `OVERTIME_CONSENSUS_REQ: ${name} (${units} units). Requires dual-lock auth.`
    }, [CareRole.COORDINATOR, CareRole.ACCOUNTANT]);
    return req;
  }

  approve(id: string, role: CareRole) {
    const req = this.requests.find(r => r.id === id);
    if (!req) return null;
    if (role === CareRole.COORDINATOR) req.opsLock = true;
    if (role === CareRole.ACCOUNTANT) req.fiscalLock = true;
    if (req.opsLock && req.fiscalLock) req.status = 'AUTHORIZED';
    return req;
  }
}

export const overtimeService = new OvertimeService();
