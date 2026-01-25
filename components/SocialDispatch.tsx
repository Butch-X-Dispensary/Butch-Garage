
import React, { useState, useEffect, useRef } from 'react';
import { Vehicle, SocialCampaign } from '../types';
import { generateSocialCampaign } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface SocialDispatchProps {
  vehicles: Vehicle[];
  onClose: () => void;
}

const HYPE_GOALS = [
  'Global Product Launch',
  'Humanitarian Mission Announcement',
  'Interstellar Hub Expansion',
  'Billboard PH Nexus Event',
  'Executive Fleet Showcase'
];

export const SocialDispatch: React.FC<SocialDispatchProps> = ({ vehicles, onClose }) => {
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [campaign, setCampaign] = useState<SocialCampaign | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const handleDispatch = async () => {
    const asset = vehicles.find(v => v.id === selectedAssetId);
    if (!asset || !selectedGoal) return;

    sounds.play('action');
    setIsDispatching(true);
    setLogs([`INITIALIZING BROADCAST NODE: ${asset.name.toUpperCase()}`, `HYPING GOAL: ${selectedGoal.toUpperCase()}`]);
    
    const steps = [
      "Accessing Neural Social Matrix...",
      "Encrypting Holographic Media...",
      "Uplinking to Billboard Nexus...",
      "Synthesizing Omni-Channel Script...",
      "Bypassing Global Algorithmic Barriers...",
      "Dispatching Content Nodes..."
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] > ${step}`]);
    }

    try {
      const result = await generateSocialCampaign(asset.name, selectedGoal);
      setCampaign(result);
      sounds.play('success');
      setIsDispatching(false);
    } catch (error) {
      sounds.play('error');
      setLogs(prev => [...prev, "ERROR: BROADCAST INTERRUPTED. UPLINK FAILED."]);
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8 overflow-hidden">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
         <div className="w-[800px] h-[800px] border border-cyan-500 rounded-full animate-ping"></div>
         <div className="absolute w-[600px] h-[600px] border border-magenta-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl w-full bg-[#050505] border-2 border-cyan-500/30 rounded-[4rem] overflow-hidden relative shadow-[0_0_150px_rgba(6,182,212,0.15)] flex flex-col md:flex-row min-h-[750px] animate-in zoom-in duration-500">
        
        {/* Close */}
        <button onClick={onClose} className="absolute top-12 right-12 z-50 text-cyan-500/50 hover:text-cyan-400 transition-all hover:scale-110">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Sidebar: Dispatch Control */}
        <div className="w-full md:w-1/3 bg-black/60 border-r border-cyan-500/20 p-16 space-y-12">
           <div className="space-y-4">
              <span className="px-4 py-1.5 bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] rounded-md neon-text-cyan italic">DISPATCH_CENTER ACTIVE</span>
              <h3 className="font-orbitron text-4xl font-black text-white uppercase italic tracking-tighter">Omni <span className="text-cyan-500">Dispatch</span></h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Broadcast executive Butch Garage updates across the global digital nexus.</p>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[11px] font-black text-cyan-500/60 uppercase tracking-[0.4em] ml-2">TARGET ASSET</label>
                 <select 
                   value={selectedAssetId} 
                   onChange={(e) => { sounds.play('hover'); setSelectedAssetId(e.target.value); }}
                   className="w-full bg-white/5 border border-cyan-500/20 rounded-2xl px-6 py-4 text-[11px] font-black tracking-widest text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer uppercase"
                 >
                   <option value="" className="bg-black text-gray-800">CHOOSE ASSET...</option>
                   {vehicles.map(v => <option key={v.id} value={v.id} className="bg-black text-white">{v.name}</option>)}
                 </select>
              </div>

              <div className="space-y-3">
                 <label className="text-[11px] font-black text-magenta-500/60 uppercase tracking-[0.4em] ml-2">HYPE STRATEGY</label>
                 <select 
                   value={selectedGoal} 
                   onChange={(e) => { sounds.play('hover'); setSelectedGoal(e.target.value); }}
                   className="w-full bg-white/5 border border-magenta-500/20 rounded-2xl px-6 py-4 text-[11px] font-black tracking-widest text-white focus:outline-none focus:border-magenta-500 transition-all appearance-none cursor-pointer uppercase neon-text-magenta"
                 >
                   <option value="" className="bg-black text-gray-800">SELECT MISSION...</option>
                   {HYPE_GOALS.map(goal => <option key={goal} value={goal} className="bg-black text-white">{goal}</option>)}
                 </select>
              </div>

              <button 
                onClick={handleDispatch} 
                disabled={isDispatching || !selectedAssetId || !selectedGoal}
                className="w-full py-8 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.8em] rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all disabled:opacity-20 transform active:scale-95 shadow-xl border-b-4 border-cyan-800"
              >
                {isDispatching ? 'BROADCASTING...' : 'INITIATE DISPATCH'}
              </button>
           </div>

           <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
              {['X', 'IG', 'LI'].map(p => (
                <div key={p} className="flex flex-col items-center gap-2">
                   <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-wait uppercase">
                      {p}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 flex flex-col p-16 bg-black relative">
           {!campaign ? (
             <div className="flex-1 flex flex-col">
                <div className="mb-8 flex items-center justify-between">
                   <span className="text-[11px] font-black text-magenta-500 uppercase tracking-[0.6em] neon-text-magenta animate-pulse">DISPATCH_TERMINAL_V4.9</span>
                   <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-cyan-500/40 animate-pulse"></div>
                   </div>
                </div>
                <div 
                  ref={logRef}
                  className="flex-1 bg-black border-2 border-magenta-500/10 p-10 rounded-[3rem] font-mono text-[13px] text-magenta-400/80 overflow-y-auto space-y-4 shadow-inner"
                >
                   {logs.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <svg className="w-32 h-32 mb-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167a2.405 2.405 0 00-1.285-1.378l-1.026-.513a1.59 1.59 0 000-2.848l1.026-.513a2.405 2.405 0 001.285-1.378L7.583 3.94a1.76 1.76 0 013.417.592zm0 0h4.417a1.76 1.76 0 011.645 1.186l1.417 4.14a2.405 2.405 0 001.285 1.378l1.026.513a1.59 1.59 0 010 2.848l-1.026.513a2.405 2.405 0 00-1.285 1.378l-1.417 4.14a1.76 1.76 0 01-1.645 1.186H11" /></svg>
                        <p className="uppercase tracking-[0.5em] font-black text-center max-w-xs">Awaiting Global Nexus Command...</p>
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
             <div className="flex-1 space-y-12 animate-in fade-in slide-in-from-bottom duration-1000 overflow-y-auto pr-4 custom-scrollbar">
                <div className="text-center space-y-4">
                   <div className="flex justify-center gap-4 mb-4">
                      {campaign.holographicHashtags.map(tag => (
                        <span key={tag} className="text-[10px] font-black text-cyan-400 uppercase tracking-widest neon-text-cyan">{tag}</span>
                      ))}
                   </div>
                   <h4 className="font-orbitron text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">Campaign: {campaign.campaignName}</h4>
                </div>

                <div className="space-y-10">
                   {/* X THREAD */}
                   <div className="space-y-4 border-l-4 border-cyan-500 pl-8">
                      <h5 className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.4em]">X Dispatch (Thread)</h5>
                      <div className="space-y-4">
                         {campaign.xThread.map((tweet, i) => (
                           <div key={i} className="bg-white/5 p-6 rounded-2xl text-sm text-gray-300 italic">
                             {tweet}
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* IG CAPTION */}
                   <div className="space-y-4 border-l-4 border-magenta-500 pl-8">
                      <h5 className="text-[11px] font-black text-magenta-500 uppercase tracking-[0.4em]">Insta-Grid Payload</h5>
                      <div className="bg-white/5 p-8 rounded-2xl text-sm text-gray-300 italic font-medium leading-relaxed">
                         {campaign.instaCaption}
                      </div>
                   </div>

                   {/* LINKEDIN */}
                   <div className="space-y-4 border-l-4 border-white pl-8">
                      <h5 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">LinkedIn Corporate Sync</h5>
                      <div className="bg-white/5 p-8 rounded-2xl text-sm text-gray-400 leading-relaxed font-mono">
                         {campaign.linkedInPost}
                      </div>
                   </div>
                </div>

                <div className="bg-cyan-500/10 border-2 border-cyan-500/20 p-12 rounded-[3rem] text-center">
                   <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block mb-2 neon-text-cyan">Projected Global Reach</span>
                   <p className="font-orbitron text-5xl font-black text-white tracking-tighter">{campaign.reachProjection}</p>
                </div>

                <div className="flex gap-8 pb-8">
                   <button 
                     onClick={() => { sounds.play('success'); setCampaign(null); setLogs([]); }}
                     className="flex-1 py-6 bg-white text-black font-black text-[12px] uppercase tracking-[0.5em] rounded-2xl hover:bg-magenta-500 hover:text-white transition-all shadow-xl"
                   >
                     RE-GENERATE CAMPAIGN
                   </button>
                   <button 
                     onClick={onClose}
                     className="flex-1 py-6 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-2xl hover:bg-cyan-500 transition-all shadow-2xl"
                   >
                     EXECUTE ALL NODES
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
