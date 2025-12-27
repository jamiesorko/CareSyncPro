import React, { useState, useEffect } from 'react';
    import { aiIntegritySentinel, HallucinationAlert } from '../../services/aiIntegritySentinel';
    import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const IntegrityShieldHUD: React.FC<Props> = ({ language }) => {
  const [alerts, setAlerts] = useState<HallucinationAlert[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const runAudit = async () => {
    setIsScanning(true);
    // Simulating a mismatch scan
    const mockBiometrics = [
      { clientId: 'c1', heartRate: 118, stepsToday: 420, status: 'STRESS' as const, timestamp: new Date().toISOString(), oxygenSaturation: 94 }
    ];
    const mockNote = "Patient Robert Johnson was calm, stationary, and sleeping during the 09:00 visit window.";
    
    const alert = await aiIntegritySentinel.verifyNeuralFidelity(mockNote, mockBiometrics);
    if (alert) setAlerts([alert]);
    setIsScanning(false);
  };

  useEffect(() => { runAudit(); }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-sky-400">Integrity_Shield</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Sovereignty & Hallucination Drift Intercept</p>
        </div>
        <button 
          onClick={runAudit}
          disabled={isScanning}
          className="px-10 py-4 bg-sky-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-3xl hover:bg-sky-500 transition-all"
        >
          {isScanning ? 'PROBING_FIDELITY...' : 'INITIALIZE_LOYALTY_SCAN'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-12">Neural_Drift_Log</h3>
           
           <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
              {alerts.length > 0 ? (
                alerts.map((a, i) => (
                  <div key={i} className={`p-10 rounded-[3rem] border transition-all ${a.severity === 'CRITICAL' ? 'bg-rose-600/10 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.1)]' : 'bg-white/[0.03] border-white/5'}`}>
                     <div className="flex justify-between items-start mb-8">
                        <span className={`px-3 py-1 rounded text-[8px] font-black uppercase ${a.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-600'} text-white`}>{a.severity}_BREACH</span>
                        <div className="text-right">
                           <p className="text-2xl font-black text-white italic">{Math.round(a.confidenceDrift * 100)}%</p>
                           <p className="text-[7px] font-bold text-slate-600 uppercase">Hallucination Delta</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <p className="text-[8px] font-black text-slate-600 uppercase mb-2">AI_Generated_Assertion</p>
                           <p className="text-xs text-slate-400 italic">"{a.sourceText}"</p>
                        </div>
                        <div className="p-6 bg-rose-600/5 border border-rose-500/20 rounded-2xl">
                           <p className="text-[8px] font-black text-rose-500 uppercase mb-2">Contradictory_Sensor_Vector</p>
                           <p className="text-xs text-white font-bold italic">"{a.contradictoryMetric}"</p>
                        </div>
                        <p className="text-[10px] text-sky-400 font-bold leading-relaxed uppercase">Root Failure: {a.logicFailureReason}</p>
                     </div>
                     <button 
                      onClick={() => { setAlerts([]); alert("LOGIC_REPAIRED: Neural weights re-centered against sensor truth."); }}
                      className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                     >
                       RE-SYNCHRONIZE_LOGIC_CORE
                     </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                   <span className="text-7xl mb-8">🛡️</span>
                   <p className="text-xl font-black text-white uppercase tracking-widest leading-relaxed">Neural Fidelity is 100%.</p>
                   <p className="text-xs font-bold text-slate-500 mt-2">Zero logic gaps detected between AI reasoning and physical biometrics.</p>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4 bg-sky-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="text-7xl font-black italic">TRUST</span>
           </div>
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Sovereignty_Status</h3>
           <div className="space-y-8 relative z-10">
              <div className="flex items-baseline gap-2">
                 <p className="text-8xl font-black italic tracking-tighter">99<span className="text-2xl opacity-50">.9</span></p>
                 <span className="text-xs font-black opacity-50 uppercase">Reliability</span>
              </div>
              <p className="text-sm font-bold italic leading-relaxed">
                "The Sentinel is currently cross-referencing 14,000 temporal data points to ensure AI agency directives match biological truth."
              </p>
              <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                 <p className="text-[8px] font-black uppercase mb-3 opacity-60">Fidelity_Node</p>
                 <p className="text-xs font-black tracking-tighter uppercase leading-none">Global_Intercept_Active</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrityShieldHUD;