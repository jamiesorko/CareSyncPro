
import React from 'react';
import { HydratedScheduleEntry } from '../../services/anonymizationService';

interface Props {
  entry: HydratedScheduleEntry;
  onAuthorize: () => void;
}

const OvertimeAlert: React.FC<Props> = ({ entry, onAuthorize }) => (
  <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 animate-in slide-in-from-top-2">
    <div>
      <p className="text-xs font-black text-white">{entry.staffName}</p>
      <p className="text-[9px] font-bold text-rose-400 uppercase">Cap Breach: {entry.weeklyLoad} Units</p>
    </div>
    <button 
      onClick={onAuthorize}
      className="px-6 py-2 bg-white text-black rounded-xl text-[8px] font-black uppercase shadow-lg hover:scale-105 transition-all"
    >
      Request_OT_Auth
    </button>
  </div>
);

export default OvertimeAlert;
