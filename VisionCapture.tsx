
import React from 'react';

interface Props {
  image: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  loading: boolean;
}

const VisionCapture: React.FC<Props> = ({ image, onUpload, onClick, loading }) => {
  return (
    <div 
      onClick={!loading ? onClick : undefined}
      className={`aspect-square bg-black/40 rounded-[3rem] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
        loading ? 'border-indigo-500/50 cursor-wait' : 'border-white/5 hover:border-indigo-500/50'
      }`}
    >
      {image ? (
        <div className="relative w-full h-full">
          <img src={image} className="w-full h-full object-cover" alt="Clinical Vector" />
          {loading && (
            <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-full h-1 bg-white/20 absolute top-0 animate-[bounce_2s_infinite]">
                <div className="w-full h-full bg-indigo-400 shadow-[0_0_15px_#818cf8]"></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</span>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ingest_Clinical_Vector</p>
        </>
      )}
      <input type="file" hidden accept="image/*" />
    </div>
  );
};

export default VisionCapture;
