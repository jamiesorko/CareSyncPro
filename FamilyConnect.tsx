import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { familySynthesisService } from '../../services/familySynthesisService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const FamilyConnect: React.FC<Props> = ({ language, clients }) => {
  const [reassurance, setReassurance] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const activeClient = clients[0]; // Robert Johnson

  useEffect(() => {
    const fetchUpdate = async () => {
      setLoading(true);
      const mockLog = "Patient was alert and oriented. Assisted with morning walk for 15 minutes. High protein breakfast consumed. Pulse steady at 74.";
      const res = await familySynthesisService.synthesizeUpdate(activeClient.name, mockLog);
      setReassurance(res);
      setLoading(false);
    };
    fetchUpdate();
  }, [activeClient]);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-teal-400">FamilyConnect</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Empathetic Transparency Mirror for {activeClient.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Reassurance HUD */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-[#0f172a] border border-white/10 rounded-[5rem] p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="text-9xl font-black italic text-white uppercase">Peace</span>
              </div>
              
              <div className="relative z-10 space-y-12">
                 <div className="flex items-center space-x-4">
                    <div className="w-1.5 h-10 bg-teal-400 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Neural_Care_Update</h3>
                 </div>

                 {loading ? (
                   <div className="py-20 flex flex-col items-center justify-center space-y-6">
                      <div className="w-12 h-12 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] animate-pulse">Synthesizing_Reassurance</p>
                   </div>
                 ) : (
                   <p className="text-4xl font-bold text-white leading-tight italic tracking-tighter animate-in slide-in-from-bottom-4">
                     "{reassurance}"
                   </p>
                 )}

                 <div className="pt-10 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                       <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Status</p>
                          <p className="text-xs font-black text-emerald-400 uppercase">Comfortable</p>
                       </div>
                       <div className="w-px h-8 bg-white/5"></div>
                       <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Last Visit</p>
                          <p className="text-xs font-black text-white uppercase">Today, 08:12 AM</p>
                       </div>
                    </div>
                    <button className="px-8 py-3 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Request_Clinical_Detail</button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
                 <h4 className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-8 italic">Wellness_Telemetry</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Resting Pulse</span>
                       <span className="text-[10px] font-black text-white italic">72 BPM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Mobility Level</span>
                       <span className="text-[10px] font-black text-emerald-400 italic">Improving</span>
                    </div>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
                 <h4 className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-8 italic">Team_Mirror</h4>
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-xl">👤</div>
                    <div>
                       <p className="text-sm font-black text-white uppercase italic">Elena R.</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Primary PSW • 98% Punctual</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Control Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-teal-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-teal-600/30">
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Advocate_Action</h3>
              <div className="space-y-6">
                 <button className="w-full py-5 bg-white text-teal-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Video_Chat_Request</button>
                 <button className="w-full py-5 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Post_Family_Note</button>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Continuity_History</p>
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                 {[
                   { date: 'Oct 14', event: 'Surgical staples removed successfully.' },
                   { date: 'Oct 13', event: 'Patient ambulated 40ft with minimal assist.' },
                   { date: 'Oct 12', event: 'New hydration protocol synchronized.' }
                 ].map((h, i) => (
                   <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                      <p className="text-[7px] font-black text-teal-400 uppercase mb-1">{h.date}</p>
                      <p className="text-[10px] text-slate-300 italic">"{h.event}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FamilyConnect;