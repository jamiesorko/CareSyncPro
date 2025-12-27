import React, { useState, useEffect } from 'react';
import { iotFleetService } from '../../services/iotFleetService';
import { IoTAsset } from '../../types';
import Translate from '../../components/Translate';

interface Props {
  language: string;
}

const IoTFleetCommand: React.FC<Props> = ({ language }) => {
  const [assets, setAssets] = useState<IoTAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<IoTAsset | null>(null);

  const syncAssets = async () => {
    setLoading(true);
    const mockAssets = [
      { id: 'iot-v1', name: 'Fleet Unit 42 (Van)', type: 'VEHICLE', telemetry: 'Brake pad wear detected (Code: 092A)', location: 'North York' },
      { id: 'iot-h1', name: 'Mechanical Hoyer #9', type: 'HARDWARE', telemetry: 'Battery cell degradation (Capacity: 12%)', location: 'Etobicoke' },
      { id: 'iot-h2', name: 'O2 Concentrator-Alpha', type: 'HARDWARE', telemetry: 'Flow rate fluctuation (0.4L variance)', location: 'Downtown' }
    ];

    const processed = await Promise.all(mockAssets.map(a => 
      iotFleetService.processAssetTelemetry(a as any, a.location)
    ));
    setAssets(processed);
    setLoading(false);
  };

  useEffect(() => {
    syncAssets();
  }, []);

  return (
    <div className="h-full space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-cyan-400">IoT_Fleet_Command</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Autonomous Maintenance & Hardware Lifecycle Intercept</p>
        </div>
        <button 
          onClick={syncAssets}
          disabled={loading}
          className="px-10 py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 hover:bg-slate-700 transition-all shadow-3xl"
        >
          {loading ? 'INGESTING_IOT_SIGNAL...' : 'REFRESH_TELEMETY_GRID'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Logistics Grid */}
        <div className="lg:col-span-8 bg-black border border-white/10 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
           
           <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-10 relative z-10">Active_Asset_Matrix</h3>
           
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 overflow-y-auto scrollbar-hide pr-2">
              {assets.map((asset) => (
                <div 
                  key={asset.id} 
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${selectedAsset?.id === asset.id ? 'bg-cyan-600/10 border-cyan-500/50' : 'bg-white/[0.03] border-white/5 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${asset.status === 'NOMINAL' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20 animate-pulse'}`}>
                       <span className="text-xl">{asset.type === 'VEHICLE' ? '🚐' : '🏥'}</span>
                    </div>
                    <div className="text-right">
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${asset.status === 'NOMINAL' ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'}`}>{asset.status}</span>
                       <p className="text-[7px] font-bold text-slate-600 uppercase mt-2">IoT Signal: Locked</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">{asset.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium italic mb-4">"{asset.telemetry}"</p>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                     <p className="text-[8px] font-black text-cyan-400 uppercase">View Maintenance History</p>
                     <span className="text-xs">→</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Maintenance Intercept Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex-1 flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="text-7xl font-black italic">FIX</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-slate-500">Autonomous_Repair_Nexus</h3>
              
              {selectedAsset ? (
                <div className="flex-1 space-y-8 relative z-10 animate-in slide-in-from-right-4">
                   <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl">
                      <p className="text-[8px] font-black text-cyan-400 uppercase mb-3">Grounded_Technician_Source</p>
                      <p className="text-sm font-bold text-white italic leading-relaxed">
                        {selectedAsset.repairGroundedInfo}
                      </p>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                         <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Impact Probability</p>
                         <p className="text-xs font-bold text-slate-300">"92% probability of asset failure in next 12 usage hours."</p>
                      </div>
                      <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                         <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Procurement Direct</p>
                         <p className="text-xs font-bold text-slate-300">Replacement parts available in Sector 1 Depot.</p>
                      </div>
                   </div>

                   <button 
                    onClick={() => alert("SIGNAL_LOCKED: Maintenance work order published to technician gateway. Asset flagged for downtime.")}
                    className="w-full mt-auto py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                   >
                     EXECUTE_REPAIR_ORDER
                   </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center opacity-20 italic text-sm text-center px-10">
                  Select an asset for maintenance vector analysis.
                </div>
              )}
           </div>

           <div className="bg-cyan-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-cyan-600/30">
              <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">Maintenance_Status</p>
              <div className="space-y-4">
                 {[
                   { label: 'Uptime Integrity', val: '98.4%', color: 'text-white' },
                   { label: 'Avg Repair TTR', val: '4.2h', color: 'text-white' },
                   { label: 'Critical Faults', val: assets.filter(a => a.status === 'FAULT').length, color: 'text-rose-200' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <span className="text-[10px] font-bold opacity-60 uppercase">{stat.label}</span>
                      <span className={`text-[11px] font-black uppercase ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default IoTFleetCommand;