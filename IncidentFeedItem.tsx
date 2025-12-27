
import React from 'react';
import { AlertSignal } from '../../types';
import Button from './Button';
import Badge from './Badge';

interface Props {
  signal: AlertSignal;
  onAcknowledge: (id: string) => void;
}

const IncidentFeedItem: React.FC<Props> = ({ signal, onAcknowledge }) => {
  const isEmergency = ['FALL', 'CHOKING', 'MEDICAL', 'UNSAFE_ENV'].includes(signal.type);
  const isPending = signal.status === 'PENDING';
  
  return (
    <div className={`p-10 rounded-[3rem] border transition-all duration-700 animate-in slide-in-from-right-8 ${
      isEmergency && isPending
        ? 'bg-rose-600/10 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.15)] animate-pulse' 
        : 'bg-slate-900/50 border-white/5 hover:border-white/10'
    }`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isEmergency ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-sky-500 shadow-[0_0_15px_#0ea5e9]'}`}></div>
            <Badge variant={isEmergency ? 'error' : 'info'}>{signal.type}</Badge>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{signal.timestamp}</span>
          </div>
          
          <div>
            <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
              {signal.clientName || 'Subject_Unknown'}
            </h4>
            <div className="mt-4 p-6 bg-black/40 rounded-2xl border border-white/5">
                <p className="text-base text-slate-300 font-medium italic leading-relaxed">
                    "{signal.content}"
                </p>
                {isEmergency && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center space-x-3">
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Neural Triage:</span>
                        <p className="text-[10px] font-bold text-rose-400 uppercase italic">Clinical Warning: Immediate Stabilisation Required</p>
                    </div>
                )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-[8px] font-black text-slate-600 uppercase">Signal Source:</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase italic">{signal.senderName}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          {isPending ? (
            <Button 
              variant={isEmergency ? 'danger' : 'primary'} 
              size="lg" 
              onClick={() => onAcknowledge(signal.id)}
              className="w-48 py-5"
            >
              {isEmergency ? 'INTERCEPT_SIGNAL' : 'ACKNOWLEDGE'}
            </Button>
          ) : (
            <div className="w-48 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center space-x-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Synchronized</span>
            </div>
          )}
          <Button variant="secondary" size="lg" className="w-48 py-5">Dossier_View</Button>
        </div>
      </div>
    </div>
  );
};

export default IncidentFeedItem;
