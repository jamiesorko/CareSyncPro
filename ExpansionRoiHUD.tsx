import React, { useState } from 'react';
import { expansionRoiService, RoiProjection } from '../../services/expansionRoiService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const ExpansionRoiHUD: React.FC<Props> = ({ language }) => {
  const [roi, setRoi] = useState<RoiProjection | null>(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('Hamilton');

  const runProjection = async () => {
    setLoading(true);
    try {
      const data = await expansionRoiService.forecastExpansionROI(region);
      setRoi(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24 h-[650px] overflow-hidden flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-400">Expansion_ROI</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Capital Leverage & Market Sovereignty Forecaster</p>
        </div>
        <div className="flex gap-4">
           <input 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[10px] font-black uppercase text-white outline-none focus:border-emerald-500"
            placeholder="Target Region..."
           />
           <button 
            onClick={runProjection}
            disabled={loading}
            className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-3xl hover:scale-105 active:scale-95 transition-all"
           >
            {loading ? 'SIMULATING_CAPITAL...' : 'EXECUTE_ROI_PROJECTION'}
           </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-0">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
         
         {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
               <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] animate-pulse">Forging_Regional_Solvency_Matrix</p>
            </div>
         ) : roi ? (
           <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Proj. Annual Revenue</p>
                    <p className="text-3xl font-black italic tracking-tighter text-white">${(roi.projectedAnnualRevenue / 1000).toFixed(0)}k</p>
                 </div>
                 <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Break-Even Velocity</p>
                    <p className="text-3xl font-black italic tracking-tighter text-sky-400">{roi.breakEvenMonths} MO</p>
                 </div>
                 <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Wage Inflation</p>
                    <p className="text-3xl font-black italic tracking-tighter text-rose-500">+{roi.localWageInflation}%</p>
                 </div>
                 <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Competitor Density</p>
                    <p className="text-3xl font-black italic tracking-tighter text-amber-500">{roi.competitorSaturation}%</p>
                 </div>
              </div>

              <div className="bg-emerald-600/10 border border-emerald-500/30 p-10 rounded-[3.5rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10">
                    <span className="text-8xl font-black italic text-white uppercase">GROW</span>
                 </div>
                 <div className="flex items-center space-x-4 mb-8">
                    <div className="w-1.5 h-10 bg-emerald-500 rounded-full group-hover:animate-bounce"></div>
                    <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">Strategic_Expansion_Directive</h4>
                 </div>
                 <p className="text-lg font-bold text-slate-200 leading-relaxed italic uppercase tracking-tighter">"{roi.strategicRationale}"</p>
                 <div className="mt-12 flex gap-4">
                    <button className="flex-1 py-5 bg-white text-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Authorize_Capital_Allocation</button>
                    <button className="px-10 py-5 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Share_with_Board</button>
                 </div>
              </div>
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 px-12">
              <span className="text-9xl mb-10">📈</span>
              <p className="text-xl font-black text-white uppercase tracking-widest">Awaiting Expansion Signal</p>
              <p className="text-sm font-medium leading-relaxed max-w-sm mt-4">
                Input a target city to trigger a neural market audit involving grounded competitor wage and senior density analytics.
              </p>
           </div>
         )}
      </div>
    </div>
  );
};

export default ExpansionRoiHUD;