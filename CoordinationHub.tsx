import React, { useState } from 'react';
import Translate from '../components/Translate';
import { MOCK_STAFF, MOCK_CLIENTS } from '../data/careData';
import { CareRole, StaffMember, Client, BlastStatus } from '../types';
import LiveMap from './coordination/LiveMap';
import VelocityCommand from './coordination/VelocityCommand';

interface Props {
  language: string;
  blasts: Record<string, BlastStatus>;
  setBlasts: React.Dispatch<React.SetStateAction<Record<string, BlastStatus>>>;
}

const CoordinationHub: React.FC<Props> = ({ language, blasts, setBlasts }) => {
  const [activeView, setActiveView] = useState<'MAP' | 'VELOCITY' | 'LOGISTICS' | 'OT_MONITOR'>('MAP');
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');

  const handleUpdateInstruction = (clientId: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, coordinatorInstructions: instruction } : c));
    setEditingClient(null);
    setInstruction('');
    alert("Operational directive published to care plan.");
  };

  const tabs = [
    { id: 'MAP', label: 'Fleet Matrix' },
    { id: 'VELOCITY', label: 'Throughput' },
    { id: 'LOGISTICS', label: 'Manual Control' },
    { id: 'OT_MONITOR', label: 'Resource Guard' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Coordination</h2>
          <p className="text-sm text-slate-500">Autonomous logistics and operative deployment</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          {tabs.map(v => (
            <button 
              key={v.id}
              onClick={() => setActiveView(v.id as any)}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === v.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Translate targetLanguage={language}>{v.label}</Translate>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        {activeView === 'MAP' && (
          <div className="h-[650px] bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <LiveMap language={language} />
          </div>
        )}

        {activeView === 'VELOCITY' && (
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm">
            <VelocityCommand clients={clients} staff={MOCK_STAFF} language={language} />
          </div>
        )}

        {activeView === 'OT_MONITOR' && (
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-white">Utilization Guard</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Automatic Monitoring</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_STAFF.filter(s => [CareRole.PSW, CareRole.RN, CareRole.RPN].includes(s.role as CareRole)).map(staff => (
                <div key={staff.id} className={`p-6 rounded-xl border transition-all ${staff.weeklyHours >= 40 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-800/50 border-white/5'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm font-bold text-white">{staff.name}</p>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{staff.role.split(' ')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${staff.weeklyHours >= 40 ? 'text-rose-500' : 'text-emerald-500'}`}>{staff.weeklyHours}h</p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${staff.weeklyHours >= 40 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (staff.weeklyHours / 44) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'LOGISTICS' && (
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm animate-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-white mb-8">Roster Overrides</h3>
            <div className="space-y-4">
              {clients.map(client => (
                <div key={client.id} className="p-6 bg-slate-800/50 border border-white/5 rounded-xl flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-bold text-white">{client.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{client.time} • {client.address}</p>
                    <p className="text-xs text-indigo-400 mt-4 font-medium italic">Directive: "{client.coordinatorInstructions || 'Standard procedure.'}"</p>
                  </div>
                  <div className="w-full md:w-auto">
                    {editingClient === client.id ? (
                      <div className="flex gap-2">
                        <input 
                          value={instruction} 
                          onChange={e => setInstruction(e.target.value)} 
                          className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:border-indigo-500 outline-none" 
                          placeholder="New directive..."
                        />
                        <button onClick={() => handleUpdateInstruction(client.id)} className="bg-indigo-600 px-4 py-2 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingClient(client.id)} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-600 transition-colors">Modify Directive</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinationHub;