
import React, { useState, useEffect } from 'react';
import { AppTab, CareRole, Company } from '../types';
import Translate from './Translate';
import CommandIntercept from '../features/command/CommandIntercept';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  activeRole: CareRole;
  setActiveRole: (role: CareRole) => void;
  staffName: string;
  language: string;
  company: Company;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  activeTab, setActiveTab, 
  activeRole, setActiveRole, 
  staffName, language, 
  company, onLogout, 
  children 
}) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const roles = Object.values(CareRole);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getRoleColor = (role: CareRole) => {
    switch(role) {
      case CareRole.CEO: return 'text-amber-500';
      case CareRole.COO: return 'text-cyan-500';
      case CareRole.DOC: return 'text-rose-500';
      case CareRole.RN: 
      case CareRole.RPN: return 'text-indigo-500';
      case CareRole.CLIENT:
      case CareRole.FAMILY: return 'text-emerald-500';
      default: return 'text-slate-400';
    }
  };

  const tabs = Object.values(AppTab);
  const filteredTabs = tabs.filter(tab => {
    if (activeRole === CareRole.CEO) return true;
    if (tab === AppTab.COMPANY_SETTINGS) return false;
    if (!company.activeModules?.includes(tab)) return false;
    if ([AppTab.DASHBOARD, AppTab.MESSAGES].includes(tab)) return true;

    switch (activeRole) {
      case CareRole.CLIENT:
        return [AppTab.CLIENT_CARE, AppTab.VAULT].includes(tab);
      case CareRole.FAMILY:
        return [AppTab.FAMILY_PORTAL, AppTab.VAULT].includes(tab);
      case CareRole.PSW:
      case CareRole.HSS:
        return [AppTab.SCHEDULE, AppTab.CARE_HUB, AppTab.VAULT, AppTab.GUARDIAN_SENTINEL, AppTab.TRAINING_FORGE].includes(tab);
      case CareRole.RPN:
      case CareRole.RN:
        return [AppTab.SCHEDULE, AppTab.CARE_HUB, AppTab.VAULT, AppTab.CLINICAL_COMMAND, AppTab.CARE_PLANNER, AppTab.VIRTUAL_STATION, AppTab.GUARDIAN_SENTINEL].includes(tab);
      case CareRole.DOC:
        return [AppTab.SCHEDULE, AppTab.CARE_HUB, AppTab.VAULT, AppTab.CLINICAL_COMMAND, AppTab.DOC_SUPERVISION, AppTab.REGULATORY_SENTINEL, AppTab.TRUTH_MEDIATION].includes(tab);
      case CareRole.COORDINATOR:
        return [AppTab.SCHEDULE, AppTab.COORDINATION, AppTab.ADMIN_INTAKE, AppTab.VAULT].includes(tab);
      case CareRole.ACCOUNTANT:
        return [AppTab.ACCOUNTING, AppTab.VAULT, AppTab.REVENUE_RECLAMATION].includes(tab);
      default:
        return [AppTab.DASHBOARD].includes(tab);
    }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      {isCommandOpen && (
        <CommandIntercept 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onClose={() => setIsCommandOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="font-bold text-white tracking-tighter">CP</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              CareSync <span className="text-indigo-400">Pro</span>
            </h1>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Persona Profile</p>
            <select 
              value={activeRole}
              onChange={(e) => {
                const newRole = e.target.value as CareRole;
                setActiveRole(newRole);
                if (newRole === CareRole.CLIENT) setActiveTab(AppTab.CLIENT_CARE);
                else if (newRole === CareRole.FAMILY) setActiveTab(AppTab.FAMILY_PORTAL);
                else setActiveTab(AppTab.DASHBOARD);
              }}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-slate-200 outline-none cursor-pointer"
            >
              {roles.map(role => (
                <option key={role} value={role} className="bg-slate-900">{role}</option>
              ))}
            </select>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {filteredTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center group ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-4 transition-all ${isActive ? 'bg-indigo-500 scale-100' : 'bg-transparent scale-0'}`}></div>
                <Translate targetLanguage={language}>{tab}</Translate>
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 bg-slate-900/50">
           <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-400">
                {staffName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-white truncate">{staffName}</p>
                <p className={`text-[10px] font-medium uppercase tracking-tight truncate ${getRoleColor(activeRole)}`}>{activeRole}</p>
              </div>
           </div>
           <button onClick={onLogout} className="w-full py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-500/20">
              Sign Out Terminal
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 z-20">
            <div className="flex items-center space-x-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
                    {activeTab}
                </h2>
                <button 
                  onClick={() => setIsCommandOpen(true)}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 uppercase hover:text-sky-400 transition-all"
                >
                  ⌘ K
                </button>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node_Active</span>
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
