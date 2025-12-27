import React, { useState, useEffect } from 'react';
import { Client, StaffMember } from '../../types';
import { qualityAuditService, DefensibilityReport } from '../../services/qualityAuditService';

interface Props {
  language: string;
  clients: Client[];
  staff: StaffMember[];
}

const DefensibilityHub: React.FC<Props> = ({ language, clients, staff }) => {
  const [report, setReport] = useState<DefensibilityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const runAudit = async () => {
    setLoading(true);
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    try {
      const result = await qualityAuditService.auditDefensibility(staff[0], client, "Standard visit completed.");
      setReport(result);
    } catch (e) {
      console.error("Audit failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedClientId) runAudit(); }, [selectedClientId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-amber-500">Defensibility_Center</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Regulatory Shield</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button key={c.id} onClick={() => setSelectedClientId(c.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedClientId === c.id ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-white'}`}>{c.name}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] animate-pulse">Analyzing_Exposure_Vectors</p>
             </div>
           ) : report && (
             <div className="space-y-12 relative z-10 animate-in zoom-in">
                <div className="text-center py-10 bg-amber-500/5 border border-amber-500/20 rounded-[3rem]">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Defensibility Score</p>
                   <p className={`text-9xl font-black italic tracking-tighter ${report.score < 70 ? 'text-rose-500' : 'text-emerald-400'}`}>{report.score}%</p>
                </div>
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compliance Gaps</p>
                   {report.gaps.map((g, i) => (
                     <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        <p className="text-xs text-slate-300 italic">"{g}"</p>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
        <div className="lg:col-span-4 bg-amber-600 p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Legal_Directives</h3>
           <p className="text-sm font-bold italic leading-relaxed mb-10">"Legislative basis: {report?.legislation || "Waiting..."}"</p>
           <button onClick={() => alert("Corrective documentation task assigned.")} className="w-full py-5 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase shadow-xl">EXECUTE_CORRECTIVE_TASK</button>
        </div>
      </div>
    </div>
  );
};

export default DefensibilityHub;