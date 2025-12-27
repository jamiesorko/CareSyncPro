import React, { useState } from 'react';
import { Applicant, CareRole } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const HiringHub: React.FC<Props> = ({ language }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: 'app1', companyId: 'demo-company', name: 'James Morrison', role: CareRole.PSW, credentialsVerified: true, referencesChecked: false, cultureFitScore: 82, status: 'PENDING', appliedDate: '2025-10-01' },
    { id: 'app2', companyId: 'demo-company', name: 'Sarah Lee', role: CareRole.RN, credentialsVerified: true, referencesChecked: true, cultureFitScore: 94, status: 'INTERVIEW_SET', appliedDate: '2025-10-05' },
    { id: 'app3', companyId: 'demo-company', name: 'Robert Chen', role: CareRole.RPN, credentialsVerified: false, referencesChecked: false, cultureFitScore: 78, status: 'PENDING', appliedDate: '2025-10-08' },
  ]);

  const toggleCheck = (id: string, field: 'credentialsVerified' | 'referencesChecked') => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, [field]: !a[field] } : a));
  };

  const handleStatusChange = (id: string, status: Applicant['status']) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    alert(`SIGNAL: Applicant ${id} moved to ${status}. Notification dispatched.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10 italic">Applicant_Triage_Stack</h3>
              <div className="space-y-4">
                 {applicants.map(app => (
                   <div key={app.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                         <div className="flex-1 space-y-4">
                            <div className="flex items-center space-x-3">
                               <h4 className="text-lg font-black text-white italic tracking-tighter uppercase">{app.name}</h4>
                               <span className="px-2 py-0.5 bg-sky-600/20 text-sky-400 text-[7px] font-black rounded uppercase">{app.role}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Applied: {app.appliedDate}</p>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                               <button 
                                onClick={() => toggleCheck(app.id, 'credentialsVerified')}
                                className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${app.credentialsVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-600 border border-white/5'}`}
                               >
                                 Credentials: {app.credentialsVerified ? 'SECURE' : 'PENDING'}
                               </button>
                               <button 
                                onClick={() => toggleCheck(app.id, 'referencesChecked')}
                                className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${app.referencesChecked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-600 border border-white/5'}`}
                               >
                                 References: {app.referencesChecked ? 'SECURE' : 'PENDING'}
                               </button>
                               <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black rounded-xl uppercase">
                                 Culture Fit: {app.cultureFitScore}%
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-col justify-between items-end gap-4">
                            <span className={`px-3 py-1 rounded text-[8px] font-black uppercase ${app.status === 'HIRED' ? 'bg-emerald-600 text-white' : app.status === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'}`}>
                               {app.status}
                            </span>
                            <div className="flex gap-2">
                               <button onClick={() => handleStatusChange(app.id, 'INTERVIEW_SET')} className="p-3 bg-white text-black rounded-xl text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all">Schedule</button>
                               <button onClick={() => handleStatusChange(app.id, 'HIRED')} className="p-3 bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Hire</button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <span className="text-7xl font-black italic">GROW</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 opacity-60 italic">Recruitment_Velocity</h3>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-baseline space-x-2">
                    <p className="text-7xl font-black italic tracking-tighter">14</p>
                    <span className="text-xs font-black opacity-40 uppercase tracking-widest">Active_Pipeline</span>
                 </div>
                 <p className="text-sm font-bold italic leading-relaxed">
                   "Neural sourcing detects high-quality candidates in Sector 4. Recommend prioritizing PSW Linda for interviewing to meet upcoming discharge demand."
                 </p>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex-1 backdrop-blur-3xl flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">Personnel_Forecasting</p>
              <div className="space-y-6 flex-1">
                 {[
                   { label: 'Time to Hire', val: '8.4 Days', color: 'text-emerald-400' },
                   { label: 'Candidate Quality', val: 'High', color: 'text-sky-400' },
                   { label: 'Role Alignment', val: '92%', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className={`text-[10px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HiringHub;