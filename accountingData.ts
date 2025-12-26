
import { CareRole } from '../types';

export interface PayrollRecord {
  id: string;
  staffName: string;
  role: CareRole;
  hours: number;
  rate: number;
  grossPay: number;
  taxFederal: number;
  taxProvincial: number;
  cpp: number;
  ei: number;
  insuranceDeductible: number;
  unionDues: number;
  netPay: number;
  status: 'PROCESSED' | 'PENDING' | 'ADJUSTED' | 'VOID';
  date: string;
  yearToDate: number;
  vacationPayAccrued: number;
}

export interface SupplyRequest {
  id: string;
  staffName: string;
  item: string;
  quantity: number;
  urgency: 'LOW' | 'MED' | 'HIGH';
  status: 'PENDING' | 'ORDERED' | 'DELIVERED';
  timestamp: string;
}

export interface InvoiceRecord {
  id: string;
  clientName: string;
  amount: number;
  status: 'SENT' | 'PAID' | 'OVERDUE' | 'DRAFT';
  date: string;
  dueDate: string;
}

export interface PayableRecord {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  status: 'UNVERIFIED' | 'VERIFIED' | 'PAID';
  date: string;
  dueDate: string;
}

export const MOCK_PAYROLL: PayrollRecord[] = [
  {
    id: 'PR-2025-001',
    staffName: 'Elena R.',
    role: CareRole.PSW,
    hours: 80,
    rate: 25,
    grossPay: 2000.00,
    taxFederal: 280.00,
    taxProvincial: 140.00,
    cpp: 110.00,
    ei: 32.00,
    insuranceDeductible: 45.00,
    unionDues: 32.50,
    netPay: 1360.50,
    status: 'PROCESSED',
    date: '2025-10-15',
    yearToDate: 45000.00,
    vacationPayAccrued: 960.00
  },
  {
    id: 'PR-2025-002',
    staffName: 'Mark K.',
    role: CareRole.RN,
    hours: 75,
    rate: 55,
    grossPay: 4125.00,
    taxFederal: 825.00,
    taxProvincial: 412.50,
    cpp: 226.88,
    ei: 66.00,
    insuranceDeductible: 60.00,
    unionDues: 55.00,
    netPay: 2479.62,
    status: 'PENDING',
    date: '2025-10-15',
    yearToDate: 82000.00,
    vacationPayAccrued: 1680.00
  },
  {
    id: 'PR-2025-003',
    staffName: 'Sarah J.',
    role: CareRole.PSW,
    hours: 40,
    rate: 24.50,
    grossPay: 980.00,
    taxFederal: 110.00,
    taxProvincial: 55.00,
    cpp: 53.90,
    ei: 15.68,
    insuranceDeductible: 20.00,
    unionDues: 18.00,
    netPay: 707.42,
    status: 'ADJUSTED',
    date: '2025-10-15',
    yearToDate: 28000.00,
    vacationPayAccrued: 420.00
  }
];

export const MOCK_INVOICES: InvoiceRecord[] = [
  { id: 'INV-1001', clientName: 'Robert Miller', amount: 4500.00, status: 'PAID', date: '2025-10-01', dueDate: '2025-10-15' },
  { id: 'INV-1002', clientName: 'Sarah Chen', amount: 8200.00, status: 'SENT', date: '2025-10-05', dueDate: '2025-10-19' },
  { id: 'INV-1003', clientName: 'Martha Stewart', amount: 3100.00, status: 'OVERDUE', date: '2025-09-20', dueDate: '2025-10-04' }
];

export const MOCK_PAYABLES: PayableRecord[] = [
  { id: 'PAY-501', vendor: 'MedSource Inc', amount: 1200.00, category: 'Medical Supplies', status: 'VERIFIED', date: '2025-10-10', dueDate: '2025-10-24' },
  { id: 'PAY-502', vendor: 'North York Auto', amount: 850.00, category: 'Fleet Maintenance', status: 'UNVERIFIED', date: '2025-10-12', dueDate: '2025-10-26' },
  { id: 'PAY-503', vendor: 'Skyline Properties', amount: 5500.00, category: 'Facility Lease', status: 'PAID', date: '2025-10-01', dueDate: '2025-10-15' }
];

export const MOCK_SUPPLY_REQUESTS: SupplyRequest[] = [
  { id: 'REQ-01', staffName: 'Elena R.', item: 'Nitrile Gloves (Box)', quantity: 10, urgency: 'HIGH', status: 'PENDING', timestamp: '2025-10-15 08:30' },
  { id: 'REQ-02', staffName: 'Jared L.', item: 'Wound Care Kits', quantity: 5, urgency: 'MED', status: 'PENDING', timestamp: '2025-10-14 16:45' }
];

export const MOCK_HISTORICAL_PL = [
  { month: 'May', revenue: 42000, expenses: 31000 },
  { month: 'Jun', revenue: 48000, expenses: 32500 },
  { month: 'Jul', revenue: 45000, expenses: 34000 },
  { month: 'Aug', revenue: 52000, expenses: 33000 },
  { month: 'Sep', revenue: 58000, expenses: 38000 },
  { month: 'Oct', revenue: 64000, expenses: 40000 },
];
