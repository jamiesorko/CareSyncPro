
import { Client, CareRole, StaffMember } from '../types';

export const MOCK_STAFF: StaffMember[] = [
  { 
    id: 's1', anonymizedId: 'R201', companyId: 'csp-001', name: 'Tom Hardy', role: CareRole.RN, status: 'ONLINE', lastSeen: 'Active', 
    weeklyHours: 40, hourlyRate: 52, homeSector: 'North York', 
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], startTime: '08:00', endTime: '16:00' },
    restrictedClientIds: []
  },
  { 
    id: 's2', anonymizedId: 'W501', companyId: 'csp-001', name: 'Linda White', role: CareRole.PSW, status: 'IN_FIELD', lastSeen: 'Just now', 
    weeklyHours: 38, hourlyRate: 26, homeSector: 'Downtown',
    availability: { days: ['Monday', 'Tuesday', 'Thursday', 'Friday'], startTime: '07:00', endTime: '15:00' },
    restrictedClientIds: ['c2'] // Staff requested not to see Alice Cooper
  },
  { 
    id: 's3', anonymizedId: 'P301', companyId: 'csp-001', name: 'Samwise Gamgee', role: CareRole.RPN, status: 'IN_FIELD', lastSeen: '10m ago', 
    weeklyHours: 35, hourlyRate: 22, homeSector: 'Scarborough',
    availability: { days: ['Saturday', 'Sunday', 'Monday'], startTime: '08:00', endTime: '20:00' },
    restrictedClientIds: []
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    anonymizedId: 'C101',
    companyId: 'csp-001',
    name: 'Robert Johnson',
    time: '08:00 AM',
    date: 'Daily',
    address: '42 Wallaby Way, Toronto, ON',
    sector: 'North York',
    phone: '416-555-1234',
    conditions: ['Hypertension', 'Arthritis', 'Type 2 Diabetes'],
    mobilityStatus: { isBedridden: true, useWheelchair: true, useWalker: false, dementia: true, liftType: 'Hoyer', transferMethod: 'Mechanical' },
    isInitialVisit: true,
    description: 'Full transfer support and skin monitoring.',
    blacklistStaffIds: ['s3'], // Client blacklisted Samwise
    medications: [{ id: 'm1', name: 'Lisinopril', dosage: '10mg', route: 'Oral', time: '08:00 AM' }],
    carePlans: { [CareRole.PSW]: ['Bed bath', 'Hoyer transfer'] }
  },
  {
    id: 'c2',
    anonymizedId: 'C102',
    companyId: 'csp-001',
    name: 'Alice Cooper',
    time: '11:30 AM',
    date: 'Mon/Wed/Fri',
    address: '101 Bay St, Toronto, ON',
    sector: 'Downtown',
    phone: '416-555-9876',
    conditions: ['Post-Op Hip Replacement'],
    mobilityStatus: { isBedridden: false, useWheelchair: false, useWalker: true, dementia: false, liftType: 'None', transferMethod: '1-Person' },
    isInitialVisit: false,
    description: 'Physiotherapy assistance required.',
    blacklistStaffIds: [],
    medications: [],
    carePlans: { [CareRole.PSW]: ['Gait training', 'Meal prep'] }
  }
];
