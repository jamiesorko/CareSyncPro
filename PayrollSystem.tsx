
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import { PayrollRecord } from '../../data/accountingData';
import PayrollTable from './PayrollTable';

interface Props {
  language: string;
  records?: PayrollRecord[]; // Now accepts records from live state
}

const PayrollSystem: React.FC<Props> = ({ language, records = [] }) => {
  const [missedShifts] = useState([
    { id: 'ms1', staffName: 'Sarah J.', clientName: 'Robert Miller', date: '2025-10-15', verified: false }
  ]);

  const verifyWithClient = (shift: any) => {
    const confirmation = window.confirm(`Initiate Secure Verification Signal to ${shift.clientName}?`);
    if (confirmation) alert(`Signal Dispatched to ${shift.clientName}.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {missedShifts.length > 0 && (
        <section className="bg-rose-600/10 border border-rose-500/20 rounded-[3rem] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <h3 className="text-xl font-black text-rose-500 italic tracking-tighter uppercase leading-none">Payroll_Gating_Alerts</h3>
          </div>
          <div className="space-y-4">
            {missedShifts.map(ms => (
              <div key={ms.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500 font-black text-[10px]">!</div>
                  <p className="text-xs font-black text-white italic">Unverified GPS Log: {ms.staffName} @ {ms.clientName}</p>
                </div>
                <button onClick={() => verifyWithClient(ms)} className="px-6 py-2.5 bg-white text-black text-[9px] font-black uppercase rounded-xl hover:scale-105 transition-all shadow-xl">Secure Verification</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex justify-between items-end px-4">
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Payroll_Disbursement_Ledger</h3>
          <p className="text-xs font-black text-sky-400 uppercase">Oct 01 - Oct 15, 2025</p>
        </div>
        
        <PayrollTable 
          records={records} 
          onUpdate={() => {}} // In Supabase mode, updates would happen via DBService
          language={language} 
        />

        <div className="flex justify-end gap-4 pt-6">
           <button className="px-10 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
             Export_T4_Audit
           </button>
           <button className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all">
             Initialize_Electronic_Transfer
           </button>
        </div>
      </section>
    </div>
  );
};

export default PayrollSystem;
