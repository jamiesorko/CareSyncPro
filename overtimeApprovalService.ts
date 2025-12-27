
import { CareRole } from '../types';
import { notificationService } from './notificationService';

export interface OvertimeConsensus {
  id: string;
  staffId: string;
  staffName: string;
  units: number;
  opsLock: boolean;
  fiscalLock: boolean;
  status: 'PENDING' | 'AUTHORIZED' | 'REJECTED';
}

class OvertimeApprovalService {
  private queue: OvertimeConsensus[] = [];

  async request(staffId: string, staffName: string, units: number) {
    const id = Math.random().toString(36).substring(7);
    const newReq: OvertimeConsensus = {
      id,
      staffId,
      staffName,
      units,
      opsLock: false,
      fiscalLock: false,
      status: 'PENDING'
    };
    this.queue.push(newReq);

    await notificationService.broadcastSignal({
      type: 'FISCAL',
      content: `OVERTIME_CONSENSUS_REQ: ${staffName} (${units} units). Dual-lock authorization required.`
    }, [CareRole.COORDINATOR, CareRole.ACCOUNTANT]);

    return newReq;
  }

  approve(id: string, role: CareRole) {
    const req = this.queue.find(r => r.id === id);
    if (!req) return null;

    if (role === CareRole.COORDINATOR) req.opsLock = true;
    if (role === CareRole.ACCOUNTANT) req.fiscalLock = true;

    if (req.opsLock && req.fiscalLock) {
      req.status = 'AUTHORIZED';
    }
    return { ...req };
  }

  getPending() {
    return this.queue.filter(r => r.status === 'PENDING');
  }
}

export const overtimeApprovalService = new OvertimeApprovalService();
