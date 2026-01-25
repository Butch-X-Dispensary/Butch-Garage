
import React, { useState, useEffect, useRef } from 'react';
import { BlueprintScript } from '../types';
import { sounds } from '../services/soundService';

interface BlueprintDisplayProps {
  blueprint: BlueprintScript;
  onClose: () => void;
}

export const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ blueprint, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    sounds.play('modalOpen');
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.play('modalClose');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleClose = () => {
    sounds.play('modalClose');
    onClose();
  };

  const copyToClipboard = (text: string, section: string) => {
    sounds.play('hover');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const handleRate = (val: number) => {
    sounds.play('success');
    setRating(val);
    // In a production app, we would send this to an analytics endpoint here.
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-title"
    >
      <div className="max-w-4xl w-full bg-[#0a0a0a] border border-cyan-900/50 rounded-2xl shadow-2xl p-6 md:p-10 relative animate-in fade-in zoom-in duration-300">
        <button 
          ref={closeButtonRef}
          onClick={handleClose}
          aria-label="Close schematic"
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="mb-8 border-b border-white/5 pb-6">
          <h2 id="blueprint-title" className="font-orbitron text-3xl font-bold text-cyan-400 mb-2 uppercase tracking-tighter">
            [ Project: {blueprint.title} ]
          </h2>
          <p className="text-gray-400 italic">Official Blueprint - Butch Garage Advanced Engineering Dept.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <section className="relative" aria-labelledby="section-tech-overview">
              <div className="flex items-center justify-between mb-3">
                <h3 id="section-tech-overview" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Technical Overview</h3>
                <button 
                  onClick={() => copyToClipboard(blueprint.technicalDetails, 'tech')}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 hover:text-cyan-400 transition-colors focus:outline-none focus:underline"
                >
                  {copiedSection === 'tech' ? <span className="text-green-400" aria-live="polite">Copied!</span> : "Copy"}
                </button>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm bg-white/5 p-4 rounded-lg border border-white/5 font-mono">
                {blueprint.technicalDetails}
              </p>
            </section>

            <section aria-labelledby="section-workflow">
              <h3 id="section-workflow" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Assembly Workflow</h3>
              <div className="space-y-4">
                {blueprint.stages.map((stage, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 hover:bg-white/[0.02] rounded-lg transition-colors border border-transparent hover:border-white/5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs" aria-hidden="true">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{stage.name}</h4>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-xl relative" aria-labelledby="section-ai-rec">
              <h3 id="section-ai-rec" className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-3">AI Recommendation</h3>
              <p className="text-xs text-gray-300 italic leading-relaxed border-l-2 border-cyan-500/30 pl-3">
                &ldquo;{blueprint.aiRecommendation}&rdquo;
              </p>
            </section>

            <section aria-labelledby="section-materials">
              <h3 id="section-materials" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Core Materials</h3>
              <ul className="space-y-2">
                {blueprint.materials.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-300 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" aria-hidden="true"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-6">
              <button 
                onClick={() => { sounds.play('action'); window.print(); }}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
              >
                Download Schematic
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Mechanism */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Rate synthesis accuracy</span>
          {!rating ? (
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleRate(val)}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center font-orbitron text-xs font-bold text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"
                  aria-label={`Rate ${val} stars out of 5`}
                >
                  {val}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-2 animate-in fade-in slide-in-from-bottom duration-500">
               <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Feedback received. Thank you, Executive.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
