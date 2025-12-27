import React, { useState, useEffect } from 'react';
import { boardDirectorService } from '../../services/boardDirectorService';
import { ChairmanMandate } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const BoardDirectorTerminal: React.FC<Props> = ({ language }) => {
  const [mandate, setMandate] = useState<ChairmanMandate | null>(null);
  const [loading, setLoading] = useState(true);

  const runAudit = async () => {
    setLoading(true);
    try {
      // Mocked high-level stats for the Board
      const metrics = {
        avgHealth: 92,
        unbilledRevenue: 14200,
        staffTurnover: '12%',
        complianceIndex: 99.8
      };
      const result = await boardDirectorService.synthesizeMandate(metrics, "Toronto");
      setMandate(result);
    } catch (e) {
      alert("Board Consensus Interrupted. Signal drift detected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24 font-serif">
      <div className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Chairman_Command</h2>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mt-3">Board of Directors • Institutional Sovereignty Matrix</p>
        </div>
        <button 
          onClick={runAudit}
          disabled={loading}
          className="px-12 py-5 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 hover:bg-slate-700 transition-all shadow-3xl"
        >
          {loading ? 'INGESTING_REPORTS...' : 'INITIATE_BOARD_AUDIT'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* The Mandate Forge */}
        <div className="lg:col-span-8 bg-[#0a0f1e] border border-white/5 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden flex flex-col min-h-[750px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin shadow-[0_0_50px_rgba(245,158,11,0.2)]"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.8em] animate-pulse">Forging_Chairman_Consensus</p>
             </div>
           ) : mandate && (
             <div className="flex-1 space-y-16 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                
                <section>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">State_Of_The_Agency</p>
                   <p className="text-3xl font-bold text-white leading-tight italic uppercase tracking-tighter">"{mandate.stateOfAgency}"</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Institutional_Fragility_Gaps</p>
                      <div className="space-y-4">
                         {mandate.institutionalFragilityPoints.map((f, i) => (
                           <div key={i} className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                              <p className="text-xs text-slate-300 font-medium italic">"{f}"</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Market_Grounded_Outlook</p>
                      <div className="p-8 bg-sky-600/5 border border-sky-500/10 rounded-[3rem]">
                         <p className="text-[11px] text-slate-200 leading-relaxed font-medium italic italic">"{mandate.marketSentimentGrounded}"</p>
                      </div>
                   </div>
                </div>

                <section className="pt-10 border-t border-white/5">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-10">Non-Negotiable_Directives</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mandate.nonNegotiableDirectives.map((d, i) => (
                        <div key={i} className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl relative group hover:bg-amber-500/10 transition-all">
                           <h4 className="text-xs font-black text-amber-500 uppercase mb-3 italic">{d.title}</h4>
                           <p className="text-[10px] text-white font-bold leading-relaxed mb-4">"{d.action}"</p>
                           <p className="text-[8px] text-slate-600 font-black uppercase">Projected Impact: {d.impact}</p>
                        </div>
                      ))}
                   </div>
                </section>
             </div>
           )}
        </div>

        {/* Global Risk Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-[#1e1b4b] p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                 <span className="text-8xl font-black italic">INDEX</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-12 opacity-60">Strategic_Risk_Index</h3>
              
              <div className="space-y-10 relative z-10">
                 <div className="flex items-baseline space-x-3">
                    <p className={`text-9xl font-black italic tracking-tighter ${mandate && mandate.strategicRiskIndex > 50 ? 'text-rose-500' : 'text-emerald-400'}`}>
                      {mandate?.strategicRiskIndex || '--'}
                    </p>
                    <span className="text-xs font-black opacity-40 uppercase">Exposure_Level</span>
                 </div>
                 
                 <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${mandate && mandate.strategicRiskIndex > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${mandate?.strategicRiskIndex || 0}%` }}
                    />
                 </div>

                 <p className="text-sm font-bold italic leading-relaxed opacity-80">
                   "Neural Board Directive: Capital allocation must pivot toward Sector 4 staff retention immediately to offset competitor poaching surges."
                 </p>

                 <button className="w-full py-5 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                   AUTHORIZE_BOARD_DECREE
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] flex-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Institutional_Vitality_Stats</p>
              <div className="space-y-8">
                 {[
                   { label: 'Agency Solvency', val: 'High', color: 'text-emerald-400' },
                   { label: 'Regulatory Drift', val: 'None', color: 'text-sky-400' },
                   { label: 'Clinical Fidelity', val: '99.8%', color: 'text-white' },
                   { label: 'Expansion ROI', val: '+14.2%', color: 'text-emerald-400' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
              </div>
              
              <div className="mt-16 p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                 <p className="text-[8px] font-black text-amber-500 uppercase mb-4 tracking-widest">Interrogate_Board_Core</p>
                 <div className="relative">
                    <input 
                      placeholder="Query Chairman's Logic..."
                      className="w-full bg-transparent border-none text-xs font-bold text-white italic outline-none"
                    />
                    <button className="absolute right-0 top-0 text-amber-500">→</button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BoardDirectorTerminal;