import React, { useState, useEffect } from 'react';
import { regionalTacticalService, TacticalThreat } from '../../services/regionalTacticalService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const RegionalTacticalHUD: React.FC<Props> = ({ language }) => {
  const [threats, setThreats] = useState<TacticalThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('Toronto');

  const runTacticalScan = async () => {
    setLoading(true);
    try {
      const results = await regionalTacticalService.scanRegionalThreats(region);
      setThreats(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runTacticalScan(); }, [region]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-rose-500">Regional_Tactical_Map</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Grounded Logistics Impedance & Fleet Safety Intercept</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           {['Toronto', 'Hamilton', 'Ottawa'].map(r => (
             <button 
              key={r}
              onClick={() => setRegion(r)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${region === r ? 'bg-rose-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}
             >
               {r}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Map Visualization Placeholder */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">
           <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-79.3832,43.6532,11,0/1200x800?access_token=pk.dummy')] bg-cover opacity-20 pointer-events-none"></div>
           <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
              {[...Array(144)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
           </div>
           
           <div className="relative z-10 p-12 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10">Sector_Visual_Intercept</h3>
              
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                   <div className="w-16 h-16 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Intercepting_Grounded_Signals</p>
                </div>
              ) : (
                <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide pr-2">
                   {threats.map((t, i) => (
                     <div key={i} className={`p-10 rounded-[3rem] border transition-all animate-in slide-in-from-left-8 duration-700 ${t.severity === 'CRITICAL' ? 'bg-rose-600/20 border-rose-500' : 'bg-slate-900 border-white/10'}`}>
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <span className={`px-3 py-1 rounded text-[8px] font-black uppercase ${t.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-600'} text-white`}>{t.severity}_ALERT</span>
                              <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase mt-4 leading-none">{t.type} Hazard</h4>
                           </div>
                           <div className="text-right">
                              <p className="text-5xl font-black italic text-white tracking-tighter">{t.impactedStaffCount}</p>
                              <p className="text-[7px] font-bold text-slate-500 uppercase">Staff Nodes Impacted</p>
                           </div>
                        </div>
                        <p className="text-lg font-bold text-slate-300 italic mb-10 leading-relaxed">"{t.description}"</p>
                        <div className="p-8 bg-black/40 border border-white/10 rounded-3xl">
                           <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4">Tactical_Directive</p>
                           <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-relaxed">"{t.tacticalDirective}"</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Global Dispatch Controls */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-rose-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic uppercase">STOP</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Force_Protection_Alert</h3>
              <div className="space-y-8 relative z-10 flex-1">
                 <p className="text-sm font-bold italic leading-relaxed">
                   "Neural Dispatch identifies significant transit impedance in Sector 1. Initiating autonomous visit buffering: +15m added to all arrival windows."
                 </p>
                 <button 
                  onClick={() => alert("SIGNAL_LOCKED: Roster buffers adjusted. Families notified via SMS.")}
                  className="w-full py-5 bg-white text-rose-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   AUTHORIZE_FLEET_BUFFER
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col shadow-3xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Dispatch_Pulse_Log</p>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Dispatch Precision', val: '99.8%', color: 'text-emerald-400' },
                   { label: 'Route Efficiency', val: '+12.4%', color: 'text-sky-400' },
                   { label: 'Asset Sovereignty', val: 'Secured', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">Logistician_Insight</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Cross-referencing transit drift with staff fuel usage. Detected 8% higher burn in Sector 4. Adjusting mileage reimbursement node for Oct-Cycle."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RegionalTacticalHUD;