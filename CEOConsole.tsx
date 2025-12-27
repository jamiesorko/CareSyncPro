import React, { useState, useEffect } from 'react';
import { CareRole, Client, StaffMember } from '../types';
import Translate from '../components/Translate';
import RiskMatrix from './predictive/RiskMatrix';
import WarRoom from './ceo/WarRoom';
import StrategicMap from './ceo/StrategicMap';
import SystemHealthMonitor from './ceo/SystemHealthMonitor';

interface Props {
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const CEOConsole: React.FC<Props> = ({ language, clients, staff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'SEARCH' | 'RISK' | 'WAR_ROOM' | 'GROWTH' | 'RESILIENCE'>('OVERVIEW');
  const [results, setResults] = useState<{ staff: StaffMember[]; clients: Client[] }>({ staff: [], clients: [] });

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults({ staff: [], clients: [] });
      return;
    }
    setResults({
      staff: staff.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase())),
      clients: clients.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()))
    });
  }, [searchTerm, staff, clients]);

  const tabs = [
    { id: 'OVERVIEW', label: 'Strategic Command' },
    { id: 'SEARCH', label: 'Census Search' },
    { id: 'RISK', label: 'Risk Monitor' },
    { id: 'WAR_ROOM', label: 'War Room' },
    { id: 'GROWTH', label: 'Expansion' },
    { id: 'RESILIENCE', label: 'Defense Engine' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Sovereignty</h2>
          <p className="text-sm text-slate-500">Lead Intelligence & Macro-Control Core</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 overflow-x-auto scrollbar-hide shadow-sm">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all ${
                activeView === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Translate targetLanguage={language}>{tab.label}</Translate>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
        {activeView === 'GROWTH' && <StrategicMap language={language} />}
        {activeView === 'RESILIENCE' && <SystemHealthMonitor language={language} />}
        {activeView === 'RISK' && <RiskMatrix clients={clients} language={language} />}
        {activeView === 'WAR_ROOM' && <WarRoom language={language} />}

        {activeView === 'SEARCH' && (
          <div className="space-y-8">
            <div className="relative bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm">
              <input 
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Query Global Roster or Census Matrix..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl py-6 px-10 text-2xl font-semibold text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
              />
              <p className="mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Interrogating encrypted institution nodes...</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Global Personnel Log ({results.staff.length})</h3>
                  <div className="space-y-2">
                     {results.staff.map(s => (
                       <div key={s.id} className="p-4 bg-slate-800 border border-white/5 rounded-xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                          <div>
                             <p className="text-sm font-bold text-white italic">{s.name} <span className="text-[8px] opacity-40">({s.anonymizedId})</span></p>
                             <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">{s.role} • {s.homeSector}</p>
                          </div>
                          <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all px-3 py-1 border border-indigo-400/20 rounded-lg">View Profile</button>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Global Census Matrix ({results.clients.length})</h3>
                  <div className="space-y-2">
                     {results.clients.map(c => (
                       <div key={c.id} className="p-4 bg-slate-800 border border-white/5 rounded-xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                          <div>
                             <p className="text-sm font-bold text-white italic">{c.name} <span className="text-[8px] opacity-40">({c.anonymizedId})</span></p>
                             <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">{c.sector} • {c.conditions[0]}</p>
                          </div>
                          <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all px-3 py-1 border border-indigo-400/20 rounded-lg">Open Dossier</button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeView === 'OVERVIEW' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/5 p-8 rounded-2xl shadow-sm">
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">Neural System Health</p>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-400">Node Synchronization</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase">SYNCHRONIZED</span>
                   </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 rounded-2xl shadow-sm">
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">Compliance Sentinel</p>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-400">Regulatory Drift</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase">NOMINAL</span>
                   </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 rounded-2xl shadow-sm">
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">Institutional Liability</p>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-400">Conflict Score</span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">LOW</span>
                   </div>
                </div>
             </div>
             <SystemHealthMonitor language={language} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CEOConsole;