import React, { useState, useEffect } from 'react';
    import { Client, StaffMember } from '../../types';
    import { fleetVelocityService, VelocitySignal, ReallocationProposal } from '../../services/fleetVelocityService';
    import Translate from '../../components/Translate';

interface Props {
  clients: Client[];
  staff: StaffMember[];
  language: string;
}

const VelocityCommand: React.FC<Props> = ({ clients, staff, language }) => {
  const [signals, setSignals] = useState<VelocitySignal[]>([]);
  const [proposals, setProposals] = useState<ReallocationProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const s = await fleetVelocityService.computeAcuityDrift(clients);
      setSignals(s);
      const p = await fleetVelocityService.generateReallocations(staff, s);
      setProposals(p);
      setLoading(false);
    };
    init();
  }, [clients, staff]);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-6">
       <div className="w-12 h-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Synchronizing_Trajectory_Vectors</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Trajectory Grid */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <span className="text-8xl font-black italic text-white uppercase">Discharge</span>
              </div>
              
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10 relative z-10">Discharge_Velocity_Matrix</h3>
              
              <div className="space-y-6 relative z-10">
                 {signals.map(s => (
                   <div key={s.clientId} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                      <div className="flex justify-between items-center mb-6">
                         <div>
                            <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{s.clientName}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-2">Target: {s.predictedReleaseDate}</p>
                         </div>
                         <div className="text-right">
                            <span className={`text-2xl font-black italic tracking-tighter ${s.stabilityScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {s.stabilityScore}% Stable
                            </span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Discharge_Velocity</p>
                            <p className="text-[10px] font-black text-white">{s.dischargeVelocity}%</p>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${s.dischargeVelocity > 70 ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-slate-700'}`}
                              style={{ width: `${s.dischargeVelocity}%` }}
                            ></div>
                         </div>
                         <p className="text-[10px] text-slate-400 font-medium italic mt-4 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                            "{s.logicRationale}"
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Autonomous Router */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-sky-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-sky-600/30 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-10 opacity-60">AI_Router_Synthesis</h3>
              
              <div className="space-y-8">
                 {proposals.map(p => (
                   <div key={p.id} className="space-y-6">
                      <div>
                         <p className="text-xl font-black italic tracking-tighter uppercase mb-2">Reallocate: {p.staffName}</p>
                         <p className="text-[10px] font-bold opacity-60 uppercase">Projected Efficiency Gain: <span className="text-white">+{p.efficiencyGain}%</span></p>
                      </div>
                      
                      <div className="p-6 bg-white/10 border border-white/10 rounded-2xl">
                         <p className="text-xs font-medium italic leading-relaxed">
                           "{p.logicRationale}"
                         </p>
                      </div>

                      <button 
                        onClick={() => alert("SIGNAL_PUBLISHED: Fleet reassignment authorized. Staff notification dispatched.")}
                        className="w-full py-5 bg-white text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        Authorize_Router_Logic
                      </button>
                   </div>
                 ))}

                 {proposals.length === 0 && (
                   <p className="text-sm text-sky-100 italic opacity-50 text-center py-10">No reallocation vectors identified within safety thresholds.</p>
                 )}
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Personnel_Energy_Pulse</p>
              <div className="space-y-4">
                 {[
                   { label: 'Fleet Fatigue', val: 'Low', color: 'text-emerald-400' },
                   { label: 'Dispatch Precision', val: '99.2%', color: 'text-sky-400' },
                   { label: 'Trajectory Confidence', val: 'High', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default VelocityCommand;