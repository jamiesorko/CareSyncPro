import React, { useState, useEffect } from 'react';
import { fiscalHealthService } from '../../services/fiscalHealthService';
import { LeakageSignal } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const FiscalHealthCockpit: React.FC<Props> = ({ language }) => {
  const [signals, setSignals] = useState<LeakageSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<LeakageSignal | null>(null);

  const runDeepScan = async () => {
    setLoading(true);
    // Simulating a high-volume data interrogator
    const mockBatch = [
      { id: 'v-992', staff: 'Elena R.', claimedMileage: 42.4, gpsDistance: 31.8, duration: 60, billed: 'Standard' },
      { id: 'v-993', staff: 'Mark K.', claimedMileage: 12.0, gpsDistance: 12.0, duration: 90, note: 'Used complex dressing kit', billed: 'Basic' },
      { id: 'v-994', staff: 'Sarah J.', claimedMileage: 8.5, gpsDistance: 8.5, duration: 45, billed: 'Standard' }
    ];

    const results = await fiscalHealthService.detectMicroLeakage(mockBatch);
    setSignals(results);
    setLoading(false);
  };

  useEffect(() => {
    runDeepScan();
  }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-indigo-400">Fiscal_Health_Cockpit</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Capital Forensics & Micro-Leakage Intercept Hub</p>
        </div>
        <button 
          onClick={runDeepScan}
          disabled={loading}
          className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-indigo-500 transition-all border border-indigo-500/30"
        >
          {loading ? 'Interrogating_Ledgers...' : 'INITIATE_DEEP_FISCAL_AUDIT'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Leakage Queue */}
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10 relative z-10">Neural_Leakage_Inbound</h3>
           
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 overflow-y-auto scrollbar-hide pr-2">
              {loading ? (
                 <div className="col-span-2 flex flex-col items-center justify-center space-y-8 h-full">
                    <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] animate-pulse">Auditing_14,000_Visit_Nodes</p>
                 </div>
              ) : signals.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedSignal(s)}
                  className={`p-8 rounded-[3rem] border transition-all cursor-pointer group ${selectedSignal === s ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-white/[0.03] border-white/5 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded text-[8px] font-black uppercase ${
                      s.type === 'UPCODING' ? 'bg-emerald-600 text-white' : 
                      s.type === 'MILEAGE' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                       {s.type}
                    </div>
                    <div className="text-right">
                       <p className={`text-xl font-black italic ${s.type === 'UPCODING' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {s.type === 'UPCODING' ? '+' : '-'}${(s.estimatedLoss || 0).toLocaleString()}
                       </p>
                       <p className="text-[7px] font-bold text-slate-600 uppercase mt-1">Capital Drift</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase italic tracking-tighter mb-2">Vector: {s.involvedStaff}</h4>
                  <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed line-clamp-2">"{s.rationale}"</p>
                  
                  <div className="mt-6 flex justify-between items-baseline">
                     <div className="flex items-center space-x-2">
                        <span className="text-[8px] font-black text-slate-700 uppercase">Certainty Index</span>
                        <p className="text-xs font-black text-indigo-400">{Math.round((s.confidence || 0) * 100)}%</p>
                     </div>
                     <span className="text-xs text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Forensic Interrogation Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-[#1e1b4b] border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex-1 flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="text-7xl font-black italic uppercase">Vault</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-slate-500 italic">Neural_Forensic_Interrogator</h3>
              
              {selectedSignal ? (
                <div className="flex-1 flex flex-col space-y-10 animate-in slide-in-from-right-4 duration-500">
                   <div className="bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50"></div>
                      <p className="text-[8px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Logic_Evidence_Interrogation</p>
                      <p className="text-sm font-bold text-white italic leading-relaxed">
                        {selectedSignal.rationale}
                      </p>
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-[9px] font-bold text-slate-500 uppercase">Impact Probability</span>
                         <span className="text-[10px] font-black text-rose-500 uppercase italic tracking-widest">CRITICAL_EXPOSURE</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-[9px] font-bold text-slate-500 uppercase">Reclamation Potential</span>
                         <span className="text-[10px] font-black text-emerald-400 uppercase italic tracking-widest">HIGH_ROI</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => alert("SIGNAL_LOCKED: Fiscal adjustment committed to Ledger. Personnel management notified.")}
                    className="w-full mt-auto py-6 bg-white text-indigo-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                   >
                     EXECUTE_RECLAIM
                   </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic text-center px-10 space-y-6">
                   <span className="text-6xl">⚖️</span>
                   <p className="text-sm leading-relaxed">Select a capital drift vector from the matrix to initialize a deep forensic Interrogation cycle.</p>
                </div>
              )}
           </div>

           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30">
              <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">CFO_Operational_Directive</p>
              <div className="flex items-baseline space-x-2 mb-6">
                 <p className="text-6xl font-black italic tracking-tighter">1.8%</p>
                 <span className="text-xs font-black opacity-50 uppercase tracking-widest">Target_Leakage_Floor</span>
              </div>
              <p className="text-xs font-bold italic leading-relaxed">
                "Autonomous forensics have identified a recurring pattern of 'Phantom Mileage' in Sector 1. Initiating geo-boundary refinement to 100m buffer."
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FiscalHealthCockpit;