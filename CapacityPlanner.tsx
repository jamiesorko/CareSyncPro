
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import { geminiService } from '../../services/geminiService';

interface Props {
  language: string;
}

const CapacityPlanner: React.FC<Props> = ({ language }) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateStaffingPlan = async () => {
    setLoading(true);
    const mockDemandData = {
      activeClients: 142,
      averageAcuity: 'High (Clinical Level 4)',
      sectorSaturation: { 'North York': '98%', 'Etobicoke': '62%' },
      upcomingDischarges: 4,
      referralPipeline: 12
    };

    try {
      const response = await geminiService.generateText(
        `Action: Strategic Capacity Analysis. 
        Data: ${JSON.stringify(mockDemandData)}
        Task: Recommend EXACT quantity of field staff (PSW, RN) required to safely onboard the 12 pending referrals while maintaining 95% service quality in North York. 
        Format: Concise, data-driven HR directive.`,
        false
      );
      setRecommendation(response.text || "AI Engine Timeout.");
    } catch (err) {
      setRecommendation("Failure in neural capacity analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-indigo-600/10 border border-indigo-500/20 p-12 rounded-[4rem] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <span className="text-9xl font-black italic">PLAN</span>
        </div>
        
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Neural Capacity Forecaster</h3>
        <p className="text-indigo-300 text-sm max-w-xl mx-auto font-medium">Recommend staffing levels based on client flow and referral pipeline intensity.</p>
        
        <button 
          onClick={generateStaffingPlan}
          disabled={loading}
          className="mt-12 px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center mx-auto space-x-4"
        >
          {loading ? 'Analyzing Flux...' : 'Execute Resource Synthesis'}
        </button>

        {recommendation && (
          <div className="mt-12 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] text-left animate-in slide-in-from-top-6 duration-700">
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Resource Core Directive</span>
             </div>
             <p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CapacityPlanner;
