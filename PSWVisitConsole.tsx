
import React, { useState, useEffect } from 'react';
import { Client, CareRole, AlertType } from '../../types';
import Translate from '../../components/Translate';
import { clinicalService } from '../../services/clinicalService';
import HandoverStudio from './HandoverStudio';

interface Props {
  client: Client;
  onClockOut: (durationMinutes: number) => void;
  onAlert: (type: AlertType, content: string, target: 'COORDINATOR' | 'SUPERVISOR' | 'BOTH') => void;
  language: string;
}

const PSWVisitConsole: React.FC<Props> = ({ client, onClockOut, onAlert, language }) => {
  const [elapsed, setElapsed] = useState(0);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [showHandover, setShowHandover] = useState(false);
  const [visitNote, setVisitNote] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleFinalize = async () => {
    const minutes = Math.floor(elapsed / 60);
    await clinicalService.auditVisitDuration(client.id, minutes);
    onClockOut(minutes);
  };

  const triggerAlert = (type: AlertType, label: string) => {
    const content = prompt(`Protocol: Describe ${label} details:`);
    if (content) {
      onAlert(type, content, ['FALL', 'CHOKING', 'MEDICAL', 'UNSAFE_ENV'].includes(type) ? 'BOTH' : 'COORDINATOR');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
      {showHandover && (
        <HandoverStudio 
          client={client} 
          lastNote={visitNote || "Care delivered according to protocol."} 
          language={language}
          onCancel={() => setShowHandover(false)}
          onFinalize={handleFinalize}
        />
      )}

      {/* Deployment HUD */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="flex items-center space-x-8">
          <div className="px-6 py-4 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-indigo-500/20">
            <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-1">Session</span>
            <span className="text-3xl font-mono font-bold text-white tracking-tighter">{formatTime(elapsed)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{client.name}</h2>
            <p className="text-slate-400 text-sm font-medium">{client.address}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`)} className="px-6 py-3 bg-slate-800 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors uppercase tracking-widest">Tactical GPS</button>
          <button onClick={() => setShowHandover(true)} className="px-8 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-500 transition-colors uppercase tracking-widest">Clock Out</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Directives */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Clinical Directives</h3>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{Object.keys(checkedTasks).length} / {(client.carePlans[CareRole.PSW] || []).length} Verified</span>
            </div>
            <div className="space-y-3 mb-8">
              {(client.carePlans[CareRole.PSW] || []).map((task, i) => (
                <label key={i} className={`flex items-center space-x-4 p-6 rounded-2xl cursor-pointer transition-all border ${checkedTasks[i] ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                  <input 
                    type="checkbox" 
                    checked={!!checkedTasks[i]}
                    onChange={() => setCheckedTasks(prev => ({...prev, [i]: !prev[i]}))}
                    className="w-5 h-5 rounded border-white/10 bg-transparent text-indigo-500 focus:ring-indigo-500" 
                  />
                  <p className={`text-sm font-medium ${checkedTasks[i] ? 'text-emerald-400 line-through italic' : 'text-slate-200 font-bold'}`}>{task}</p>
                </label>
              ))}
            </div>
            
            <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Shift Narrative</p>
              <textarea 
                value={visitNote}
                onChange={(e) => setVisitNote(e.target.value)}
                placeholder="Ingest clinical summary for next operative..."
                className="w-full bg-slate-800 border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 italic"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-6xl font-black italic">SOS</span>
            </div>
            <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-8 italic">Field Incident Link</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { type: 'FALL', label: 'Fall / Burn / Choking' },
                { type: 'MEDICAL', label: 'Medical Emergency' },
                { type: 'UNSAFE_ENV', label: 'Environmental Hazard' },
                { type: 'BOOK_OFF', label: 'Emergency Book-Off' }
              ].map(alert => (
                <button 
                  key={alert.type}
                  onClick={() => triggerAlert(alert.type as AlertType, alert.label)}
                  className={`p-6 rounded-2xl text-left transition-all group border ${alert.type === 'BOOK_OFF' ? 'bg-amber-600/10 border-amber-500/20 hover:bg-amber-500/20' : 'bg-slate-900 border-white/5 hover:bg-rose-600 hover:border-white shadow-md'}`}
                >
                  <p className={`text-xs font-black uppercase tracking-widest ${alert.type === 'BOOK_OFF' ? 'text-amber-500' : 'text-slate-300 group-hover:text-white'}`}>{alert.label}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] shadow-xl">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 italic">Emergency_Contact</p>
            <p className="text-xl font-black text-white tracking-tighter">{client.phone}</p>
            <div className="mt-8 flex gap-2">
                <button className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5">Text</button>
                <button className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5">Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSWVisitConsole;
