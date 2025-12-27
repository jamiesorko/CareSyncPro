import React, { useState } from 'react';
import { marketDominanceService } from '../../services/marketDominanceService';
import { DominanceStrategy } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const MarketDominanceHub: React.FC<Props> = ({ language }) => {
  const [strategy, setStrategy] = useState<DominanceStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('Toronto East');
  const [service, setService] = useState('Complex Wound Care');

  const runDominanceScan = async () => {
    setLoading(true);
    try {
      const result = await marketDominanceService.forgeDominanceStrategy(region, service);
      setStrategy(result);
    } catch (e) {
      alert("Neural Intelligence Bottleneck. Scaling up sector search...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-amber-500">Market_Dominance_Hub</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Grounded Competitive Intelligence & Strategic Bid Forge</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           <button 
            disabled={loading}
            onClick={runDominanceScan}
            className="px-10 py-4 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all"
           >
             {loading ? 'CALCULATING_DOMINANCE...' : 'FORGE_MARKET_STRATEGY'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Strategy Control */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-10 italic">Target_Vector_Input</h3>
              <div className="space-y-8">
                 <div>
                    <label className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Expansion_Region</label>
                    <input 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all italic"
                    />
                 </div>
                 <div>
                    <label className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Specialized_Service_Pivot</label>
                    <input 
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all italic"
                    />
                 </div>
                 <div className="p-6 bg-amber-600/5 border border-amber-600/10 rounded-2xl">
                    <p className="text-[10px] text-amber-500 font-bold leading-relaxed italic">
                      "Engine uses Gemini 3 Pro + Search to scan local job boards, patient waitlists, and public provider reviews in real-time."
                    </p>
                 </div>
              </div>
           </div>

           {strategy && (
             <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 animate-in slide-in-from-left-4">
                <p className="text-[9px] font-black uppercase tracking-widest mb-6 opacity-60">Bid_Confidence_Score</p>
                <div className="flex items-baseline gap-2 mb-10">
                   <p className="text-8xl font-black italic tracking-tighter">{strategy.bidConfidence}%</p>
                </div>
                <div className="p-5 bg-black/10 border border-white/10 rounded-2xl">
                   <p className="text-[8px] font-black uppercase mb-3 opacity-60">Sector_Status</p>
                   <p className="text-xs font-bold leading-relaxed italic">"Market signal indicates 12% undersupply in high-acuity nodes. Advantage: CareSync Pro."</p>
                </div>
             </div>
           )}
        </div>

        {/* Intelligence Matrix */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {!strategy && !loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <span className="text-9xl mb-8">🏆</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Awaiting Acquisition Signal</h3>
                <p className="text-sm font-bold text-slate-500 mt-4 max-w-sm">The Dominance Hub identifies competitive attack surfaces using grounded legislative and market data.</p>
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin shadow-[0_0_50px_rgba(245,158,11,0.2)]"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em] animate-pulse">Scanning_Global_Competitor_Landscape</p>
             </div>
           ) : strategy && (
             <div className="flex-1 flex flex-col relative z-10 animate-in zoom-in duration-700">
                <div className="flex justify-between items-start mb-16">
                   <div>
                      <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Attack_Surface: {strategy.region}</h3>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-4 italic">Dominance Directive Active</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Competitive Density</p>
                      <p className="text-lg font-black text-white italic">LOW</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                   <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] group">
                      <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-6 italic">Competitor_Failure_Vector</p>
                      <p className="text-xl font-bold text-white leading-relaxed italic uppercase">"{strategy.competitorWeakness}"</p>
                   </div>
                   <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem]">
                      <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-6 italic">Grounded_Market_Logic</p>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"{strategy.marketGroundedLogic}"</p>
                   </div>
                </div>

                <div className="flex-1 bg-white/5 border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <span className="text-9xl font-black italic text-white uppercase">BID</span>
                   </div>
                   <div className="flex items-center space-x-3 mb-8">
                      <div className="w-1.5 h-10 bg-amber-500 rounded-full"></div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">Draft_Value_Proposition</h4>
                   </div>
                   <div className="flex-1 bg-black/40 border border-white/5 rounded-3xl p-8 overflow-y-auto scrollbar-hide">
                      <p className="text-base text-slate-200 leading-relaxed font-medium italic">"{strategy.draftedValueProposition}"</p>
                   </div>
                   <div className="mt-8 flex gap-4">
                      <button className="flex-1 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Export_RFP_Brief</button>
                      <button className="px-10 py-5 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Share_with_Board</button>
                   </div>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default MarketDominanceHub;