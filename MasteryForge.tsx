import React, { useState, useEffect } from 'react';
import { trainingForgeService } from '../../services/trainingForgeService';
import { TrainingModule, StaffMember } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  staffMember: StaffMember;
}

const MasteryForge: React.FC<Props> = ({ language, staffMember }) => {
  const [module, setModule] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const triggerForge = async () => {
    setLoading(true);
    try {
      const gap = "Documentation integrity during complex transfers (Hoyer Lift)";
      const result = await trainingForgeService.forgeModule(staffMember, gap);
      setModule(result);
      setActiveQuestion(0);
      setSelectedOpt(null);
      setIsComplete(false);
      setScore(0);
    } catch (e) {
      alert("Forge Desync. Re-calibrating educational vector...");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    setSelectedOpt(idx);
    const correct = idx === module?.questions[activeQuestion].correct;
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (activeQuestion + 1 < (module?.questions.length || 0)) {
        setActiveQuestion(prev => prev + 1);
        setSelectedOpt(null);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-[#fbbf24]">Mastery_Forge</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Remedial Neural Training & Clinical Competency Locking</p>
        </div>
        {!module && !loading && (
          <button 
            onClick={triggerForge}
            className="px-10 py-4 bg-[#fbbf24] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            INITIATE_FORGE_SCAN
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Lesson Area */}
        <div className="lg:col-span-8 bg-slate-900 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <span className="text-9xl font-black italic text-white uppercase tracking-tighter">Learn</span>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="w-20 h-20 border-4 border-[#fbbf24]/10 border-t-[#fbbf24] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-[#fbbf24] uppercase tracking-[0.5em] animate-pulse">Forging_Mastery_Lesson</p>
             </div>
           ) : isComplete ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in duration-700">
                <div className="w-40 h-40 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.2)]">
                   <span className="text-6xl">🏆</span>
                </div>
                <div>
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Mastery_Certified</h3>
                   <p className="text-slate-400 font-medium italic">"Score: {score}/{(module?.questions.length || 0)} | Skill: {module?.targetSkill}"</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setModule(null)} className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Return_to_Station</button>
                   <button onClick={triggerForge} className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase">Another_Challenge</button>
                </div>
             </div>
           ) : module ? (
             <div className="flex-1 flex flex-col relative z-10 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                <div>
                   <span className="px-3 py-1 bg-[#fbbf24]/20 text-[#fbbf24] text-[8px] font-black rounded uppercase">Remedial_Path_v4</span>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mt-4">{module.title}</h3>
                </div>

                <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem]">
                   <p className="text-[9px] font-black text-[#fbbf24] uppercase tracking-widest mb-6">Neural_Concept_Brief</p>
                   <p className="text-lg text-slate-200 font-medium italic leading-relaxed">"{module.conceptBrief}"</p>
                </div>

                <div className="space-y-10">
                   <div className="flex justify-between items-end">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mastery_Check ({activeQuestion + 1} / {module.questions.length})</p>
                      <div className="flex gap-1">
                         {module.questions.map((_, i) => (
                           <div key={i} className={`w-6 h-1 rounded-full ${activeQuestion >= i ? 'bg-[#fbbf24]' : 'bg-white/10'}`}></div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-8">
                      <p className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">"{module.questions[activeQuestion].q}"</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {module.questions[activeQuestion].a.map((opt, i) => (
                           <button 
                            key={i}
                            disabled={selectedOpt !== null}
                            onClick={() => handleAnswer(i)}
                            className={`p-6 rounded-[2rem] border text-left transition-all ${
                              selectedOpt === i 
                                ? (i === module.questions[activeQuestion].correct ? 'bg-emerald-500 border-white text-white' : 'bg-rose-600 border-white text-white') 
                                : (selectedOpt !== null && i === module.questions[activeQuestion].correct ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white')
                            }`}
                           >
                              <p className="text-xs font-black uppercase tracking-tighter">{opt}</p>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic">
                <span className="text-8xl mb-8">🛠️</span>
                <p className="text-lg font-bold">Forge station inactive. Initialize scan to find clinical gaps.</p>
             </div>
           )}
        </div>

        {/* Global Competency Stats */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-[#fbbf24] p-10 rounded-[3rem] text-black shadow-2xl shadow-yellow-500/30">
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60">Personal_Competency_Index</h3>
              <div className="flex items-baseline space-x-2 mb-8">
                 <p className="text-7xl font-black italic tracking-tighter">98</p>
                 <span className="text-xs font-black opacity-40 uppercase">Safe_to_Deploy</span>
              </div>
              <p className="text-sm font-bold italic leading-relaxed">
                "You have successfully locked 14 clinical mastery vectors this quarter. Your documentation precision is in the 94th percentile."
              </p>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Locked_Skills_Vault</p>
              <div className="space-y-6">
                 {[
                   { label: 'Oxygen Safety v4', date: 'Oct 12' },
                   { label: 'Catheter Management', date: 'Sep 28' },
                   { label: 'Cognitive De-escalation', date: 'Sep 15' },
                   { label: 'Handover Synthesis', date: 'Active' }
                 ].map((skill, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{skill.label}</span>
                      <span className="text-[9px] font-black text-white uppercase italic">{skill.date}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MasteryForge;