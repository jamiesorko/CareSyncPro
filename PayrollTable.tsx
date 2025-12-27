
import React, { useState } from 'react';
import Translate from '../../components/Translate';
import { PayrollRecord } from '../../data/accountingData';

interface Props {
  records: PayrollRecord[];
  onUpdate: (id: string, field: keyof PayrollRecord, value: number) => void;
  language: string;
}

const PayrollTable: React.FC<Props> = ({ records, language }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatCurrency = (num: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(num);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      PROCESSED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      ADJUSTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      VOID: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/10">
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Employee_ID</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Gross_Earnings</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-rose-400">Fed_Tax</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-rose-400">Prov_Tax</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-amber-400">CPP</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-amber-400">EI</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-indigo-400">Ins_&_Union</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-emerald-400">Net_Liquid</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="text-[10px] font-medium text-slate-300">
            {records.map(record => (
              <tr key={record.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="p-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs tracking-tighter uppercase italic">{record.staffName}</span>
                    <span className="text-[8px] text-slate-600 font-bold uppercase">{record.role.split(' ')[0]} • {record.hours}HRS @ ${record.rate}</span>
                  </div>
                </td>
                <td className="p-5 font-bold text-white whitespace-nowrap">{formatCurrency(record.grossPay)}</td>
                <td className="p-5 text-rose-400/80 font-mono whitespace-nowrap">-{formatCurrency(record.taxFederal)}</td>
                <td className="p-5 text-rose-400/80 font-mono whitespace-nowrap">-{formatCurrency(record.taxProvincial)}</td>
                <td className="p-5 text-amber-400/80 font-mono whitespace-nowrap">-{formatCurrency(record.cpp)}</td>
                <td className="p-5 text-amber-400/80 font-mono whitespace-nowrap">-{formatCurrency(record.ei)}</td>
                <td className="p-5 text-indigo-400/80 font-mono whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>-{formatCurrency(record.insuranceDeductible + record.unionDues)}</span>
                    <span className="text-[7px] text-slate-600 uppercase">Ins: {formatCurrency(record.insuranceDeductible)} / Un: {formatCurrency(record.unionDues)}</span>
                  </div>
                </td>
                <td className="p-5 whitespace-nowrap">
                  <span className="text-sm font-black text-emerald-400 tracking-tighter">{formatCurrency(record.netPay)}</span>
                </td>
                <td className="p-5 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                <td className="p-5 text-center whitespace-nowrap">
                  <button className="opacity-0 group-hover:opacity-100 p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all text-[8px] font-black uppercase tracking-widest">
                    Adjust_Entry
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer - Totals (The QuickBooks way) */}
      <div className="bg-white/[0.03] p-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Total Gross Payroll</p>
          <p className="text-lg font-black text-white tracking-tighter">{formatCurrency(records.reduce((acc, r) => acc + r.grossPay, 0))}</p>
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-500 uppercase mb-1 text-rose-400">Total Statutory Deductions</p>
          <p className="text-lg font-black text-rose-400 tracking-tighter">
            -{formatCurrency(records.reduce((acc, r) => acc + r.taxFederal + r.taxProvincial + r.cpp + r.ei, 0))}
          </p>
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-500 uppercase mb-1 text-indigo-400">Total Other Deductions</p>
          <p className="text-lg font-black text-indigo-400 tracking-tighter">
            -{formatCurrency(records.reduce((acc, r) => acc + r.insuranceDeductible + r.unionDues, 0))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-emerald-400 uppercase mb-1">Total Net Disbursement</p>
          <p className="text-2xl font-black text-emerald-400 tracking-tighter">
            {formatCurrency(records.reduce((acc, r) => acc + r.netPay, 0))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayrollTable;
