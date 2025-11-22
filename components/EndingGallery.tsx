
import React, { useEffect, useState } from 'react';
import { getGlobalState } from '../services/storageService';
import { ENDING_LIST } from '../constants';

interface Props {
  onBack: () => void;
}

export const EndingGallery: React.FC<Props> = ({ onBack }) => {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const state = getGlobalState();
    setUnlocked(state.unlockedEndings);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 p-8 md:p-20 flex flex-col relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-20 border-b border-stone-900 pb-8">
          <div>
             <h1 className="text-5xl md:text-6xl font-serif text-stone-200 tracking-[0.2em] mb-4 text-shadow">
               记忆碎片
             </h1>
             <p className="text-emerald-800 text-xs font-mono uppercase tracking-[0.5em]">
               Fragments of Time
             </p>
          </div>
          <button 
            onClick={onBack}
            className="px-6 py-3 hover:bg-stone-900/50 text-stone-500 hover:text-stone-200 transition-all tracking-[0.2em] uppercase text-xs border border-transparent hover:border-stone-800"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.values(ENDING_LIST).map((ending) => {
            const isUnlocked = unlocked.includes(ending.id);
            return (
              <div 
                key={ending.id}
                className={`relative group transition-all duration-700
                  ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale blur-[1px] hover:opacity-60 hover:blur-0'}`}
              >
                {/* Polaroid/Frame Container */}
                <div className="bg-stone-900/40 p-4 border border-stone-800 hover:border-stone-600 transition-colors shadow-2xl min-h-[300px] flex flex-col">
                  
                  {/* Visual Placeholder (Abstract) */}
                  <div className={`w-full h-32 mb-6 overflow-hidden ${isUnlocked ? 'bg-black' : 'bg-stone-950'}`}>
                    {isUnlocked && (
                       <div className="w-full h-full opacity-50 bg-gradient-to-br from-emerald-900/20 to-black border-b border-stone-800 flex items-center justify-center text-stone-700 font-serif italic">
                          {ending.character}
                       </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-[10px] tracking-widest uppercase border px-2 py-1
                        ${ending.type === 'GOOD' ? 'border-emerald-900 text-emerald-600' : 
                          ending.type === 'BAD' ? 'border-red-900/50 text-red-900' : 
                          'border-stone-800 text-stone-600'}`}>
                        {isUnlocked ? (ending.type === 'GOOD' ? 'HE' : ending.type === 'BAD' ? 'BE' : 'NE') : 'LOCKED'}
                      </span>
                    </div>

                    <h3 className={`text-2xl font-serif mb-3 tracking-wide transition-colors
                      ${isUnlocked ? 'text-stone-200 group-hover:text-emerald-400' : 'text-stone-700'}`}>
                      {isUnlocked ? ending.title : '???'}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed font-serif text-justify
                      ${isUnlocked ? 'text-stone-400' : 'text-transparent select-none'}`}>
                      {isUnlocked ? ending.description : 'This memory has not yet been recovered.'}
                    </p>
                  </div>
                  
                  {/* Footer decorative */}
                  <div className="mt-6 pt-4 border-t border-stone-800/50 flex justify-between text-[10px] text-stone-700 font-mono">
                    <span>{isUnlocked ? 'REC. 2009' : '---'}</span>
                    <span>{isUnlocked ? `#${ending.id.split('_')[1]}` : '---'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
