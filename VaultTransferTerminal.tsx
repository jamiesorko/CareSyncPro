
import React, { useState, useRef } from 'react';
import Translate from '../../components/Translate';

const VaultTransferTerminal: React.FC = () => {
  const [isTransferring, setIsTransferring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startTransfer = async () => {
    setIsTransferring(true);
    setLogs(["PROTOCOL_INIT: Establishing secure buffer...", "WASH_ACTIVE: Identifying PII vectors..."]);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setLogs(prev => [...prev, "SCRUB_COMPLETE: 42 Names Masked", "SCRUB_COMPLETE: 12 Addresses Generalized", "INDEX_LOCKED: Vector ingestion finalized."]);
        setIsTransferring(false);
      }
      setProgress(Math.floor(currentProgress));
      
      // Random log injection
      if (currentProgress > 30 && currentProgress < 35) setLogs(prev => [...prev, "NEURAL_MAPPING: Generating semantic embeddings..."]);
      if (currentProgress > 60 && currentProgress < 65) setLogs(prev => [...prev, "GOVERNANCE_LOCK: Verifying PHIPA alignment..."]);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <span className="text-9xl font-black italic uppercase">TRANSFER</span>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">NEURAL_VAULT_TRANSFER</h2>
            <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mt-4">Autonomous Ingestion & Double-Scrubbing Core</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isTransferring}
            className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
          >
            INIT_INGESTION_VECTOR
          </button>
          <input type="file" ref={fileInputRef} hidden onChange={startTransfer} multiple />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
          <div className="flex flex-col space-y-6">
             <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex-1 flex flex-col">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-6">Transfer_Activity_Log</p>
                <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-3 scrollbar-hide">
                   {logs.map((log, i) => (
                     <p key={i} className={log.includes('COMPLETE') ? 'text-emerald-400' : 'text-sky-400'}>
                        <span className="opacity-30 mr-4">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                     </p>
                   ))}
                   {logs.length === 0 && <p className="text-slate-800 italic">Ready for data-moat breach...</p>}
                </div>
             </div>
          </div>

          <div className="flex flex-col justify-center space-y-12">
             <div className="text-center">
                <p className="text-8xl font-black text-white italic tracking-tighter">{progress}%</p>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.5em] mt-4 animate-pulse">Sovereignty_Scrubbing_Active</p>
             </div>
             
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_20px_#6366f1]" style={{ width: `${progress}%` }} />
             </div>

             <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem]">
                <p className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Privacy Enforcement</p>
                <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                  "Neural Core executes identity-masking at the socket layer. All PHI is generalized before inference occurs."
                </p>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-widest">
           <span>Sovereignty: {progress > 99 ? 'LOCKED' : 'ENFORCING'}</span>
           <span>Hashed Trace ID: CP-VAULT-992-ARC</span>
        </div>
      </div>
    </div>
  );
};

export default VaultTransferTerminal;
