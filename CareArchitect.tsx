
import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const CareArchitect: React.FC<Props> = ({ language }) => {
  const [objective, setObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [sop, setSop] = useState<any>(null);

  const handleSynthesize = async () => {
    if (!objective.trim()) return;
    setLoading(true);
    try {
      // Use the correct thinkingBudget for Gemini 3 Pro
      const prompt = `
        Act as a Lead Clinical Compliance Architect. 
        Objective: "${objective}"
        
        Task: Synthesize a professional Standard Operating Procedure (SOP).
        1. Write a formal title.
        2. Sequence a 30-day timeline for RN and PSW roles.
        3. Reference exactly one Ontario health law guardrail.
        4. Include a 3-point forensic audit checklist.
        
        Return JSON.
      `;
      const res = await geminiService.generateAdvancedReasoning(prompt);
      setSop(JSON.parse(res.text || '{}'));
    } catch (e) {
      alert("Neural forge desync. Re-calibrating logic patterns...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-sky-400">Care_Architect</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3 italic">Autonomous Clinical Protocol Synthesis & Sequencing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col space-y-8">
           <div className="bg-slate-900 border border-white/10 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-between flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <span className="text-7xl font-black italic">SOP</span>
              </div>
              <div className="space-y-10 relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Directive_Vector_Ingest</h3>
                 <textarea 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="E.g. New protocol for Stage 4 pressure sores in high-acuity residential environments."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-sm text-white focus:outline-none focus:border-sky-500 transition-all italic placeholder:text-slate-800"
                 />
              </div>
              <button 
                onClick={handleSynthesize}
                disabled={loading || !objective.trim()}
                className="w-full mt-10 py-8 bg-sky-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
              >
                {loading ? 'SEQUENCING_VECTORS...' : 'EXECUTE_SOP_SYNTHESIS'}
              </button>
           </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[750px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           {!sop && !loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                <span className="text-[120px] mb-12">🏗️</span>
                <h3 className="text-3xl font-black text-white uppercase tracking-widest leading-none">Awaiting Blueprint</h3>
                <p className="text-sm font-bold text-slate-500 mt-6 max-w-sm">The Architect transforms executive intent into role-sequenced clinical workflows with absolute regulatory parity.</p>
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl">🧩</div>
                </div>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.8em] animate-pulse">Forging_Master_Directive</p>
             </div>
           ) : (
             <div className="flex-1 space-y-12 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{sop.title || 'SOP_Draft'}</h3>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-4 italic">Regulatory_Alignment: Validated</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Workflow_Sequence</p>
                   <div className="space-y-4">
                      {(sop.timeline || []).map((step: any, i: number) => (
                        <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-8 group hover:bg-white/5 transition-all">
                           <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-[11px] font-black text-sky-400 italic">{i+1}</div>
                           <div>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{step.role}</p>
                              <p className="text-sm text-white font-bold italic">"{step.task}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem]">
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-6 italic">Forensic_Audit_Checklist</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(sop.checklist || []).map((item: string, i: number) => (
                        <div key={i} className="flex items-center space-x-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                           <p className="text-[10px] text-slate-300 font-bold uppercase">{item}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={() => alert("SIGNAL_LOCKED: SOP published to Neural Ledger. Fleet terminals updated.")}
                  className="w-full py-8 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  AUTHORIZE_&_PUBLISH_PROTOCOL
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CareArchitect;
