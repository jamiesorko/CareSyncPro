import React, { useState, useEffect } from 'react';
import { Client, HuddleSignal } from '../../types';
import { clinicalTruthFusionService } from '../../services/clinicalTruthFusionService';

interface Props {
  language: string;
  clients: Client[];
}

const NeuralHuddleRoom: React.FC<Props> = ({ language, clients }) => {
  const [signal, setSignal] = useState<HuddleSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runFusion = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const mockTranscript = "Patient mentioned difficulty swallowing. Vitals show slight tachycardia.";
    const mockVitals = { hr: 94, bp: "140/90", spo2: 96 };

    try {
      const result = await clinicalTruthFusionService.fusePatientSignals(client, mockTranscript, mockVitals);
      setSignal(result);
    } catch (e) {
      console.error("Fusion failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedClientId) runFusion(selectedClientId); }, [selectedClientId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-indigo-400">Neural_Huddle</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Multimodal Consensus & Truth Synthesis</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button key={c.id} onClick={() => setSelectedClientId(c.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedClientId === c.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>{c.name}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse">Fusing_Signal_Vectors</p>
             </div>
           ) : signal && (
             <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3.5rem]">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Consensus_Dossier</p>
                   <p className="text-2xl font-bold text-white leading-relaxed italic uppercase tracking-tighter">"{signal.truthSynthesis}"</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Contradiction Detected</p>
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${signal.contradictionDetected ? 'bg-rose-500' : 'bg-emerald-500'} text-white`}>{signal.contradictionDetected ? 'YES' : 'NO'}</span>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Confidence Score</p>
                      <p className="text-3xl font-black text-indigo-400 italic">{Math.round(signal.confidence * 100)}%</p>
                   </div>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Intercept_Directive</h3>
           <p className="text-lg font-bold italic leading-tight mb-10">"{signal?.remediationDirective || "Awaiting consensus..."}"</p>
           <button onClick={() => alert("Directing RN supervisor to intervene.")} className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">AUTHORIZE_INTERCEPT</button>
        </div>
      </div>
    </div>
  );
};

export default NeuralHuddleRoom;