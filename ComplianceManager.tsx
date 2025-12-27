
import React, { useState } from 'react';
import { Certificate, TrainingRecord } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
  isHR: boolean;
}

const ComplianceManager: React.FC<Props> = ({ language, isHR }) => {
  const [certs] = useState<Certificate[]>([
    // Added companyId to satisfy Certificate interface
    { id: 'ct1', companyId: 'demo-company', staffId: 's1', staffName: 'Elena R.', type: 'First Aid/CPR', expiryDate: '2025-11-01', status: 'WARNING' },
    { id: 'ct2', companyId: 'demo-company', staffId: 's3', staffName: 'Sarah J.', type: 'Police Clearance', expiryDate: '2025-10-20', status: 'EXPIRED' },
  ]);

  const [trainings] = useState<TrainingRecord[]>([
    // Added companyId to satisfy TrainingRecord interface
    { id: 'tr1', companyId: 'demo-company', staffId: 's1', staffName: 'Elena R.', moduleName: 'Workplace Safety v4', isMandatory: true, isCompleted: true, dueDate: '2025-10-15' },
    { id: 'tr2', companyId: 'demo-company', staffId: 's3', staffName: 'Sarah J.', moduleName: 'Dementia Care', isMandatory: true, isCompleted: false, dueDate: '2025-10-10' },
  ]);

  const handleNotifyCerts = () => {
    alert("Broadcasting Critical Renewal Alerts: SMS/Email sent to all staff with nearing expirations. Employment suspension enforced past cutoff.");
  };

  const handleNotifyTraining = () => {
    alert("Signal Burst: Mandatory training notifications sent to all personnel. Non-compliant staff flagged for RN Supervisor/HR Manager review.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Certification Guard</h3>
          {isHR && (
            <button onClick={handleNotifyCerts} className="text-[9px] font-black text-sky-400 border border-sky-400/20 px-3 py-1 rounded-lg uppercase tracking-widest hover:bg-sky-400/10 transition-all">
              Notify All Expirations
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {certs.map(cert => (
            <div key={cert.id} className={`p-6 rounded-2xl border flex justify-between items-center ${cert.status === 'EXPIRED' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/5'}`}>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">{cert.staffName}</p>
                <p className="text-sm font-black text-white italic uppercase tracking-tighter">{cert.type}</p>
              </div>
              <div className="text-right">
                <p className={`text-[9px] font-black uppercase ${cert.status === 'EXPIRED' ? 'text-rose-500' : 'text-amber-500'}`}>Expiry: {cert.expiryDate}</p>
                <p className="text-[8px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{cert.status === 'EXPIRED' ? 'SUSPENSION RISK' : 'RENEWAL REQ'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Training Matrix</h3>
          {isHR && (
            <button onClick={handleNotifyTraining} className="text-[9px] font-black text-sky-400 border border-sky-400/20 px-3 py-1 rounded-lg uppercase tracking-widest hover:bg-sky-400/10 transition-all">
              Flag Non-Compliant
            </button>
          )}
        </div>

        <div className="space-y-4">
          {trainings.map(tr => (
            <div key={tr.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${tr.isCompleted ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase">{tr.staffName}</p>
                  <p className="text-sm font-black text-white italic uppercase tracking-tighter">{tr.moduleName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase">Due: {tr.dueDate}</p>
                {!tr.isCompleted && <span className="text-[7px] bg-rose-500/10 text-rose-500 px-1 py-0.5 rounded font-black">FLAGGED TO RN</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceManager;
