
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { GeneratedImage } from '../types';

const ImageLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fix: Corrected handleGenerate to handle single image URL string return and update state correctly
  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const url = await geminiService.generateImage(prompt);
      if (url) {
        setImages(prev => [{ url, prompt }, ...prev]);
      }
    } catch (err) {
      alert("Failed to generate image. Please try a different prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Image Generation</h2>
        <div className="flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Artwork...</span>
              </>
            ) : (
              <span>Generate Image</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="w-full h-auto aspect-square object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-slate-500 line-clamp-2 italic">"{img.prompt}"</p>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = img.url;
                  link.download = `gemini-art-${idx}.png`;
                  link.click();
                }}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Download PNG
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && !loading && (
          <div className="col-span-full py-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Your generated gallery will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLab;
