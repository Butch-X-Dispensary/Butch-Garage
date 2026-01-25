
import React from 'react';
import { Vehicle } from '../types';
import { sounds } from '../services/soundService';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const getLuxuryColor = (level: string) => {
    switch (level) {
      case 'Sovereign': return 'border-amber-500/50 text-amber-400 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
      case 'Elite': return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]';
      case 'Executive': return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20';
      case 'Humanitarian': return 'border-rose-500/50 text-rose-400 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
      default: return 'border-white/20 text-white bg-white/10';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Auctioning': return 'bg-amber-500 text-black animate-pulse shadow-[0_0_15px_#f59e0b]';
      case 'Vaulted': return 'bg-gray-800 text-gray-400 border border-gray-700';
      case 'Pre-Order': return 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]';
      case 'Available': return 'bg-emerald-500 text-black shadow-[0_0_15px_#10b981]';
      default: return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(vehicle);
    }
  };

  const cardId = `vehicle-card-${vehicle.id}`;
  const titleId = `title-${cardId}`;
  const descId = `desc-${cardId}`;

  return (
    <div 
      id={cardId}
      role="button"
      tabIndex={0}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={() => onSelect(vehicle)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => sounds.play('hover')}
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-white/5 bg-black transition-all duration-700 ease-out hover:-translate-y-4 hover:border-cyan-500/60 hover:shadow-[0_40px_80px_rgba(6,182,212,0.25)] focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
    >
      {/* Background Cyber Mesh */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(#06b6d4_1.5px,transparent_1.5px)] bg-[size:30px_30px]"></div>

      {/* Sale / Market Badge */}
      {vehicle.marketStatus && (
        <div className="absolute top-6 right-6 z-40">
           <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all group-hover:scale-110 ${getStatusBadge(vehicle.marketStatus)}`}>
              {vehicle.marketStatus}
           </div>
        </div>
      )}

      {/* Price Overlay on Hover - Cyber Accent */}
      {vehicle.price && (
        <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-cyan-500/10 backdrop-blur-sm pointer-events-none">
          <div className="bg-black border-2 border-cyan-400 px-10 py-4 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.8)] transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
             <span className="font-orbitron text-2xl font-black text-white tracking-tighter neon-text-cyan">{vehicle.price}</span>
          </div>
        </div>
      )}
      
      {/* Interactive Floating Info */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="px-3 py-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl transform transition-all group-hover:translate-x-2 duration-500">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest neon-text-cyan">{vehicle.origin}</span>
          </div>
          <div className="px-3 py-1 bg-magenta-600/90 backdrop-blur-xl border border-magenta-400/30 rounded-lg shadow-2xl transform transition-transform group-hover:translate-x-2 group-hover:delay-75 duration-500">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{vehicle.year}</span>
          </div>
        </div>
        <div className={`px-3 py-1 border-2 rounded-lg backdrop-blur-xl w-fit shadow-2xl transform transition-transform group-hover:translate-x-2 group-hover:delay-100 duration-500 ${getLuxuryColor(vehicle.luxuryLevel)}`}>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{vehicle.luxuryLevel}</span>
        </div>
      </div>

      {/* Image Container with CRT Distortion Effect & Enhanced Parallax */}
      <div className="aspect-[16/10] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-1000">
        <img 
          src={vehicle.image} 
          alt="" 
          role="presentation"
          className="h-full w-full object-cover transition-all duration-[3000ms] ease-out group-hover:scale-110 group-hover:translate-y-[-4%] group-hover:translate-x-[-1%]"
        />
        
        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,4px_100%] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
        
        {/* Animated HUD Elements on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           <div className="absolute top-1/2 left-10 w-4 h-px bg-cyan-500 animate-pulse"></div>
           <div className="absolute top-1/2 right-10 w-4 h-px bg-cyan-500 animate-pulse"></div>
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-1 border border-cyan-500/30 text-[8px] text-cyan-500 font-black uppercase tracking-[0.5em]">SYSTEM_CHECK: OK</div>
        </div>
      </div>
      
      {/* Content Area - Cyberpunk Detail */}
      <div className="p-8 relative z-20">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 neon-text-cyan">{vehicle.type}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-magenta-500 font-black tracking-[0.2em] uppercase neon-text-magenta animate-pulse">Sovereign_Link</span>
          </div>
        </div>
        
        <h3 id={titleId} className="font-orbitron text-3xl font-black text-white mb-3 uppercase tracking-tighter leading-none group-hover:text-cyan-400 transition-all">
          {vehicle.name}
        </h3>
        
        <p id={descId} className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 h-10 group-hover:text-gray-300 transition-colors italic">
          &ldquo;{vehicle.description}&rdquo;
        </p>
        
        <div className="mt-8 flex flex-wrap gap-3 items-center">
          {vehicle.specs.tech.slice(0, 2).map((t, idx) => (
            <span 
              key={idx} 
              className="bg-cyan-500/5 px-3 py-1 rounded-lg border border-cyan-500/10 group-hover:border-cyan-500/50 text-[9px] text-cyan-500/70 group-hover:text-cyan-400 uppercase font-black tracking-widest transition-all"
            >
              {t}
            </span>
          ))}
          <div className="ml-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border-2 border-white/5 group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500 hover-glitch">
               <svg className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14 5l7 7m0 0l-7 7m7-7H3" />
               </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Depth Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5" aria-hidden="true">
        <div className="h-full w-0 bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 group-hover:w-full transition-all duration-1000 ease-in-out" />
      </div>
    </div>
  );
};
