import React, { useState } from 'react';
import { CareRole, StaffMember } from '../types';
import Translate from '../components/Translate';
import HiringHub from './hr/HiringHub';
import ComplianceManager from './hr/ComplianceManager';
import CapacityPlanner from './hr/CapacityPlanner';
import StaffManager from './hr/StaffManager';
import WorkforceNexus from './hr/WorkforceNexus';
import RetentionIntelligence from './hr/RetentionIntelligence';
import TalentSourcingNode from './hr/TalentSourcingNode';
import { MOCK_STAFF } from '../data/careData';

interface Props {
  role: CareRole;
  language: string;
}

const HRPortal: React.FC<Props> = ({ role, language }) => {
  const [activeTab, setActiveTab] = useState<'HIRING' | 'COMPLIANCE' | 'CAPACITY' | 'STAFF' | 'NEXUS' | 'RETENTION' | 'SOURCING'>('NEXUS');
  const isHR = role === CareRole.HR_SPECIALIST || role === CareRole.CEO;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Resource Core</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Human Capital & Compliance Oversight</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('NEXUS')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'NEXUS' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            Workforce Nexus
          </button>
          <button 
            onClick={() => setActiveTab('RETENTION')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'RETENTION' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            Retention Intel
          </button>
          <button 
            onClick={() => setActiveTab('SOURCING')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'SOURCING' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            Talent Sourcing
          </button>
          <button 
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'COMPLIANCE' ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-slate-500 hover:text-white'}`}
          >
            Compliance & Training
          </button>
          {isHR && (
            <>
              <button 
                onClick={() => setActiveTab('HIRING')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'HIRING' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
              >
                Hiring Hub
              </button>
              <button 
                onClick={() => setActiveTab('STAFF')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'STAFF' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
              >
                Personnel
              </button>
              <button 
                onClick={() => setActiveTab('CAPACITY')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === 'CAPACITY' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
              >
                Capacity Planning
              </button>
            </>
          )}
        </div>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'NEXUS' && <WorkforceNexus staff={MOCK_STAFF} language={language} />}
        {activeTab === 'RETENTION' && <RetentionIntelligence staff={MOCK_STAFF} language={language} />}
        {activeTab === 'SOURCING' && <TalentSourcingNode language={language} />}
        {activeTab === 'COMPLIANCE' && <ComplianceManager language={language} isHR={isHR} />}
        {activeTab === 'HIRING' && isHR && <HiringHub language={language} />}
        {activeTab === 'STAFF' && isHR && <StaffManager language={language} />}
        {activeTab === 'CAPACITY' && isHR && <CapacityPlanner language={language} />}
      </div>
    </div>
  );
};

export default HRPortal;