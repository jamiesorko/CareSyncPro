
import React, { useState } from 'react';
import { CareRole, Client, StaffMember } from '../types';
import Translate from '../components/Translate';

interface Props {
  staffName: string;
  role: CareRole;
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const Dashboard: React.FC<Props> = ({ staffName, role, language, clients, staff }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const isExecutive = [CareRole.CEO, CareRole.COO, CareRole.DOC].includes(role);

  const MetricCard = ({ label, value, color }: any) => (
    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
        <Translate targetLanguage={language}>{label}</Translate>
      </p>
      <h3 className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</h3>
    </div>
  );

  if (isExecutive) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Command_Matrix</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Institutional Telemetry Hub</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Agency Health" value="98.4%" color="text-indigo-400" />
          <MetricCard label="Active Census" value={clients.length} color="text-sky-400" />
          <MetricCard label="Clinical Risk" value="STABLE" color="text-emerald-400" />
          <MetricCard label="Recovery ROI" value="14.2%" color="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-white/5 rounded-[4rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <span className="text-9xl font-black italic">ACTIVE</span>
        </div>
        
        <div className="relative z-10 space-y-10">
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.4em] mb-4">Live Deployment</p>
            <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              {clients[0]?.name || 'Standby'}
            </h3>
            <p className="text-slate-400 text-lg font-medium mt-2">{clients[0]?.address || 'Awaiting dispatch'}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <button 
              onClick={() => setClockedIn(!clockedIn)}
              className={`px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${
                clockedIn ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
              }`}
            >
              {clockedIn ? 'Terminate Shift Session' : 'Initialize Patient Sync'}
            </button>
            {clockedIn && (
              <div className="px-8 py-5 bg-white/5 rounded-[2rem] border border-white/10 flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-2xl font-mono font-black text-white tracking-tighter">00:42:15</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
