import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { neuralSentinelService, ChronoSimulation } from '../../services/neuralSentinelService';

interface Props {
  language: string;
  clients: Client[];
}

const NeuralSentinelHub: React.FC<Props> = ({ language, clients }) => {
  const [activeSim, setActiveSim] = useState<ChronoSimulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runSim = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const mockVitals = [{ hr: 84 }, { hr: 88 }];
    const mockNotes = ["Increased confusion.", "Dry cough."];
    try {
      const result = await neuralSentinelService.simulatePatientHorizon(client, mockVitals, mockNotes);
      setActiveSim(result);
    } catch (e) {
      console.error("Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedClientId) runSim(selectedClientId); }, [selectedClientId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-rose-500">Neural_Sentinel</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Chrono-Trajectory Mapping</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button key={c.id} onClick={() => setSelectedClientId(c.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-white'}`}>{c.name}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-black border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em] animate-pulse">Running_Trajectory_Simulation</p>
             </div>
           ) : activeSim && (
             <div className="space-y-12 relative z-10 animate-in zoom-in">
                <div className="p-8 bg-rose-600/5 border border-rose-500/20 rounded-3xl">
                   <p className="text-[9px] font-black text-rose-500 uppercase mb-4">Crisis Probability Horizon</p>
                   <p className="text-8xl font-black italic tracking-tighter text-white">{activeSim.crisisProbability}%</p>
                </div>
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                   <p className="text-[9px] font-black text-slate-500 uppercase mb-6">Simulation Reasoning Chain</p>
                   <div className="space-y-4">
                      {activeSim.reasoningChain.map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                           <p className="text-sm text-slate-300 italic">"{step}"</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-rose-600 p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Preventative_Directive</h3>
           <p className="text-lg font-bold italic leading-tight mb-10">"{activeSim?.suggestedDirective || "Analyzing vectors..."}"</p>
           <button onClick={() => alert("Preventative order pushed.")} className="w-full py-5 bg-white text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">PUBLISH_INTERCEPT</button>
        </div>
      </div>
    </div>
  );
};

export default NeuralSentinelHub;