import React, { useState, useEffect } from 'react';
import { capitalGovernorService, CapitalPulse } from '../../services/capitalGovernorService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const CapitalGovernorHUD: React.FC<Props> = ({ language }) => {
  const [pulse, setPulse] = useState<CapitalPulse | null>(null);
  const [loading, setLoading] = useState(true);

  const runFiscalAudit = async () => {
    setLoading(true);
    try {
      const mockMetrics = { reserves: 620000, currentRev: 245000, region: 'Ontario' };
      const data = await capitalGovernorService.forecastStrategicCapital(mockMetrics, "Toronto");
      setPulse(data);
    } catch (e) {
      console.error("Fiscal sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runFiscalAudit(); }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-400">Capital_Governor</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural CFO & Macro-Economic Leverage Matrix</p>
        </div>
        <button 
          onClick={runFiscalAudit}
          disabled={loading}
          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-3xl hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? 'CALCULATING_LEVERAGE...' : 'REFRESH_FISCAL_VECTORS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Capital HUD */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-20 h-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Ingesting_Economic_Grounded_Signals</p>
             </div>
           ) : pulse && (
             <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Fiscal_Runway</p>
                      <p className="text-6xl font-black italic tracking-tighter text-white">{pulse.runwayMonths}<span className="text-xl ml-1 text-slate-700">MO</span></p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Burn_Rate (Weekly)</p>
                      <p className="text-2xl font-black italic text-rose-500">${pulse.burnRateWeekly.toLocaleString()}</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Market Leverage</p>
                      <p className="text-4xl font-black italic text-sky-400">{pulse.marketLeverageScore}%</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {pulse.strategicPivots.map((pivot, i) => (
                     <div key={i} className="p-10 bg-emerald-600/5 border border-emerald-500/20 rounded-[3rem] group hover:bg-emerald-600/10 transition-all">
                        <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">{pivot.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium italic mb-6">"{pivot.rationale}"</p>
                        <div className="flex justify-between items-center">
                           <span className="text-[8px] font-black text-rose-500 uppercase">Risk: {pivot.risk}</span>
                           <button className="text-[8px] font-black text-sky-400 uppercase">Model_Expansion →</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Leverage Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">GROW</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Expansion_Capacity</h3>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-baseline gap-2">
                    <p className="text-6xl font-black italic tracking-tighter">${pulse ? (pulse.expansionCapacity / 1000).toFixed(0) : '--'}k</p>
                    <span className="text-xs font-black opacity-50 uppercase">Deployable_Capital</span>
                 </div>
                 <p className="text-sm font-bold italic leading-relaxed">
                   "Neural CFO recommends restructuring Sector 1 debt to unlock +12% expansion runway for Sector 4 specialized nodes."
                 </p>
                 <button 
                  onClick={() => alert("SIGNAL_LOCKED: Financial directive transmitted to Treasury Node.")}
                  className="w-full py-5 bg-white text-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                 >
                   AUTHORIZE_FINANCING_PIVOT
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">Macro_Grounded_Telemetry</p>
              <div className="space-y-6">
                 {[
                   { label: 'Inflation Offset', val: '+2.4%', color: 'text-rose-400' },
                   { label: 'Funding Sovereignty', val: 'High', color: 'text-emerald-400' },
                   { label: 'Competitor Burn', val: 'Accelerating', color: 'text-sky-400' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
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

export default CapitalGovernorHUD;