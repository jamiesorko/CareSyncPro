import React, { useState } from 'react';
import Translate from '../components/Translate';
import { CareRole, Complaint } from '../types';
import { MOCK_STAFF } from '../data/careData';
import { geminiService } from '../services/geminiService';
import StabilityGrid from './coo/StabilityGrid';
import ThroughputPulse from './coo/ThroughputPulse';

interface Props {
  language: string;
}

const COOCommand: React.FC<Props> = ({ language }) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'STAFF_SUPPORT' | 'STABILITY' | 'PULSE' | 'POLICY'>('OVERVIEW');
  const [loading, setLoading] = useState(false);
  const [policyDraft, setPolicyDraft] = useState<string | null>(null);

  const staffComplaints: Complaint[] = [
    { 
      id: 'sc1', 
      companyId: 'demo-company',
      clientId: 'N/A',
      clientName: 'N/A',
      staffId: 's1', 
      staffName: 'Elena R. (PSW)', 
      content: 'Requesting more robust PPE for Sector 4 visits. Current supply latency is high.', 
      timestamp: '2025-10-15 11:00', 
      status: 'NEW', 
      priority: 'HIGH',
      type: 'STAFF_GRIEVANCE'
    }
  ];

  const handleDraftPolicy = async () => {
    setLoading(true);
    const prompt = `Context: COO Healthcare Policy. Action: Draft Staff Wellness policy based on high field density. Concise bullets.`;
    try {
      const res = await geminiService.generateText(prompt, false);
      setPolicyDraft(res.text || "Policy synthesis complete.");
    } catch (e) {
      setPolicyDraft("Neural logic bottleneck.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]"><Translate targetLanguage={language}>Operations Control Center</Translate></span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic"><Translate targetLanguage={language}>COO_OPERATIONAL_MATRIX</Translate></h2>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl overflow-x-auto scrollbar-hide">
          {['OVERVIEW', 'STAFF_SUPPORT', 'STABILITY', 'PULSE', 'POLICY'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSubTab === tab ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Translate targetLanguage={language}>{tab}</Translate>
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'STABILITY' && <StabilityGrid language={language} />}
      {activeSubTab === 'PULSE' && <ThroughputPulse language={language} />}

      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Agency Velocity', val: '94.2%', color: 'text-cyan-400' },
               { label: 'Validation Latency', val: '115m', color: 'text-emerald-400' },
               { label: 'Staff Reliability', val: '88%', color: 'text-white' },
               { label: 'Compliance Index', val: '99.8%', color: 'text-white' }
             ].map((stat, i) => (
               <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4"><Translate targetLanguage={language}>{stat.label}</Translate></p>
                  <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
               </div>
             ))}
          </div>
          <ThroughputPulse language={language} />
        </div>
      )}

      {activeSubTab === 'STAFF_SUPPORT' && (
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase italic">Professional Support Link</h3>
          <div className="space-y-6">
             {staffComplaints.map(complaint => (
               <div key={complaint.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center gap-8 group hover:bg-white/5 transition-all">
                  <div className="flex-1">
                     <div className="flex items-center space-x-3 mb-4">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-rose-500 text-white uppercase">{complaint.priority}_PRIORITY</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{complaint.timestamp}</span>
                     </div>
                     <h4 className="text-lg font-black text-white italic tracking-tighter uppercase">Support Req: {complaint.staffName}</h4>
                     <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium">"{complaint.content}"</p>
                  </div>
                  <button className="px-8 py-3 bg-cyan-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-cyan-600/20 hover:scale-105 transition-all">Resolve Issue</button>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeSubTab === 'POLICY' && (
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-12 rounded-[4rem] text-center relative overflow-hidden">
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Neural Policy Forge</h3>
          <p className="text-indigo-300 text-sm max-w-xl mx-auto font-medium mb-12">Synthesize operational guidelines based on real-time fleet density.</p>
          <button onClick={handleDraftPolicy} disabled={loading} className="px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all">
            {loading ? 'Synthesizing...' : 'Draft Efficiency Policy'}
          </button>
          {policyDraft && (
            <div className="mt-12 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] text-left animate-in slide-in-from-top-6">
               <p className="text-sm text-slate-300 italic whitespace-pre-wrap">{policyDraft}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default COOCommand;