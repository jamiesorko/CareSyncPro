
export enum CareRole {
  CEO = 'CEO',
  COO = 'COO',
  DOC = 'Director of Care',
  RN = 'Registered Nurse',
  RPN = 'Registered Practical Nurse',
  PSW = 'Personal Support Worker',
  HSS = 'Home Support Specialist',
  HR_SPECIALIST = 'HR Specialist',
  COORDINATOR = 'Coordinator',
  ACCOUNTANT = 'Accountant',
  CLIENT = 'Client',
  FAMILY = 'Family'
}

export enum AppTab {
  DASHBOARD = 'Dashboard',
  STRATEGIC_AUTHORITY = 'Strategic Authority',
  RESILIENCE = 'Neural Resilience',
  ORG_COMMAND = 'Org Command',
  FIELD_OPS = 'Field Ops',
  INCIDENT_REPORTS = 'Incident Reports',
  NURSING_COMMAND = 'Nursing Command',
  CARE_ARCHITECT = 'Care Architect',
  DOC_SUPERVISION = 'DOC Supervision',
  OPERATIONS_MATRIX = 'Operations Matrix',
  COORDINATION = 'Coordination',
  ACCOUNTING = 'Accounting',
  VAULT = 'Neural Vault',
  HIRING = 'Hiring',
  CLIENT_CARE = 'Client Care',
  FAMILY_PORTAL = 'Family Portal',
  MESSAGES = 'Messages',
  SCHEDULE = 'Schedule',
  CARE_HUB = 'Care Hub',
  COMPANY_SETTINGS = 'Company Settings',
  GUARDIAN_SENTINEL = 'Guardian Sentinel',
  TRAINING_FORGE = 'Training Forge',
  CLINICAL_COMMAND = 'Clinical Command',
  CARE_PLANNER = 'Care Planner',
  VIRTUAL_STATION = 'Virtual Station',
  REGULATORY_SENTINEL = 'Regulatory Sentinel',
  TRUTH_MEDIATION = 'Truth Mediation',
  ADMIN_INTAKE = 'Admin Intake',
  REVENUE_RECLAMATION = 'Revenue Reclamation'
}

export interface BaseEntity {
  id: string;
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  brandColor?: string;
  activeModules: string[];
}

export interface RiskScore {
  level: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  factors: string[];
  lastAssessed: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  route: string;
  time: string;
}

export interface Client extends BaseEntity {
  name: string;
  anonymizedId: string;
  address: string;
  sector: string;
  phone: string;
  time: string;
  date: string;
  conditions: string[];
  mobilityStatus: {
    isBedridden: boolean;
    useWheelchair: boolean;
    useWalker: boolean;
    dementia: boolean;
    liftType: string;
    transferMethod: string;
  };
  isInitialVisit: boolean;
  description: string;
  carePlans: Record<string, string[]>;
  medications: Medication[];
  blacklistStaffIds: string[];
  currentVisitStatus?: 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
  risk?: RiskScore;
  docInstructions?: string;
  coordinatorInstructions?: string;
}

export interface StaffMember extends BaseEntity {
  name: string;
  anonymizedId: string;
  role: CareRole | string;
  status: string;
  lastSeen: string;
  weeklyHours: number;
  hourlyRate?: number;
  homeSector: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  restrictedClientIds: string[];
}

export interface AlertSignal {
  id: string;
  type: string;
  content: string;
  senderName: string;
  timestamp: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  clientName?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingSources?: any[];
}

export type AlertType = 'FALL' | 'BURN' | 'CHOKING' | 'MEDICAL' | 'NOT_SEEN' | 'UNSAFE_FOR_STAFF' | 'BEDSORES' | 'SWELLING' | 'UNABLE_TO_COMPLETE' | 'EMERGENCY' | 'OPERATIONAL' | 'SAFETY' | 'CLINICAL' | 'VACATION' | 'LOA' | 'AVAILABILITY' | 'INSURANCE_Q' | 'RESTRICTION' | 'T4_REQUEST' | 'UNSAFE_ENV' | 'INTEGRITY_AUDIT' | 'SUPPLY_REQ' | 'PAYROLL_DISPUTE' | 'BOOK_OFF' | 'URGENT_BOOK_OFF';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  companyId: string;
  name: string;
  type: 'GROUP' | 'PRIVATE';
  lastMessage: string;
  unreadCount: number;
}

export interface GeneratedImage { url: string; prompt: string; }
export interface BlastStatus { id: string; status: string; }
export interface BillingAlert { id: string; staffName: string; clientName: string; type: string; }
export interface FormRequirement { id: string; name: string; submissionTarget: string; isMandatory: boolean; }
export interface Applicant { id: string; companyId: string; name: string; role: CareRole; credentialsVerified: boolean; referencesChecked: boolean; cultureFitScore: number; status: 'PENDING' | 'INTERVIEW_SET' | 'HIRED' | 'REJECTED'; appliedDate: string; }
export interface Certificate { id: string; companyId: string; staffId: string; staffName: string; type: string; expiryDate: string; status: 'WARNING' | 'EXPIRED' | 'VALID'; }
export interface TrainingRecord { id: string; companyId: string; staffId: string; staffName: string; moduleName: string; isMandatory: boolean; LoveIsCompleted: boolean; isCompleted: boolean; dueDate: string; }
export interface LeaveRequest { id: string; companyId: string; staffId: string; staffName: string; type: string; option1: { start: string; end: string }; option2?: { start: string; end: string }; status: 'PENDING' | 'APPROVED' | 'REJECTED'; timestamp: string; }
export interface Complaint { id: string; companyId: string; clientId: string; clientName: string; staffId: string; staffName: string; content: string; timestamp: string; status: 'NEW' | 'INVESTIGATING' | 'RESOLVED'; priority: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL'; type: string; }
export interface OncallShift { id: string; companyId: string; staffId: string; staffName: string; startTime: string; endTime: string; tier: 'PRIMARY' | 'SECONDARY'; }
export interface RecoveryMilestone { title: string; status: 'ON_TRACK' | 'STAGNANT' | 'DELAYED' | 'ACHIEVED' | 'PENDING' | 'AT_RISK'; }
export interface NexusConsensus { id: string; clientId: string; specialistInputs: any[]; unifiedCareVector: string; criticalSynergyAlert: string | null; consensusScore: number; }
export interface ChairmanMandate { id: string; timestamp: string; stateOfAgency: string; institutionalFragilityPoints: string[]; nonNegotiableDirectives: any[]; strategicRiskIndex: number; marketSentimentGrounded: string; }
export interface IoTAsset { id: string; name: string; type: string; status: string; telemetry: string; repairGroundedInfo: string; location?: string; }
export interface BioTrajectory { clientId: string; recoveryVelocity: number; predictedIndependenceDate: string; stagnationProbability: number; milestones: any[]; clinicalRationale: string; }
export interface EthicsConsult { id: string; timestamp: string; dilemma: string; moralConflict: string; stakeholderPerspectives: any[]; consensusDirective: string; legislativeGuardrail: string; }
export interface TrainingModule { id: string; title: string; targetSkill: string; conceptBrief: string; questions: any[]; masteryTarget: number; }
export interface ProtocolDraft { title: string; objective: string; regulatoryAlignment: string; workflowSteps: any[]; auditChecklist: string[]; }
export interface RecoveryVector { staffId: string; staffName: string; failureType: string; nearestRepairShop: string; rescueEtaMinutes: number; reassignedStaffId: string; reassignedStaffName: string; }
export interface PatientTwinSim { clientId: string; changeDescription: string; predictedStability: number[]; complicationRisk: number; staffWorkloadImpact: number; clinicalAdvisory: string; }
export interface LeakageSignal { type: 'MILEAGE' | 'SUPPLY' | 'HOURS' | 'UPCODING'; confidence: number; estimatedLoss: number; involvedStaff: string; rationale: string; }
export interface TruthMediationCase { clientId: string; divergentSignals: any[]; aiSynthesizedTruth: string; discrepancyProbability: number; safetyPriorityLevel: string; suggestedDirective: string; }
export interface ReclamationCase { id: string; denialCode: string; denialReason: string; evidenceHarvested: string[]; successProbability: number; draftedAppeal: string; status: string; }
export interface RegionalViralPulse { region: string; threatType: string; surgeIntensity: number; sourceUri: string; ppeMandate: string[]; fleetImpactAdvisory: string; }
export interface UserProfile { id: string; companyId: string; role: CareRole; fullName: string; }
export interface AfterActionReview { eventId: string; observedPath: string; optimalPath: string; decisionNodes: any[]; trainingForge: any[]; }
export interface TriageReferral { id: string; patientName: string; source: string; gravityScore: number; clinicalAcuity: string; logisticalFit: number; aiRationale: string; status: string; }
export interface CrisisResource { name: string; type: string; distance: string; uri: string; }
export interface BioSocialSignal { clientId: string; isolationScore: number; nutritionDrift: string; environmentalIntegrity: number; aiSynthesis: string; recommendedSocialIntercept: string; }
export interface NeighborhoodImmunity { postalCode: string; threatType: string; intensity: number; mandateUpdate: string; }
export interface PatientDailySynthesis { headline: string; accomplishments: string[]; visitorToday: string; tomorrowPreview: string; soothingNote: string; }
export interface ZenVideoPrompt { prompt: string; mood: string; estimatedDuration: number; }

/**
 * Additional Federated Interfaces for Neural ERP Nodes
 */
export interface CommunityResource {
  name: string;
  address: string;
  category: string;
  uri: string;
}

export interface ContingencyPlan {
  impactedClients: string[];
  suggestedRescuers: string[];
  etaVariance: number;
}

export interface ClinicalTruthVector {
  clientId: string;
  timestamp: string;
  acuityScore: number;
  fusionLevel: string;
  topDiagnosticSignals: string[];
}

export interface SecurityProbe {
  id: string;
  actorId: string;
  action: string;
  resourcePath: string;
  anomalyScore: number;
  threatLevel: 'NONE' | 'ELEVATED' | 'CRITICAL';
}

export interface ClinicalBoardReview {
  clientId: string;
  timestamp: string;
  caseSummary: string;
  perspectives: any[];
  consensusPlan: string;
}

export interface RevenueGap {
  visitId: string;
  missingProcedure: string;
  estimatedValue: number;
  clinicalEvidence: string;
  billingCodeSuggestion: string;
}

export interface StrategicScenario {
  id: string;
  title: string;
  projection: {
    month: string;
    revenue: number;
    burnRate: number;
    staffRetention: number;
    netReserve: number;
  }[];
  failurePoint: string;
  mitigationStrategy: string;
  riskIndex: number;
}

export interface OutbreakZone {
  postalCode: string;
  threatType: 'FLU' | 'RSV' | 'COVID' | 'NONE' | string;
  severity: 'SAFE' | 'WARNING' | 'CRITICAL';
  intensity: number;
  mandatoryPPE: string[];
  advisory: string;
}

export interface MarketThreat {
  competitor: string;
  wageOffer: string;
  bonus: string;
  sector: string;
}

export interface StaffLoyaltyRisk {
  staffId: string;
  riskLevel: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  vulnerabilityFactors: string[];
  suggestedPremium: number;
  rationale: string;
}

export interface HuddleSignal {
  id: string;
  clientId: string;
  truthSynthesis: string;
  contradictionDetected: boolean;
  biometricDrift: string;
  remediationDirective: string;
  confidence: number;
}

export interface ForensicDossier {
  eventId: string;
  truthVector: string;
  multimodalTimeline: { time: string; source: string; evidence: string; hash: string }[];
  legalDefensibilityScore: number;
  exposureAnalysis: string;
}

export interface DominanceStrategy {
  region: string;
  targetServiceLine: string;
  competitorWeakness: string;
  marketGroundedLogic: string;
  bidConfidence: number;
  draftedValueProposition: string;
}

export interface SyntheticInsight {
  patientId: string;
  globalPeerComparison: string;
  predictedLongTermTrajectory: string;
  scientificCitations: { title: string; uri: string }[];
}

export interface DeviceReading {
  deviceName: string;
  detectedValue: string;
  standardizedMetric: string;
  confidence: number;
  fhirMappedJson: string;
}

export interface RegulatoryPatch {
  id: string;
  newLawReference: string;
  affectedSOPs: string[];
  autoDraftedRevision: string;
  complianceDeadline: string;
}

export interface ClinicalTruthVector {
  clientId: string;
  timestamp: string;
  acuityScore: number;
  fusionLevel: string;
  topDiagnosticSignals: string[];
}
