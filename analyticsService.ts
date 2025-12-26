
import { Client, StaffMember } from '../types';

export interface AgencyMetrics {
  healthScore: number;
  utilizationRate: number;
  riskVelocity: 'STABLE' | 'ACCELERATING' | 'CRITICAL';
  activeCensus: number;
  pendingIntakes: number;
  compliancePercentage: number;
}

export class AnalyticsService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  computeAgencyHealth(clients: Client[], staff: StaffMember[]): AgencyMetrics {
    // Fixed: currentVisitStatus property now exists on Client type
    const activeVisits = clients.filter(c => c.currentVisitStatus === 'IN_PROGRESS').length;
    const fieldStaff = staff.filter(s => s.status === 'IN_FIELD').length;
    
    // Heuristic: Health is high if visits are moving and staff are utilized but not maxed
    const utilization = staff.length > 0 ? (fieldStaff / staff.length) * 100 : 0;
    // Fixed: risk property now exists on Client type
    const health = 100 - (clients.filter(c => c.risk?.level === 'CRITICAL').length * 5);

    return {
      healthScore: Math.min(100, Math.max(0, health)),
      utilizationRate: utilization,
      riskVelocity: utilization > 90 ? 'ACCELERATING' : 'STABLE',
      activeCensus: clients.length,
      pendingIntakes: clients.filter(c => c.isInitialVisit).length,
      compliancePercentage: 98.4 // Mocked for demo
    };
  }

  getProfitabilityDelta() {
    return {
      revenue: 64000,
      expenses: 42000,
      margin: 34.3
    };
  }
}

export const analyticsService = new AnalyticsService();
