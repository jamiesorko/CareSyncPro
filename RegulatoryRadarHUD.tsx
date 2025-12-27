import React, { useState, useEffect } from 'react';
import { regulatoryRadarService, LawChange } from '../../services/regulatoryRadarService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const RegulatoryRadarHUD: React.FC<Props> = ({ language }) => {
  const [laws, setLaws] = useState<LawChange[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLaws = async () => {
    setLoading(true);
    try {
      const data = await regulatoryRadarService.scanLegislativeDrift("Ontario");
      setLaws(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLaws(); }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24 h-[600px] overflow-hidden flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-sky-400">Regulatory_Radar</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Grounded Legislative Drift Detection</p>
        </div>
        <button 
          onClick={fetchLaws}
          className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          {loading ? 'SCANNING_GAZETTES...' : 'SYNC_MANDATES'}
        </button>
      </div>

      <div className="flex-1 bg-slate-950 border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-0">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
         
         <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6 relative z-10 pr-2">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest animate-pulse">Ingesting_Legal_Vectors</p>
              </div>
            ) : laws.length > 0 ? (
              laws.map((law, i) => (
                <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{law.title}</h4>
                      <p className="text-[10px] font-bold text-sky-400 uppercase mt-2">Effective: {law.effectiveDate}</p>
                    </div>
                    <a href={law.sourceUrl} target="_blank" className="text-[8px] font-black text-slate-500 uppercase border border-white/10 px-3 py-1 rounded hover:text-white transition-colors">Source_Link</a>
                  </div>
                  <p className="text-sm text-slate-400 font-medium italic mb-6 leading-relaxed">"{law.summary}"</p>
                  <div className="flex flex-wrap gap-2">
                    {law.affectedSOPs.map(sop => (
                      <span key={sop} className="px-3 py-1 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded text-[8px] font-black uppercase">At Risk: {sop}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center opacity-20 italic">No legal drift detected in the last 24h cycle.</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default RegulatoryRadarHUD;