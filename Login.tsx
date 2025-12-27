import React, { useState, useEffect } from 'react';
import { CareRole, Company } from '../types';
import { dbService } from '../services/dbService';
import { MOCK_STAFF } from '../data/careData';
import Translate from '../components/Translate';

interface LoginProps {
  onLogin: (role: CareRole, name: string, company: Company) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getCompanies();
      setCompanies(data);
      if (data.length > 0) setSelectedCompany(data[0]);
      setLoading(false);
    };
    load();
  }, []);

  const sections = [
    { title: 'Executive Management', roles: [CareRole.CEO, CareRole.COO, CareRole.DOC] },
    { title: 'Clinical Operations', roles: [CareRole.RN, CareRole.RPN] },
    { title: 'Support Services', roles: [CareRole.PSW, CareRole.HSS] },
    { title: 'Administration', roles: [CareRole.ACCOUNTANT, CareRole.COORDINATOR, CareRole.HR_SPECIALIST] },
    { title: 'Patients & Family', roles: [CareRole.CLIENT, CareRole.FAMILY] }
  ];

  // Helper for mock logins of roles not in MOCK_STAFF
  const getMockUsersForRole = (role: CareRole) => {
    const fromStaff = MOCK_STAFF.filter(s => s.role === role);
    if (fromStaff.length > 0) return fromStaff;
    
    // Virtual mock for missing roles in basic data
    return [{
      id: `mock-${role.toLowerCase()}`,
      name: role === CareRole.CLIENT ? 'Robert Johnson' : role === CareRole.FAMILY ? 'Sarah Johnson' : `Generic ${role}`,
      role: role
    }];
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 selection:bg-indigo-500/30 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                    <span className="text-xl font-bold text-white">CP</span>
                </div>
                <h1 className="text-6xl font-extrabold text-white tracking-tighter">
                  CareSync<span className="text-indigo-500">Pro</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  High-Fidelity Institutional Intelligence for Healthcare Enterprises. 
                </p>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Institutional Instance</p>
                <div className="flex flex-wrap gap-3">
                    {companies.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setSelectedCompany(c)}
                            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all border ${selectedCompany?.id === c.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-3xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Persona Terminal</h3>
            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                {sections.map(section => (
                    <div key={section.title} className="space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest pl-1">{section.title}</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {section.roles.map(role => (
                                <React.Fragment key={role}>
                                  {getMockUsersForRole(role).map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => selectedCompany && onLogin(user.role as CareRole, user.name, selectedCompany)}
                                        className="p-5 bg-slate-800 border border-white/5 rounded-2xl text-left hover:border-indigo-500/50 group transition-all"
                                    >
                                        <p className="text-sm font-bold text-white mb-0.5">{user.name}</p>
                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight group-hover:text-indigo-400">{role}</p>
                                    </button>
                                  ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Login;