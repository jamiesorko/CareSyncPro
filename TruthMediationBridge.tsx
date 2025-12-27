import React, { useState, useEffect } from 'react';
import { Client, TruthMediationCase } from '../../types';
import { clinicalTruthMediationService } from '../../services/clinicalTruthMediationService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const TruthMediationBridge: React.FC<Props> = ({ language, clients }) => {
  const [activeCase, setActiveCase] = useState<TruthMediationCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runMediation = async (clientId: string) => {
    setLoading(true);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Conflicting reports for demo simulation
    const mockReports = [
      { staffName: 'Elena R.', role: 'PSW', note: 'Patient was calm, resting comfortably during entire visit. No agitation noted.' },
      { staffName: 'Mark K.', role: 'RN (Consult)', note: 'Patient extremely agitated. Pulse 108. Lungs sounded wet. Needs immediate respiratory audit.' }
    ];

    try {
      const result = await clinicalTruthMediationService.mediateSignals(client, mockReports);
      setActiveCase(result);
    } catch (e) {
      alert("Neural arbitration desync. Re-routing consensus vector...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) runMediation(selectedClientId);
  }, [selectedClientId]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-rose-400">Truth_Mediation_Bridge</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Arbitrating Conflicting Clinical Field Signals via Forensic Synthesis</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClientId === c.id ? 'bg-rose-600 text-white shadow-2xl shadow-rose-600/30' : 'text-slate-500 hover:text-white'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Signal Comparison Stage */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[700px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-16">
              <div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Divergent_Signals_Matrix</h3>
                 <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mt-2">Active Comparison Instance</p>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">⚖️</div>
                </div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em] animate-pulse">Weighing_Clinical_Integrity</p>
             </div>
           ) : activeCase && (
             <div className="flex-1 space-y-12 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {activeCase.divergentSignals.map((s, i) => (
                     <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] group hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.staffName} ({s.role})</span>
                           <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        </div>
                        <p className="text-sm text-slate-300 italic leading-relaxed font-medium">"{s.note}"</p>
                     </div>
                   ))}
                </div>

                {/* The Synthesized Truth */}
                <div className="p-10 bg-rose-600/10 border border-rose-500/30 rounded-[3.5rem] shadow-inner group">
                   <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-10 bg-rose-500 rounded-full group-hover:animate-ping"></div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">Forensic_Truth_Synthesis</h4>
                   </div>
                   <p className="text-2xl font-bold text-white leading-relaxed italic uppercase tracking-tighter">"{activeCase.aiSynthesizedTruth}"</p>
                   <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center space-x-6">
                         <div className="text-center">
                            <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Discrepancy Severity</p>
                            <p className="text-xl font-black text-rose-500 italic">{activeCase.discrepancyProbability}%</p>
                         </div>
                         <div className="w-px h-8 bg-white/5"></div>
                         <div className="text-center">
                            <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Confidence Factor</p>
                            <p className="text-xl font-black text-emerald-500 italic">94%</p>
                         </div>
                      </div>
                      <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${activeCase.safetyPriorityLevel === 'CRITICAL' ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-white/10 text-slate-400'}`}>
                        {activeCase.safetyPriorityLevel}
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => runMediation(selectedClientId)}
                  className="mt-auto py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  RE-ALIGNE_VECTORS
                </button>
             </div>
           )}
        </div>

        {/* Resolution Directive */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-rose-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-rose-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic uppercase">Fix</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Arbiter_Directive</h3>
              <div className="space-y-8 relative z-10">
                 <p className="text-base font-bold italic leading-relaxed mb-8">
                   "{activeCase?.suggestedDirective || "Awaiting signal arbitration to generate authoritative resolution protocol..."}"
                 </p>
                 <button 
                  disabled={loading || !activeCase}
                  onClick={() => alert("SIGNAL_LOCKED: Corrected clinical status published. Handover note modified. Personnel feedback logged.")}
                  className="w-full py-5 bg-white text-rose-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   AUTHORIZE_RESOLUTION
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Arbiter_Audit_Stats</p>
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Conflict Velocity', val: 'Minimal', color: 'text-emerald-400' },
                   { label: 'Truth Fidelity', val: '99.8%', color: 'text-sky-400' },
                   { label: 'Arbiter Uptime', val: '100%', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-4 tracking-widest">DOC_System_Note</p>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">
                      "Divergence detected in 14% of Sector 4 respiratory reports. Initiating mandatory 'Mastery Forge' refresher for all field staff in this region."
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TruthMediationBridge;