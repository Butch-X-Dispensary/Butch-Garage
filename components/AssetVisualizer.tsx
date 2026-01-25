
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { generateVehicleVisual } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface AssetVisualizerProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const AssetVisualizer: React.FC<AssetVisualizerProps> = ({ vehicle, onClose }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    sounds.play('action');
    setIsGenerating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 99));
    }, 100);

    try {
      const imageUrl = await generateVehicleVisual(vehicle.description);
      setGeneratedImage(imageUrl);
      sounds.play('success');
    } catch (error) {
      sounds.play('error');
      console.error(error);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-8">
      <div className="max-w-6xl w-full bg-[#050505] border-2 border-cyan-500/30 rounded-[3rem] overflow-hidden relative shadow-[0_0_100px_rgba(6,182,212,0.2)] flex flex-col min-h-[600px] animate-in zoom-in duration-500">
        
        {/* Header HUD */}
        <div className="p-10 border-b border-cyan-500/10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] neon-text-cyan italic">IMAGING_PROTOCOL_0.9</span>
            <h3 className="font-orbitron text-3xl font-black text-white uppercase italic tracking-tighter">Quantum <span className="text-cyan-500">Visualizer</span></h3>
          </div>
          <button onClick={onClose} className="text-cyan-500/50 hover:text-cyan-400 transition-all">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
          {!generatedImage ? (
            <div className="w-full max-w-2xl text-center space-y-10">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-cyan-500 font-orbitron text-2xl font-black">{progress}%</div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-black uppercase tracking-[0.4em] text-xl">Reconstructing Mesh...</h4>
                <p className="text-cyan-400/60 text-xs font-bold uppercase tracking-widest animate-pulse italic">Synthesizing photonic data from description nodes</p>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-500 shadow-[0_0_15px_cyan] transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-8 animate-in fade-in duration-1000">
              <div className="flex-1 rounded-[2rem] overflow-hidden border-2 border-cyan-500/20 shadow-2xl relative group">
                <img src={generatedImage} alt="Generated Visual" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Visual HUD Overlays */}
                <div className="absolute top-6 left-6 text-cyan-400 text-[10px] font-black uppercase tracking-widest bg-black/40 px-4 py-2 rounded-lg backdrop-blur-md border border-cyan-500/20">
                  REF: {vehicle.name}
                </div>
                <div className="absolute bottom-6 left-6 text-white text-xs font-bold italic max-w-md bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                  "The visual synthesis confirms optimal flux alignment. Aerodynamic contours meet Sovereign standards."
                </div>
              </div>
              
              <div className="flex gap-6">
                <button 
                  onClick={() => { setGeneratedImage(null); handleGenerate(); }}
                  className="flex-1 py-6 bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all"
                >
                  RE-GENERATE VISUAL
                </button>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `${vehicle.name}-visual.png`;
                    link.click();
                  }}
                  className="flex-1 py-6 bg-cyan-600 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all"
                >
                  DOWNLOAD DOSSIER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
