
import React, { useState, useCallback } from 'react';
import { AppTab, CareRole, Company, Client, StaffMember, AlertSignal, AlertType } from './types';
import Layout from './components/Layout';
import Dashboard from './features/Dashboard';
import Login from './features/Login';
import StrategicAuthorityHub from './features/ceo/StrategicAuthorityHub';
import ResilienceEngine from './features/admin/ResilienceEngine';
import CompanySettings from './features/admin/CompanySettings';
import CoordinationHub from './features/CoordinationHub';
import IncidentCommandFeed from './features/clinical/IncidentCommandFeed';
import RNCommandCenter from './features/rn/RNCommandCenter';
import CareArchitect from './features/clinical/CareArchitect';
import DOCSupervision from './features/doc/DOCSupervision';
import OperationsMatrix from './features/coo/OperationsMatrix';
import AccountingHub from './features/accounting/AccountingHub';
import DocumentVault from './features/DocumentVault';
import HRPortal from './features/HRPortal';
import ClientPortal from './features/ClientPortal';
import FamilyPortal from './features/family/FamilyPortal';
import ScheduleView from './features/ScheduleView';
import CareReport from './features/CareReport';
import IncidentInterceptHUD from './features/command/IncidentInterceptHUD';
import { MOCK_CLIENTS, MOCK_STAFF } from './data/careData';
import { incidentService } from './services/incidentService';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string, role: CareRole, id: string } | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [alerts, setAlerts] = useState<AlertSignal[]>([]);
  const [activeIntercept, setActiveIntercept] = useState<AlertSignal | null>(null);

  const handleIncident = useCallback(async (clientId: string, type: AlertType, content: string) => {
    if (company) incidentService.setContext(company.id);
    const newSignal = await incidentService.routeSignal(clientId, type, content, user?.name || "Field_Operative");
    const client = clients.find(c => c.id === clientId);
    const hydratedSignal = { ...newSignal, clientName: client?.name || "Global_System" };
    
    setAlerts(prev => [hydratedSignal, ...prev]);
    
    // Global Crisis Intercept Protocol
    const isCrisis = ['FALL', 'CHOKING', 'MEDICAL', 'UNSAFE_ENV'].includes(type);
    const isSupervisor = [CareRole.DOC, CareRole.COO, CareRole.RN, CareRole.CEO].includes(user?.role as CareRole);
    
    if (isCrisis && isSupervisor) {
      setActiveIntercept(hydratedSignal);
    }
  }, [user, clients, company]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    if (activeIntercept?.id === id) setActiveIntercept(null);
  };

  if (!user || !company) {
    return <Login onLogin={(role, name, comp) => {
      setUser({ name, role, id: 'u1' });
      setCompany(comp);
    }} />;
  }

  const renderTabContent = () => {
    const commonProps = { language: 'English' };

    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard staffName={user.name} role={user.role} clients={clients} staff={staff} billingAlerts={[]} {...commonProps} />;
      case AppTab.STRATEGIC_AUTHORITY:
        return <StrategicAuthorityHub clients={clients} staff={staff} {...commonProps} />;
      case AppTab.RESILIENCE:
        return <ResilienceEngine {...commonProps} />;
      case AppTab.ORG_COMMAND:
        return <CompanySettings company={company} setCompany={setCompany} {...commonProps} />;
      case AppTab.SCHEDULE:
        return <ScheduleView 
          role={user.role} 
          clients={clients} 
          language="English" 
          onVisitSignal={(id, type) => console.log(`Visit ${type} for ${id}`)}
          onMissedClock={(s, c) => handleIncident('system', 'NOT_SEEN', `Missed clock-in for ${c} by ${s}`)}
          onAlert={handleIncident}
        />;
      case AppTab.FIELD_OPS:
      case AppTab.COORDINATION:
        return <CoordinationHub blasts={{}} setBlasts={() => {}} {...commonProps} />;
      case AppTab.INCIDENT_REPORTS:
        return <IncidentCommandFeed signals={alerts} onAcknowledge={acknowledgeAlert} {...commonProps} />;
      case AppTab.NURSING_COMMAND:
        return <RNCommandCenter alerts={alerts} setAlerts={setAlerts} {...commonProps} />;
      case AppTab.CARE_ARCHITECT:
        return <CareArchitect {...commonProps} />;
      case AppTab.DOC_SUPERVISION:
        return <DOCSupervision {...commonProps} />;
      case AppTab.OPERATIONS_MATRIX:
        return <OperationsMatrix {...commonProps} />;
      case AppTab.ACCOUNTING:
        return <AccountingHub language="English" alerts={[]} setAlerts={() => {}} clients={clients} />;
      case AppTab.VAULT:
        return <DocumentVault role={user.role} {...commonProps} />;
      case AppTab.HIRING:
        return <HRPortal role={user.role} {...commonProps} />;
      case AppTab.CLIENT_CARE:
        return <ClientPortal {...commonProps} />;
      case AppTab.FAMILY_PORTAL:
        return <FamilyPortal clients={clients} {...commonProps} />;
      case AppTab.CARE_HUB:
        return <CareReport role={user.role} clients={clients} {...commonProps} />;
      default:
        return <Dashboard staffName={user.name} role={user.role} clients={clients} staff={staff} billingAlerts={[]} {...commonProps} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      activeRole={user.role}
      setActiveRole={(role) => setUser({ ...user, role })}
      staffName={user.name}
      language="English"
      company={company}
      onLogout={() => { setUser(null); setCompany(null); }}
    >
      {activeIntercept && (
        <IncidentInterceptHUD 
          client={clients.find(c => c.name === activeIntercept.clientName) || clients[0]} 
          staff={staff} 
          onClose={() => setActiveIntercept(null)} 
          language="English" 
        />
      )}
      {renderTabContent()}
    </Layout>
  );
};

export default App;
