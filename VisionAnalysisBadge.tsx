
import React from 'react';

interface Props {
  loading: boolean;
  hasResult: boolean;
}

const VisionAnalysisBadge: React.FC<Props> = ({ loading, hasResult }) => {
  if (!loading && !hasResult) return null;

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></div>
      <p className={`text-[9px] font-black uppercase tracking-widest ${loading ? 'text-indigo-400' : 'text-emerald-400'}`}>
        {loading ? 'Neural_Vector_Analysis_Active' : 'Diagnostic_Signal_Locked'}
      </p>
    </div>
  );
};

export default VisionAnalysisBadge;
