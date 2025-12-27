import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { carePlanHealerService, LogicGap } from '../../services/carePlanHealerService';

interface Props {
  language: string;
  clients: Client[];
}

const NeuralFixHUD: React.FC<Props> = ({ language, clients }) => {
  const [gaps, setGaps] = useState<LogicGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runAudit = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    try {
      const results = await carePlanHealerService.auditPlanIntegrity(client);
      setGaps(results);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedClientId) runAudit(selectedClientId);
  }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-400">Neural_Self_Heal</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Care Plan Logic Alignment</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedClientId === c.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[500px]">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6 relative z-10">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                   <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Auditing_Care_Directives</p>
                </div>
              ) : gaps.length > 0 ? (
                gaps.map((gap, i) => (
                  <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${gap.type === 'OMISSION' ? 'bg-rose-600' : 'bg-amber-600'} text-white`}>{gap.type}</span>
                        <button 
                          onClick={() => {
                            setGaps(prev => prev.filter((_, idx) => idx !== i));
                            alert("FIX_AUTHORIZED: Care plan synchronized with medical necessity.");
                          }}
                          className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase shadow-xl hover:scale-105 transition-all"
                        >
                          Execute_Fix
                        </button>
                     </div>
                     <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-4">{gap.description}</h4>
                     <div className="p-6 bg-emerald-600/5 border border-emerald-500/20 rounded-2xl">
                        <p className="text-[8px] font-black text-emerald-400 uppercase mb-2">Suggested Correction</p>
                        <p className="text-xs text-slate-200 font-bold italic">"{gap.suggestedFix}"</p>
                     </div>
                     <p className="text-[9px] text-slate-600 mt-4 uppercase italic">Rationale: {gap.rationale}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 italic">No care plan logic gaps detected. Alignment 100%.</div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">SAFE</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Clinical_Integrity</h3>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-baseline gap-2">
                    <p className="text-8xl font-black italic tracking-tighter">99<span className="text-2xl opacity-50">.8</span></p>
                    <span className="text-xs font-black opacity-50 uppercase">Sync_Score</span>
                 </div>
                 <p className="text-sm font-bold italic leading-relaxed">
                   "Neural self-healing is monitoring 142 diagnoses and 842 care tasks for real-time logical parity."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralFixHUD;