
import React, { useState } from 'react';
import { CareRole } from '../types';
import Translate from '../components/Translate';
import VaultChat from './vault/VaultChat';
import VaultTransferTerminal from './vault/VaultTransferTerminal';

interface Props {
  role: CareRole;
  language: string;
}

type VaultTab = 'INGESTION' | 'INTERROGATION';

const DocumentVault: React.FC<Props> = ({ role, language }) => {
  const [activeTab, setActiveTab] = useState<VaultTab>('INGESTION');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Neural Vault</h2>
          <p className="text-sm text-slate-500">Secure semantic indexing and protocol retrieval</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 shadow-sm">
          {(['INGESTION', 'INTERROGATION'] as VaultTab[]).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Translate targetLanguage={language}>{tab === 'INGESTION' ? 'Data Ingest' : 'Neural Query'}</Translate>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px] animate-in slide-in-from-bottom-4">
        {activeTab === 'INTERROGATION' ? (
          <div className="bg-slate-900 border border-white/5 rounded-2xl shadow-sm h-full min-h-[600px] overflow-hidden">
            <VaultChat language={language} />
          </div>
        ) : (
          <VaultTransferTerminal />
        )}
      </div>
    </div>
  );
};

export default DocumentVault;
