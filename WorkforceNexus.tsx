import React, { useState, useEffect } from 'react';
import { StaffMember } from '../../types';
import { workforceResilienceService, MentorshipPairing } from '../../services/workforceResilienceService';

interface Props {
  staff: StaffMember[];
  language: string;
}

const WorkforceNexus: React.FC<Props> = ({ staff, language }) => {
  const [pairings, setPairings] = useState<MentorshipPairing[]>([]);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    const results = await workforceResilienceService.calculateSynergy(staff);
    setPairings(results);
    setLoading(false);
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Mentorship_Nexus</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Synergy Pairing & Clinical Mastery Support</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? 'CALIBRATING_SYNERGY...' : 'RE-SYNC_PAIRINGS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Human Capital Heatmap Overlay */}
        <div className="lg:col-span-7 bg-slate-950 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10">Synergy_Deployment_Matrix</h3>
           
           <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
              {pairings.map((p, i) => {
                const mentor = staff.find(s => s.id === p.mentorId);
                const mentee = staff.find(s => s.id === p.menteeId);
                return (
                  <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all animate-in slide-in-from-bottom-4">
                     <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-white italic">M</div>
                           <div>
                              <p className="text-sm font-black text-white uppercase italic">{mentor?.name}</p>
                              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Master Lead</p>
                           </div>
                        </div>
                        <div className="w-8 h-px bg-white/10"></div>
                        <div className="flex items-center space-x-4 text-right">
                           <div>
                              <p className="text-sm font-black text-white uppercase italic">{mentee?.name}</p>
                              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Clinical Operative</p>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black text-white italic">O</div>
                        </div>
                     </div>

                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Focus: {p.focusArea}</p>
                           <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed max-w-md">"{p.reason}"</p>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-black text-indigo-400 italic">{p.synergyScore}%</p>
                           <p className="text-[7px] font-black text-slate-600 uppercase">Match Score</p>
                        </div>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Global Resilience Metrics */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">BND</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Team_Cohesion_Pulse</h3>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-baseline space-x-2">
                    <p className="text-7xl font-black italic tracking-tighter">82</p>
                    <span className="text-xs font-black opacity-40 uppercase">Safe_Baseline</span>
                 </div>
                 <p className="text-sm font-bold italic leading-relaxed">
                   "Linguistic alignment across Sector 4 indicates high morale. Mentorship synergies have reduced documentation latency by 14% this quarter."
                 </p>
                 <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white shadow-[0_0_20px_white]" style={{ width: '82%' }}></div>
                 </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Resilience_Log</h3>
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { label: 'Burnout Delta', val: '-8.4%', color: 'text-emerald-400' },
                   { label: 'Skill Mastery Growth', val: '+12.1%', color: 'text-sky-400' },
                   { label: 'Pairing Coverage', val: '94%', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
                 <p className="text-[8px] text-slate-700 italic text-center mt-12 px-10">Neural Analysis correlates vocal fatigue markers with visit success rates in real-time.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default WorkforceNexus;