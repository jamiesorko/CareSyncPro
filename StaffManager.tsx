
import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const StaffManager: React.FC<Props> = ({ language }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'VACATION', start1: '', end1: '', start2: '', end2: '' });
  
  const [requests] = useState<LeaveRequest[]>([
    // Added companyId to satisfy LeaveRequest interface
    { 
      id: 'l1', companyId: 'demo-company', staffId: 's1', staffName: 'Elena R.', type: 'VACATION', 
      option1: { start: '2025-11-01', end: '2025-11-07' },
      option2: { start: '2025-11-15', end: '2025-11-21' },
      status: 'PENDING', timestamp: '2025-10-15' 
    }
  ]);

  const checkCoverage = (dates: { start: string, end: string }) => {
    // Simulated logic: 15th to 21st has low coverage
    return dates.start.includes('-15') ? 'RISK' : 'SECURE';
  };

  const handleSubmit = () => {
    if (!form.start1 || !form.end1) return alert("Option 1 is mandatory.");
    alert("Dual-Option Request Logged. HR and Coordinators will analyze sector coverage.");
    setShowModal(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in pb-24">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Temporal_Asset_Management</h3>
        <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">File Leave Request</button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Pending Roster Adjustments</h3>
        <div className="space-y-6">
          {requests.map(req => (
            <div key={req.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col lg:flex-row justify-between gap-10">
              <div className="flex-1">
                <p className="text-sm font-black text-white italic uppercase">{req.staffName} • {req.type}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className={`p-4 rounded-2xl border ${checkCoverage(req.option1) === 'SECURE' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                    <p className="text-[9px] font-black text-white uppercase mb-2">Option 1 (Preferred)</p>
                    <p className="text-xs text-slate-300">{req.option1.start} to {req.option1.end}</p>
                    <p className={`text-[8px] font-black mt-3 uppercase ${checkCoverage(req.option1) === 'SECURE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Coverage: {checkCoverage(req.option1)}
                    </p>
                  </div>
                  {req.option2 && (
                    <div className={`p-4 rounded-2xl border ${checkCoverage(req.option2) === 'SECURE' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                      <p className="text-[9px] font-black text-white uppercase mb-2">Option 2 (Secondary)</p>
                      <p className="text-xs text-slate-300">{req.option2.start} to {req.option2.end}</p>
                      <p className={`text-[8px] font-black mt-3 uppercase ${checkCoverage(req.option2) === 'SECURE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Coverage: {checkCoverage(req.option2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase">Approve Op1</button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase">Approve Op2</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-950 border border-white/10 p-10 rounded-[3rem] w-full max-w-2xl shadow-2xl">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-8">New Request Submission</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Option 1 Dates</h4>
                  <input type="date" value={form.start1} onChange={e => setForm({...form, start1: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs"/>
                  <input type="date" value={form.end1} onChange={e => setForm({...form, end1: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs"/>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Option 2 Dates</h4>
                  <input type="date" value={form.start2} onChange={e => setForm({...form, start2: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs"/>
                  <input type="date" value={form.end2} onChange={e => setForm({...form, end2: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs"/>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-white/5 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Discard</button>
                <button onClick={handleSubmit} className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px]">Submit Protocol</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
