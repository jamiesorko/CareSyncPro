
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import { MOCK_PAYABLES, MOCK_SUPPLY_REQUESTS, PayableRecord, SupplyRequest } from '../../data/accountingData';

interface Props {
  language: string;
}

const AccountsPayable: React.FC<Props> = ({ language }) => {
  const [payables, setPayables] = useState<PayableRecord[]>(MOCK_PAYABLES);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>(MOCK_SUPPLY_REQUESTS);

  const verifyPayable = (id: string) => {
    setPayables(prev => prev.map(p => p.id === id ? { ...p, status: 'VERIFIED' } : p));
  };

  const processPayment = (id: string) => {
    setPayables(prev => prev.map(p => p.id === id ? { ...p, status: 'PAID' } : p));
  };

  const orderSupplies = (id: string) => {
    setSupplyRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ORDERED' } : r));
    alert("Supply Vector Locked: Requisition sent to Vendor Portal. Tracking initialized.");
  };

  return (
    <div className="space-y-10">
      <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
        <h3 className="text-xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">Vendor_Invoice_Verification</h3>
        <div className="space-y-4">
          {payables.map(p => (
            <div key={p.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex justify-between items-center group">
              <div>
                <p className="text-sm font-black text-white uppercase italic">{p.vendor}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p.category} • Due: {p.dueDate}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded ${
                    p.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-500' : 
                    p.status === 'VERIFIED' ? 'bg-sky-500/20 text-sky-400' : 'bg-rose-500/20 text-rose-500'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="text-right flex items-center space-x-4">
                <p className="text-lg font-black text-white tracking-tighter">-${p.amount.toLocaleString()}</p>
                <div className="flex space-x-2">
                  {p.status === 'UNVERIFIED' && (
                    <button onClick={() => verifyPayable(p.id)} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Verify</button>
                  )}
                  {p.status === 'VERIFIED' && (
                    <button onClick={() => processPayment(p.id)} className="px-4 py-2 bg-white text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Pay Bill</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
        <h3 className="text-xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">Field_Supply_Requisitions</h3>
        <div className="space-y-4">
          {supplyRequests.map(r => (
            <div key={r.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-sm font-black text-white italic">{r.item} (x{r.quantity})</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Requested by: {r.staffName} • {r.timestamp}</p>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded mt-2 inline-block ${
                  r.urgency === 'HIGH' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {r.urgency}_URGENCY
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-[9px] font-black uppercase ${r.status === 'ORDERED' ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}`}>
                  {r.status}
                </span>
                {r.status === 'PENDING' && (
                  <button onClick={() => orderSupplies(r.id)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                    Place Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AccountsPayable;
