
import React, { useState } from 'react';
import { Company, AppTab } from '../../types';
import Translate from '../../components/Translate';
import { dbService } from '../../services/dbService';

interface Props {
  company: Company;
  setCompany: (company: Company) => void;
  language: string;
}

const CompanySettings: React.FC<Props> = ({ company, setCompany, language }) => {
  const [name, setName] = useState(company.name);
  const [color, setColor] = useState(company.brandColor || '#0ea5e9');
  const [isSaving, setIsSaving] = useState(false);

  const availableModules = Object.values(AppTab).filter(t => t !== AppTab.ORG_COMMAND);

  const handleToggleModule = (mod: string) => {
    const current = company.activeModules || [];
    const updated = current.includes(mod) 
      ? current.filter(m => m !== mod) 
      : [...current, mod];
    setCompany({ ...company, activeModules: updated });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dbService.updateCompanySettings(company.id, { 
        name, 
        brandColor: color,
        activeModules: company.activeModules 
      });
      setCompany({ ...company, name, brandColor: color });
      alert("INSTANCE_LOCKED: Organization parameters updated across global node.");
    } catch (err) {
      alert("SYNC_FAILURE: Failed to persist org changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      <div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Instance_Command</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Organization Configuration & Neural Feature Flags</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase italic">Branding_Core</h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Organization Identity</label>
              <input 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:border-sky-500 italic"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Brand Accent Vector</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="color" 
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-12 h-12 bg-transparent border-none cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400">{color.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase italic">Feature_Matrix</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
            {availableModules.map(mod => (
              <label key={mod} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all group">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-tighter transition-colors">{mod}</span>
                <input 
                  type="checkbox" 
                  checked={company.activeModules?.includes(mod)}
                  onChange={() => handleToggleModule(mod)}
                  className="w-4 h-4 rounded bg-slate-800 border-white/10 text-sky-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/20 p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div>
          <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Commit_Configuration</h4>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Locked instance parameters propagate instantly across mobile fleet</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isSaving ? 'SYNCHRONIZING...' : 'AUTHORIZE_ORG_PULSE'}
        </button>
      </div>
    </div>
  );
};

export default CompanySettings;
