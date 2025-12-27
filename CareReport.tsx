import React, { useState } from 'react';
import { CareRole, Client, AlertType } from '../types';
import Translate from '../components/Translate';
import { clinicalService } from '../services/clinicalService';
import NeuralScribe from './rn/NeuralScribe';

interface Props {
  role: CareRole;
  language: string;
  clients: Client[];
}

const CareReport: React.FC<Props> = ({ role, language, clients }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [reportType, setReportType] = useState<string>('');
  const [useNeuralScribe, setUseNeuralScribe] = useState(false);
  const [note, setNote] = useState('');
  const [escalationTarget, setEscalationTarget] = useState<'COORDINATOR' | 'SUPERVISOR' | 'BOTH'>('COORDINATOR');

  const allCategories = [
    { label: 'FALL / BURN / CHOKING', group: 'EMERGENCY', color: 'bg-rose-600', roles: ['ALL'] },
    { label: 'MEDICAL EMERGENCY', group: 'EMERGENCY', color: 'bg-rose-600', roles: ['ALL'] },
    { label: 'NOT SEEN / NOT FOUND', group: 'OPERATIONAL', color: 'bg-amber-600', roles: ['ALL'] },
    { label: 'UNSAFE FOR STAFF', group: 'SAFETY', color: 'bg-indigo-600', roles: ['ALL'] },
    { label: 'BEDSORES / SWELLING', group: 'CLINICAL', color: 'bg-indigo-600', roles: [CareRole.RN, CareRole.RPN, CareRole.PSW] },
    { label: 'UNABLE TO COMPLETE', group: 'HSS_ENVIRONMENT', color: 'bg-slate-600', roles: [CareRole.HSS] }
  ];

  const filteredCategories = allCategories.filter(cat => 
    cat.roles.includes('ALL') || cat.roles.includes(role as any)
  );

  const handleSubmit = async () => {
    if (!reportType || !selectedClientId) {
      alert("Verification required: Selection of resident and incident type mandatory.");
      return;
    }
    
    try {
      await clinicalService.createIncident({
        clientId: selectedClientId,
        type: reportType as AlertType,
        note: note,
        escalationTarget: escalationTarget
      });
      alert(`Incident report [${reportType}] transmitted to the secure ledger.`);
      setReportType('');
      setNote('');
    } catch (err) {
      alert("Transmission failure: Secure ledger unreachable.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Incident Reporting</h2>
          <p className="text-sm text-slate-500">Capture and route operational or clinical signals</p>
        </div>
        <button 
          onClick={() => setUseNeuralScribe(!useNeuralScribe)}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            useNeuralScribe 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {useNeuralScribe ? 'Standard View' : 'Neural Scribe Assist'}
        </button>
      </div>

      {useNeuralScribe ? (
        <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <NeuralScribe language={language} />
        </div>
      ) : (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Patient Dossier</label>
              <select 
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none"
              >
                {clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Escalation Routing</label>
              <select 
                value={escalationTarget}
                onChange={(e) => setEscalationTarget(e.target.value as any)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none"
              >
                <option value="COORDINATOR" className="bg-slate-900">Coordinator (Operational)</option>
                <option value="SUPERVISOR" className="bg-slate-900">Director of Care (Clinical)</option>
                <option value="BOTH" className="bg-slate-900">Regional Authority (Compliance)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Incident Classification</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {filteredCategories.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => setReportType(cat.label)}
                  className={`p-3 rounded-xl text-left border transition-all h-20 flex flex-col justify-between ${
                    reportType === cat.label 
                    ? `${cat.color} border-white text-white shadow-lg scale-[1.02]` 
                    : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70">{cat.group}</span>
                  <span className="text-[10px] font-semibold leading-tight uppercase">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Clinical Narrative</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide objective clinical observations..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl p-5 text-sm text-slate-200 outline-none h-32 focus:border-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            <Translate targetLanguage={language}>Transmit Incident Signal</Translate>
          </button>
        </div>
      )}
    </div>
  );
};

export default CareReport;