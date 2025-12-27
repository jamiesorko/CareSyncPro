import React, { useState, useEffect } from 'react';
import { Client, AfterActionReview } from '../../types';
import { afterActionService } from '../../services/afterActionService';

interface Props {
  language: string;
  clients: Client[];
}

const AfterActionStation: React.FC<Props> = ({ language, clients }) => {
  const [aar, setAar] = useState<AfterActionReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runAAR = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const mockLog = "Patient slurred speech noted at breakfast. RN called 2h later.";
    try {
      const result = await afterActionService.neuralizeIncident(client, mockLog);
      setAar(result);
    } catch (e) {
      console.error("AAR failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedClientId) runAAR(selectedClientId); }, [selectedClientId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-amber-500">After_Action_Station</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Institutional Memory Forge</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button key={c.id} onClick={() => setSelectedClientId(c.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-white'}`}>{c.name}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-black border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] animate-pulse">Reconstructing_Incident</p>
             </div>
           ) : aar && (
             <div className="space-y-12 relative z-10 animate-in zoom-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-4">Observed Path</p>
                      <p className="text-sm text-slate-400 italic">"{aar.observedPath}"</p>
                   </div>
                   <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                      <p className="text-[9px] font-black text-emerald-500 uppercase mb-4">Neural Optimal Vector</p>
                      <p className="text-sm text-white italic font-bold">"{aar.optimalPath}"</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Decision Nodes</p>
                   {aar.decisionNodes.map((node: any, i: number) => (
                     <div key={i} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${node.isOptimal ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <p className="text-xs text-slate-300 font-bold uppercase">{node.time}: {node.staffAction}</p>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-amber-600 p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Interactive_Simulation</h3>
           <p className="text-sm font-bold italic leading-relaxed mb-8">Forge micro-lessons based on this event to prevent recurrence.</p>
           <button onClick={() => alert("Assigning remedial training.")} className="w-full py-5 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">EXECUTE_REMEDIAL_FORGE</button>
        </div>
      </div>
    </div>
  );
};

export default AfterActionStation;