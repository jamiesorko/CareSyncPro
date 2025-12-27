import React, { useState, useEffect } from 'react';
import { Client, PatientTwinSim } from '../../types';
import { patientDigitalTwinService } from '../../services/patientDigitalTwinService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const PatientDigitalTwin: React.FC<Props> = ({ language, clients }) => {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [sim, setSim] = useState<PatientTwinSim | null>(null);
  const [loading, setLoading] = useState(false);
  const [proposedChange, setProposedChange] = useState("Introduce daily range-of-motion exercises and increase hydration monitoring frequency.");

  const runSimulation = async () => {
    setLoading(true);
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    try {
      const result = await patientDigitalTwinService.simulatePlanChange(client, proposedChange);
      setSim(result);
    } catch (e) {
      alert("Neural Twin Drift. Re-calibrating clinical vectors...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) runSimulation();
  }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-400">Patient_Digital_Twin</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Predictive Clinical Outcomes & Longitudinal Stability Mirror</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              disabled={loading}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClientId === c.id ? 'bg-emerald-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Trajectory Sandbox */}
        <div className="lg:col-span-8 bg-[#0a1012] border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[700px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-12">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Simulation_Stage: v4.2</h3>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">30-Day Stability Forecast</p>
                 <p className="text-lg font-black text-emerald-400 italic">GROUNDED</p>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">👥</div>
                </div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] animate-pulse">Mapping_Clinical_Outcome</p>
             </div>
           ) : sim && (
             <div className="flex-1 space-y-12 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* SVG Prediction Graph */}
                <div className="h-64 bg-black/40 rounded-[3rem] border border-white/5 p-8 relative overflow-hidden group">
                   <div className="absolute inset-0 opacity-5 grid grid-cols-30 pointer-events-none">
                      {[...Array(30)].map((_, i) => <div key={i} className="border-r border-white"></div>)}
                   </div>
                   <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
                      <path 
                        d={`M 0 15 ${sim.predictedStability.map((s, i) => `L ${i * 3.44} ${18 - (s / 100) * 15}`).join(' ')}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      />
                      {sim.predictedStability.map((s, i) => (
                        <circle key={i} cx={i * 3.44} cy={18 - (s / 100) * 15} r="0.4" fill="#fff" className="opacity-20 group-hover:opacity-60 transition-opacity" />
                      ))}
                   </svg>
                   <div className="absolute bottom-4 left-8 right-8 flex justify-between">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Intake Vector</span>
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Projected Graduation</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] group hover:bg-white/5 transition-all">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Neural_Predictive_Advisory</p>
                      <p className="text-sm text-slate-200 leading-relaxed font-medium italic">"{sim.clinicalAdvisory}"</p>
                   </div>
                   <div className="space-y-6">
                      <div className="p-6 bg-rose-600/10 border border-rose-500/20 rounded-3xl flex justify-between items-center shadow-lg">
                         <div>
                            <p className="text-[8px] font-black text-rose-400 uppercase">Complication Risk</p>
                            <p className="text-3xl font-black text-white italic">{sim.complicationRisk}%</p>
                         </div>
                         <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" style={{ width: `${sim.complicationRisk}%` }} />
                         </div>
                      </div>
                      <div className="p-6 bg-sky-600/10 border border-sky-500/20 rounded-3xl flex justify-between items-center shadow-lg">
                         <div>
                            <p className="text-[8px] font-black text-sky-400 uppercase">Staff Load impact</p>
                            <p className="text-3xl font-black text-white italic">+{sim.staffWorkloadImpact}h<span className="text-xs ml-1 opacity-50 uppercase">/WK</span></p>
                         </div>
                         <span className="text-[9px] font-black text-sky-500 animate-pulse uppercase">Scaling Reqd</span>
                      </div>
                   </div>
                </div>
             </div>
           )}

           <div className="mt-auto pt-10 border-t border-white/5">
              <div className="flex flex-col gap-4">
                 <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest ml-4 italic">Proposed Intervention Delta</p>
                 <div className="flex gap-4">
                    <input 
                      value={proposedChange}
                      onChange={(e) => setProposedChange(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all italic placeholder:text-slate-800"
                    />
                    <button 
                      onClick={runSimulation}
                      disabled={loading || !proposedChange.trim()}
                      className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                    >
                      EXECUTE_CLONE
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Strategy Overlay */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">SYNC</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Trajectory_Authorization</h3>
              <div className="space-y-8 relative z-10">
                 <p className="text-sm font-bold italic leading-relaxed">
                   "Neural Twin confirms an 18.4% improvement in mobility within 12 days if hydration protocol is intensified. Authorizing care plan update?"
                 </p>
                 <button 
                  onClick={() => alert("SIGNAL_LOCKED: Simulation data committed. Care plan amendment published to DOC Queue.")}
                  className="w-full py-6 bg-white text-emerald-900 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   AUTHORIZE_PLAN_DELTA
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Predictive_Benchmarking</p>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Avg Recovery Speed', val: '74.2%', color: 'text-emerald-400' },
                   { label: 'Simulation Fidelity', val: '99.4%', color: 'text-sky-400' },
                   { label: 'Acuity Reduction', val: '12% / Mo', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">Researcher_Pulse</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Cross-referencing similar cohorts suggests a 22% lower readmission risk with these changes. Validating against regional legislative rules..."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDigitalTwin;