import React, { useState, useEffect } from 'react';
import { Client, NexusConsensus } from '../../types';
import { clinicalInterdisciplinaryService } from '../../services/clinicalInterdisciplinaryService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const InterdisciplinaryNexus: React.FC<Props> = ({ language, clients }) => {
  const [consensus, setConsensus] = useState<NexusConsensus | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runConsensusForge = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Simulate multi-discipline inputs
    const mockInputs = [
      { role: 'RN_SURGICAL', note: 'Wound dressing change daily. Monitor for exudate.' },
      { role: 'DIETITIAN', note: 'High-protein diet recommended to support tissue repair.' },
      { role: 'PHYSIO', note: 'Initiate weight-bearing exercises. Goal: 10 mins ambulation.' },
      { role: 'OCC_THERAPY', note: 'Home safety audit: recommended grab bars in shower for surgical stability.' }
    ];

    try {
      const result = await clinicalInterdisciplinaryService.synthesizeConsensus(client, mockInputs);
      setConsensus(result);
    } catch (e) {
      alert("Neural Consensus Bridge Divergence. Recalibrating...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) runConsensusForge(selectedClientId);
  }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-sky-400">Interdisciplinary_Nexus</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Case Orchestration & Cross-Discipline Synergy Hub</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              disabled={loading}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClientId === c.id ? 'bg-sky-600 text-white shadow-2xl shadow-sky-600/30' : 'text-slate-500 hover:text-white'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Mission Control Deck */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[700px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-16">
              <div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Team_Consensus_Matrix</h3>
                 <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-2">Active Multi-Discipline Synchronization</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Alignment Confidence</p>
                 <p className={`text-4xl font-black italic tracking-tighter ${consensus && consensus.consensusScore > 80 ? 'text-emerald-400' : 'text-amber-500'}`}>
                   {consensus ? consensus.consensusScore : '--'}%
                 </p>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl">🧩</div>
                </div>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.6em] animate-pulse">Forging_Discipline_Consensus</p>
             </div>
           ) : consensus && (
             <div className="flex-1 space-y-12 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* Unified Care Vector */}
                <div className="p-10 bg-sky-600/10 border border-sky-500/20 rounded-[3.5rem] shadow-inner group">
                   <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-10 bg-white rounded-full group-hover:animate-bounce"></div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">Unified_Care_Vector</h4>
                   </div>
                   <p className="text-2xl font-bold text-white leading-relaxed italic uppercase tracking-tighter">"{consensus.unifiedCareVector}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {consensus.specialistInputs.map((input, i) => (
                     <div key={i} className={`p-8 rounded-3xl border transition-all ${input.conflict ? 'bg-rose-600/10 border-rose-500/50' : 'bg-white/[0.03] border-white/5'}`}>
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{input.role}</span>
                           {input.conflict && <span className="px-2 py-0.5 bg-rose-600 text-white text-[7px] font-black rounded uppercase">Drift_Detected</span>}
                        </div>
                        <p className="text-xs text-slate-300 font-medium italic leading-relaxed">"{input.directive}"</p>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => selectedClientId && runConsensusForge(selectedClientId)}
                  className="mt-auto py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  RE-SYNCHRONIZE_NEXUS
                </button>
             </div>
           )}
        </div>

        {/* Global Strategy Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           {/* Critical Synergy Alert */}
           <div className={`p-10 rounded-[3rem] shadow-2xl transition-all duration-1000 ${
             consensus?.criticalSynergyAlert ? 'bg-amber-600 text-white shadow-amber-600/30' : 'bg-emerald-600 text-white shadow-emerald-600/30'
           } relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">{consensus?.criticalSynergyAlert ? 'ALARM' : 'SAFE'}</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Synergy_Sentinel</h3>
              
              <div className="space-y-8 relative z-10">
                 <p className="text-sm font-bold italic leading-relaxed">
                   {consensus?.criticalSynergyAlert || "No clinical friction detected. Multi-discipline alignment is nominal."}
                 </p>
                 <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase mb-3 opacity-60">Action_Status</p>
                    <p className="text-sm font-black italic tracking-tighter uppercase leading-none">
                      {consensus?.criticalSynergyAlert ? 'INTERVENTION_REQUIRED' : 'CONTINUE_PROTOCOL'}
                    </p>
                 </div>
                 {consensus?.criticalSynergyAlert && (
                   <button 
                    onClick={() => alert("SIGNAL_LOCKED: Emergency team huddle broadcast to all specialists.")}
                    className="w-full py-5 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                   >
                     EXECUTE_NEXUS_INTERCEPT
                   </button>
                 )}
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Discipline_Activity_Pulse</p>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Nursing Vector', val: 'Active', color: 'text-emerald-400' },
                   { label: 'Dietetic Vector', val: 'Active', color: 'text-emerald-400' },
                   { label: 'Physio Vector', val: 'Stalled', color: 'text-rose-400' },
                   { label: 'OT Vector', val: 'Syncing', color: 'text-sky-400' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">Case_Manager_Insight</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Cross-discipline audit detects 14% improvement in mobility markers when protein protocol is followed. Roster adjusted to prioritize snack service."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default InterdisciplinaryNexus;