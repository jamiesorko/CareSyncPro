
import React from 'react';

interface Props {
  idleIndex: number;
  continuity: number;
}

const EfficiencyHUD: React.FC<Props> = ({ idleIndex, continuity }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fleet_Idle_Index</p>
       <p className="text-3xl font-black text-emerald-400 italic">
         {idleIndex}<span className="text-xs ml-1 opacity-40 uppercase">min/hr saved</span>
       </p>
    </div>
    <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Continuity_Lock</p>
       <p className="text-3xl font-black text-white italic">{continuity}%</p>
    </div>
  </div>
);

export default EfficiencyHUD;
