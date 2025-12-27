import React, { useState, useEffect } from 'react';
import { Client, StaffMember } from '../../types';
import { commandBridgeService, SectorIntel } from '../../services/commandBridgeService';

interface Props {
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const CommandBridge: React.FC<Props> = ({ language, clients, staff }) => {
  const [intel, setIntel] = useState<SectorIntel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState('North York');

  const fetchIntel = async (sector: string) => {
    setLoading(true);
    try {
      const result = await commandBridgeService.synthesizeFleetStatus(sector, [], "Staff reports normal load.");
      setIntel(result);
    } catch (e) {
      console.error("Signal lost");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIntel(activeSector); }, [activeSector]);

  return (
    <div className="h-full space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Command_Bridge</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Fleet Orchestration & IoT Fusion</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {['North York', 'Downtown', 'Scarborough'].map(s => (
             <button key={s} onClick={() => setActiveSector(s)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeSector === s ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}>{s}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse">Syncing_Sector_Grounding</p>
             </div>
           ) : intel && (
             <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="flex justify-center">
                   <div className={`w-64 h-64 rounded-full border-4 flex items-center justify-center transition-all ${intel.riskScore > 50 ? 'border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.3)]' : 'border-indigo-500 shadow-[0_0_80px_rgba(99,102,241,0.3)]'}`}>
                      <div className="text-center">
                         <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Sector Risk</p>
                         <p className="text-7xl font-black italic tracking-tighter text-white">{intel.riskScore}%</p>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Environmental Hazard</p>
                      <p className="text-sm font-bold italic text-white italic">"{intel.environmentalHazard}"</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Sentiment Pulse</p>
                      <p className={`text-xl font-black italic tracking-tighter uppercase ${intel.vocalSentiment === 'STRESS' ? 'text-rose-500' : 'text-emerald-400'}`}>{intel.vocalSentiment}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Command_Directive</h3>
           <p className="text-lg font-bold italic leading-tight mb-10">"{intel?.aiDirective || "Awaiting signals..."}"</p>
           <button onClick={() => alert("Directive broadcast to sector fleet.")} className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">PUBLISH_SECTOR_INTERCEPT</button>
        </div>
      </div>
    </div>
  );
};

export default CommandBridge;