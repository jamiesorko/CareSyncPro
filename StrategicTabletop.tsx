import React, { useState } from 'react';
import { strategicForecasterService, SimulationResult } from '../../services/strategicForecasterService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const StrategicTabletop: React.FC<Props> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const mockStats = { revenue: 245000, staffCount: 60, patientCount: 140, sector: 'GTA' };
      const data = await strategicForecasterService.simulateScenario(prompt, mockStats);
      setResult(data);
    } catch (e) {
      alert("Neural simulation failed. Re-centering logic vectors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-cyan-400">Strategic_Tabletop</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Monte Carlo Simulation & Failure-Point Modeling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Control Console */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col min-h-[450px]">
              <div className="flex-1 space-y-8">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Disruption_Parameters</h3>
                 <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Lose 15% of RPNs in Sector 4 while onboarding 20 high-acuity surgical discharges."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all italic placeholder:text-slate-800"
                 />
              </div>
              <button 
                onClick={runSimulation}
                disabled={loading || !prompt.trim()}
                className="w-full mt-10 py-6 bg-cyan-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                {loading ? 'SIMULATING_TIMELINES...' : 'INITIATE_PROBABILITY_FUSION'}
              </button>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-6 italic">Simulation_History</p>
              <div className="space-y-4 opacity-40 italic font-medium">
                 <p className="text-xs">"Q3 Sector 1 Saturation" - [Resolved]</p>
                 <p className="text-xs">"Bill 124 Wage Pivot" - [Analyzed]</p>
              </div>
           </div>
        </div>

        {/* Failure Point Matrix */}
        <div className="lg:col-span-7 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {!result && !loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <span className="text-9xl mb-8">♟️</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Awaiting Disruption Signal</h3>
                <p className="text-sm font-bold text-slate-500 mt-4 max-w-sm">The Tabletop uses Gemini 3 Pro to model failure points in institutional resilience before they occur.</p>
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="w-24 h-24 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_50px_rgba(34,211,238,0.2)]"></div>
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.8em] animate-pulse">Calculating_Discontinuity_Vectors</p>
             </div>
           ) : result && (
             <div className="flex-1 flex flex-col relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-start mb-16">
                   <div>
                      <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Outcome_Trajectory</h3>
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-4 italic">Reliability Confidence: 94.2%</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Agency Resilience</p>
                      <p className={`text-7xl font-black italic tracking-tighter ${result.resilienceScore < 50 ? 'text-rose-500' : 'text-emerald-400'}`}>
                        {result.resilienceScore}%
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                   {[
                     { label: 'Fiscal Drift', val: `-$${Math.abs(result.fiscalImpact).toLocaleString()}`, color: 'text-rose-400' },
                     { label: 'Retention Risk', val: `${(result.staffRetentionRisk * 100).toFixed(0)}%`, color: 'text-amber-400' },
                     { label: 'Clinical Stability', val: `${result.clinicalStabilityDelta}%`, color: 'text-sky-400' },
                     { label: 'Failure Horizon', val: 'Month 4', color: 'text-white' }
                   ].map((stat, i) => (
                     <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-3">{stat.label}</p>
                        <p className={`text-lg font-black italic ${stat.color}`}>{stat.val}</p>
                     </div>
                   ))}
                </div>

                <div className="flex-1 bg-white/5 border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col group">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <span className="text-8xl font-black italic text-white uppercase">Directive</span>
                   </div>
                   <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-10 bg-cyan-400 rounded-full group-hover:animate-ping"></div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">AI_Strategic_Advisory</h4>
                   </div>
                   <div className="flex-1 overflow-y-auto scrollbar-hide">
                      <p className="text-base text-slate-200 leading-relaxed font-medium italic">
                        "{result.aiStrategicAdvisory}"
                      </p>
                   </div>
                   <button 
                    onClick={() => alert("STRATEGIC_LOCKED: Simulation data committed to Board Terminal.")}
                    className="mt-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                   >
                     COMMIT_SIMULATION_TO_BOARD
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StrategicTabletop;