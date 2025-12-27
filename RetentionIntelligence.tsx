import React, { useState, useEffect } from 'react';
import { StaffMember, MarketThreat, StaffLoyaltyRisk } from '../../types';
import { retentionIntelligenceService } from '../../services/retentionIntelligenceService';

interface Props {
  staff: StaffMember[];
  language: string;
}

const RetentionIntelligence: React.FC<Props> = ({ staff, language }) => {
  const [threats, setThreats] = useState<MarketThreat[]>([]);
  const [risks, setRisks] = useState<StaffLoyaltyRisk[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeRegion, setActiveRegion] = useState('Toronto');

  const run = async () => {
    setLoading(true);
    try {
      const market = await retentionIntelligenceService.scanMarketThreats(activeRegion);
      setThreats(market);
      const riskResults = await Promise.all(staff.slice(0, 3).map(s => retentionIntelligenceService.calculateLoyaltyRisk(s, market)));
      setRisks(riskResults);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { run(); }, [activeRegion]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-sky-400">Retention_Intel</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Poaching Sentinel</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {['Toronto', 'Ottawa', 'Hamilton'].map(r => (
             <button key={r} onClick={() => setActiveRegion(r)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeRegion === r ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>{r}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
           <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-slate-500">Market_Threat_Inbound</h3>
           <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-2">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                   <div className="w-12 h-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest animate-pulse">Scraping_Labor_Boards</p>
                </div>
              ) : threats.map((t, i) => (
                <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl group transition-all">
                   <p className="text-sm font-black text-white uppercase italic">{t.competitor}</p>
                   <span className="text-[10px] text-emerald-400 font-bold uppercase mt-2 block">Wage: {t.wageOffer}</span>
                </div>
              ))}
           </div>
        </div>
        <div className="lg:col-span-8 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10">Personnel_Vulnerability_Matrix</h3>
           <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
              {risks.map((r, i) => {
                const s = staff.find(member => member.id === r.staffId);
                return (
                  <div key={i} className={`p-8 rounded-3xl border transition-all ${r.riskLevel === 'CRITICAL' ? 'bg-rose-600/10 border-rose-500/50' : 'bg-white/[0.03] border-white/5'}`}>
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{s?.name}</h4>
                           <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">{s?.role}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${r.riskLevel === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-slate-500'}`}>{r.riskLevel}</span>
                     </div>
                     <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-2xl">
                        <div>
                           <p className="text-[8px] font-black text-emerald-400 uppercase mb-2">Premium_Authorized</p>
                           <p className="text-3xl font-black text-white italic">+${r.suggestedPremium}<span className="text-xs text-slate-700 ml-2">/MO</span></p>
                        </div>
                        <button onClick={() => alert(`Premium of $${r.suggestedPremium} published to payroll.`)} className="px-6 py-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase shadow-xl">EXECUTE_PREMIUM</button>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RetentionIntelligence;