
import React, { useState, useEffect, useRef } from 'react';
import { generateAssetPackage, generateVehicleVisual } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface AssetSynthesisProps {
  onClose: () => void;
}

export const AssetSynthesis: React.FC<AssetSynthesisProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSynthesize = async () => {
    if (!prompt) return;
    sounds.play('action');
    setIsSynthesizing(true);
    setLogs(["INITIALIZING SOVEREIGN ACQUISITION NODE...", `TARGET CONCEPT: ${prompt.toUpperCase()}`]);
    
    const steps = [
      "Accessing Precision Engineering Hub...",
      "Synthesizing Material Schematics...",
      "Generating Sovereign Technical Profile...",
      "Compiling Executive Sales Script...",
      "Reconstructing Photonic Visual Mesh...",
      "Applying Billboard PH Cultural Sync..."
    ];

    try {
      // Step 1: Data Package
      setLogs(prev => [...prev, "DATA_SYNC: Commencing Package Synthesis..."]);
      const packageData = await generateAssetPackage(prompt);
      setLogs(prev => [...prev, "DATA_SYNC: Package Compiled. Visual Uplink Requested..."]);
      
      // Step 2: Visual
      const imageUrl = await generateVehicleVisual(packageData.description);
      setLogs(prev => [...prev, "IMAGING: Photonic Reconstruction Complete."]);

      setResult({ ...packageData, image: imageUrl });
      sounds.play('success');
      setIsSynthesizing(false);
    } catch (error) {
      sounds.play('error');
      setLogs(prev => [...prev, "ERROR: ACQUISITION TERMINATED. UPLINK FAILED."]);
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#06b6d4_2px,transparent_2px)] bg-[size:30px:30px] animate-pulse"></div>
      
      <div className="max-w-7xl w-full bg-[#050505] border-2 border-cyan-500/30 rounded-[4rem] overflow-hidden relative shadow-[0_0_150px_rgba(6,182,212,0.2)] flex flex-col md:flex-row min-h-[800px] animate-in zoom-in duration-500">
        
        {/* Close */}
        <button onClick={onClose} className="absolute top-12 right-12 z-50 text-cyan-500/50 hover:text-cyan-400 transition-all hover:scale-110">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Sidebar: Command */}
        <div className="w-full md:w-1/3 bg-black/60 border-r border-cyan-500/20 p-16 space-y-12">
           <div className="space-y-4">
              <span className="px-4 py-1.5 bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] rounded-md neon-text-cyan italic">ACQUISITION_UPLINK ACTIVE</span>
              <h3 className="font-orbitron text-4xl font-black text-white uppercase italic tracking-tighter">Sovereign <span className="text-cyan-500">Synth</span></h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Describe the ultra-luxury asset. Our neural core will synthesize the blueprint, visual, and sales pitch.</p>
           </div>

           {!result && (
             <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[11px] font-black text-cyan-500/60 uppercase tracking-[0.4em] ml-2">ASSET CONCEPT</label>
                   <textarea 
                     value={prompt} 
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder="E.G., FUTURISTIC STEALTH HELICOPTER FOR BUTCHER..."
                     className="w-full h-40 bg-white/5 border border-cyan-500/20 rounded-3xl px-8 py-6 text-[12px] font-bold tracking-widest text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-gray-800 uppercase resize-none"
                   />
                </div>

                <button 
                  onClick={handleSynthesize} 
                  disabled={isSynthesizing || !prompt}
                  className="w-full py-8 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.8em] rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all disabled:opacity-20 transform active:scale-95 shadow-xl"
                >
                  {isSynthesizing ? 'SYNTHESIZING...' : 'INITIATE SALE'}
                </button>
             </div>
           )}

           <div 
             ref={logRef}
             className="flex-1 bg-black border border-cyan-500/10 p-8 rounded-3xl font-mono text-[10px] text-cyan-500/60 overflow-y-auto space-y-2 h-40"
           >
              {logs.map((log, i) => <div key={i}>{'>'} {log}</div>)}
           </div>
        </div>

        {/* Main: The Synthesis Result */}
        <div className="flex-1 flex flex-col p-16 bg-black relative overflow-y-auto">
           {!result ? (
             <div className="h-full flex flex-col items-center justify-center opacity-10">
                <svg className="w-48 h-48 mb-12 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <p className="text-xl uppercase tracking-[1em] font-black text-center">Awaiting Concept Input...</p>
             </div>
           ) : (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom duration-1000">
                <div className="text-center space-y-6">
                   <span className="px-6 py-2 bg-magenta-600 text-white text-[12px] font-black uppercase tracking-[1em] rounded-full shadow-[0_0_30px_rgba(217,70,239,0.5)]">Sovereign Acquisition: Verified</span>
                   <h2 className="font-orbitron text-7xl font-black text-white uppercase italic tracking-tighter leading-none">{result.name}</h2>
                </div>

                <div className="rounded-[4rem] overflow-hidden border-4 border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.15)] relative group">
                   <img src={result.image} alt="Generated Asset" className="w-full aspect-video object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                   <div className="absolute bottom-12 right-12">
                      <div className="bg-black/80 backdrop-blur-xl border-2 border-cyan-500/50 px-10 py-6 rounded-3xl">
                         <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block mb-2">Acquisition Value</span>
                         <p className="font-orbitron text-4xl font-black text-white tracking-tighter">{result.suggestedPrice}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                   <div className="space-y-10">
                      <div className="space-y-4 border-l-4 border-cyan-500 pl-8">
                         <h4 className="text-[12px] font-black text-cyan-500 uppercase tracking-[0.6em]">Technical Profile</h4>
                         <p className="text-gray-400 text-lg italic leading-relaxed">&ldquo;{result.description}&rdquo;</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="bg-white/5 p-8 rounded-3xl space-y-2">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Velocity</span>
                            <p className="text-xl font-orbitron font-black text-white">{result.specs.speed}</p>
                         </div>
                         <div className="bg-white/5 p-8 rounded-3xl space-y-2">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Power Core</span>
                            <p className="text-xl font-orbitron font-black text-white">{result.specs.engine}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8 bg-magenta-900/5 border border-magenta-500/20 p-12 rounded-[3rem] relative">
                      <div className="absolute top-0 right-12 -translate-y-1/2 bg-magenta-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">The Script Sale</div>
                      <h4 className="text-[12px] font-black text-magenta-400 uppercase tracking-[0.6em] mb-6 neon-text-magenta">Exclusive Pitch Payload</h4>
                      <div className="space-y-6 text-gray-300 text-sm leading-relaxed italic whitespace-pre-wrap font-medium">
                         {result.salesScript}
                      </div>
                   </div>
                </div>

                <div className="flex gap-8 pb-12">
                   <button 
                     onClick={() => { sounds.play('action'); setResult(null); setLogs([]); }}
                     className="flex-1 py-8 bg-white/5 border border-white/10 text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-3xl hover:bg-white/10 transition-all"
                   >
                     SYNTHESIZE NEW VARIANT
                   </button>
                   <button 
                     onClick={onClose}
                     className="flex-1 py-8 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-3xl hover:bg-cyan-500 shadow-2xl transition-all"
                   >
                     EXECUTE ACQUISITION
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
