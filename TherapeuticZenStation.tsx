import React, { useState, useEffect } from 'react';
import { therapeuticZenService } from '../../services/therapeuticZenService';
import { Client, ZenVideoPrompt } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  client: Client;
  language: string;
}

const TherapeuticZenStation: React.FC<Props> = ({ client, language }) => {
  const [prompt, setPrompt] = useState<ZenVideoPrompt | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initZen = async () => {
    setLoading(true);
    try {
      const z = await therapeuticZenService.generateCalmingPrompt(client);
      setPrompt(z);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleForge = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const url = await therapeuticZenService.synthesizeZenMoment(prompt.prompt);
      setVideoUrl(url);
    } catch (e) { alert("Zen link interrupted. Try again."); }
    finally { setLoading(false); }
  };

  useEffect(() => { initZen(); }, [client]);

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-[5rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
      <div className="absolute top-0 right-0 p-10 opacity-5 font-black italic text-9xl text-white pointer-events-none">ZEN</div>
      
      <div className="relative z-10 flex flex-col h-full space-y-12">
         <div className="flex items-center space-x-6">
            <div className="w-2 h-12 bg-sky-500 rounded-full animate-pulse"></div>
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Therapeutic_Zen_Station</h3>
         </div>

         {videoUrl ? (
           <div className="flex-1 animate-in zoom-in duration-1000 space-y-8">
              <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-3xl border border-white/10">
                 <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              </div>
              <button onClick={() => setVideoUrl(null)} className="w-full py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white">Exit Meditation</button>
           </div>
         ) : (
           <div className="flex-1 flex flex-col justify-center space-y-12">
              <div className="max-w-2xl">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Neural Suggestion for Calm</p>
                 <p className="text-3xl font-bold text-white italic leading-tight">
                    {loading ? 'Thinking...' : `"${prompt?.prompt}"`}
                 </p>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={handleForge}
                  disabled={loading || !prompt}
                  className="px-12 py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                 >
                   {loading ? 'Synthesizing_Zen...' : 'INITIALIZE_ZEN_MOMENT'}
                 </button>
                 <button onClick={initZen} className="px-10 py-6 bg-white/5 border border-white/10 text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest">New Idea</button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default TherapeuticZenStation;