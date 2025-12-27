
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audioHelpers';
import { CareRole } from '../types';
import Translate from '../components/Translate';

interface Props {
  role: CareRole;
  onClose: () => void;
  language: string;
}

const AIConsult: React.FC<Props> = ({ role, onClose, language }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Neural Core Idle');
  const [transcript, setTranscript] = useState<string[]>([]);
  
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
    setStatus('Connection Severed');
  }, []);

  const startSession = async () => {
    try {
      setStatus('Calibrating Neural Sync...');
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
            setStatus('Neural Link: Active');
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
              setTranscript(prev => [...prev.slice(-10), `[CORE]: ${message.serverContent.outputTranscription.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscript(prev => [...prev.slice(-10), `[OPERATOR]: ${message.serverContent.inputTranscription.text}`]);
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
          onerror: (e) => setStatus('Link Interrupted'),
          onclose: () => setIsActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are the high-tech Neural Core Assistant for a ${role}. Provide rapid clinical insights.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('Calibration Failure');
    }
  };

  useEffect(() => {
    return () => { if (sessionRef.current) sessionRef.current.close(); };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-500">
      <div className="bg-[#020617] w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col h-[75vh] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-sky-500 animate-ping' : 'bg-slate-700'}`}></div>
            <h3 className="text-xl font-black text-white uppercase"><Translate targetLanguage={language}>Neural_Consult</Translate></h3>
          </div>
          <button onClick={onClose} className="text-slate-500 font-bold hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {transcript.map((line, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] font-medium border ${line.startsWith('[OPERATOR]') ? 'bg-sky-500/10 border-sky-500/20 text-sky-100 ml-12' : 'bg-white/5 border-white/10 text-slate-300 mr-12'}`}>
              {line}
            </div>
          ))}
          {transcript.length === 0 && <p className="text-slate-600 text-center mt-20 italic">Awaiting neural signal...</p>}
        </div>

        <div className="p-10 border-t border-white/5">
          <button onClick={isActive ? stopSession : startSession} className={`w-full py-6 rounded-2xl font-black text-xs tracking-[0.3em] transition-all ${isActive ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-white text-black'}`}>
            <Translate targetLanguage={language}>{isActive ? 'TERMINATE_SIGNAL' : 'OPEN_NEURAL_LINK'}</Translate>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsult;
