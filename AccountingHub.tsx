
import React from 'react';
import Translate from '../components/Translate';

interface Props {
  language: string;
}

const AccountingHub: React.FC<Props> = ({ language }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase"><Translate targetLanguage={language}>FINANCIAL LEDGER</Translate></h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-2"><Translate targetLanguage={language}>Autonomous Capital Flux</Translate></p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20"><Translate targetLanguage={language}>Init_Payroll</Translate></button>
          <button className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase"><Translate targetLanguage={language}>Tax_Forge</Translate></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Projected Payroll', val: '$42,901', color: 'text-white' },
          { label: 'Unbilled Delta', val: '$12,204', color: 'text-emerald-400' },
          { label: 'Burn Rate (Weekly)', val: '$8,410', color: 'text-rose-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4"><Translate targetLanguage={language}>{stat.label}</Translate></p>
             <p className={`text-4xl font-black ${stat.color} tracking-tighter`}><Translate targetLanguage={language}>{stat.val}</Translate><span className="text-xs opacity-30 ml-1">.00</span></p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
         <h3 className="text-xl font-black text-white mb-10 tracking-tighter uppercase"><Translate targetLanguage={language}>Real-Time Transactions</Translate></h3>
         <div className="font-mono text-[11px] space-y-4">
            {[
              { type: 'INVOICE', target: 'Sector 4 Gov', val: '+24,000', status: 'SETTLED' },
              { type: 'PAYROLL', target: 'Sarah J. (PSW)', val: '-1,420', status: 'PENDING' },
              { type: 'SUPPLIES', target: 'MedSource Global', val: '-840', status: 'DISPATCHED' }
            ].map((t, i) => (
              <div key={i} className="grid grid-cols-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                 <span className="font-black text-sky-400">[<Translate targetLanguage={language}>{t.type}</Translate>]</span>
                 <span className="text-slate-300"><Translate targetLanguage={language}>{t.target}</Translate></span>
                 <span className={`text-right font-black ${t.val.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}><Translate targetLanguage={language}>{t.val}</Translate></span>
                 <span className="text-right text-slate-500"><Translate targetLanguage={language}>{t.status}</Translate></span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AccountingHub;
