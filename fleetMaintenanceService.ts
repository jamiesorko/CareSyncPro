import { supabase } from '../lib/supabase';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  mileage: number;
  lastService: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
}

export class FleetMaintenanceService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async reportOdometer(vehicleId: string, mileage: number) {
    console.log(`[FLEET_LOGS]: Updating mileage for ${vehicleId} to ${mileage}km`);
    if (supabase) {
      await supabase.from('vehicles').update({ mileage, last_update: new Date().toISOString() }).eq('id', vehicleId);
    }
  }

  async scheduleMaintenance(vehicleId: string, date: string) {
    if (supabase) {
      await supabase.from('fleet_schedules').insert([{
        vehicle_id: vehicleId,
        service_date: date,
        status: 'SCHEDULED'
      }]);
    }
  }

  async getFleetStatus(): Promise<Vehicle[]> {
    return [
      { id: 'v1', make: 'Toyota', model: 'Prius', licensePlate: 'CARE-001', mileage: 12400, lastService: '2025-01-10', status: 'AVAILABLE' },
      { id: 'v2', make: 'Honda', model: 'Civic', licensePlate: 'CARE-002', mileage: 8500, lastService: '2025-02-05', status: 'IN_USE' }
    ];
  }
}

export const fleetMaintenanceService = new FleetMaintenanceService();