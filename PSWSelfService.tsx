
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import { hrService } from '../../services/hrService';
import { financialService } from '../../services/financialService';
import { coordinationService } from '../../services/coordinationService';
import { AlertType } from '../../types';

interface Props {
  language: string;
}

const PSWSelfService: React.FC<Props> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'ADMIN' | 'RESOURCES' | 'VAULT'>('ADMIN');

  const handleHRAction = async (type: AlertType) => {
    const details = prompt(`Submitting [${type}]: Provide tactical request details:`);
    if (details) {
      await hrService.submitHRRequest({ type, details, staffId: 'psw-1' });
      alert(`SIGNAL_LOCKED: ${type} request transmitted to Resource Core.`);
    }
  };

  const handleFinancialAction = async (type: 'PAYROLL_DISPUTE' | 'SUPPLY_REQ') => {
    const details = prompt(`Initiating ${type === 'PAYROLL_DISPUTE' ? 'Dispute' : 'Requisition'}: Details:`);
    if (details) {
      // Fixed: Using specific financialService methods instead of non-existent submitFinancialSignal.
      if (type === 'PAYROLL_DISPUTE') {
        await financialService.submitPayrollDispute({ staffId: 'psw-1', details });
      } else {
        await financialService.submitSupplyRequest({ staffId: 'psw-1', item: details, quantity: 1 });
      }
      alert("SIGNAL_LOCKED: Financial directive routed to Accounting.");
    }
  };

  const handleBookOff = async (urgent: boolean) => {
    const reason = prompt(urgent ? "URGENT_BOOK_OFF (<24h notice): Protocol reason:" : "ADVANCE_BOOK_OFF: Enter reason:");
    if (reason) {
      await coordinationService.signalBookOff({ staffId: 'psw-1', reason, isUrgent: urgent });
      alert(urgent ? "⚠️ CRITICAL: Urgent book-off signal broadcast to Dispatch Grid." : "Request queued for coordination review.");
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Worker_Station_Alpha</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Personal Administration & Fleet Logistics</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['ADMIN', 'RESOURCES', 'VAULT'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              <Translate targetLanguage={language}>{tab}</Translate>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'ADMIN' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Vacation Request', icon: '✈️', action: () => handleHRAction('VACATION') },
                { label: 'Time Off / LOA', icon: '⏳', action: () => handleHRAction('LOA') },
                { label: 'Availability Update', icon: '📅', action: () => handleHRAction('AVAILABILITY') },
                { label: 'Payroll Dispute', icon: '⚖️', action: () => handleFinancialAction('PAYROLL_DISPUTE') },
                { label: 'Insurance Question', icon: '🛡️', action: () => handleHRAction('INSURANCE_Q') },
                { label: 'Restrict Client ID', icon: '🚫', hint: 'Match Preference', action: () => handleHRAction('RESTRICTION') }
              ].map((req, i) => (
                <button 
                  key={i} 
                  onClick={req.action}
                  className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-center hover:bg-white/10 transition-all group"
                >
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{req.icon}</div>
                  <p className="text-xs font-black text-white uppercase tracking-tighter">{req.label}</p>
                  {req.hint && <p className="text-[8px] text-slate-600 uppercase mt-2">{req.hint}</p>}
                </button>
              ))}
            </div>

            <div className="bg-rose-600/10 border border-rose-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1">
                 <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Emergency_Book_Off_Array</h4>
                 <p className="text-[10px] text-rose-300 italic mt-2 uppercase">Broadcasts unavailability to active Dispatch Grid.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => handleBookOff(false)} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Advance (24h+)</button>
                  <button onClick={() => handleBookOff(true)} className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20">Urgent (&lt;24h)</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'RESOURCES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 text-center flex flex-col items-center justify-center">
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">Supply_Requisition</h3>
               <p className="text-slate-400 text-sm max-w-sm mb-10 leading-relaxed font-medium">Request clinical PPE or field hardware from procurement.</p>
               <button onClick={() => handleFinancialAction('SUPPLY_REQ')} className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/20">Initiate Supply Request</button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Mandatory_Field_Training</h3>
               <div className="space-y-4">
                  <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex justify-between items-center group">
                     <div>
                       <p className="text-[10px] font-black text-rose-500 uppercase mb-1">Status: High Priority</p>
                       <p className="text-sm font-black text-white uppercase italic tracking-tighter">Hoyer Lift Safety v5</p>
                     </div>
                     <button className="px-6 py-2 bg-white text-black rounded-lg text-[9px] font-black uppercase">Launch</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'VAULT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: '2024 T4 Statement', action: () => handleHRAction('T4_REQUEST') },
              { label: 'Insurance Policy Doc', action: () => handleHRAction('INSURANCE_Q') },
              { label: 'Recent Paystub', action: () => handleFinancialAction('PAYROLL_DISPUTE') },
              { label: 'CNO Certification', action: () => alert('Syncing with CNO...') }
            ].map((doc, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col justify-between hover:bg-white/10 transition-all cursor-pointer group h-64">
                 <div className="text-4xl mb-8 group-hover:scale-110 transition-transform">📄</div>
                 <div>
                   <p className="text-xs font-black text-white uppercase italic tracking-tighter">{doc.label}</p>
                   <button onClick={doc.action} className="text-[9px] font-black text-sky-400 uppercase tracking-widest mt-6">Authorize Download</button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PSWSelfService;
