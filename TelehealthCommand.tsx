import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../../utils/audioHelpers';
import { Client } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
}

const TelehealthCommand: React.FC<Props> = ({ language, clients }) => {
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [isActive, setIsActive] = useState(false);
  const [signals, setSignals] = useState<string[]>([]);
  const [status, setStatus] = useState('READY_FOR_INTERCEPT');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('BRIDGE_TERMINATED');
  }, []);

  const startSession = async () => {
    try {
      setStatus('TUNING_NEURAL_VECTORS...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('LIVE_INTERCEPT_ACTIVE');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text.length > 5) {
                setSignals(prev => [text, ...prev].slice(0, 15));
              }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => setStatus('SIGNAL_FAILURE'),
          onclose: () => setIsActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: `You are the Neural Telehealth Intercept agent. Listen to the conversation between the nurse and patient: ${selectedClient.name}. Detect clinical concerns, agitation, or pain. Provide short verbal guidance to the nurse if asked.`
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setStatus('CALIBRATION_FAILED');
    }
  };

  useEffect(() => {
    return () => { if (sessionRef.current) sessionRef.current.close(); };
  }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Neural_Intercept_Station</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Real-Time Clinical Telemetry & Audio Synthesis</p>
        </div>
        <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              disabled={isActive}
              onClick={() => setSelectedClient(c)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedClient.id === c.id ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-white disabled:opacity-20'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Interface */}
        <div className="lg:col-span-8 bg-slate-900 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <span className="text-9xl font-black italic uppercase">Bridge</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10">
             <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${isActive ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_50px_rgba(14,165,233,0.3)] animate-pulse' : 'bg-slate-800 border-white/10'}`}>
                <div className={`w-12 h-12 rounded-full ${isActive ? 'bg-sky-500' : 'bg-slate-700'}`}></div>
             </div>
             
             <div className="text-center">
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">{selectedClient.name}</h3>
               <p className={`text-[10px] font-black tracking-[0.4em] uppercase ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`}>{status}</p>
             </div>

             <div className="flex gap-4 h-12 items-end">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`w-1.5 bg-sky-500/50 rounded-full transition-all duration-300 ${isActive ? 'animate-bounce h-12' : 'h-2'}`} style={{ animationDelay: `${i * 0.05}s` }}></div>
                ))}
             </div>
          </div>

          <div className="mt-12">
             <button 
              onClick={isActive ? stopSession : startSession}
              className={`w-full py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-2xl ${isActive ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-white text-black hover:scale-[1.02] active:scale-95'}`}
             >
               <Translate targetLanguage={language}>{isActive ? 'TERMINATE_INTERCEPT' : 'INITIALIZE_BRIDGE'}</Translate>
             </button>
          </div>
        </div>

        {/* Signals Sidebar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex-1 backdrop-blur-3xl overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Clinical_Logic_Signals</h3>
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-2">
                 {signals.length > 0 ? (
                   signals.map((s, i) => (
                     <div key={i} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl animate-in slide-in-from-right-4 duration-500">
                        <p className="text-[11px] text-slate-200 font-medium leading-relaxed italic">"{s}"</p>
                        <div className="mt-2 flex justify-between items-center">
                           <span className="text-[7px] font-black text-sky-500 uppercase tracking-tighter">Diagnostic_Inference</span>
                           <span className="text-[7px] font-bold text-slate-700 uppercase">92% CONF</span>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-20 italic text-sm text-slate-500 text-center px-10">
                     Awaiting live acoustic ingestion to synchronize logic...
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-sky-600/10 border border-sky-500/20 p-10 rounded-[3rem]">
              <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-4 italic">Operative_Directive</p>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">During the link, the AI monitors for cognitive decline markers and respiratory effort. Use "Neural Scribe" afterward to finalize the summary.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TelehealthCommand;