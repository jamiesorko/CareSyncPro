
import React, { useState, useMemo } from 'react';
import { CareRole, Client, StaffMember, BillingAlert } from '../types';
import Translate from '../components/Translate';
import CEOFinancials from './ceo/CEOFinancials';
import { analyticsService } from '../services/analyticsService';

interface DashboardProps {
  staffName: string;
  role: CareRole;
  language: string;
  clients: Client[];
  staff: StaffMember[];
  billingAlerts: BillingAlert[];
}

const Dashboard: React.FC<DashboardProps> = ({ staffName, role, language, clients, staff }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const stats = useMemo(() => analyticsService.computeAgencyHealth(clients, staff), [clients, staff]);

  const MetricCard = ({ label, value, trend, trendUp, color, hint }: any) => (
    <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm hover:border-white/10 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <Translate targetLanguage={language}>{label}</Translate>
        </p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend}
        </span>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className={`text-3xl font-bold tracking-tight ${color || 'text-white'}`}>{value}</h3>
      </div>
      <p className="text-[8px] font-black text-slate-700 uppercase opacity-0 group-hover:opacity-100 transition-opacity">{hint}</p>
    </div>
  );

  const isExecutive = [CareRole.CEO, CareRole.COO, CareRole.DOC].includes(role);

  if (isExecutive) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Strategic_Operational_Command</h2>
                <p className="text-sm text-slate-500 mt-2">Executive Telemetry & Institutional Grade Summary</p>
            </div>
            <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl flex items-center space-x-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Pulse</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Agency Health" value={`${stats.healthScore.toFixed(0)}%`} trend="+1.2%" trendUp={true} color="text-indigo-400" hint="Total Operational Sovereignty Score" />
          <MetricCard label="Active Census" value={clients.length} trend="Nominal" trendUp={true} color="text-sky-400" hint="Total Patients Managed" />
          <MetricCard label="Clinical Risk" value={stats.riskVelocity} trend="Stable" trendUp={true} color={stats.riskVelocity === 'CRITICAL' ? 'text-rose-500' : 'text-emerald-400'} hint="Predictive Acuity Drift Index" />
          <MetricCard label="Compliance Rate" value={`${stats.compliancePercentage}%`} trend="Audit Ready" trendUp={true} color="text-white" hint="Regulatory Buffer Integrity" />
        </div>
        
        <div className="mt-12">
            <CEOFinancials language={language} currentStats={{ ...stats, ar: 142500 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <span className="text-9xl font-bold tracking-tighter italic">ACTIVE</span>
        </div>
        
        <div className="relative z-10 space-y-8">
            <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3">Live Roster Deployment</p>
                {clients[0] ? (
                    <div className="space-y-2">
                        <h3 className="text-5xl font-extrabold text-white tracking-tight">{clients[0].name}</h3>
                        <p className="text-slate-400 text-lg font-medium">{clients[0].address}</p>
                    </div>
                ) : (
                    <h3 className="text-4xl font-bold text-slate-600">No active assignment</h3>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <button 
                    disabled={!clients[0]}
                    onClick={() => setClockedIn(!clockedIn)}
                    className={`px-12 py-4 rounded-2xl font-bold text-sm tracking-tight transition-all shadow-xl ${
                        !clients[0] ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                        clockedIn ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
                    }`}
                >
                    {clockedIn ? 'Terminate Shift Session' : 'Initialize Patient Sync'}
                </button>
                {clockedIn && (
                    <div className="flex items-center space-x-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Timer</span>
                        <span className="text-2xl font-mono font-bold text-indigo-400 tracking-tighter">00:42:15</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
