import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { clinicalTruthMediationService } from '../../services/clinicalTruthMediationService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const TruthMediationSuite: React.FC<Props> = ({ language, clients }) => {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runMediation = async () => {
    setLoading(true);
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    // Conflicting reports for demo simulation
    const mockReports = [
      { staffName: 'Elena R.', role: 'PSW', note: 'Patient was calm and sleeping throughout session. No agitation.' },
      { staffName: 'Neural_Vital_Sensor', role: 'IoT', note: 'Pulse spike 118 BPM detected at 09:12 AM. Rapid chest movement.' }
    ];

    try {
      const data = await clinicalTruthMediationService.mediateSignals(client, mockReports);
      setResult(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedClientId) runMediation(); }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-rose-500">Truth_Mediation</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Forensic Discrepancy Resolution & Signal Interrogation</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-12 relative z-10">Divergent_Signals_Detected</h3>
           
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Mediating_Forensic_Logic</p>
             </div>
           ) : result && (
             <div className="space-y-10 relative z-10 animate-in zoom-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {result.divergentSignals.map((s: any, i: number) => (
                     <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-4">{s.staffName} ({s.role})</p>
                        <p className="text-sm text-slate-300 italic">"{s.note}"</p>
                     </div>
                   ))}
                </div>
                <div className="p-10 bg-rose-600/10 border border-rose-500/20 rounded-[3rem]">
                   <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-6">Synthesized_Clinical_Truth</p>
                   <p className="text-2xl font-bold text-white leading-relaxed italic uppercase tracking-tighter">"{result.aiSynthesizedTruth}"</p>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-rose-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col group">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Arbiter_Directive</h3>
           <p className="text-lg font-bold italic leading-relaxed mb-10">
             {result?.suggestedDirective || "Analyzing signal collision..."}
           </p>
           <button onClick={() => alert("Consensus updated in chart.")} className="w-full mt-auto py-5 bg-white text-rose-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">AUTHORIZE_CONSENSUS</button>
        </div>
      </div>
    </div>
  );
};

export default TruthMediationSuite;