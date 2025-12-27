
import React from 'react';
import { Client } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  clients: Client[];
  language: string;
}

const RiskMatrix: React.FC<Props> = ({ clients, language }) => {
  const highRiskClients = clients.filter(c => c.risk?.level === 'HIGH' || c.risk?.level === 'CRITICAL' || !c.risk);

  return (
    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Risk_Velocity_Monitor</h3>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Neural Hospital Readmission Prediction</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-[9px] font-black text-rose-500 uppercase">Critical</span>
           </div>
           <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-[9px] font-black text-amber-500 uppercase">Warning</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highRiskClients.map(client => (
          <div key={client.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:bg-white/10 transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-6 opacity-20 ${client.risk?.level === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>
               <span className="text-4xl font-black italic">!</span>
            </div>
            
            <p className="text-xl font-black text-white italic uppercase tracking-tighter">{client.name}</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">{client.conditions[0]}</p>
            
            <div className="mt-8 space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Readmission Prob.</span>
                  <span className="text-[10px] font-black text-rose-500">88%</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full">
                  <div className="h-full bg-rose-600 w-[88%] shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
               {client.risk?.factors.map((f, i) => (
                 <p key={i} className="text-[10px] text-slate-400 italic">→ {f}</p>
               ))}
               {!client.risk && <p className="text-[10px] text-sky-400 animate-pulse">Running Neural Diagnostic...</p>}
            </div>
            
            <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity">
               Open Clinical Record
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMatrix;
