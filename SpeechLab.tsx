
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioHelpers';

const SpeechLab: React.FC = () => {
  const [text, setText] = useState('Welcome to the future of multimodal intelligence.');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

  const handleSynthesize = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);

    try {
      const base64Audio = await geminiService.generateSpeech(text, voice);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (err) {
      alert("Speech synthesis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Speech Synthesis</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Speaker Voice</label>
            <div className="flex flex-wrap gap-2">
              {voices.map(v => (
                <button
                  key={v}
                  onClick={() => setVoice(v)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    voice === v 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter text to speak..."
          />

          <button
            onClick={handleSynthesize}
            disabled={loading || !text.trim()}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-black disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Synthesize Audio</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechLab;
