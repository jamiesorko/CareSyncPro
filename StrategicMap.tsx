import React, { useState } from 'react';
import { strategicExpansionService, GrowthZone } from '../../services/strategicExpansionService';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const StrategicMap: React.FC<Props> = ({ language }) => {
  const [zones, setZones] = useState<GrowthZone[]>([]);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    const results = await strategicExpansionService.findNextGrowthVector("Greater Toronto Area");
    setZones(results);
    setLoading(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Expansion_Vector_Engine</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Grounded Demographics & Senior Density Analysis</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="px-8 py-3 bg-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? 'Ingesting Demographics...' : 'Map Growth Zones'}
        </button>
      </div>

      {zones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zones.map((zone, i) => (
            <div key={i} className="p-8 bg-amber-600/5 border border-amber-600/20 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black italic text-5xl text-amber-500">
                {zone.postalCodePrefix}
              </div>
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-4">Target Sector: {zone.postalCodePrefix}</p>
              <h4 className="text-3xl font-black text-white italic tracking-tighter mb-4">
                {zone.seniorDensityIndex}x Density
              </h4>
              <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                <Translate targetLanguage={language}>{zone.recommendation}</Translate>
              </p>
              <div className="mt-8 flex gap-4">
                <span className="text-[8px] font-black text-slate-500 uppercase border border-white/5 px-2 py-1 rounded">Competitor Presence: {zone.competitorPresence}</span>
                <span className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded">Projected ROI: High</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center opacity-30 italic">
          <p className="text-sm text-slate-500 tracking-widest uppercase font-black">Awaiting Strategic Signal</p>
        </div>
      )}
    </div>
  );
};

export default StrategicMap;