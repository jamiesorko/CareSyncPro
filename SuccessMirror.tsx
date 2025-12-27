import React, { useState, useEffect } from 'react';
import { Client, PatientDailySynthesis } from '../../types';
import { patientWellnessService } from '../../services/patientWellnessService';
import Translate from '../../components/Translate';

interface Props {
  client: Client;
  language: string;
}

const SuccessMirror: React.FC<Props> = ({ client, language }) => {
  const [synthesis, setSynthesis] = useState<PatientDailySynthesis | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWins = async () => {
    setLoading(true);
    const mockLogs = [
      "Patient assisted with daily walk, 20 steps achieved.",
      "Finished full lunch including fluids.",
      "Participated in puzzle activity for 10 minutes."
    ];
    try {
      const data = await patientWellnessService.synthesizeDailySuccess(client, mockLogs);
      setSynthesis(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadWins(); }, [client]);

  return (
    <div className="bg-[#fef3c7] border border-amber-200 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col">
      <div className="absolute top-0 right-0 p-10 opacity-5 font-black italic text-9xl text-amber-900 pointer-events-none">WIN</div>
      
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-amber-900/10 border-t-amber-900 rounded-full animate-spin"></div>
           <p className="text-xl font-black text-amber-900 uppercase tracking-widest animate-pulse">Finding Your Successes...</p>
        </div>
      ) : synthesis && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
           <div className="space-y-4">
              <p className="text-xl font-black text-amber-800/60 uppercase tracking-widest leading-none">Today's Progress</p>
              <h2 className="text-6xl font-black text-amber-950 tracking-tighter italic leading-none">{synthesis.headline}</h2>
           </div>

           <div className="space-y-6">
              {synthesis.accomplishments.map((win, i) => (
                <div key={i} className="flex items-center gap-8 bg-white/40 p-6 rounded-[2.5rem] border border-white group/win hover:scale-[1.02] transition-all">
                   <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg">✓</div>
                   <p className="text-2xl font-bold text-amber-950 italic">"{win}"</p>
                </div>
              ))}
           </div>

           <div className="mt-auto pt-10 border-t border-amber-900/10 flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black text-amber-800/50 uppercase tracking-widest mb-1">Your Visitor</p>
                 <p className="text-2xl font-black text-amber-900 uppercase italic">{synthesis.visitorToday}</p>
              </div>
              <button className="px-10 py-4 bg-amber-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">See More</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SuccessMirror;