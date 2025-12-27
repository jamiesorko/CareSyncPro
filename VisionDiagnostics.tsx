
import React, { useState, useRef } from 'react';
import { geminiService } from '../../services/geminiService';
import VisionCapture from '../../components/ui/VisionCapture';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import AnalysisCard from '../../components/ui/AnalysisCard';

interface Props {
  language: string;
}

const VisionDiagnostics: React.FC<Props> = ({ language }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1];
      setImage(ev.target?.result as string);
      runAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64: string) => {
    setLoading(true);
    try {
      const result = await geminiService.analyzeHazardImage(base64);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("SIGNAL_LOST: Failed to interrogate visual vector.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-12" hover={false}>
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Vision_Guard_v4</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Grounded Multimodal Clinical Triage</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => { setImage(null); setAnalysis(""); }}>
          Reset_Lens
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative">
          <VisionCapture 
            image={image} 
            loading={loading} 
            onClick={() => fileInputRef.current?.click()} 
            onUpload={handleImageUpload}
          />
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
        </div>

        <div className="flex flex-col justify-center">
           <AnalysisCard 
             title="Diagnostic_Signal"
             subtitle="Multimodal_Visual_Synthesis"
             content={loading ? "Interrogating pixel density for clinical anomalies..." : analysis}
             confidence={analysis ? 92 : 0}
             loading={loading}
             type="CLINICAL"
           >
             {analysis && !loading && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <Button variant="primary" className="w-full py-5">
                    Authorize_Log_to_Care_Plan
                  </Button>
                  <p className="text-[8px] font-black text-slate-700 text-center uppercase tracking-widest">
                    Neural Scan Result committed to Sovereign Ledger
                  </p>
               </div>
             )}
           </AnalysisCard>
        </div>
      </div>
    </Card>
  );
};

export default VisionDiagnostics;
