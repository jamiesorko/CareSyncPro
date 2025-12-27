import React, { useState, useEffect } from 'react';
import { talentSourcingService, TalentThreat } from '../../services/talentSourcingService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const TalentSourcingNode: React.FC<Props> = ({ language }) => {
  const [threats, setThreats] = useState<TalentThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('Toronto');

  const runScan = async () => {
    setLoading(true);
    const results = await talentSourcingService.scanForCompetitorFriction(region);
    setThreats(results);
    setLoading(false);
  };

  useEffect(() => {
    runScan();
  }, [region]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Talent_Sourcing_Node</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Market Poaching & Attrition Intel Engine</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           {['Toronto', 'Mississauga', 'Brampton', 'Vaughan'].map(r => (
             <button 
              key={r}
              onClick={() => setRegion(r)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === r ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white'}`}
             >
               {r}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Attrition Matrix */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-12">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Competitor_Instability_Feed</h3>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Search Grounding</p>
                 <p className="text-lg font-black text-indigo-400 italic">October 2025</p>
              </div>
           </div>

           <div className="flex-1 space-y-6 relative z-10 overflow-y-auto scrollbar-hide pr-2">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-10">
                   <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] animate-pulse">Scraping_Labor_Vectors</p>
                </div>
              ) : threats.length > 0 ? (
                threats.map((t, i) => (
                  <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] group hover:bg-white/5 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{t.competitorName}</h4>
                           <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-2">Signal: {t.attritionSignal}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-3xl font-black text-white italic tracking-tighter">{t.priorityScore}<span className="text-xs text-slate-700 ml-1">TRGT</span></p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Labor_Friction_Points</p>
                           <div className="space-y-2">
                              {t.detectedPainPoints.map((p, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                   <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                                   <p className="text-[11px] text-slate-300 font-medium italic">"{p}"</p>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] flex flex-col justify-between">
                           <div>
                              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Neural_Recruitment_Pivot</p>
                              <p className="text-xs text-slate-200 font-medium leading-relaxed italic">"{t.suggestedMessaging}"</p>
                           </div>
                           <button 
                            onClick={() => alert("SIGNAL_LOCKED: Targeted ad campaign published to regional staff boards.")}
                            className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                           >
                             EXECUTE_CAMPAIGN
                           </button>
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center opacity-30 italic text-sm">No critical labor drift detected in {region}.</div>
              )}
           </div>
        </div>

        {/* Strategic Analysis Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">GROW</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Acquisition_Logic</h3>
              <div className="space-y-8 relative z-10">
                 <p className="text-base font-bold italic leading-relaxed">
                   "Search Grounding identifies 24% increase in staff turnover at major Scarborough agencies. Recommend aggressive recruitment push in Sector 1."
                 </p>
                 <div className="p-6 bg-white/10 rounded-2xl border border-white/10 text-center">
                    <p className="text-[8px] font-black uppercase mb-4 opacity-60">Potential Hiring Delta</p>
                    <p className="text-5xl font-black italic tracking-tighter">+12<span className="text-xs ml-1 opacity-50 font-normal">Staff</span></p>
                 </div>
                 <button 
                  onClick={runScan}
                  className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   RE-SCAN_MARKET_VECTORS
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Regional_Attrition_Log</h3>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Market Sentiment', val: 'Volatile', color: 'text-rose-400' },
                   { label: 'Agency Favorability', val: '94%', color: 'text-emerald-400' },
                   { label: 'Comp. Wage Drift', val: '+2.1%', color: 'text-sky-400' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">HR_Specialist_Note</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Competing agencies in North York are seeing high burnout due to lack of AI documentation support. Highlighting 'Neural Scribe' in ads."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TalentSourcingNode;