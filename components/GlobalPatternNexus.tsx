
import React, { useState, useEffect, useRef } from 'react';
import { GlobalPattern } from '../types';
import { generateGlobalPattern } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface GlobalPatternNexusProps {
   onClose: () => void;
}

const HUBS = ["NEO-MANILA", "MARANELLO", "GENEVA", "LONDON", "NEW-NEW YORK", "TOKYO-CITADEL", "SYDNEY-GATE"];

export const GlobalPatternNexus: React.FC<GlobalPatternNexusProps> = ({ onClose }) => {
   const [origin, setOrigin] = useState('');
   const [destination, setDestination] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [pattern, setPattern] = useState<GlobalPattern | null>(null);
   const [logs, setLogs] = useState<string[]>([]);
   const logRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (logRef.current) {
         logRef.current.scrollTop = logRef.current.scrollHeight;
      }
   }, [logs]);

   const handleGenerate = async () => {
      if (!origin || !destination) return;
      if (origin === destination) {
         setLogs(prev => [...prev, "ERROR: HUB SELF-CONNECTION PROHIBITED."]);
         return;
      }

      sounds.play('action');
      setIsGenerating(true);
      setLogs([`UPLINK_INITIALIZED: GLOBAL HUB NEXUS`, `ORIGIN: ${origin}`, `DESTINATION: ${destination}`]);

      const steps = [
         "Accessing Inter-Continental Data Tunnels...",
         "Mapping Chain-Jet Corridors...",
         "Synthesizing Cultural Sync Protocols...",
         "Quantum Resonance Testing...",
         "Establishing HQ Pattern..."
      ];

      for (const step of steps) {
         await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
         setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] > ${step}`]);
      }

      try {
         const result = await generateGlobalPattern(origin, destination);
         setPattern(result);
         sounds.play('success');
         setIsGenerating(false);
      } catch (error) {
         sounds.play('error');
         setLogs(prev => [...prev, "ERROR: GLOBAL SYNC FAILURE. DATA LOSS DETECTED."]);
         setIsGenerating(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[280] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8 overflow-hidden">
         <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#06b6d4_2px,transparent_2px)] bg-[size:30px_30px] animate-pulse"></div>

         <div className="max-w-7xl w-full bg-[#050505] border-2 border-cyan-500/30 rounded-[4rem] overflow-hidden relative shadow-[0_0_150px_rgba(6,182,212,0.2)] flex flex-col min-h-[800px] animate-in zoom-in duration-500">

            {/* Header HUD */}
            <div className="p-12 border-b border-cyan-500/10 flex justify-between items-center bg-black/40">
               <div>
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] neon-text-cyan italic">GLOBAL_NEXUS_V8.2</span>
                  <h3 className="font-orbitron text-4xl font-black text-white uppercase italic tracking-tighter">HQ Connectivity <span className="text-cyan-500">Patterns</span></h3>
               </div>
               <button onClick={onClose} className="text-cyan-500/50 hover:text-cyan-400 transition-all hover:scale-110">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row">
               {/* Sidebar: Control */}
               <div className="w-full lg:w-1/3 bg-black/40 border-r border-cyan-500/10 p-12 space-y-12">
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-cyan-500/60 uppercase tracking-[0.4em] ml-2">ORIGIN HUB</label>
                        <select
                           value={origin}
                           onChange={(e) => { sounds.play('hover'); setOrigin(e.target.value); }}
                           className="w-full bg-white/5 border border-cyan-500/20 rounded-2xl px-6 py-4 text-[11px] font-black tracking-widest text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer uppercase"
                        >
                           <option value="" className="bg-black text-gray-800">CHOOSE HUB...</option>
                           {HUBS.map(hub => <option key={hub} value={hub} className="bg-black text-white">{hub}</option>)}
                        </select>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-cyan-500/60 uppercase tracking-[0.4em] ml-2">DESTINATION HUB</label>
                        <select
                           value={destination}
                           onChange={(e) => { sounds.play('hover'); setDestination(e.target.value); }}
                           className="w-full bg-white/5 border border-cyan-500/20 rounded-2xl px-6 py-4 text-[11px] font-black tracking-widest text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer uppercase"
                        >
                           <option value="" className="bg-black text-gray-800">CHOOSE HUB...</option>
                           {HUBS.map(hub => <option key={hub} value={hub} className="bg-black text-white">{hub}</option>)}
                        </select>
                     </div>

                     <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !origin || !destination}
                        className="w-full py-8 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.8em] rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all disabled:opacity-20 transform active:scale-95 shadow-xl border-b-4 border-cyan-800"
                     >
                        {isGenerating ? 'SYNTHESIZING...' : 'GENERATE PATTERN'}
                     </button>
                  </div>

                  <div
                     ref={logRef}
                     className="flex-1 bg-black border border-cyan-500/20 p-8 rounded-[2rem] font-mono text-[10px] text-cyan-400/60 overflow-y-auto space-y-2 h-64"
                  >
                     {logs.map((log, i) => <div key={i}>{'>'} {log}</div>)}
                  </div>
               </div>

               {/* Main Display: Pattern Visualization */}
               <div className="flex-1 p-16 bg-black relative overflow-y-auto">
                  {!pattern ? (
                     <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <svg className="w-48 h-48 mb-12 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xl uppercase tracking-[1em] font-black text-center">Awaiting International Uplink...</p>
                     </div>
                  ) : (
                     <div className="space-y-16 animate-in fade-in slide-in-from-right duration-1000">
                        <div className="flex justify-between items-center">
                           <div className="space-y-2">
                              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block neon-text-cyan">Pattern Verified: {pattern.patternId}</span>
                              <h2 className="font-orbitron text-5xl font-black text-white uppercase italic tracking-tighter">{pattern.originHub} <span className="text-cyan-500">&gt;&gt;</span> {pattern.destinationHub}</h2>
                           </div>
                           <div className="text-right">
                              <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-1">Status</span>
                              <span className="text-3xl font-orbitron font-black text-emerald-400 neon-text-emerald italic">{pattern.status}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                           <div className="space-y-10">
                              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
                                 <h4 className="text-[12px] font-black text-cyan-500 uppercase tracking-[0.5em]">Logistics HQ Pattern</h4>
                                 <p className="text-gray-300 text-lg italic leading-relaxed font-medium">&ldquo;{pattern.logisticsRoute}&rdquo;</p>
                              </div>
                              <div className="bg-magenta-900/5 border border-magenta-500/20 p-10 rounded-[3rem] space-y-6">
                                 <h4 className="text-[12px] font-black text-magenta-400 uppercase tracking-[0.5em]">Cultural Sync Protocol</h4>
                                 <p className="text-gray-300 text-sm italic leading-relaxed font-medium">{pattern.culturalSyncProtocol}</p>
                              </div>
                           </div>

                           <div className="space-y-10">
                              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8">
                                 <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em]">Quantum Connectivity Nodes</h4>
                                 <div className="space-y-6">
                                    {pattern.nodes.map((node, i) => (
                                       <div key={i} className="flex items-center justify-between group">
                                          <div className="flex items-center gap-6">
                                             <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center font-black text-cyan-400 text-sm group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                                {i + 1}
                                             </div>
                                             <div>
                                                <p className="text-sm font-black text-white uppercase tracking-widest">{node.name}</p>
                                                <p className="text-[10px] text-gray-500 font-mono">{node.coordinate}</p>
                                             </div>
                                          </div>
                                          <div className="flex flex-col items-end gap-1">
                                             <span className="text-[9px] font-black text-gray-600 uppercase">Strength</span>
                                             <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-500 shadow-[0_0_10px_cyan]" style={{ width: `${node.strength}%` }}></div>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="bg-gradient-to-br from-cyan-600/20 to-black p-10 rounded-[3rem] border border-cyan-500/20 relative overflow-hidden group">
                                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#06b6d410_0%,transparent_70%)]"></div>
                                 <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                       <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Energy Required</span>
                                       <p className="font-orbitron text-2xl font-black text-white tracking-tighter uppercase">{pattern.energyRequirement}</p>
                                    </div>
                                    <button className="px-8 py-4 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                       ACTIVATE GRID
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-8 pb-12">
                           <button
                              onClick={() => { sounds.play('action'); setPattern(null); setLogs([]); }}
                              className="flex-1 py-8 bg-white/5 border border-white/10 text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-3xl hover:bg-white/10 transition-all"
                           >
                              RE-MAP GLOBAL ROUTE
                           </button>
                           <button
                              onClick={onClose}
                              className="flex-1 py-8 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-3xl hover:bg-cyan-500 shadow-2xl transition-all"
                           >
                              LOCK HQ PATTERN
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
