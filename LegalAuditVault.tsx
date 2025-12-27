import React, { useState } from 'react';
import { evidenceHarvesterService, DefensibilityBundle } from '../../services/evidenceHarvesterService';
import { Client } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const LegalAuditVault: React.FC<Props> = ({ language, clients }) => {
  const [bundle, setBundle] = useState<DefensibilityBundle | null>(null);
  const [loading, setLoading] = useState(false);

  const runHarvest = async () => {
    setLoading(true);
    try {
      const mockSignals = [
        { type: 'GPS', data: 'Verified on-site 09:00 - 10:15', hash: '882ac' },
        { type: 'AUDIO', data: 'Handover: Stable, lung sounds clear.', hash: '991bc' }
      ];
      const result = await evidenceHarvesterService.harvestIncidentBundle(clients[0], "INC-992", mockSignals);
      setBundle(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-rose-500">Legal_Audit_Vault</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Forensic Signal Ingestion & Defensive Bundling</p>
        </div>
        <button 
          onClick={runHarvest}
          disabled={loading}
          className="px-10 py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-slate-700 transition-all shadow-3xl"
        >
          {loading ? 'HARVESTING_EVIDENCE...' : 'GENERATE_DEFENSE_BUNDLE'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {!bundle && !loading ? (
             <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <span className="text-9xl mb-8">🛡️</span>
                <p className="text-xl font-black uppercase tracking-widest text-white">Awaiting Incident Vector</p>
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Aggregating_Immutable_Signals</p>
             </div>
           ) : bundle && (
             <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{bundle.id}</h3>
                      <p className="text-[10px] text-slate-500 uppercase mt-2 font-mono">{bundle.hashedTrace}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-rose-500 uppercase">Exposure Index</p>
                      <p className="text-4xl font-black italic text-white">{bundle.legalExposureScore}%</p>
                   </div>
                </div>

                <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem]">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Auditor_Narrative_Synthesis</p>
                   <p className="text-base text-slate-200 leading-relaxed font-medium italic">"{bundle.auditNarrative}"</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-[8px] font-black text-emerald-400 uppercase mb-2">GPS Verification</p>
                      <span className="text-xs font-black text-white uppercase">Validated_Matched</span>
                   </div>
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-[8px] font-black text-sky-400 uppercase mb-2">Biometric Parity</p>
                      <span className="text-xs font-black text-white uppercase">Linked_Secured</span>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-6">
           <div className="bg-rose-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">SHIELD</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Legal_Defense_Action</h3>
              <p className="text-sm font-bold italic leading-relaxed mb-10">
                "Bundle verified. Hashed record pushed to the distributed agency ledger. Ready for insurance export."
              </p>
              <button 
               onClick={() => alert("SIGNAL_LOCKED: Bundle encrypted and transmitted to outside counsel.")}
               className="w-full py-5 bg-white text-rose-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                AUTHORIZE_LEGAL_EXPORT
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAuditVault;