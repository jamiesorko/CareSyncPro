import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const VideoLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    "Thinking about composition...",
    "Drafting temporal consistency...",
    "Simulating physics...",
    "Rendering high-quality frames...",
    "Finalizing pixels..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    // Veo key selection check - Added missing await for hasSelectedApiKey() to properly evaluate the selection state
    if (!await (window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }

    setLoading(true);
    setVideoUrl(null);
    
    // Simulate step progress
    const interval = setInterval(() => {
      setStep(s => (s + 1) % steps.length);
    }, 4000);

    try {
      const url = await geminiService.generateVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      // If the request fails due to missing key after selection dialog, reprompt.
      if (err.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
      }
      alert("Video generation failed or timed out. Note: Veo generation can take several minutes.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-6">Cinematic Synthesis (Veo)</h2>
        <p className="text-slate-400 text-sm mb-6">
          Generate high-fidelity videos from text descriptions. 
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 hover:underline ml-1">Requires paid API key.</a>
        </p>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a cinematic scene (e.g., 'A bioluminescent forest at night with floating embers')..."
            className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold disabled:opacity-50 transition-all flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{steps[step]}</span>
              </>
            ) : (
              <span>Direct Cinema</span>
            )}
          </button>
        </div>
      </div>

      {videoUrl && (
        <div className="bg-white p-2 rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full rounded-2xl aspect-video bg-black"
          />
          <div className="p-4 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Render Complete</span>
            <a 
              href={videoUrl} 
              target="_blank" 
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full font-bold transition-colors"
            >
              Raw File
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLab;