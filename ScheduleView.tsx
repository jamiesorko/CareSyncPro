import React, { useState } from 'react';
import { CareRole, Client, AlertType } from '../types';
import PSWVisitConsole from './psw/PSWVisitConsole';
import PSWSelfService from './psw/PSWSelfService';
import Translate from '../components/Translate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

interface Props {
  role: CareRole;
  language: string;
  clients: Client[];
  onVisitSignal: (id: string, type: 'IN' | 'OUT', duration?: number) => void;
  onMissedClock: (staffName: string, clientName: string) => void;
  onAlert: (clientId: string, type: AlertType, content: string) => void;
}

const ScheduleView: React.FC<Props> = ({ role, clients, onVisitSignal, onMissedClock, onAlert, language }) => {
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [view, setView] = useState<'SCHEDULE' | 'SELF_SERVICE'>('SCHEDULE');

  const activeShiftClient = clients.find(c => c.id === activeShiftId);
  const isFieldStaff = [CareRole.PSW, CareRole.HSS, CareRole.RPN, CareRole.RN].includes(role);

  const handleClockIn = (client: Client) => {
    // Simulated AI GPS Protocol
    const isAtLocation = Math.random() > 0.15; 
    if (!isAtLocation) {
      alert(`🛰️ AI_GPS_SENTINEL: Protocol Deviation. Location mismatch for residency: ${client.address}. Dispatch informed.`);
      onMissedClock('Active Operative', client.name);
    }
    setActiveShiftId(client.id);
    onVisitSignal(client.id, 'IN');
  };

  if (view === 'SELF_SERVICE') {
    return (
      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
        <Button variant="ghost" size="sm" onClick={() => setView('SCHEDULE')} className="gap-2">
          <span>←</span> Back to Deployment Grid
        </Button>
        <PSWSelfService language={language} />
      </div>
    );
  }

  if (activeShiftClient) {
    return (
      <PSWVisitConsole 
        client={activeShiftClient} 
        onClockOut={(dur) => { onVisitSignal(activeShiftId!, 'OUT', dur); setActiveShiftId(null); }} 
        onAlert={(type, content) => onAlert(activeShiftId!, type, content)}
        language={language}
      />
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Deployment_Grid</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Operational Roster & Fleet Coordination</p>
        </div>
        {isFieldStaff && (
          <div className="flex gap-3">
             <Button variant="secondary" onClick={() => alert("Terminal Loading...")}>Internal_Email</Button>
             <Button variant="primary" onClick={() => setView('SELF_SERVICE')}>Worker_Station</Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {clients.map(client => (
          <Card key={client.id}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-1.5 h-10 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{client.name}</h3>
                </div>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{client.time} • {client.address}</p>
                <div className="flex flex-wrap gap-2">
                  {client.mobilityStatus?.dementia && <Badge variant="warning">Dementia_Watch</Badge>}
                  {client.mobilityStatus?.isBedridden && <Badge variant="error">Bedridden</Badge>}
                  <Badge variant="outline">Lift: {client.mobilityStatus?.liftType || 'None'}</Badge>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">"{client.description}"</p>
              </div>

              <div className="w-full lg:w-72">
                <Button 
                  variant="primary" 
                  size="xl" 
                  className="w-full mb-4"
                  onClick={() => handleClockIn(client)}
                >
                  INITIALIZE_SHIFT
                </Button>
                {client.isInitialVisit && (
                   <div className="p-6 bg-indigo-500/5 rounded-3xl border border-white/5 text-center">
                     <p className="text-[8px] font-black text-slate-600 uppercase mb-3 tracking-widest">New Return Profile</p>
                     <div className="flex justify-center gap-2 text-sm">⭐ ⭐ ⭐ ⭐ ⭐</div>
                   </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;