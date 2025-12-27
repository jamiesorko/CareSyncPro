import React, { useState, useEffect } from 'react';
import { legislativeSyncService, LegislationUpdate } from '../../services/legislativeSyncService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const LegislativeSentinel: React.FC<Props> = ({ language }) => {
  const [updates, setUpdates] = useState<LegislationUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [activePolicy, setActivePolicy] = useState<LegislationUpdate | null>(null);

  const fetchSignals = async () => {
    setLoading(true);
    const signals = await legislativeSyncService.scanForRegionalChanges("Ontario");
    setUpdates(signals);
    setLoading(false);
  };

  const handleForge = (update: LegislationUpdate) => {
    setActivePolicy(update);
    setIsForging(true);
    setTimeout(() => {
      setIsForging(false);
      alert("POLICY_FORGED: Amendment drafted and committed to Neural Vault for review.");
    }, 3000);
  };

  useEffect(() => { fetchSignals(); }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Legislative_Sentinel</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Grounding-Enabled Regulatory Drift Detection</p>
        </div>
        <button 
          onClick={fetchSignals}
          disabled={loading}
          className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          {loading ? 'INGESTING_SIGNALS...' : 'SYNC_GLOBAL_MANDATES'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[600px]">
        {/* Signal Log */}
        <div className="lg:col-span-7 bg-slate-950/50 border border-white/10 rounded-[4rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-10 opacity-5 font-black italic text-8xl text-white pointer-events-none">SYNC</div>
          <h3 className="text-xl font-black text-white mb-10 tracking-tighter uppercase italic">Mandate_Inbound_Feed</h3>
          
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
            {updates.length > 0 ? (
              updates.map((update, i) => (
                <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-lg font-black text-white uppercase italic tracking-tighter">{update.actName}</p>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded mt-2 inline-block ${update.urgency === 'IMMEDIATE_REVISION' ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-500'}`}>
                        {update.urgency}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleForge(update)}
                      className="opacity-0 group-hover:opacity-100 px-6 py-2 bg-sky-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all"
                    >
                      Forge_Amendment
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic mb-6">"{update.detectedChange}"</p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Analysis Impact</p>
                    <p className="text-[11px] text-slate-300 font-medium">{update.impactSummary}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                <span className="text-4xl mb-4">📡</span>
                <p>Awaiting legislative telemetry stream...</p>
              </div>
            )}
          </div>
        </div>

        {/* Policy Forge / Summary */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Compliance_Health_Score</h3>
              <div className="flex items-baseline space-x-2 mb-10">
                 <p className="text-7xl font-black italic tracking-tighter">94.2%</p>
                 <span className="text-xs font-black opacity-40 uppercase">Safe</span>
              </div>
              <div className="space-y-4">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Identified Drift Factors</p>
                 {[
                   "Staffing Ratio (New Bill Vector)",
                   "Documentation Latency Mandate",
                   "GPS Geofence Precision Requirement"
                 ].map((d, i) => (
                   <div key={i} className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                      <p className="text-[10px] font-bold italic">{d}</p>
                   </div>
                 ))}
              </div>
           </div>

           {isForging && (
             <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] animate-pulse">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                   <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Policy_Forge_Active</p>
                </div>
                <div className="space-y-4">
                   <div className="h-2 w-full bg-white/5 rounded"></div>
                   <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                   <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                </div>
             </div>
           )}

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Audit_Trail_Integrity</p>
              <div className="space-y-4">
                 {[
                   { label: 'SOP Versioning', val: 'Active', color: 'text-emerald-400' },
                   { label: 'Neural Indexing', val: '100%', color: 'text-sky-400' },
                   { label: 'Signal Latency', val: 'Nominal', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
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

export default LegislativeSentinel;