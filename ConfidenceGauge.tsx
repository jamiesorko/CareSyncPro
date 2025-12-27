
import React from 'react';

interface Props {
  score: number; // 0-100
  label?: string;
  variant?: 'sky' | 'emerald' | 'rose';
}

const ConfidenceGauge: React.FC<Props> = ({ score, label = "Certainty", variant = "sky" }) => {
  const colors = {
    sky: 'text-sky-400 stroke-sky-500/30',
    emerald: 'text-emerald-400 stroke-emerald-500/30',
    rose: 'text-rose-400 stroke-rose-500/30'
  };

  const ringColor = variant === 'sky' ? '#0ea5e9' : variant === 'emerald' ? '#10b981' : '#f43f5e';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
          <circle 
            cx="18" cy="18" r="16" fill="none" 
            stroke={ringColor} strokeWidth="2" 
            strokeDasharray={`${score}, 100`} 
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-black italic ${colors[variant]}`}>{score}%</span>
        </div>
      </div>
      <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-2">{label}</p>
    </div>
  );
};

export default ConfidenceGauge;
