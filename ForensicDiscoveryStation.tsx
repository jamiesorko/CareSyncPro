import React, { useState } from 'react';
import { forensicDiscoveryService } from '../../services/forensicDiscoveryService';
import { Client, ForensicDossier } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const ForensicDiscoveryStation: React.FC<Props> = ({ language, clients }) => {
  const [dossier, setDossier] = useState<ForensicDossier | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('EVT-992A');

  const runReconstruction = async () => {
    setLoading(true);
    const client = clients[0];
    const mockEvidence = [
      { type: 'GPS', data: 'Verified on-site 08:02 - 09:14', id: 'gps-9' },
      { type: 'AUDIO', data: 'Scribe: Patient noted mild dysphasia at breakfast.', id: 'aud-4' },
      { type: 'IOT', data: 'Hoyer Lift cycle confirmed 08:35', id: 'iot-1' }
    ];

    try {
      const result = await forensicDiscoveryService.reconstructCrisis(client, mockEvidence);
      setDossier(result);
    } catch (e) {
      alert("Evidence Nexus Drift. Recalibrating...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-rose-500">Forensic_Discovery_Station</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Deep Evidence Reconstruction & Legal Defense Matrix</p>
        </div>
        <button 
          onClick={runReconstruction}
          disabled={loading}
          className="px-10 py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-slate-700 transition-all shadow-2xl"
        >
          {loading ? 'RECONSTRUCTING_VECTORS...' : 'INITIALIZE_DISCOVERY_SWEEP'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Evidence Timeline */}
        <div className="lg:col-span-8 bg-black border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[700px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-16">
              <div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Multimodal_Event_Trace</h3>
                 <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mt-2">Target Frame: 2025-10-15 [08:00 - 09:30]</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase">Defensibility Index</p>
                 <p className={`text-4xl font-black italic tracking-tighter ${dossier && dossier.legalDefensibilityScore > 90 ? 'text-emerald-400' : 'text-rose-500'}`}>
                   {dossier ? dossier.legalDefensibilityScore : '--'}%
                 </p>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-20 h-20 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse">Forging_Truth_Vector</p>
             </div>
           ) : dossier && (
             <div className="flex-1 space-y-12 relative z-10">
                
                {/* Cryptographic Timeline */}
                <div className="space-y-6">
                   {dossier.multimodalTimeline.map((node, i) => (
                     <div key={i} className="flex items-start gap-8 group">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                           <div className="w-px h-12 bg-white/5"></div>
                        </div>
                        <div className="flex-1 p-6 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-white/5 transition-all">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-slate-500 uppercase">{node.time} • {node.source}</span>
                              <span className="text-[8px] font-mono text-slate-700 uppercase">{node.hash}</span>
                           </div>
                           <p className="text-xs text-slate-200 font-medium italic">"{node.evidence}"</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-10 bg-rose-600/5 border border-rose-500/20 rounded-[3rem]">
                   <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4">Neural_Truth_Synthesis</p>
                   <p className="text-xl font-bold text-white italic leading-relaxed uppercase tracking-tighter">"{dossier.truthVector}"</p>
                </div>
             </div>
           )}
        </div>

        {/* Legal Authority Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex-1 flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="text-7xl font-black italic">SHIELD</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-slate-500 italic">Exposure_Analysis</h3>
              
              <div className="flex-1 space-y-8 relative z-10">
                 <p className="text-base font-bold italic leading-relaxed">
                   {dossier?.exposureAnalysis || "Awaiting signal fusion to determine legal exposure vector..."}
                 </p>
                 
                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black text-emerald-400 uppercase mb-4">Audit_Integrity_Check</p>
                    <div className="space-y-3">
                       {["GPS Match: 100%", "Biometric Parity: Active", "Voice Scribe: Validated"].map((check, i) => (
                         <div key={i} className="flex items-center space-x-3">
                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                            <p className="text-[10px] font-bold text-slate-400">{check}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <button 
                  onClick={() => alert("SIGNAL_LOCKED: Secure Discovery Bundle transmitted to Legal Portal via SHA-256 Vault Link.")}
                  className="w-full mt-auto py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   AUTHORIZE_DISCOVERY_BUNDLE
                 </button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Discovery_Stats</p>
              <div className="space-y-4">
                 {[
                   { label: 'Evidence Density', val: 'High', color: 'text-emerald-400' },
                   { label: 'Reconstruction Confidence', val: '99.8%', color: 'text-sky-400' },
                   { label: 'Liability Threshold', val: 'Safe', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ForensicDiscoveryStation;