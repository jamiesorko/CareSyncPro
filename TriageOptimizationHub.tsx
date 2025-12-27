import React, { useState, useEffect } from 'react';
import { Client, StaffMember, TriageReferral } from '../../types';
import { triageOptimizationService } from '../../services/triageOptimizationService';

interface Props {
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const TriageOptimizationHub: React.FC<Props> = ({ language, clients, staff }) => {
  const [referrals, setReferrals] = useState<TriageReferral[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'WAITLIST' | 'VELOCITY'>('WAITLIST');

  const run = async () => {
    setLoading(true);
    const mockRefs = [{ id: 'ref-1', patientName: 'James Dean', source: 'St. Michaels' }, { id: 'ref-2', patientName: 'Sarah Connor', source: 'Direct' }];
    try {
      const ranked = await triageOptimizationService.rankWaitlist(mockRefs);
      setReferrals(ranked);
      const vel = await triageOptimizationService.predictDischargeVelocity(clients);
      setPredictions(vel);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { run(); }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-500">Triage_Optimization</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Waitlist Gravity & Discharge Velocity</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           <button onClick={() => setActiveView('WAITLIST')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'WAITLIST' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Waitlist</button>
           <button onClick={() => setActiveView('VELOCITY')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'VELOCITY' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Velocity</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Calculating_Gravity</p>
             </div>
           ) : activeView === 'WAITLIST' ? (
             <div className="space-y-4 relative z-10 overflow-y-auto scrollbar-hide pr-2">
                {referrals.map((r, i) => (
                  <div key={r.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Rank #{i+1}</p>
                           <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{r.patientName}</h4>
                           <p className="text-xs font-bold text-emerald-400 uppercase mt-1">{r.source}</p>
                        </div>
                        <p className="text-3xl font-black text-white italic">{r.gravityScore}<span className="text-xs ml-1">GRV</span></p>
                     </div>
                     <p className="text-[11px] text-slate-400 font-medium italic mt-4 leading-relaxed">"{r.aiRationale}"</p>
                  </div>
                ))}
             </div>
           ) : (
             <div className="space-y-4 relative z-10 overflow-y-auto scrollbar-hide pr-2">
                {predictions.map((p, i) => (
                  <div key={p.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group transition-all">
                     <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-black text-white uppercase italic">{clients.find(c => c.id === p.id)?.name}</h4>
                        <span className="text-2xl font-black text-emerald-400 italic">{p.velocity}%</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${p.velocity}%` }}></div>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col group">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Strategic_Growth</h3>
           <div className="space-y-8 relative z-10">
              <div className="flex items-baseline space-x-2">
                 <p className="text-7xl font-black italic tracking-tighter">184</p>
                 <span className="text-xs font-black opacity-50 uppercase">Hours Projected</span>
              </div>
              <p className="text-sm font-bold italic leading-relaxed">Neural Core predicts stabilization for 4 patients in Sector 4 within 72 hours. Recommended to execute intakes immediately.</p>
              <button onClick={() => alert("Admission sequence initiated.")} className="w-full py-5 bg-white text-emerald-600 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">RE-CALCULATE_CAPACITY</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TriageOptimizationHub;