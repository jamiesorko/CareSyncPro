import React, { useState, useEffect } from 'react';
import { Client, StaffMember } from '../../types';
import { revenueIntegrityService, IntegrityAudit } from '../../services/revenueIntegrityService';

interface Props {
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const RevenueIntegrityConsole: React.FC<Props> = ({ language, clients, staff }) => {
  const [audits, setAudits] = useState<IntegrityAudit[]>([]);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    const mockVisits = [{ id: 'v-101', billed: 'Standard', duration: '12m', gps: false }];
    try {
      const result = await Promise.all(mockVisits.map(v => revenueIntegrityService.performIntegrityAudit(clients[0], staff[0], v)));
      setAudits(result);
    } catch (e) {
      console.error("Audit failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runAudit(); }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-amber-600">Revenue_Integrity</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Fiscal Forensics & Fraud Detection</p>
        </div>
        <button onClick={runAudit} className="px-10 py-4 bg-amber-600 text-white rounded-2xl text-[9px] font-black uppercase shadow-xl">TRIGGER_GLOBAL_AUDIT</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-amber-600/10 border-t-amber-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest animate-pulse">Reconciling_Fiscal_Vectors</p>
             </div>
           ) : (
             <div className="space-y-4 relative z-10">
                {audits.map((a, i) => (
                  <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-white/5 transition-all">
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{a.visitId}</p>
                        <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{a.leakageType}</h4>
                     </div>
                     <div className="text-right">
                        <p className={`text-2xl font-black italic ${a.integrityScore < 70 ? 'text-rose-500' : 'text-emerald-400'}`}>{a.integrityScore}%</p>
                        <p className="text-[7px] font-bold text-slate-600 uppercase mt-1">Integrity Score</p>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-amber-600 p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Reclamation_Directive</h3>
           <p className="text-sm font-bold italic leading-relaxed mb-10">"Neural Core detected patterns of under-billing in Sector 4. Recommend automated reclamation cycle."</p>
           <button onClick={() => alert("Starting reclamation cycle.")} className="w-full py-5 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase shadow-xl">EXECUTE_RECLAIM</button>
        </div>
      </div>
    </div>
  );
};

export default RevenueIntegrityConsole;