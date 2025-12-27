import React, { useState, useEffect } from 'react';
import { Client, StaffMember } from '../../types';
import { fleetVelocityService, VelocitySignal } from '../../services/fleetVelocityService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const VelocityHub: React.FC<Props> = ({ language, clients, staff }) => {
  const [signals, setSignals] = useState<VelocitySignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const s = await fleetVelocityService.computeAcuityDrift(clients);
      setSignals(s);
      setLoading(false);
    };
    init();
  }, [clients]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-sky-400">Velocity_Command</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Agency-Wide Throughput & Longitudinal Stability Telemetry</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="px-6 py-2 text-center">
              <p className="text-[8px] font-black text-slate-500 uppercase">Fleet Velocity</p>
              <p className="text-lg font-black text-emerald-400 italic">94.2%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Velocity Grid */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-16">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Throughput_Matrix</h3>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Confidence</p>
                 <p className="text-lg font-black text-sky-400 italic">GROUNDED</p>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.5em] animate-pulse">Syncing_Recovery_Vectors</p>
             </div>
           ) : (
             <div className="space-y-6 relative z-10 overflow-y-auto scrollbar-hide pr-2">
                {signals.map((s) => (
                  <div key={s.clientId} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                           <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{s.clientName}</h4>
                           <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Target Horizon: {s.predictedReleaseDate}</p>
                        </div>
                        <div className="text-right">
                           <span className={`text-2xl font-black italic tracking-tighter ${s.dischargeVelocity > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                             {s.dischargeVelocity}% Velocity
                           </span>
                        </div>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${s.dischargeVelocity > 70 ? 'bg-sky-500' : 'bg-slate-700'}`} style={{ width: `${s.dischargeVelocity}%` }}></div>
                     </div>
                     <p className="text-[10px] text-slate-400 font-medium italic mt-4 leading-relaxed">"{s.logicRationale}"</p>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Global Operational Directive */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-sky-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-sky-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">WIN</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Fleet_Optimizer_Directive</h3>
              <div className="space-y-8 relative z-10">
                 <p className="text-base font-bold italic leading-relaxed">
                   "Recovery velocity in Sector 4 is exceeding targets by 14%. Neural Core recommends reallocating 2 PSW nodes to high-acuity intakes in Sector 1."
                 </p>
                 <button 
                  onClick={() => alert("SIGNAL_LOCKED: Fleet reallocation published to Autonomous Dispatch.")}
                  className="w-full py-5 bg-white text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   AUTHORIZE_ROSTER_DELTA
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Continuity_Metrics</p>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Avg Graduation Rate', val: '12% / Mo', color: 'text-emerald-400' },
                   { label: 'Clinical Parity', val: '99.4%', color: 'text-sky-400' },
                   { label: 'Stagnation Alerts', val: '2 Active', color: 'text-rose-400' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">COO_Operational_Note</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Cross-referencing recovery velocity with staff retention metrics. High velocity sectors show 22% lower burnout probability."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default VelocityHub;