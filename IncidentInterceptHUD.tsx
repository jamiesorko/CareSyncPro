import React, { useState, useEffect } from 'react';
import { Client, StaffMember } from '../../types';
import { incidentInterceptService, InterceptVector } from '../../services/incidentInterceptService';
import Translate from '../../components/Translate';

interface Props {
  client: Client;
  staff: StaffMember[];
  onClose: () => void;
  language: string;
}

const IncidentInterceptHUD: React.FC<Props> = ({ client, staff, onClose, language }) => {
  const [vector, setVector] = useState<InterceptVector | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(vector?.etaMinutes || 15);

  useEffect(() => {
    const init = async () => {
      const clinicalStaff = staff.filter(s => s.role.includes('Nurse') || s.role.includes('DOC'));
      const result = await incidentInterceptService.calculateIntercept(client, clinicalStaff);
      setVector(result);
      setLoading(false);
    };
    init();
  }, [client, staff]);

  return (
    <div className="fixed inset-0 bg-rose-950/90 backdrop-blur-2xl z-[500] flex items-center justify-center p-6 animate-in zoom-in duration-300">
      <div className="w-full max-w-4xl bg-[#020617] border border-rose-500/30 rounded-[4rem] shadow-[0_0_150px_rgba(244,63,94,0.3)] overflow-hidden flex flex-col">
        <div className="p-12 border-b border-white/5 bg-rose-600/10 flex justify-between items-center">
           <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl animate-pulse">⚠️</div>
              <div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">CRITICAL_INCIDENT_INTERCEPT</h2>
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.4em] mt-3">Target: {client.name} • Location: {client.address}</p>
              </div>
           </div>
           <button onClick={onClose} className="text-white/40 hover:text-white text-2xl font-black transition-colors">✕</button>
        </div>

        <div className="flex-1 p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
           {loading ? (
             <div className="col-span-2 py-20 flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em] animate-pulse">Calculating_Rescue_Vectors</p>
             </div>
           ) : vector && (
             <>
               <div className="space-y-10">
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Assigned Responder</p>
                     <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">{vector.responderName}</h3>
                     <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Protocol: EMERGENCY_DIVERSION</p>
                     
                     <div className="mt-10 grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                           <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Distance</p>
                           <p className="text-xl font-black text-white">{vector.distanceKm} KM</p>
                        </div>
                        <div className="p-6 bg-rose-600/20 border border-rose-500/30 rounded-2xl">
                           <p className="text-[8px] font-black text-rose-400 uppercase mb-2">ETA (Grounded)</p>
                           <p className="text-xl font-black text-white animate-pulse">{vector.etaMinutes} MIN</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-sky-600/10 border border-sky-500/20 p-8 rounded-3xl">
                     <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></div>
                        <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Golden_Hour_Directive</p>
                     </div>
                     <p className="text-sm text-slate-200 font-medium italic leading-relaxed">"{vector.priorityDirective}"</p>
                  </div>
               </div>

               <div className="flex flex-col space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex-1 relative overflow-hidden flex flex-col">
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 italic">Incident_Command_Comm</h3>
                     <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2 text-[11px] font-mono text-slate-400">
                        <p className="text-emerald-400">[08:12] FALL_DETECTION_PULSE_RECEIVED</p>
                        <p className="text-white">[08:14] COORDINATOR_ACKNOWLEDGED</p>
                        <p className="text-sky-400">[08:15] NEURAL_INTERCEPT_VECTORS_CALCULATED</p>
                        <p className="text-rose-400 animate-pulse">[08:15] BROADCASTING_EMERGENCY_DIVERSION_TO_{vector.responderName.toUpperCase()}</p>
                     </div>
                     <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Broadcast_Dispatch</button>
                        <button className="w-full py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[9px] font-black uppercase">Patch_Audio_Bridge</button>
                     </div>
                  </div>
               </div>
             </>
           )}
        </div>

        <div className="p-12 bg-white/[0.02] border-t border-white/5 flex gap-4">
           <button className="flex-1 py-5 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20">Initiate_911_Relay</button>
           <button className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-black text-[10px] uppercase tracking-widest">Incident_Report_Log</button>
        </div>
      </div>
    </div>
  );
};

export default IncidentInterceptHUD;