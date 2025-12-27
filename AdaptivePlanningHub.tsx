import React, { useState, useEffect } from 'react';
import { Client, BioSocialSignal, NeighborhoodImmunity } from '../../types';
import { bioSocialService } from '../../services/bioSocialService';

interface Props {
  language: string;
  clients: Client[];
}

const AdaptivePlanningHub: React.FC<Props> = ({ language, clients }) => {
  const [pulse, setPulse] = useState<BioSocialSignal | null>(null);
  const [threat, setThreat] = useState<NeighborhoodImmunity | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runAnalysis = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const mockNotes = ["Son hasn't called.", "Fridge empty.", "Home cold."];
    try {
      const [p, t] = await Promise.all([
        bioSocialService.synthesizeBioSocialPulse(client, mockNotes),
        bioSocialService.scanNeighborhoodThreats(client.address.split(',')[1]?.trim() || "M5V")
      ]);
      setPulse(p);
      setThreat(t);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedClientId) runAnalysis(selectedClientId); }, [selectedClientId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-purple-400">Bio_Social_Core</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Social determinant integration</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           {clients.slice(0, 3).map(c => (
             <button key={c.id} onClick={() => setSelectedClientId(c.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>{c.name}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.6em] animate-pulse">Correlating_Social_Vectors</p>
             </div>
           ) : pulse && (
             <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-6">Isolation</p>
                      <p className="text-5xl font-black italic tracking-tighter text-amber-500">{pulse.isolationScore}%</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-6">Nutrition</p>
                      <p className="text-xl font-black italic uppercase text-rose-500">{pulse.nutritionDrift}</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-6">Env. Integrity</p>
                      <p className="text-5xl font-black italic text-emerald-400">{pulse.environmentalIntegrity}%</p>
                   </div>
                </div>
                <div className="p-10 bg-purple-600/5 border border-purple-500/20 rounded-[3rem]">
                   <p className="text-[9px] font-black text-purple-400 uppercase mb-6">AI_Synthesis</p>
                   <p className="text-sm text-slate-200 leading-relaxed font-medium italic italic">"{pulse.aiSynthesis}"</p>
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-[#fbbf24] p-10 rounded-[3rem] text-black shadow-2xl relative overflow-hidden">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Neighborhood_Immunity</h3>
           {threat && (
             <div className="space-y-10 relative z-10 animate-in slide-in-from-right-4">
                <p className="text-3xl font-black italic uppercase leading-none">{threat.threatType}</p>
                <div className="p-6 bg-black/5 border border-black/10 rounded-2xl text-xs font-bold italic italic">"{threat.mandateUpdate}"</div>
                <button onClick={() => alert("PPE vector updated.")} className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">UPDATE_FLEET_PPE</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdaptivePlanningHub;