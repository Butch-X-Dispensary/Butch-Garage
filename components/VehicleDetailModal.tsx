
import React, { useEffect, useRef } from 'react';
import { Vehicle } from '../types';
import { sounds } from '../services/soundService';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onGenerate: (vehicle: Vehicle) => void;
  onTune: (vehicle: Vehicle) => void;
  onVisualize: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose, onGenerate, onTune, onVisualize }) => {
  const isVaulted = vehicle.marketStatus === 'Vaulted';
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.play('modalClose');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus management: focus the close button on open
    closeButtonRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.1) translate(0, 0); }
          25% { transform: scale(1.15) translate(-1%, -1%); }
          50% { transform: scale(1.2) translate(1%, -1%); }
          75% { transform: scale(1.15) translate(1%, 1%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        .animate-ken-burns {
          animation: ken-burns 40s ease-in-out infinite;
        }
      `}</style>

      <div 
        ref={modalRef}
        className="max-w-6xl w-full bg-[#050505] border-2 border-cyan-500/20 rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(6,182,212,0.1)] relative animate-in zoom-in duration-500"
      >
        
        {/* Close Button */}
        <button 
          ref={closeButtonRef}
          onClick={() => { sounds.play('modalClose'); onClose(); }} 
          aria-label="Close asset details"
          className="absolute top-8 right-8 z-50 p-4 bg-black/50 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
          {/* Image Side with Ken Burns effect */}
          <div className="relative overflow-hidden group/img bg-black border-r border-cyan-500/10">
            <img 
              src={vehicle.image} 
              alt={vehicle.name} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover/img:grayscale-0 transition-all duration-1000 animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" aria-hidden="true" />
            
            <div className="absolute bottom-10 left-10 right-10 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-cyan-400 block animate-pulse neon-text-cyan">
                STATUS: {vehicle.marketStatus || 'ACTIVE'}
              </span>
              <h2 id="modal-title" className="font-orbitron text-5xl font-black text-white uppercase tracking-tighter leading-none italic">
                {vehicle.name}
              </h2>
              {vehicle.price && (
                <div className="inline-block px-6 py-2 bg-cyan-500 text-black font-orbitron font-black text-2xl mt-4 rounded-xl transform -rotate-2 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  {vehicle.price}
                </div>
              )}
            </div>
          </div>

          {/* Details Side */}
          <div className="p-12 lg:p-20 space-y-12 flex flex-col justify-center bg-[radial-gradient(circle_at_top_right,#06b6d405_0%,transparent_50%)]">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.6em] mb-4">Technical Dossier</h3>
              <p className="text-gray-300 leading-relaxed text-base italic font-medium border-l-4 border-cyan-500/30 pl-8">
                &ldquo;{vehicle.description}&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-12 gap-x-12 border-y border-white/5 py-12">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Velocity Cap</span>
                <p className="font-orbitron text-white text-2xl font-black tracking-tighter">{vehicle.specs.speed}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Engine Flux</span>
                <p className="font-orbitron text-white text-2xl font-black tracking-tighter">{vehicle.specs.engine}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Class</span>
                <p className="text-cyan-400 text-sm font-black uppercase tracking-widest neon-text-cyan">{vehicle.luxuryLevel}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Origin Hub</span>
                <p className="text-gray-400 text-sm font-black uppercase tracking-widest">{vehicle.origin}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.6em]">Active Systems</h3>
              <div className="flex flex-wrap gap-3">
                {vehicle.specs.tech.map((tech, i) => (
                  <span key={i} className="px-5 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-crosshair">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {isVaulted ? (
                <div className="col-span-full text-center p-10 bg-white/[0.02] border border-white/10 rounded-[2rem]">
                   <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6">Asset is currently vaulted by executive order</p>
                   <button className="text-cyan-400 text-xs font-black uppercase tracking-[0.5em] hover:text-cyan-300 transition-colors focus:outline-none focus:underline neon-text-cyan">Apply for Access Clearance</button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => onVisualize(vehicle)}
                    className="w-full py-6 bg-cyan-600 text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-2xl hover:bg-cyan-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] transform hover:-translate-y-1"
                  >
                    GENERATE VISUAL
                  </button>
                  <button 
                    onClick={() => onTune(vehicle)}
                    className="w-full py-6 bg-magenta-600 text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-2xl hover:bg-magenta-500 transition-all shadow-[0_0_30px_rgba(217,70,239,0.3)] transform hover:-translate-y-1"
                  >
                    NEURAL TUNE
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
