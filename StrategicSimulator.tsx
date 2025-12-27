import React, { useState } from 'react';
import { StrategicScenario } from '../../types';
import { businessSimulationService } from '../../services/businessSimulationService';

interface Props {
  language: string;
}

const StrategicSimulator: React.FC<Props> = ({ language }) => {
  const [input, setInput] = useState('');
  const [scenario, setScenario] = useState<StrategicScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMonth, setActiveMonth] = useState(0);

  const run = async () => {
    setLoading(true);
    try {
      const result = await businessSimulationService.runScenarioSimulation(input);
      setScenario(result);
      setActiveMonth(0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Strategic_Tabletop</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Business Modeling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scenario parameters..." className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all italic mb-8 min-h-[200px]" />
              <button onClick={run} disabled={loading || !input.trim()} className="w-full py-6 bg-cyan-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 disabled:opacity-30">{loading ? 'SIMULATING...' : 'RUN_SIMULATION'}</button>
           </div>
           {scenario && (
             <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl animate-in slide-in-from-left-4">
                <p className="text-[9px] font-black uppercase tracking-widest mb-6 opacity-60">Risk Index</p>
                <p className="text-7xl font-black italic tracking-tighter mb-10">{scenario.riskIndex}</p>
                <p className="text-xs font-bold leading-relaxed italic italic">"{scenario.mitigationStrategy}"</p>
             </div>
           )}
        </div>
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">Computing_Probability_Clouds</p>
             </div>
           ) : scenario && (
             <div className="flex-1 flex flex-col relative z-10 animate-in zoom-in">
                <div className="flex justify-between items-start mb-16">
                   <div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{scenario.title}</h3>
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-3">Step: Month {activeMonth + 1}</p>
                   </div>
                   <p className="text-xs font-bold text-slate-400 italic max-w-xs">{scenario.failurePoint}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-4">Net Reserve</p>
                      <p className="text-2xl font-black italic text-emerald-400">${scenario.projection[activeMonth]?.netReserve?.toLocaleString()}</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-4">Retention</p>
                      <p className="text-2xl font-black italic text-sky-400">{scenario.projection[activeMonth]?.staffRetention}%</p>
                   </div>
                </div>
                <input type="range" min="0" max="11" step="1" value={activeMonth} onChange={(e) => setActiveMonth(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500" />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StrategicSimulator;