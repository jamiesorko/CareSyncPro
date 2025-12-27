
import React, { useState } from 'react';
import { CareRole, AppTab, Company } from './types';
import Layout from './components/Layout';
import Dashboard from './features/Dashboard';
import Login from './features/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; role: CareRole } | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  if (!user || !company) {
    return <Login onLogin={(role: CareRole, name: string, comp: Company) => {
      setUser({ name, role });
      setCompany(comp);
    }} />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard staffName={user.name} role={user.role} clients={[]} staff={[]} language="English" />;
      default:
        return <div className="p-20 text-center opacity-30 text-xl font-black uppercase italic tracking-widest">Sector_Under_Maintenance</div>;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      activeRole={user.role}
      setActiveRole={(role: CareRole) => setUser({ ...user, role })}
      staffName={user.name}
      language="English"
      company={company}
      onLogout={() => { setUser(null); setCompany(null); }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
