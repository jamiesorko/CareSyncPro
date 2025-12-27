import React, { useState, useEffect, useRef } from 'react';
import { Client } from '../../types';
import { guardianService, SafetyPulse } from '../../services/guardianService';

interface Props {
  language: string;
  clients: Client[];
}

const GuardianEscort: React.FC<Props> = ({ language, clients }) => {
  const [isActive, setIsActive] = useState(false);
  const [pulse, setPulse] = useState<SafetyPulse | null>(null);
  const sessionRef = useRef<any>(null);

  const start = async () => {
    const session = await guardianService.startEscort((p) => setPulse(p));
    sessionRef.current = session;
    setIsActive(true);
  };

  const stop = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setPulse(null);
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-orange-500">Guardian_Escort</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Safety Sentinel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className={`lg:col-span-8 border rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px] transition-all ${isActive ? 'bg-slate-950 border-orange-500/30' : 'bg-black border-white/5'}`}>
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <div className="flex-1 flex flex-col justify-center items-center">
              {!isActive ? (
                <div className="text-center opacity-30 italic"><p className="text-5xl mb-6">🛡️</p><p className="text-sm font-black uppercase tracking-widest">Signal_Inert</p></div>
              ) : (
                <div className="w-full space-y-12 text-center">
                   <div className="relative h-64 flex items-center justify-center">
                      <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all ${pulse?.status === 'WARNING' ? 'border-orange-500 shadow-[0_0_80px_rgba(244,63,94,0.5)] animate-pulse' : 'border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.2)]'}`}>
                         <p className="text-7xl font-black italic tracking-tighter text-white">{pulse?.aggressionScore || 0}%</p>
                      </div>
                   </div>
                   <p className="text-sm text-slate-400 italic">"Grounded: {pulse?.aiCommentary || "Monitoring acoustic baseline..."}"</p>
                </div>
              )}
           </div>
           <button onClick={isActive ? stop : start} className={`w-full py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] transition-all shadow-2xl ${isActive ? 'bg-orange-600 text-white' : 'bg-white text-black'}`}>
             {isActive ? 'TERMINATE_LOCK' : 'INITIALIZE_GUARDIAN'}
           </button>
        </div>
        <div className="lg:col-span-4 bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-slate-500">Live_Tactical_Stats</h3>
           <div className="space-y-6">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Sector Priority</span>
                 <span className="text-[10px] font-black text-emerald-400">NORMAL</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Privacy Mask</span>
                 <span className="text-[10px] font-black text-sky-400">ACTIVE</span>
              </div>
              <button className="w-full mt-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">SOS_EMERGENCY</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianEscort;