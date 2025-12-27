
import React from 'react';
import { Client } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const FamilyPortal: React.FC<Props> = ({ language, clients }) => {
  const myClient = clients[0]; // Logic: Mocking for current authenticated family member

  if (!myClient) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Family Care Node</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Family_Advocate_Hub</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Transparency Mirror for {myClient.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Care Delivery Trust Score</p>
            <p className="text-5xl font-black text-teal-400 tracking-tighter italic">9.8<span className="text-xs text-slate-600">/10</span></p>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-4 tracking-widest italic">Based on 14 Visits • 100% Punctual</p>
         </div>

         <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Biometric Feed</p>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400">Resting Heart Rate</span>
                  <span className="text-[10px] font-black text-white">72 BPM</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400">Active Steps Today</span>
                  <span className="text-[10px] font-black text-white">2,140</span>
               </div>
            </div>
         </div>

         <div className="bg-teal-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-teal-600/20">
            <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">Status Message</p>
            <p className="text-sm font-bold leading-relaxed italic">"The care team is currently on-site. Routine hydration protocol is being followed. Robert is resting comfortably."</p>
            <button className="mt-8 text-[9px] font-black uppercase border border-white/20 px-4 py-2 rounded-xl">Message Care Team</button>
         </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12">
         <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase italic">Upcoming Continuity</h3>
         <div className="space-y-4">
            {[
               { date: 'TOMORROW', time: '08:00 AM', staff: 'Elena R.', role: 'PSW', task: 'Morning Support' },
               { date: 'OCT 18', time: '01:30 PM', staff: 'Mark K.', role: 'RN', task: 'Clinical Assessment' }
            ].map((visit, i) => (
              <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] flex justify-between items-center">
                 <div>
                    <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">{visit.date} @ {visit.time}</span>
                    <h4 className="text-lg font-black text-white italic tracking-tighter uppercase mt-1">{visit.staff} ({visit.role})</h4>
                 </div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{visit.task}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default FamilyPortal;
