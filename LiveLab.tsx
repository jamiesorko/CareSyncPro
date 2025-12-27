
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audioHelpers';

const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [status, setStatus] = useState('Ready to connect');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('Disconnected');
  }, []);

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      // Initializing GoogleGenAI according to strict requirements.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Live Listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // Using sessionPromise.then ensures data is only sent after successful connection.
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscripts(prev => [...prev.slice(-10), `Model: ${text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscripts(prev => [...prev.slice(-10), `You: ${text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              // Ensuring proper cleanup of audio source nodes.
              source.onended = () => {
                sourcesRef.current.delete(source);
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            // Correctly handling model turn interruption.
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live error', e);
            setStatus('Connection Error');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Closed');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: 'You are a fast-responding voice assistant. Keep answers brief and conversational.'
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setStatus('Failed to start session');
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) sessionRef.current.close();
    };
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
          isActive ? 'bg-red-100 animate-pulse scale-110' : 'bg-slate-100'
        }`}>
          <div className={`w-12 h-12 rounded-full ${isActive ? 'bg-red-500' : 'bg-slate-300'}`}></div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Live Multimodal API</h2>
          <p className={`text-sm font-medium mt-1 ${isActive ? 'text-red-500' : 'text-slate-500'}`}>
            {status}
          </p>
        </div>

        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            isActive 
              ? 'bg-slate-800 text-white hover:bg-slate-900' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
          }`}
        >
          {isActive ? 'Stop Conversation' : 'Start Talking'}
        </button>
      </div>

      <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 p-6 overflow-hidden flex flex-col">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Transcription Feed</h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {transcripts.map((t, i) => (
            <div key={i} className={`text-sm p-2 rounded-lg ${t.startsWith('You:') ? 'bg-blue-50 text-blue-800 ml-4' : 'bg-white text-slate-800 mr-4'}`}>
              {t}
            </div>
          ))}
          {transcripts.length === 0 && (
            <p className="text-slate-400 text-sm italic text-center mt-20">Voice activity will be transcribed here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLab;
