import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { autonomySentinelService, AutonomyFlag } from '../../services/autonomySentinelService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const AutonomyGuardHUD: React.FC<Props> = ({ language, clients }) => {
  const [flag, setFlag] = useState<AutonomyFlag | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runAudit = async () => {
    setLoading(true);
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    // Simulation: A note that might contain an autonomy red flag
    const mockNote = "Patient repeatedly refused to use the Hoyer lift for morning transfer. Caregiver insisted and completed transfer regardless to ensure safety schedule.";

    try {
      const result = await autonomySentinelService.auditAutonomy(client, mockNote);
      setFlag(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedClientId) runAudit();
  }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-slate-400">Autonomy_Guard</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Dignity Compliance & Autonomy Sentinel</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[550px]">
           <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Probing_Documentation_Ethics</p>
             </div>
           ) : flag && (
             <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="p-10 rounded-[3.5rem] bg-white/[0.03] border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Finding_Synthesis</p>
                   <p className="text-2xl font-bold text-white leading-relaxed italic uppercase tracking-tighter">"{flag.finding}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl text-center">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-4">Signal Type</p>
                      <span className={`px-4 py-1 rounded text-[10px] font-black uppercase ${flag.type === 'STABLE' ? 'bg-emerald-500' : 'bg-rose-600'} text-white`}>{flag.type}</span>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl text-center">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-4">Neural Confidence</p>
                      <p className="text-3xl font-black italic text-white">{Math.round(flag.confidence * 100)}%</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl text-center">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-4">Roster Impact</p>
                      <span className="text-[10px] font-black text-emerald-400 uppercase">NOMINAL</span>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-4 bg-slate-900 border border-white/10 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col group">
           <div className="flex items-center space-x-3 mb-10">
              <div className="w-1.5 h-10 bg-slate-400 rounded-full group-hover:animate-ping"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Arbiter_Directive</h3>
           </div>
           <div className="flex-1 space-y-8">
              <p className="text-lg font-bold italic leading-relaxed">
                "{flag?.remediationPath || "Awaiting signal to forge moral directive..."}"
              </p>
              <button 
               onClick={() => alert("SIGNAL_LOCKED: Ethics briefing published to RN Supervisor queue.")}
               className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                AUTHORIZE_INTERVENTION
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomyGuardHUD;