
import React, { useState, useEffect } from 'react';
import Translate from '../../components/Translate';
import { CareRole } from '../../types';

interface StaffNode {
  id: string;
  name: string;
  role: CareRole;
  x: number; 
  y: number; 
  status: 'ACTIVE' | 'IDLE' | 'EMERGENCY';
  signal: number;
}

interface Props {
  language: string;
}

const LiveMap: React.FC<Props> = ({ language }) => {
  const [nodes, setNodes] = useState<StaffNode[]>([
    { id: 'n1', name: 'Elena R.', role: CareRole.PSW, x: 45.2, y: 30.5, status: 'ACTIVE', signal: 98 },
    { id: 'n2', name: 'Mark K.', role: CareRole.RN, x: 25.1, y: 62.8, status: 'IDLE', signal: 82 },
    { id: 'n3', name: 'Sarah J.', role: CareRole.PSW, x: 70.4, y: 41.2, status: 'ACTIVE', signal: 95 },
    { id: 'n4', name: 'Jared L.', role: CareRole.RPN, x: 55.8, y: 75.1, status: 'EMERGENCY', signal: 45 },
    { id: 'n5', name: 'Mike T.', role: CareRole.HSS, x: 12.3, y: 18.9, status: 'IDLE', signal: 91 },
  ]);

  const [selectedNode, setSelectedNode] = useState<StaffNode | null>(null);

  useEffect(() => {
    const driftInterval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        x: Math.max(5, Math.min(95, node.x + (Math.random() - 0.5) * 1.2)),
        y: Math.max(5, Math.min(95, node.y + (Math.random() - 0.5) * 1.2)),
        signal: Math.max(20, Math.min(100, node.signal + (Math.random() - 0.5) * 4))
      })));
    }, 2000);
    return () => clearInterval(driftInterval);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden rounded-[3rem] border border-white/10 group shadow-2xl">
      {/* Background HUD Layers (Pointer Events Disabled to allow node interaction) */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5 pointer-events-none">
        {[...Array(144)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <defs>
          <radialGradient id="mapGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: 'rgb(59,130,246)', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(2,6,23)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="45%" fill="url(#mapGrad)" />
        <path d="M0,50 L100,50 M50,0 L50,100" stroke="white" strokeWidth="0.05" />
      </svg>

      {/* Interactive Staff Nodes */}
      <div className="absolute inset-0 z-10">
        {nodes.map(node => (
          <div 
            key={node.id}
            onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
            className="absolute transition-all duration-2000 ease-in-out cursor-pointer group/node"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Ping Rings */}
            <div className={`absolute -inset-6 rounded-full opacity-20 animate-ping ${
              node.status === 'EMERGENCY' ? 'bg-rose-500' : node.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-500'
            }`}></div>
            
            {/* Marker Core */}
            <div className={`relative w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all group-hover/node:scale-150 ${
               node.status === 'EMERGENCY' ? 'bg-rose-500' : node.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-500'
            }`}>
               <div className="absolute inset-0 bg-white/40 rounded-full scale-[0.3]"></div>
            </div>

            {/* Float Label */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity">
              <div className="bg-black/80 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-md">
                <p className="text-[8px] font-black text-white uppercase tracking-tighter">{node.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Telemetry Detail Overlay */}
      {selectedNode && (
        <div className="absolute bottom-8 right-8 w-72 bg-slate-950/80 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl animate-in slide-in-from-right-4 duration-500 z-50 shadow-3xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-base font-black text-white tracking-tighter uppercase leading-none">{selectedNode.name}</h4>
              <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mt-1">{selectedNode.role}</p>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Signal Integ.</span>
              <span className={`text-[10px] font-black ${selectedNode.signal > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{Math.round(selectedNode.signal)}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Global Status</span>
              <span className={`text-[10px] font-black uppercase ${selectedNode.status === 'EMERGENCY' ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                {selectedNode.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sector Position</span>
              <span className="text-[10px] font-black text-white">[{selectedNode.x.toFixed(1)}, {selectedNode.y.toFixed(1)}]</span>
            </div>
            <button className="w-full mt-4 py-4 bg-sky-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-xl shadow-sky-600/20">
              Open Biometric Feed
            </button>
          </div>
        </div>
      )}

      {/* Map Control Cluster */}
      <div className="absolute top-8 left-8 p-6 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md z-40 pointer-events-none">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Live Operational Matrix</p>
        </div>
        <div className="space-y-3">
          {[
            { color: 'bg-emerald-500', label: 'ACTIVE_OPS' },
            { color: 'bg-rose-500', label: 'PRIORITY_ALARM' },
            { color: 'bg-slate-500', label: 'IDLE_STATION' }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-sm ${item.color}`}></div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
