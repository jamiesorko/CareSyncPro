import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import { decode, decodeAudioData } from '../../utils/audioHelpers';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const VoiceBriefingTerminal: React.FC<Props> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [briefingText, setBriefingText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const generateBriefing = async () => {
    setLoading(true);
    setBriefingText("");
    
    const prompt = `
      Act as the Chief of Staff for a Healthcare Enterprise. 
      Task: Synthesize a 100-word Daily Executive Briefing. 
      Focus: Clinical safety stability, fiscal reclamation success ($14k found), and regional labor threats (2 agencies hiring aggressively).
      Tone: Formal, urgent, strategic.
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      const text = response.text || "Operations nominal. Fiscal vectors stable. Resource core aligned.";
      setBriefingText(text);

      const audioBase64 = await geminiService.generateSpeech(text, 'Zephyr');
      
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(decode(audioBase64), outCtx, 24000, 1);
      
      const source = outCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(outCtx.destination);
      source.onended = () => setIsPlaying(false);
      
      setIsPlaying(true);
      source.start();
    } catch (e) {
      alert("Neural Briefing Interrupted. Signal lost in executive node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24 font-serif">
      <div className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Command_Audio_Feed</h2>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mt-3">Executive Sovereignty • Daily Neural Briefing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-[#0a0f1e] border border-white/5 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <div className="flex-1 flex flex-col justify-center items-center space-y-12 relative z-10">
              <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${isPlaying ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_100px_rgba(245,158,11,0.3)] animate-pulse' : 'bg-slate-900 border-white/10'}`}>
                 <span className="text-5xl">{isPlaying ? '🔊' : '🎙️'}</span>
              </div>
              
              <div className="text-center max-w-lg">
                {loading ? (
                  <div className="space-y-4">
                     <div className="h-2 w-full bg-white/5 rounded animate-pulse"></div>
                     <div className="h-2 w-3/4 bg-white/5 rounded animate-pulse mx-auto"></div>
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em] mt-8 animate-pulse">Synthesizing_Agency_State</p>
                  </div>
                ) : briefingText ? (
                  <p className="text-xl font-bold text-slate-200 leading-relaxed italic">"{briefingText}"</p>
                ) : (
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Press Initialize to generate the daily acoustic sovereignty report.</p>
                )}
              </div>
           </div>

           <button 
            onClick={generateBriefing}
            disabled={loading}
            className="w-full mt-12 py-8 bg-white text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
             {loading ? 'RECONSTRUCTING_HISTORY...' : 'INITIALIZE_DAILY_BRIEFING'}
           </button>
        </div>

        <div className="lg:col-span-5 space-y-6 flex flex-col">
           <div className="bg-amber-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col group">
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Strategic_Alerts</h3>
              <div className="space-y-6 flex-1">
                 <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase mb-1 opacity-60">Critical Path</p>
                    <p className="text-sm font-bold italic">Sector 4 staff retention drift: 12% probability hike.</p>
                 </div>
                 <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase mb-1 opacity-60">Capital Pulse</p>
                    <p className="text-sm font-bold italic">Unbilled supply delta recovered: +$842.00.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceBriefingTerminal;