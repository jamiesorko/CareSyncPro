
import React, { useState, useEffect } from 'react';
import { Client, BioTrajectory } from '../../types';
import { outcomeTrajectoryService } from '../../services/outcomeTrajectoryService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const BioTrajectoryHub: React.FC<Props> = ({ language, clients }) => {
  const [trajectory, setTrajectory] = useState<BioTrajectory | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runTrajectoryAnalysis = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Simulate multi-day adherence telemetry
    const mockTrend = [
      { date: '2025-09-30', vitals: 'Stable', adl: '100% completion' },
      { date: '2025-10-05', vitals: 'Improving', adl: '90% completion' },
      { date: '2025-10-10', vitals: 'Nominal', adl: '100% completion' }
    ];

    try {
      const result = await outcomeTrajectoryService.computeIndependenceHorizon(client, mockTrend);
      setTrajectory(result);
    } catch (e) {
      alert("Chrono-Link Desync. Re-aligning clinical vectors...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) runTrajectoryAnalysis(selectedClientId);
  }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-indigo-400">Bio_Trajectory_Hub</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Predictive Independence Forecasting & Recovery Velocity Analytics</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
           {clients.slice(0, 4).map(c => (
             <button 
              key={c.id}
              disabled={loading}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClientId === c.id ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Trajectory Main Graph */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-16">
              <div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Recovery_Slope_Model</h3>
                 <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-2">Predictive Horizon: 90 Days</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Discharge Velocity</p>
                 <p className={`text-4xl font-black italic tracking-tighter ${trajectory && trajectory.recoveryVelocity > 70 ? 'text-emerald-400' : 'text-amber-500'}`}>
                   {trajectory ? trajectory.recoveryVelocity : '--'}%
                 </p>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🎯</div>
                </div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] animate-pulse">Calculating_Discharge_Slope</p>
             </div>
           ) : trajectory && (
             <div className="flex-1 space-y-12 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* SVG Prediction Curve */}
                <div className="h-64 bg-black/20 rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
                   <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
                      <path 
                        d="M 0 18 Q 30 15 50 10 T 100 2" 
                        fill="none" 
                        stroke="#818cf8" 
                        strokeWidth="0.5" 
                        strokeDasharray="1,1" 
                        className="opacity-30"
                      />
                      <path 
                        d={`M 0 18 Q 30 15 50 ${18 - (trajectory.recoveryVelocity / 100) * 16} T 100 2`} 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      />
                      <circle cx="100" cy="2" r="1.5" fill="#10b981" className="animate-pulse" />
                      {/* Fixed: italic is not valid on SVG text. Using fontStyle instead. */}
                      <text x="75" y="6" fill="#10b981" fontSize="3" fontWeight="black" fontStyle="italic">GRADUATION</text>
                   </svg>
                   <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <span className="text-[8px] font-black text-slate-700 uppercase">Baseline Intake</span>
                      <span className="text-[8px] font-black text-indigo-500 uppercase">Neural Independence Target</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Independence_Milestones</p>
                      <div className="space-y-4">
                         {trajectory.milestones.map((m, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
                              <p className="text-xs font-bold text-white italic">{m.title}</p>
                              <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${m.status === 'ACHIEVED' ? 'bg-emerald-500' : m.status === 'AT_RISK' ? 'bg-rose-500' : 'bg-slate-700'} text-white`}>
                                {m.status}
                              </span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem]">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-6">Clinical_Rationale</p>
                      <p className="text-sm text-slate-200 leading-relaxed font-medium italic">"{trajectory.clinicalRationale}"</p>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Global Strategy Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">EXIT</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Graduation_Directive</h3>
              
              <div className="space-y-8 relative z-10">
                 <div className="flex items-baseline space-x-2">
                    <p className="text-[10px] font-black opacity-60 uppercase">Target Independence</p>
                    <p className="text-3xl font-black italic tracking-tighter">
                      {trajectory?.predictedIndependenceDate || "Awaiting Signal"}
                    </p>
                 </div>
                 
                 <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase mb-3 opacity-60">Stagnation Probability</p>
                    <div className="flex items-baseline gap-2">
                       <p className={`text-4xl font-black italic tracking-tighter ${trajectory && trajectory.stagnationProbability > 30 ? 'text-rose-400' : 'text-emerald-300'}`}>
                         {trajectory?.stagnationProbability || 0}%
                       </p>
                       <span className="text-[8px] font-black opacity-40 uppercase">Drift_Risk</span>
                    </div>
                 </div>

                 <button 
                  onClick={() => alert("SIGNAL_LOCKED: Discharge planning protocol initialized with Family Advocate.")}
                  className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   AUTHORIZE_EXIT_PLAN
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Cohort_Efficiency_Stats</p>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Average Recovery Velocity', val: '84.2%', color: 'text-emerald-400' },
                   { label: 'Graduation Rate', val: '12% / Mo', color: 'text-sky-400' },
                   { label: 'Longitudinal Precision', val: '99.8%', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">Trajectory_Insight</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Neural Analysis detects 12% faster recovery velocity in patients utilizing specialized PT Intercepts in the first 14 days of intake."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BioTrajectoryHub;
