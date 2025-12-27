
import React, { useState, useEffect } from 'react';
import Translate from '../../components/Translate';
import { geminiService } from '../../services/geminiService';
import LiveMap from '../coordination/LiveMap';

interface Props {
  language: string;
}

const WarRoom: React.FC<Props> = ({ language }) => {
  const [marketIntel, setMarketIntel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const fetchMarketIntel = async () => {
    setLoading(true);
    const query = "Current home care nursing shortages and flu outbreak trends in North York, Ontario October 2025.";
    try {
      const res = await geminiService.getMarketIntelligence(query);
      setMarketIntel(res.text || "No data available.");
      setSources(res.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (e) {
      setMarketIntel("Failed to ingest market signals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMarketIntel(); }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[600px]">
           <LiveMap language={language} />
        </div>
        <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col">
           <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Market_Intel</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse"></div>
                </div>
              ) : (
                <>
                  <p className="text-xs leading-relaxed text-slate-300 italic">{marketIntel}</p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-4">Grounding Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((s, i) => s.web && (
                        <a key={i} href={s.web.uri} target="_blank" className="text-[8px] bg-white/5 border border-white/5 px-2 py-1 rounded text-amber-500 truncate max-w-full">
                          {s.web.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
           </div>

           <button 
            onClick={fetchMarketIntel}
            className="mt-8 w-full py-4 bg-amber-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"
           >
             Refresh Global Signals
           </button>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;
