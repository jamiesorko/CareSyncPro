
import React, { useState } from 'react';
import Translate from '../components/Translate';
import { CareRole, Client } from '../types';

interface Props {
  language: string;
  role: CareRole;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const AdminPortal: React.FC<Props> = ({ language, role, clients, setClients }) => {
  const [showIntake, setShowIntake] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState({ name: '', address: '', phone: '', conditions: '' });

  const handleIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (clients.length + 1).toString();
    // Fixed: Use valid Client interface properties
    const client: Client = {
      id,
      companyId: 'demo-company',
      anonymizedId: `C${100 + clients.length + 1}`,
      name: newClient.name,
      address: newClient.address,
      sector: 'General',
      phone: newClient.phone,
      time: '09:00 AM',
      date: 'Monday',
      conditions: newClient.conditions.split(','),
      mobilityStatus: {
        isBedridden: false,
        useWheelchair: false,
        useWalker: true,
        dementia: false,
        liftType: 'None',
        transferMethod: 'Independent'
      },
      isInitialVisit: true,
      description: 'Newly onboarded client.',
      carePlans: {},
      medications: [],
      blacklistStaffIds: [],
      currentVisitStatus: 'IDLE'
    };
    setClients(prev => [...prev, client]);
    setShowIntake(false);
    setNewClient({ name: '', address: '', phone: '', conditions: '' });
    alert("INTAKE_SUCCESS: Patient synchronized across Neural Core.");
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Census_Control</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Administrative & Operational Registry</p>
        </div>
        <button onClick={() => setShowIntake(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">New Patient Intake</button>
      </div>

      <div className="relative">
        <input 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Query Global Census Matrix..."
          className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 px-12 text-2xl font-black text-white focus:outline-none focus:border-indigo-500 transition-all italic placeholder:text-slate-800"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">Search Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map(c => (
            <div key={c.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] flex justify-between items-center group hover:bg-white/10 transition-all">
              <div>
                <p className="text-xl font-black text-white italic tracking-tighter uppercase">{c.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{c.address}</p>
              </div>
              <button className="text-[9px] font-black text-indigo-400 uppercase border border-indigo-400/20 px-4 py-2 rounded-xl">View Dossier</button>
            </div>
          ))}
        </div>
      </div>

      {showIntake && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleIntake} className="bg-[#020617] border border-white/10 p-12 rounded-[4rem] w-full max-w-2xl shadow-2xl space-y-8 animate-in zoom-in duration-500">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Patient_Intake_Protocol</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none"/>
              <input required value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} placeholder="Contact Phone" className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none"/>
              <input required value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} placeholder="Address" className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none"/>
              <input value={newClient.conditions} onChange={e => setNewClient({...newClient, conditions: e.target.value})} placeholder="Clinical Conditions (Comma Separated)" className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none"/>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setShowIntake(false)} className="flex-1 py-5 bg-white/5 text-slate-500 rounded-3xl font-black uppercase text-[10px]">Abort</button>
              <button type="submit" className="flex-1 py-5 bg-white text-black rounded-3xl font-black text-[10px] shadow-xl">Transmit to Ledger</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
