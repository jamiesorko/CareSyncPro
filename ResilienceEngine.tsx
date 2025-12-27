
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import NeuralSelfHealingStation from './NeuralSelfHealingStation';

interface Props {
  language: string;
}

const ResilienceEngine: React.FC<Props> = ({ language }) => {
  const [activeSubTab, setActiveSubTab] = useState<'SELF_HEALING' | 'PRIVACY' | 'LOGIC'>('SELF_HEALING');

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Neural_Defense_Engine</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Institutional Integrity & Sovereignty Guard</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
          {['SELF_HEALING', 'PRIVACY', 'LOGIC'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Translate targetLanguage={language}>{tab}</Translate>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px] animate-in slide-in-from-bottom-4 duration-700">
        {activeSubTab === 'SELF_HEALING' && <NeuralSelfHealingStation language={language} />}
        
        {activeSubTab === 'PRIVACY' && (
          <div className="space-y-8">
             <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                   <span className="text-9xl font-black italic">WASH</span>
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-6 leading-none">Double-Scrubbing Protocol</h3>
                <p className="text-lg font-medium italic leading-relaxed max-w-2xl">
                  Automatically hides real names, phone numbers, and exact addresses from neural inference threads. exact fiscal amounts are bucketed into magnitude tiers.
                </p>
                <div className="mt-12 p-8 bg-black/20 rounded-3xl border border-white/10 inline-block">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-4">Privacy_State</p>
                   <p className="text-xs font-black uppercase tracking-tighter text-emerald-400">Total_Sovereignty_Active</p>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'LOGIC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between group">
                <div>
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">Truth_Detective</h3>
                   <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                     Autonomous engine scanning for physically impossible events across the roster.
                   </p>
                </div>
                <div className="mt-10 space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-white/10 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase italic">Active Roster Scan</span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">NOMINAL</span>
                   </div>
                </div>
             </div>
             <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between group">
                <div>
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">Integrity_Heartbeat</h3>
                   <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                     Cross-referencing GPS nodes with billing timestamps to enforce absolute honesty.
                   </p>
                </div>
                <div className="mt-10 space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-white/10 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase italic">GPS Drift Detection</span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ENABLED</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResilienceEngine;
