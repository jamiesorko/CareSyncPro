import { GoogleGenAI, Modality } from "@google/genai";
import { encode } from '../utils/audioHelpers';

export interface SafetyPulse {
  aggressionScore: number;
  environmentRisk: number;
  aiCommentary: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export class GuardianService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async startEscort(onPulse: (pulse: SafetyPulse) => void) {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(session => session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message) => {
          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            const isAggressive = text.toLowerCase().includes('stop') || text.toLowerCase().includes('help');
            onPulse({
              aggressionScore: isAggressive ? 85 : 10,
              environmentRisk: 10,
              aiCommentary: text,
              status: isAggressive ? 'WARNING' : 'SAFE'
            });
          }
        },
        onerror: (e) => console.error(e),
        onclose: () => console.log("Escort finished")
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        systemInstruction: `Act as a Sentinel Safety Escort. Listen for verbal aggression, physical struggles, or clinician stress. Respond only if critical.`
      }
    });
    return await sessionPromise;
  }
}

export const guardianService = new GuardianService();