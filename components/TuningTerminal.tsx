
import React, { useState, useEffect, useRef } from 'react';
import { Vehicle, PerformancePatch } from '../types';
import { generatePerformancePatch } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface TuningTerminalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const OBJECTIVES = [
  'Tactical Executive Extraction',
  'Billboard PH Cultural Resonance',
  'Hyper-Sonic Warp Stability',
  'Infiltration & Ghost Presence',
  'Interstellar Humanitarian Logistics'
];

export const TuningTerminal: React.FC<TuningTerminalProps> = ({ vehicle, onClose }) => {
  const [objective, setObjective] = useState('');
  const [isTuning, setIsTuning] = useState(false);
  const [patch, setPatch] = useState<PerformancePatch | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const handleTune = async () => {
    if (!objective) return;
    sounds.play('action');
    setIsTuning(true);
    setLogs([`INITIATING NEURAL UPLINK: ${vehicle.name.toUpperCase()}`, `OBJECTIVE: ${objective.toUpperCase()}`]);
    
    const steps = [
      "Accessing Core Engine Flux...",
      "Bypassing AI Safety Inhibitors...",
      "Syncing Biometric Signature...",
      "Synthesizing Neural Patch...",
      "Quantum Verification Level 7...",
      "Patch Complete."
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] > ${step}`]);
    }

    try {
      const result = await generatePerformancePatch(vehicle.name, objective);
      setPatch(result);
      sounds.play('success');
      setIsTuning(false);
    } catch (error) {
      sounds.play('error');
      setLogs(prev => [...prev, "ERROR: CRITICAL UPLINK FAILURE."]);
      setIsTuning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-flow"></div>
      
      <div className="max-w-6xl w-full bg-[#050505] border-2 border-magenta-500/30 rounded-[3rem] overflow-hidden relative shadow-[0_0_100px_rgba(217,70,239,0.1)] flex flex-col md:flex-row min-h-[600px] animate-in zoom-in duration-500">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-10 right-10 z-50 text-magenta-500/50 hover:text-magenta-400 transition-all hover:scale-110">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Sidebar: Config */}
        <div className="w-full md:w-1/3 bg-black/50 border-r border-magenta-500/20 p-12 space-y-12">
           <div className="space-y-4">
              <span className="px-3 py-1 bg-magenta-900/30 border border-magenta-500/30 text-magenta-400 text-[10px] font-black uppercase tracking-[0.5em] rounded-md neon-text-magenta italic">Uplink Status: Ready</span>
              <h3 className="font-orbitron text-3xl font-black text-white uppercase italic tracking-tighter">Neural <span className="text-magenta-500">Tuner</span></h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Optimize the neural core of the {vehicle.name} for high-stakes deployment.</p>
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[11px] font-black text-magenta-400/60 uppercase tracking-[0.4em] ml-2">MISSION OBJECTIVE</label>
                 <select 
                   value={objective} 
                   onChange={(e) => { sounds.play('hover'); setObjective(e.target.value); }}
                   className="w-full bg-white/5 border border-magenta-500/20 rounded-2xl px-6 py-4 text-[11px] font-black tracking-widest text-white focus:outline-none focus:border-magenta-500 transition-all appearance-none cursor-pointer uppercase"
                 >
                   <option value="" className="bg-black text-gray-800">SELECT PROFILE...</option>
                   {OBJECTIVES.map(obj => <option key={obj} value={obj} className="bg-black text-white">{obj}</option>)}
                 </select>
              </div>
              <button 
                onClick={handleTune} 
                disabled={isTuning || !objective}
                className="w-full py-6 bg-magenta-600 text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-2xl hover:bg-magenta-500 hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] transition-all disabled:opacity-20 transform active:scale-95 shadow-xl"
              >
                {isTuning ? 'TUNING...' : 'INITIATE UPLINK'}
              </button>
           </div>

           <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Biometric Link</span>
                 <span className="text-emerald-500 text-[10px] font-black">STABLE</span>
              </div>
              <div className="flex gap-1 h-1">
                 {[...Array(12)].map((_, i) => <div key={i} className={`flex-1 rounded-full ${i < 10 ? 'bg-emerald-500' : 'bg-white/10'}`}></div>)}
              </div>
           </div>
        </div>

        {/* Main: Terminal / Results */}
        <div className="flex-1 flex flex-col p-12 bg-black/80 relative">
           {!patch ? (
             <div className="flex-1 flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                   <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] neon-text-cyan animate-pulse">TERMINAL FEED_V2.0</span>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse"></div>
                   </div>
                </div>
                <div 
                  ref={logRef}
                  className="flex-1 bg-black border border-cyan-500/20 p-8 rounded-[2rem] font-mono text-[12px] text-cyan-400/80 overflow-y-auto space-y-3 shadow-inner"
                >
                   {logs.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <svg className="w-20 h-20 mb-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <p className="uppercase tracking-[0.4em] font-black">Awaiting Uplink Initiation...</p>
                     </div>
                   ) : (
                     logs.map((log, i) => (
                       <div key={i} className="animate-in fade-in slide-in-from-left duration-300">
                          {log}
                       </div>
                     ))
                   )}
                </div>
             </div>
           ) : (
             <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="text-center border-b border-white/10 pb-10">
                   <span className="px-4 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.5em] rounded-md mb-4 inline-block shadow-[0_0_20px_rgba(6,182,212,0.4)]">PATCH VERIFIED</span>
                   <h4 className="font-orbitron text-4xl font-black text-white uppercase italic tracking-tighter">Optimized: {patch.objectiveName}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-3">
                      <span className="text-[11px] font-black text-magenta-400 uppercase tracking-widest neon-text-magenta">Engine Tuning</span>
                      <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-magenta-500/30 pl-6">&ldquo;{patch.engineTuning}&rdquo;</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-3">
                      <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest neon-text-cyan">AI Reflexes</span>
                      <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-cyan-500/30 pl-6">&ldquo;{patch.aiLogicUpgrade}&rdquo;</p>
                   </div>
                </div>

                <div className="bg-gradient-to-r from-magenta-500/10 to-cyan-500/10 border-2 border-white/5 p-10 rounded-[3rem] relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magenta-500 via-white to-cyan-500 group-hover:animate-pulse transition-all"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-2">
                         <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">Resonance Bonus (Billboard PH ROI)</span>
                         <p className="text-2xl font-orbitron font-black text-white tracking-tighter">{patch.resonanceBonus}</p>
                      </div>
                      <div className="text-right">
                         <span className="text-[11px] font-black text-white/50 uppercase tracking-widest block mb-1">Stability Rating</span>
                         <span className="text-3xl font-orbitron font-black text-emerald-400 neon-text-emerald italic">{patch.stabilityRating}</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-6">
                   <button 
                     onClick={() => { sounds.play('success'); setPatch(null); setLogs([]); }}
                     className="flex-1 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-magenta-500 hover:text-white transition-all shadow-xl"
                   >
                     RE-TUNE CORE
                   </button>
                   <button 
                     onClick={onClose}
                     className="flex-1 py-5 bg-transparent border-2 border-white/20 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-white/5 transition-all"
                   >
                     DEPLOY PATCH
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
