
import React, { useState } from 'react';
import Translate from '../components/Translate';
import { CareRole } from '../types';

interface Props {
  language: string;
}

const ClientPortal: React.FC<Props> = ({ language }) => {
  const [schedule] = useState([
    { id: 'v1', time: '08:00 AM', staffName: 'Elena R.', staffRole: CareRole.PSW, status: 'CONFIRMED' },
    { id: 'v2', time: '01:30 PM', staffName: 'Mark K.', staffRole: CareRole.RN, status: 'UPCOMING' },
  ]);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const toggleBlacklist = (staffName: string) => {
    if (blacklist.includes(staffName)) {
      setBlacklist(prev => prev.filter(n => n !== staffName));
    } else {
      if (window.confirm(`Formally restrict ${staffName} from future assignments to your residence?`)) {
        setBlacklist(prev => [...prev, staffName]);
        alert("Roster update transmitted to Coordination.");
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Resident_Command</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Quality & Logistics Monitor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
            <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase italic">Current_Service_Log</h3>
            <div className="space-y-4">
              {schedule.map(visit => (
                <div key={visit.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 group">
                  <div>
                    <p className="text-lg font-black text-white italic tracking-tighter uppercase">{visit.staffName}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{visit.staffRole}</p>
                    
                    <div className="mt-6 flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          onClick={() => setRatings(prev => ({ ...prev, [visit.id]: star }))}
                          className={`text-xl transition-all ${ratings[visit.id] >= star ? 'grayscale-0 scale-110' : 'grayscale opacity-30 hover:opacity-100'}`}
                        >
                          ⭐
                        </button>
                      ))}
                      <span className="text-[10px] font-black text-slate-600 ml-3 uppercase">Rate Service</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => toggleBlacklist(visit.staffName)}
                      className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase transition-all ${
                        blacklist.includes(visit.staffName) 
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                        : 'bg-white/5 border border-white/10 text-rose-500 hover:bg-rose-500/10'
                      }`}
                    >
                      {blacklist.includes(visit.staffName) ? 'Restricted Personnel' : 'Do Not Send Again'}
                    </button>
                    <button className="px-8 py-3 bg-white text-black rounded-2xl text-[9px] font-black uppercase">View Instructions</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-teal-600/10 border border-teal-500/20 p-10 rounded-[3rem] h-fit">
          <h3 className="text-sm font-black text-teal-400 uppercase italic mb-6">Care Directive Mirror</h3>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            Instructions from the Clinical DOC and Logistics Coordinator are synced here for your transparency.
          </p>
          <div className="mt-8 space-y-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-teal-400 uppercase mb-2">Clinical Directive</p>
                <p className="text-xs text-white italic">"Recovery protocol optimized for post-op mobility."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
