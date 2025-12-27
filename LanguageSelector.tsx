
import React, { useState } from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 
    'Arabic', 'Portuguese', 'Japanese', 'Russian', 'Italian', 
    'Korean', 'Tagalog', 'Vietnamese', 'Swahili', 'Dutch', 'Turkish', 'Hebrew', 'Greek',
    'Polish', 'Thai', 'Swedish', 'Danish', 'Finnish', 'Romanian'
  ];

  const handleSelect = (lang: string) => {
    onLanguageChange(lang);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all shadow-xl group backdrop-blur-md"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🌐</span>
        <div className="text-left">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Switch</p>
          <p className="text-[11px] font-black uppercase text-white tracking-tighter">{currentLanguage}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-72 bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] p-6 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">Neural Switch Node</p>
          
          <div className="relative mb-4">
            <input 
              autoFocus
              type="text"
              placeholder="Search or type ANY language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-sky-500 transition-colors placeholder:text-slate-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search) {
                  handleSelect(search);
                }
              }}
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-1 pr-2 scrollbar-hide">
            {search && !commonLanguages.some(l => l.toLowerCase() === search.toLowerCase()) && (
               <button 
                onClick={() => handleSelect(search)}
                className="w-full text-left px-4 py-3 rounded-xl text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 font-black uppercase tracking-widest mb-2"
              >
                Translate to: "{search}"
              </button>
            )}
            {commonLanguages
              .filter(l => l.toLowerCase().includes(search.toLowerCase()))
              .map(lang => (
                <button 
                  key={lang}
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-all uppercase font-black tracking-widest ${
                    currentLanguage === lang ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
          </div>
          <p className="text-[8px] text-slate-600 mt-4 text-center italic">The system supports all 7,000+ world languages via neural translation.</p>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
