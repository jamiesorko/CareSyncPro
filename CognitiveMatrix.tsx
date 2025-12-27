import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { cognitiveService, CognitivePulse } from '../../services/cognitiveService';

interface Props {
  language: string;
  clients: Client[];
}

const CognitiveMatrix: React.FC<Props> = ({ language, clients }) => {
  const [pulse, setPulse] = useState<CognitivePulse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runAnalysis = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const mockHistory = ["Slight confusion.", "Repeating phrases."];
    try {
      const result = await cognitiveService.calculateCognitiveDrift(client, mockHistory);
      setPulse(result);
    } catch (e) {
      console.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedClientId) runAnalysis(selectedClientId); }, [selectedClientId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-amber-500">Cognitive_Matrix</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Linguistic personality drift tracking</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.filter(c => c.mobilityStatus.dementia).map(c => (
             <button key={c.id} onClick={() => setSelectedClientId(c.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-white'}`}>{c.name}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em] animate-pulse">Analyzing_Personality_Vectors</p>
             </div>
           ) : pulse && (
             <div className="space-y-12 relative z-10 animate-in zoom-in">
                <div className="text-center py-10 bg-amber-500/5 border border-amber-500/20 rounded-[3rem]">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Cognitive Drift Magnitude</p>
                   <p className="text-8xl font-black italic tracking-tighter text-white">{pulse.driftScore}%</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Linguistic Attrition</p>
                      <div className="flex flex-wrap gap-2">
                         {pulse.attrition.map((a, i) => (
                           <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded text-[9px] font-black uppercase">{a}</span>
                         ))}
                      </div>
                   </div>
                   <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                      <p className="text-[9px] font-black text-amber-500 uppercase mb-4 tracking-widest">Confusion Window</p>
                      <p className="text-xl font-black text-white uppercase italic">{pulse.window}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-amber-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Reminiscence_Forge</h3>
           <p className="text-sm font-bold italic leading-relaxed mb-10">"AI Suggestion: Forge memory anchor for de-escalation."</p>
           <button onClick={() => alert("Forging cinematic memory anchor.")} className="w-full py-5 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">INITIALIZE_VEO_FORGE</button>
        </div>
      </div>
    </div>
  );
};

export default CognitiveMatrix;