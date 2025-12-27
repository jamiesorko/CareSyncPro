import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { familyCrisisService, CrisisBrief } from '../../services/familyCrisisService';

interface Props {
  language: string;
  clients: Client[];
}

const FamilyCrisisHub: React.FC<Props> = ({ language, clients }) => {
  const [brief, setBrief] = useState<CrisisBrief | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const client = clients[0];
      const mockIncident = "Chest pain noted. Nitroglycerin given. 911 dispatched at 08:12.";
      const result = await familyCrisisService.synthesizeCrisisBrief(client, mockIncident);
      setBrief(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { runAnalysis(); }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="p-10 rounded-[3rem] border bg-rose-600 border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.3)]">
         <div className="flex justify-between items-center text-white">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Crisis_Bridge: robert johnson</h2>
            <div className="px-8 py-4 bg-white text-rose-600 rounded-2xl text-[9px] font-black uppercase shadow-xl animate-pulse">LIVE_HUDDLE_ACTIVE</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[550px]">
           <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse">Synthesizing_Update</p>
             </div>
           ) : brief && (
             <div className="space-y-10 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                   <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Direct Summary</p>
                   <p className="text-2xl font-bold text-white leading-relaxed italic">"{brief.summary}"</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-sky-600/10 border border-sky-500/20 p-8 rounded-3xl">
                      <p className="text-[9px] font-black text-sky-400 uppercase mb-4">Context</p>
                      <p className="text-xs text-slate-300 font-medium italic">{brief.context}</p>
                   </div>
                   <div className="bg-rose-600/10 border border-rose-500/20 p-8 rounded-3xl">
                      <p className="text-[9px] font-black text-rose-400 uppercase mb-4">Your Action</p>
                      <p className="text-sm font-black text-white uppercase italic">{brief.action}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 flex flex-col space-y-6">
           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl flex-1 overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Emergency_Resources</h3>
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                 {brief?.resources.map((res, i) => (
                   <a key={i} href={res.uri} target="_blank" className="block p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                      <p className="text-sm font-black text-white uppercase italic">{res.name}</p>
                      <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">{res.type} • {res.distance}</p>
                   </a>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyCrisisHub;