import React, { useState, useRef } from 'react';
import { bioSurveillanceService } from '../../services/bioSurveillanceService';
import Translate from '../../components/Translate';

interface Props {
  requiredPPE: string[];
  onVerified: () => void;
  onCancel: () => void;
  language: string;
}

const PPEIntercept: React.FC<Props> = ({ requiredPPE, onVerified, onCancel, language }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [findings, setFindings] = useState<{ verified: boolean; missing: string[] } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const captureAndVerify = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 400, 400);
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    setImage(canvasRef.current.toDataURL('image/jpeg'));

    setIsVerifying(true);
    const result = await bioSurveillanceService.verifyPPEComplaince(base64, requiredPPE);
    setFindings(result);
    setIsVerifying(false);

    if (result.verified) {
      setTimeout(onVerified, 2000);
    }
  };

  React.useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-rose-950/95 backdrop-blur-2xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-[#020617] border border-rose-500/30 rounded-[4rem] shadow-[0_0_100px_rgba(244,63,94,0.2)] overflow-hidden flex flex-col">
        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-rose-600/5">
           <div>
             <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">PPE_Sentinel_Lock</h2>
             <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.4em] mt-3">Sector Warning: Mandatory Safety Intercept</p>
           </div>
           <div className="px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest animate-pulse">
             Access_Restricted
           </div>
        </div>

        <div className="flex-1 p-12 space-y-10">
           <p className="text-sm text-slate-300 font-medium italic leading-relaxed text-center">
             "You are entering a high-intensity viral zone. Please don your mandatory PPE and verify your equipment to authorize visit clock-in."
           </p>

           <div className="aspect-square bg-black rounded-[3rem] border-4 border-dashed border-white/10 overflow-hidden relative flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} width="400" height="400" className="hidden" />
              
              {isVerifying && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-4">
                   <div className="w-12 h-12 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                   <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Interrogating_Safety_Vector</p>
                </div>
              )}

              {findings && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-12 transition-all ${findings.verified ? 'bg-emerald-500/90' : 'bg-rose-600/90'}`}>
                   <span className="text-6xl mb-6">{findings.verified ? '✅' : '❌'}</span>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                     {findings.verified ? 'PROTOCOL_VALIDATED' : 'INTEGRITY_FAILURE'}
                   </h3>
                   {!findings.verified && (
                     <p className="text-[10px] font-black text-white uppercase mt-4">Missing: {findings.missing.join(', ')}</p>
                   )}
                </div>
              )}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onCancel}
                className="py-5 bg-white/5 border border-white/10 text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest"
              >
                Abort_Visit
              </button>
              <button 
                onClick={captureAndVerify}
                disabled={isVerifying}
                className="py-5 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Perform_Vision_Scan
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PPEIntercept;
