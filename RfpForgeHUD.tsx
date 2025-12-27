import React, { useState, useEffect } from 'react';
import { rfpForgeService, RFPOpportunity } from '../../services/rfpForgeService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const RfpForgeHUD: React.FC<Props> = ({ language }) => {
  const [opps, setOpps] = useState<RFPOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState<RFPOpportunity | null>(null);

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const data = await rfpForgeService.scanProcurementSignals("Toronto");
      setOpps(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOpps(); }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24 h-[700px] overflow-hidden flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-amber-500">RFP_Forge</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Procurement & Strategic Growth Intercept</p>
        </div>
        <button 
          onClick={fetchOpps}
          className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          {loading ? 'SCRAPING_GAZETTES...' : 'SYNC_PROCUREMENT_FEED'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-0">
        <div className="lg:col-span-5 bg-slate-900 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col">
           <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-10 italic">Inbound_Contract_Signals</h3>
           
           <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                   <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Probing_Government_Gateways</p>
                </div>
              ) : opps.map((o, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedOpp(o)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer ${selectedOpp?.title === o.title ? 'bg-amber-600/10 border-amber-500/50 shadow-xl' : 'bg-white/[0.03] border-white/5 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-black text-white uppercase italic leading-tight max-w-[70%]">{o.title}</h4>
                    <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase">NEW</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{o.source} • Due: {o.deadline}</p>
                    <span className="text-xs">→</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {selectedOpp ? (
             <div className="flex-1 flex flex-col relative z-10 animate-in zoom-in duration-700">
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedOpp.title}</h3>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-4">Estimated Value: {selectedOpp.valueRange}</p>
                   </div>
                </div>

                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl mb-12">
                   <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-6 italic">Neural_Strategic_Pivot</p>
                   <p className="text-sm text-slate-300 font-medium italic leading-relaxed">"{selectedOpp.strategicPivot}"</p>
                </div>

                <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden flex flex-col group">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <span className="text-8xl font-black italic text-white uppercase">BID</span>
                   </div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">Grounded_Value_Proposition</h4>
                   <div className="flex-1 overflow-y-auto scrollbar-hide text-base text-slate-200 leading-relaxed font-medium italic">
                      "{selectedOpp.draftValueProp}"
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button className="flex-[2] py-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] transition-all">AUTHORIZE_PROPOSAL_FORGE</button>
                   <button className="flex-1 py-6 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Audit_Guidelines</button>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic">
                <span className="text-9xl mb-8">📈</span>
                <p className="text-xl font-black uppercase tracking-widest">Select Opportunity</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RfpForgeHUD;