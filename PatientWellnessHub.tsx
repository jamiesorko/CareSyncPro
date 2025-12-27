import React, { useState } from 'react';
import { Client } from '../../types';
import Translate from '../../components/Translate';
import SuccessMirror from './SuccessMirror';
import TherapeuticZenStation from './TherapeuticZenStation';

interface Props {
  language: string;
  clients: Client[];
}

const PatientWellnessHub: React.FC<Props> = ({ language, clients }) => {
  const [isListening, setIsListening] = useState(false);
  const activeClient = clients[0]; // Robert Johnson for demo

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        alert("CareBot: 'I am here, Robert. You have a physical therapy session at 3:00 PM today. Would you like me to play some soft music?'");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 lg:p-12 animate-in fade-in duration-1000 font-sans">
      <div className="max-w-7xl mx-auto space-y-12 pb-24">
        
        {/* Header / Big Clock */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-[4rem] p-10 backdrop-blur-2xl">
           <div className="text-center lg:text-left">
              <p className="text-xl font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Good Afternoon</p>
              <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">{activeClient.name}</h1>
           </div>
           <div className="mt-8 lg:mt-0 text-center">
              <p className="text-7xl font-black text-white italic tracking-tighter">02:14<span className="text-2xl text-slate-600 ml-2">PM</span></p>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-2">Next Visit: 03:00 PM (PT Session)</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Success Mirror - Left */}
           <div className="lg:col-span-7">
              <SuccessMirror client={activeClient} language={language} />
           </div>

           {/* Voice/Control - Right */}
           <div className="lg:col-span-5 flex flex-col gap-8">
              <button 
                onClick={toggleVoice}
                className={`h-[300px] bg-sky-600 rounded-[5rem] p-12 text-white shadow-2xl relative overflow-hidden transition-all active:scale-95 group ${isListening ? 'animate-pulse' : ''}`}
              >
                 <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
                    <span className="text-6xl font-black italic">TALK</span>
                 </div>
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isListening ? 'bg-white border-white' : 'bg-white/10 border-white/20 group-hover:bg-white/20'}`}>
                       <span className="text-5xl">{isListening ? '🎙️' : '🔘'}</span>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Care_Voice</h3>
                    </div>
                    {isListening && (
                      <div className="flex gap-1 h-8 items-end">
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className="w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }}></div>
                         ))}
                      </div>
                    )}
                 </div>
              </button>

              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                 <span className="text-5xl">👨‍👩‍👧</span>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed px-10">
                   "Your daughter, Sarah, sent you a photo this morning. Would you like to see it?"
                 </p>
                 <button className="px-8 py-3 bg-white text-black rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl">Open_Gallery</button>
              </div>
           </div>
        </div>

        {/* Zen Station - Full Width */}
        <TherapeuticZenStation client={activeClient} language={language} />

      </div>
    </div>
  );
};

export default PatientWellnessHub;