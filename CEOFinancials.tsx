
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import { MOCK_HISTORICAL_PL } from '../../data/accountingData';
import { geminiService } from '../../services/geminiService';

interface Props {
  language: string;
  currentStats: any;
}

const CEOFinancials: React.FC<Props> = ({ language, currentStats }) => {
  const [strategy, setStrategy] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateStrategy = async () => {
    setLoading(true);
    const context = {
      historical: MOCK_HISTORICAL_PL,
      current: currentStats
    };
    const response = await geminiService.getFinancialStrategy(context);
    setStrategy(response);
    setLoading(false);
  };

  // Simple SVG Line Chart Logic
  const maxVal = Math.max(...MOCK_HISTORICAL_PL.map(d => Math.max(d.revenue, d.expenses)));
  const points = MOCK_HISTORICAL_PL.map((d, i) => ({
    x: (i / (MOCK_HISTORICAL_PL.length - 1)) * 100,
    revY: 100 - (d.revenue / maxVal) * 100,
    expY: 100 - (d.expenses / maxVal) * 100
  }));

  const revPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.revY}`).join(' ');
  const expPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.expY}`).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* P&L Performance Graph */}
      <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Flux Telemetry: P&L</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Rolling 6-Month Fiscal Performance</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expenses</span>
             </div>
          </div>
        </div>

        <div className="h-64 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(v => (
              <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="white" strokeWidth="0.1" strokeOpacity="0.05" />
            ))}
            
            {/* Expense Line */}
            <path d={expPath} fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
            
            {/* Revenue Line */}
            <path d={revPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            
            {/* Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.revY} r="1.5" fill="#10b981" className="animate-pulse" />
                <circle cx={p.x} cy={p.expY} r="1.5" fill="#f43f5e" />
              </g>
            ))}
          </svg>
          
          <div className="flex justify-between mt-6">
            {MOCK_HISTORICAL_PL.map(d => (
              <span key={d.month} className="text-[9px] font-black text-slate-600 uppercase">{d.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Strategy Forge */}
      <div className="lg:col-span-4 bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-indigo-600/30">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Neural Strategy Forge</p>
          </div>
          <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight mb-6">Direct Profit Optimization</h3>
          
          <div className="space-y-4 min-h-[180px]">
            {loading ? (
              <div className="space-y-4">
                 <div className="h-2 w-full bg-white/10 rounded animate-pulse"></div>
                 <div className="h-2 w-3/4 bg-white/10 rounded animate-pulse delay-75"></div>
                 <div className="h-2 w-1/2 bg-white/10 rounded animate-pulse delay-150"></div>
              </div>
            ) : strategy ? (
              <p className="text-xs leading-relaxed font-medium text-indigo-50 italic whitespace-pre-wrap">{strategy}</p>
            ) : (
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest text-center mt-12 opacity-50">Awaiting Signal Ingestion</p>
            )}
          </div>
        </div>

        <button 
          onClick={handleGenerateStrategy}
          disabled={loading}
          className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
        >
          {loading ? 'Analyzing Vectors...' : 'Execute AI Analytics'}
        </button>
      </div>
    </div>
  );
};

export default CEOFinancials;
