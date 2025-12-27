import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../../utils/audioHelpers';
import { Client, CareRole } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  clients: Client[];
  userRole: CareRole;
}

interface AgentInsight {
  agent: 'Clinical' | 'Ethics' | 'Fiscal';
  text: string;
  color: string;
}

const CaseConferenceRoom: React.FC<Props> = ({ language, clients, userRole }) => {
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [isActive, setIsActive] = useState(false);
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [status, setStatus] = useState('HUDDLE_IDLE');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const addInsight = (agent: 'Clinical' | 'Ethics' | 'Fiscal', text: string) => {
    const colors = { Clinical: 'text-sky-400', Ethics: 'text-amber-400', Fiscal: 'text-emerald-400' };
    setInsights(prev => [{ agent, text, color: colors[agent] }, ...prev].slice(0, 10));
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('CONSENSUS_LOCKED');
  }, []);

  const startSession = async () => {
    try {
      setStatus('TUNING_CIRCLE_OF_CARE...');
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
            setStatus('WAR_ROOM_ACTIVE');
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
              if (text.toLowerCase().includes('risk')) addInsight('Clinical', text);
              else if (text.toLowerCase().includes('choice') || text.toLowerCase().includes('right')) addInsight('Ethics', text);
              else if (text.toLowerCase().includes('cost') || text.toLowerCase().includes('bill')) addInsight('Fiscal', text);
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
          },
          onerror: () => setStatus('HUDDLE_INTERRUPTED'),
          onclose: () => setIsActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: `You are the Neural Huddle Moderator for ${selectedClient.name}. Participants include ${userRole}. 
          Listen for clinical risks, patient autonomy issues, and billing discrepancies. 
          Provide real-time brief verbal interjections to guide the human participants toward a safe care plan consensus.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('HUDDLE_SYNC_FAILED');
    }
  };

  useEffect(() => {
    return () => { if (sessionRef.current) sessionRef.current.close(); };
  }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Neural_Huddle_Suite</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Collaborative Consensus & Multi-Agent Case Conferencing</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
           {clients.slice(0, 3).map(c => (
             <button 
              key={c.id}
              disabled={isActive}
              onClick={() => setSelectedClient(c)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClient.id === c.id ? 'bg-indigo-600 text-white' : 'text-slate-500 disabled:opacity-20'}`}
             >
               {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Conference Stage */}
        <div className="lg:col-span-8 bg-slate-900 border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px] justify-between">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className={`relative w-64 h-64 rounded-full border-2 transition-all duration-1000 flex items-center justify-center ${isActive ? 'border-sky-500/50 shadow-[0_0_80px_rgba(14,165,233,0.2)]' : 'border-white/5'}`}>
                {/* Visual participant ring */}
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`absolute w-3 h-3 rounded-full bg-white transition-all duration-1000 ${isActive ? 'animate-pulse' : 'opacity-20'}`}
                    style={{ 
                      transform: `rotate(${i * 60}deg) translateY(-120px)`,
                      boxShadow: isActive ? '0 0 15px white' : 'none'
                    }}
                  ></div>
                ))}
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject</p>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedClient.name}</h3>
                  <p className={`text-[8px] font-bold mt-2 uppercase ${isActive ? 'text-emerald-400' : 'text-slate-700'}`}>{status}</p>
                </div>
             </div>
          </div>

          <div className="relative z-10">
            <button 
              onClick={isActive ? stopSession : startSession}
              className={`w-full py-10 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-2xl ${isActive ? 'bg-rose-600 text-white' : 'bg-white text-black'}`}
            >
              {isActive ? 'COMMIT_CONSENSUS_&_EXIT' : 'OPEN_NEURAL_CONFERENCE'}
            </button>
          </div>
        </div>

        {/* Neural Interjections Sidebar */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex-1 backdrop-blur-3xl overflow-hidden flex flex-col relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="text-6xl font-black italic">AUTO</span>
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Real-Time_Agent_Directives</h3>
              
              <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
                 {insights.length > 0 ? (
                   insights.map((insight, i) => (
                     <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl animate-in slide-in-from-right-4">
                        <div className="flex items-center space-x-2 mb-3">
                           <div className={`w-1.5 h-1.5 rounded-full ${insight.color.replace('text-', 'bg-')}`}></div>
                           <span className={`text-[8px] font-black uppercase tracking-widest ${insight.color}`}>Agent_{insight.agent}</span>
                        </div>
                        <p className="text-[11px] text-slate-200 font-medium leading-relaxed italic">"{insight.text}"</p>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex items-center justify-center text-center px-10 opacity-20 italic">
                     Awaiting conference trigger. Agents monitor for logic drift...
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/20">
              <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">Consensus_Protocol</p>
              <p className="text-sm font-bold italic leading-relaxed">
                Acoustics are being analyzed by three clinical agents. Speak clearly to confirm care plan amendments.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConferenceRoom;