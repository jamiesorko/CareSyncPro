
import React, { useState, useMemo } from 'react';
import { CareRole, ChatMessage, ChatThread } from '../../types';
import Translate from '../../components/Translate';
import { MOCK_STAFF } from '../../data/careData';

interface Props {
  role: CareRole;
  language: string;
  staffName: string;
}

const NeuralComms: React.FC<Props> = ({ role, language, staffName }) => {
  const [activeTab, setActiveTab] = useState<'CHANNELS' | 'PERSONNEL'>('CHANNELS');
  const [activeThreadId, setActiveThreadId] = useState<string>('staff-global');
  const [searchStaff, setSearchStaff] = useState('');
  const [input, setInput] = useState('');

  const canSeeFinance = [CareRole.CEO, CareRole.ACCOUNTANT].includes(role);

  const filteredStaff = MOCK_STAFF.filter(s => s.name.toLowerCase().includes(searchStaff.toLowerCase()));

  const threads = useMemo(() => {
    const list: ChatThread[] = [];
    // Fix: Added missing companyId property to ChatThread initialization
    list.push({ id: 'staff-global', companyId: 'demo-company', name: 'Global Roster Channel', type: 'GROUP', lastMessage: 'Biometric link active.', unreadCount: 0 });
    return list;
  }, []);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Neural_Comms</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <aside className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-3xl shadow-xl">
          <div className="p-4 border-b border-white/5 flex gap-2">
            <button 
              onClick={() => setActiveTab('CHANNELS')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'CHANNELS' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              CHANNELS
            </button>
            <button 
              onClick={() => setActiveTab('PERSONNEL')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'PERSONNEL' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              DIRECTORY
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {activeTab === 'CHANNELS' ? (
              threads.map(thread => (
                <button key={thread.id} onClick={() => setActiveThreadId(thread.id)} className={`w-full text-left p-6 rounded-2xl transition-all border ${activeThreadId === thread.id ? 'bg-sky-600/20 border-sky-500/30 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                  <span className="text-xs font-black uppercase text-white tracking-tighter">{thread.name}</span>
                </button>
              ))
            ) : (
              <div className="space-y-4">
                <input 
                  value={searchStaff}
                  onChange={e => setSearchStaff(e.target.value)}
                  placeholder="Filter personnel..."
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-white"
                />
                <div className="space-y-2">
                  {filteredStaff.map(staff => (
                    <div key={staff.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex justify-between items-center group">
                      <div>
                        <p className="text-xs font-black text-white">{staff.name}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">{staff.role}</p>
                      </div>
                      {canSeeFinance && (
                        <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-400">${staff.hourlyRate}/hr</p>
                          <p className="text-[7px] text-slate-600 uppercase">Rate Locked</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8 bg-slate-950/50 border border-white/10 rounded-[3.5rem] flex flex-col backdrop-blur-3xl overflow-hidden relative shadow-2xl">
           <div className="flex-1 overflow-y-auto p-10 space-y-8 flex items-center justify-center opacity-30 italic text-sm text-slate-500">
             [Awaiting Signal from Channel Selection]
           </div>
           <div className="p-8 bg-white/[0.03] border-t border-white/5">
              <input disabled placeholder="Channel focus required for transmission..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-600"/>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralComms;
