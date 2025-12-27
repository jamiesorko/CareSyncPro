import React, { useState, useEffect, useRef } from 'react';
import { intentService, CommandIntent } from '../../services/intentService';
import { AppTab } from '../../types';

interface Props {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onClose: () => void;
}

const CommandIntercept: React.FC<Props> = ({ setActiveTab, onClose }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    const intent = await intentService.classifyIntent(input);
    
    if (intent.type === 'NAVIGATE' && intent.targetTab) {
      setActiveTab(intent.targetTab as AppTab);
      onClose();
    } else {
      setSuggestion(intent.rationale);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
        <form onSubmit={handleCommand} className="p-2">
          <div className="flex items-center px-6 py-4">
            <span className="text-2xl mr-4 opacity-50">⚡</span>
            <input 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Jump to a sector, find a staff member, or ask a directive..."
              className="flex-1 bg-transparent border-none text-xl font-medium text-white outline-none placeholder:text-slate-700 italic"
            />
            {isProcessing && (
              <div className="w-5 h-5 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
            )}
          </div>
        </form>

        {suggestion && (
          <div className="px-8 py-6 bg-white/5 border-t border-white/5 animate-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Neural Interpretation</p>
            <p className="text-sm text-slate-300 italic">{suggestion}</p>
          </div>
        )}

        <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
           <div className="flex gap-4">
              <span><span className="text-slate-400">ENTER</span> to Execute</span>
              <span><span className="text-slate-400">ESC</span> to Close</span>
           </div>
           <span className="text-sky-500">CareSync_AI_Node_v4.2</span>
        </div>
      </div>
    </div>
  );
};

export default CommandIntercept;