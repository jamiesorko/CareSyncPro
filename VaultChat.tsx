import React, { useState, useRef, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const VaultChat: React.FC<Props> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<{ answer: string; thought: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInterrogate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isThinking) return;

    setIsThinking(true);
    setResult(null);

    const response = await documentService.queryKnowledgeBase(query);
    setResult(response);
    setIsThinking(false);
    setQuery('');
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
        <div className="absolute top-0 right-0 p-10 opacity-5 font-black italic text-8xl text-white pointer-events-none">ASK</div>
        
        <div className="flex-1 overflow-y-auto space-y-10 scrollbar-hide pr-4" ref={scrollRef}>
          {result ? (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              {/* Reasoning HUD */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                  <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Neural_Chain_of_Thought</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic font-mono">
                  {result.thought}
                </p>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
              </div>

              {/* Final Directive */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-10 bg-white rounded-full"></div>
                  <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Authoritative_Directive</h4>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-base text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                    {result.answer}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
               <div className="w-20 h-20 mb-8 border-2 border-white/20 rounded-full flex items-center justify-center animate-pulse">
                 <span className="text-4xl">🧠</span>
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-widest">Awaiting Knowledge Query</h3>
               <p className="text-xs text-slate-500 mt-2 font-bold">The Neural Core is indexed and ready to synthesize protocols.</p>
            </div>
          )}

          {isThinking && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-12 h-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.6em] animate-pulse">Interrogating_Vault_Vectors</p>
            </div>
          )}
        </div>

        <form onSubmit={handleInterrogate} className="mt-8 relative">
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Interrogate SOPs, Legislation, or Patient Dossiers..."
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black text-white focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-800 italic"
          />
          <button 
            type="submit"
            disabled={!query.trim() || isThinking}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-xl"
          >
            🚀
          </button>
        </form>
      </div>

      <div className="flex justify-between px-10">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Gemini 3 Pro Thinking Instance • v2.4</p>
        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Signal Integrity: 100%</p>
      </div>
    </div>
  );
};

export default VaultChat;