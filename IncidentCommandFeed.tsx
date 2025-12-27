import React from 'react';
import { AlertSignal } from '../../types';
import IncidentFeedItem from '../../components/ui/IncidentFeedItem';

interface Props {
  signals: AlertSignal[];
  onAcknowledge: (id: string) => void;
  language: string;
}

const IncidentCommandFeed: React.FC<Props> = ({ signals, onAcknowledge, language }) => {
  const pendingSignals = signals.filter(s => s.status === 'PENDING');
  const emergencyCount = signals.filter(s => ['FALL', 'CHOKING', 'MEDICAL', 'UNSAFE_ENV'].includes(s.type)).length;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div>
          <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Incident_Command_Feed</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">Global Operational Monitoring • {signals.length} Nodes Active</p>
        </div>
        <div className="flex gap-4">
            <div className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal Load</p>
                <p className="text-lg font-black text-white italic leading-none">{signals.length}</p>
            </div>
            <div className={`px-8 py-3 rounded-2xl border transition-all ${pendingSignals.length > 0 ? 'bg-rose-600 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse' : 'bg-white/5 border-white/10'}`}>
                <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">Critical Signals</p>
                <p className="text-lg font-black text-white italic leading-none">{pendingSignals.length}</p>
            </div>
        </div>
      </div>

      {emergencyCount > 0 && (
          <div className="mx-4 p-10 bg-rose-600/10 border border-rose-500/50 rounded-[4rem] animate-in slide-in-from-top-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="text-9xl font-black italic">SOS</span>
              </div>
              <div className="flex items-center space-x-4 mb-6 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
                  <h4 className="text-sm font-black text-rose-500 uppercase tracking-[0.4em] italic">Neural Triage Analysis</h4>
              </div>
              <p className="text-xl text-slate-100 italic font-bold leading-relaxed relative z-10">
                  "Neural Core detects high-density risk in Sector 4. Incident clusters suggest physiological instability. Executing recovery intercept vectors for {emergencyCount} high-acuity targets."
              </p>
              <div className="mt-8 flex gap-4 relative z-10">
                 <span className="text-[8px] font-black text-rose-400 uppercase border border-rose-500/30 px-3 py-1 rounded-lg">Impact: High</span>
                 <span className="text-[8px] font-black text-sky-400 uppercase border border-sky-500/30 px-3 py-1 rounded-lg">Protocol: Rapid Intercept</span>
              </div>
          </div>
      )}

      <div className="space-y-6">
        {signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 italic bg-white/5 border border-white/5 border-dashed rounded-[4rem] mx-4">
            <span className="text-7xl mb-8 grayscale">📡</span>
            <p className="text-sm font-black uppercase tracking-widest">Awaiting sector signals...</p>
          </div>
        ) : (
          signals.map(signal => (
            <div key={signal.id} className="mx-4">
                <IncidentFeedItem 
                    signal={signal} 
                    onAcknowledge={onAcknowledge} 
                />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentCommandFeed;