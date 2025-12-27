import React, { useState } from 'react';
import { ReclamationCase } from '../../types';
import { fiscalDefenseService } from '../../services/fiscalDefenseService';

interface Props {
  language: string;
}

const ForensicRecoveryHUD: React.FC<Props> = ({ language }) => {
  const [activeCase, setActiveCase] = useState<ReclamationCase | null>(null);
  const [loading, setLoading] = useState(false);

  const runReclamation = async () => {
    setLoading(true);
    const mockHistory = [
      "GPS confirms staff on-site for 65 mins.",
      "Vitals log shows acute BP surge justifying intervention.",
      "Scribe note mentions complex wound dressing applied."
    ];
    try {
      const update = await fiscalDefenseService.forgeDenialAppeal("CLM-992A", "Denied: Lacks clinical necessity", mockHistory);
      setActiveCase({
        id: "CLM-992A",
        denialCode: "18-A",
        denialReason: "Lacks clinical necessity",
        evidenceHarvested: update.evidenceHarvested || [],
        successProbability: update.successProbability || 0,
        draftedAppeal: update.draftedAppeal || "",
        status: 'READY'
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-500">Recovery_Nexus</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Forensic Evidence Harvesting & Revenue Reclamation</p>
        </div>
        <button 
          onClick={runReclamation}
          className="px-10 py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
        >
          {loading ? 'HARVESTING...' : 'DISCOVER_RECLAIMABLE_CAPITAL'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {!activeCase ? (
             <div className="flex-1 flex items-center justify-center opacity-20 italic">
               <p className="text-xl font-black uppercase tracking-widest">Awaiting_Denial_Signal</p>
             </div>
           ) : (
             <div className="space-y-12 relative z-10 animate-in zoom-in">
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                   <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-6">Evidence_Grounded_Proof</p>
                   <div className="space-y-4">
                      {activeCase.evidenceHarvested.map((e, i) => (
                        <div key={i} className="flex items-center gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                           <p className="text-sm text-slate-300 italic">"{e}"</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="flex-1 bg-black/40 border border-white/5 rounded-3xl p-10 overflow-y-auto scrollbar-hide max-h-[300px]">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-6">Strategic_Appeal_Brief</p>
                   <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">{activeCase.draftedAppeal}</p>
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-4 bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col group">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Recovery_Probability</h3>
           <div className="space-y-10 relative z-10 flex-1">
              <div className="flex items-baseline gap-2">
                 <p className="text-8xl font-black italic tracking-tighter">{activeCase?.successProbability || 0}%</p>
                 <span className="text-xs font-black opacity-50 uppercase">Certainty</span>
              </div>
              <p className="text-sm font-bold italic leading-relaxed">
                "Neural Harvester identifies 14% revenue leakage in Sector 4 wound care billing. Initiating bulk appeal cycle for October remittance."
              </p>
              <button 
                onClick={() => alert("SIGNAL_LOCKED: Appeal transmitted via EDI 275.")}
                className="w-full mt-auto py-5 bg-white text-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                AUTHORIZE_TRANSMISSION
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicRecoveryHUD;