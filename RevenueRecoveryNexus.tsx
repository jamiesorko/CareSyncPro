import React, { useState } from 'react';
import { revenueRecoveryService, RecoveryCase } from '../../services/revenueRecoveryService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const RevenueRecoveryNexus: React.FC<Props> = ({ language }) => {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(null);

  const simulateIngestion = async () => {
    setIsProcessing(true);
    const rawAdvice = "RA-OCT-2025: Claim #99283 Denied. Reason: Lack of clinical necessity (Code: 18-A). Billed: $450. Paid: $0. Claim #99284 Underpaid. Reason: Overlapping visit window. Billed: $120. Paid: $40.";
    const detected = await revenueRecoveryService.analyzeRemittance(rawAdvice);
    setCases(detected);
    setIsProcessing(false);
  };

  const runHarvest = async (c: RecoveryCase) => {
    setIsProcessing(true);
    const mockContext = "Patient required mechanical transfer via Hoyer Lift. GPS confirms staff on site for 62 minutes. Pulse spike noted at 10:15 AM justified high-acuity billing.";
    const update = await revenueRecoveryService.harvestEvidence(c, mockContext);
    
    setCases(prev => prev.map(item => item.id === c.id ? { ...item, ...update } as RecoveryCase : item));
    setIsProcessing(false);
    setSelectedCase({ ...c, ...update } as RecoveryCase);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Fiscal_Recovery_Nexus</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Evidence Harvesting & Multi-Payer Reconciliation</p>
        </div>
        <button 
          onClick={simulateIngestion}
          disabled={isProcessing}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isProcessing ? 'SCANNING_LEDGERS...' : 'INGEST_REMITTANCE_SIGNAL'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Case List */}
        <div className="lg:col-span-7 bg-slate-950 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10">Reclamation_Queue</h3>
           
           <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
              {cases.length === 0 && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-center px-20">
                   <span className="text-5xl mb-6">💰</span>
                   <p className="text-sm font-bold text-white uppercase tracking-widest leading-relaxed">No active leakage signals. Ingest a government remittance advice to initialize harvesting.</p>
                </div>
              )}
              
              {cases.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedCase(c)}
                  className={`p-8 rounded-3xl border transition-all cursor-pointer group ${selectedCase?.claimId === c.claimId ? 'bg-emerald-600/10 border-emerald-500/50' : 'bg-white/[0.03] border-white/5 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{c.claimId}</p>
                      <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{c.patientName}</h4>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-rose-500 italic">-${(c.billedAmount - c.paidAmount).toLocaleString()}</p>
                       <p className="text-[7px] font-bold text-slate-600 uppercase">Unpaid Delta</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                     <div>
                        <span className="px-2 py-0.5 bg-rose-600/20 text-rose-500 text-[8px] font-black rounded uppercase mr-2">{c.denialCode}</span>
                        <span className="text-[10px] text-slate-500 font-medium italic">"{c.denialReason}"</span>
                     </div>
                     {c.status === 'PENDING_HARVEST' ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); runHarvest(c); }}
                          className="px-6 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl"
                        >
                          Harvest_Evidence
                        </button>
                     ) : (
                        <div className="flex items-center space-x-2">
                           <p className="text-[10px] font-black text-emerald-400 uppercase italic">{c.recoveryProbability}% Probability</p>
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>
                     )}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Evidence & Appeal Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex-1 backdrop-blur-3xl overflow-hidden flex flex-col relative shadow-3xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="text-6xl font-black italic">APPEAL</span>
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Forensic_Evidence_Matrix</h3>
              
              {selectedCase ? (
                <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-right-4">
                   <div className="space-y-4">
                      <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Neural Proof Points</p>
                      {selectedCase.evidenceFound.length > 0 ? (
                        selectedCase.evidenceFound.map((e, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                             <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5"></div>
                             <p className="text-[11px] text-slate-200 font-medium leading-relaxed italic">"{e}"</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-600 italic">Click "Harvest Evidence" to interrogate the Neural Vault for this case.</p>
                      )}
                   </div>

                   {selectedCase.draftedAppeal && (
                     <div className="flex-1 flex flex-col min-h-0">
                        <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-4">Strategic Appeal Draft</p>
                        <div className="flex-1 bg-white/[0.02] border border-white/10 p-6 rounded-2xl overflow-y-auto scrollbar-hide text-[10px] font-mono text-slate-400 leading-relaxed">
                           {selectedCase.draftedAppeal}
                        </div>
                     </div>
                   )}

                   <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                      <button className="py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10">Modify_Draft</button>
                      <button 
                        disabled={!selectedCase.draftedAppeal}
                        onClick={() => alert("SIGNAL_LOCKED: Appeal transmitted to Payer Gateway via EDI 275.")}
                        className="py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                      >
                        Authorize_Recovery
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic px-10 text-center">
                  <p className="text-sm">Select a discrepancy from the queue to initialize forensic harvesting.</p>
                </div>
              )}
           </div>

           <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-600/30">
              <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">Recovery_Directive</p>
              <div className="flex items-baseline space-x-2 mb-8">
                 <p className="text-6xl font-black italic tracking-tighter">$14.2k</p>
                 <span className="text-xs font-black opacity-50 uppercase">Recoverable_Asset_Value</span>
              </div>
              <p className="text-sm font-bold italic leading-relaxed">
                "Neural Core identified 84% of Oct-RA underpayments are due to missing mobility tags. Cross-referencing Scribe logs now..."
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RevenueRecoveryNexus;