
import React from 'react';
import ConfidenceGauge from './ConfidenceGauge';

interface Props {
  title: string;
  subtitle: string;
  content: string;
  confidence: number;
  loading?: boolean;
  type?: 'CLINICAL' | 'FISCAL' | 'OPERATIONAL';
  children?: React.ReactNode;
}

const AnalysisCard: React.FC<Props> = ({ title, subtitle, content, confidence, loading, type = 'CLINICAL', children }) => {
  const theme = type === 'CLINICAL' ? 'indigo' : type === 'FISCAL' ? 'emerald' : 'sky';
  
  return (
    <div className={`bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] min-h-[300px] flex flex-col relative overflow-hidden transition-all duration-500 ${loading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-${theme}-500 animate-pulse`}></div>
            <p className={`text-[8px] font-black text-${theme}-400 uppercase tracking-widest`}>Neural_Analysis_Node</p>
          </div>
          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{title}</h4>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</p>
        </div>
        <ConfidenceGauge score={confidence} variant={type === 'CLINICAL' ? 'sky' : 'emerald'} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 relative z-10 mb-8">
        <p className="text-sm text-slate-300 leading-relaxed italic font-medium whitespace-pre-wrap">
          {content || "Awaiting signal ingestion..."}
        </p>
      </div>

      {children && <div className="relative z-10 pt-6 border-t border-white/5">{children}</div>}
      
      {/* Decorative Background Element */}
      <div className={`absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none`}>
        <span className="text-9xl font-black italic uppercase tracking-tighter">{type[0]}</span>
      </div>
    </div>
  );
};

export default AnalysisCard;
