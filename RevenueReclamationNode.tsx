import React, { useState } from 'react';
import { ReclamationCase } from '../../types';
import { fiscalReclamationService } from '../../services/fiscalReclamationService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const RevenueReclamationNode: React.FC<Props> = ({ language }) => {
  const [cases, setCases] = useState<ReclamationCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ReclamationCase | null>(null);

  const runDiscovery = async () => {
    setLoading(true);
    // Simulating a detected denial
    const claimId = 'CLM-992A';
    const reason = "Denial: Lack of medical necessity for specialized wound dressing. Billing code: W-92.";
    const mockDossier = "Patient has Stage 3 sacral wound. RN Tom Hardy documented 22cm area with exudate. GPS confirms 65-min visit. Scribe audio confirms complex dressing applied.";
    
    try {
      const result = await fiscalReclamationService.harvestEvidenceForClaim(claimId, reason, mockDossier);
      setCases([result]);
      setSelectedCase(result);
    } catch (e) {
      alert("Discovery Link Interrupted. Fiscal signal lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-emerald-500">Revenue_Reclamation_Node</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Evidence Harvesting & Forensic Denial Response</p>
        </div>
        <button 
          onClick={runDiscovery}
          disabled={loading}
          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? 'INGESTING_DENIAL_VECTORS...' : 'DISCOVER_RECLAIMABLE_ASSETS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Discovery List */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <span className="text-8xl font-black italic">WIN</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-10 italic">Inbound_Fiscal_Gap_Queue</h3>
              
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                 {cases.map((c, i) => (
                   <div 
                    key={i} 
                    onClick={() => setSelectedCase(c)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${selectedCase?.id === c.id ? 'bg-emerald-600/10 border-emerald-500/50 shadow-xl' : 'bg-white/[0.03] border-white/5 hover:bg-white/5'}`}
                   >
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">{c.id}</p>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[7px] font-black rounded uppercase">RECOVERABLE</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold italic mb-4 line-clamp-2">"{c.denialReason}"</p>
                      <div className="flex justify-between items-baseline">
                         <span className="text-[9px] font-black text-emerald-400 uppercase">{c.successProbability}% Success Probability</span>
                         <span className="text-xs">→</span>
                      </div>
                   </div>
                 ))}
                 {cases.length === 0 && !loading && (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                      <p className="text-sm">Awaiting capital discovery signal...</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-600/30">
              <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">Capital_Reclamation_Pulse</p>
              <div className="flex items-baseline gap-2 mb-6">
                 <p className="text-6xl font-black italic tracking-tighter">$14.2k</p>
                 <span className="text-xs font-black opacity-50 uppercase">At_Risk_Assets</span>
              </div>
              <p className="text-xs font-bold italic leading-relaxed">
                "Neural Harvester detects 92% evidence coverage for current denials. Projected reclamation window: 14 business days."
              </p>
           </div>
        </div>

        {/* Forensic Brief Stage */}
        <div className="lg:col-span-7 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[750px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {!selectedCase && !loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <span className="text-9xl mb-8">🛡️</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Awaiting Case Target</h3>
                <p className="text-sm font-bold text-slate-500 mt-4 max-w-sm">The Reclamation Node interrogates the Neural Vault to harvest evidence refute denials.</p>
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="w-24 h-24 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.8em] animate-pulse">Harvesting_Clinical_Proof</p>
             </div>
           ) : selectedCase && (
             <div className="flex-1 flex flex-col relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Appeal_Vector: {selectedCase.id}</h3>
                      <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-4 italic">Denial Code: {selectedCase.denialCode}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Recovery Possible</p>
                      <p className="text-3xl font-black text-white italic">$450.00</p>
                   </div>
                </div>

                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl mb-12">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Grounded_Evidence_Harvested</p>
                   <div className="space-y-4">
                      {selectedCase.evidenceHarvested.map((e, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                           <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                           <p className="text-xs text-slate-200 font-medium italic">"{e}"</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-black/40 border border-white/5 rounded-3xl p-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <span className="text-8xl font-black italic">DOC</span>
                   </div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">Drafted_Appeal_Brief</h4>
                   <div className="flex-1 overflow-y-auto scrollbar-hide">
                      <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {selectedCase.draftedAppeal}
                      </p>
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button 
                    onClick={() => alert("SIGNAL_LOCKED: Fiscal appeal transmitted via EDI-275 gateway. Evidence bundle attached.")}
                    className="flex-[2] py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     AUTHORIZE_&_TRANSMIT
                   </button>
                   <button className="flex-1 py-6 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                     Audit_Source_Logs
                   </button>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default RevenueReclamationNode;