
import React, { useState, useEffect, useRef } from 'react';
import { Scene, PlayerStats, Choice } from '../types';
import { getScene } from '../data/story';
import { saveGame, unlockEnding } from '../services/storageService';

interface GameEngineProps {
  initialStats: PlayerStats;
  initialSceneId: string;
  onExit: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({ initialStats, initialSceneId, onExit }) => {
  const [stats, setStats] = useState<PlayerStats>(initialStats);
  const [currentSceneId, setCurrentSceneId] = useState<string>(initialSceneId);
  
  // UI States
  const [isTextVisible, setIsTextVisible] = useState(false); // Controls text fade-in
  const [showChoices, setShowChoices] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [bgLoaded, setBgLoaded] = useState(false);
  
  const currentScene = getScene(currentSceneId, stats);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset bg loaded state on scene change
  useEffect(() => {
    setBgLoaded(false);
    const img = new Image();
    img.src = currentScene.background;
    img.onload = () => setBgLoaded(true);
  }, [currentScene.background]);

  // Ending Unlock Logic
  useEffect(() => {
    if (currentScene.isEnding && currentScene.endingId) {
      unlockEnding(currentScene.endingId);
    }
  }, [currentScene]);

  // Music Management
  useEffect(() => {
    if (currentScene.music) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentScene.music);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4; // Slightly louder for immersion
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      } else if (audioRef.current.src !== currentScene.music) {
        const oldAudio = audioRef.current;
        // Simple fade out mock
        const fadeOut = setInterval(() => {
            if (oldAudio.volume > 0.05) oldAudio.volume -= 0.05;
            else {
                clearInterval(fadeOut);
                oldAudio.pause();
                audioRef.current = new Audio(currentScene.music);
                audioRef.current.loop = true;
                audioRef.current.volume = 0.4;
                audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
            }
        }, 100);
      }
    }
  }, [currentScene.music]);

  // Text and Choices Fade-in Effect (Simultaneous)
  useEffect(() => {
    // Reset states for new scene
    setIsTextVisible(false);
    setShowChoices(false);
    
    // Start text and choices fade-in together after a brief mounting delay
    // This ensures the CSS transition from opacity-0 works
    const timer = setTimeout(() => {
      setIsTextVisible(true);
      setShowChoices(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [currentSceneId, currentScene.text]);

  const handleChoice = (choice: Choice) => {
    if (choice.nextSceneId === 'MENU') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      onExit();
      return;
    }

    if (choice.effect) {
      setStats(choice.effect(stats));
    }
    
    setHistory(prev => [...prev, `${currentScene.speaker || '旁白'}: ${currentScene.text}`]);

    saveGame({
      currentSceneId: choice.nextSceneId,
      stats: choice.effect ? choice.effect(stats) : stats,
      history: [...history, `${currentScene.speaker || '旁白'}: ${currentScene.text}`],
      timestamp: Date.now()
    });

    setCurrentSceneId(choice.nextSceneId);
  };

  // Ensure everything is visible if user clicks during fade (though it's fast now)
  const handleFastForward = () => {
    if (!isTextVisible) setIsTextVisible(true);
    if (!showChoices) setShowChoices(true);
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden font-serif cursor-pointer select-none"
      onClick={handleFastForward}
    >
      {/* Cinematic Background Layer */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out
          ${bgLoaded ? 'opacity-60' : 'opacity-0'} 
          grayscale contrast-125 brightness-[0.6]`}
        style={{ backgroundImage: `url(${currentScene.background})` }}
      >
        {/* Subtle color grading overlay (Green tint) */}
        <div className="absolute inset-0 bg-emerald-950/30 mix-blend-overlay"></div>
      </div>

      {/* Character Layer - Cinematic Placement (Left/Right thirds) */}
      {currentScene.characterSprite && (
        <div className="absolute bottom-0 right-[15%] h-[85vh] z-10 transition-all duration-1000 animate-breathe origin-bottom">
          <img 
            src={currentScene.characterSprite} 
            alt="Character" 
            className="h-full object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] filter grayscale brightness-[0.8] contrast-125 opacity-90 mask-image-gradient"
            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
          />
        </div>
      )}

      {/* UI Layer - Subtitle Style */}
      <div className="absolute bottom-0 w-full z-30 flex flex-col items-center pb-12 bg-gradient-to-t from-black via-black/90 to-transparent pt-32">
        
        {/* Dialogue Container */}
        <div className="w-full max-w-3xl px-6 flex flex-col items-center text-center space-y-6">
          
          {/* Speaker Badge - Minimalist */}
          {currentScene.speaker && (
            <div className="text-emerald-500 tracking-[0.3em] text-xs uppercase font-sans border-b border-emerald-900/50 pb-1 mb-2">
              {currentScene.speaker}
            </div>
          )}

          {/* Ending Title */}
          {currentScene.isEnding && (
             <div className="text-amber-500/80 tracking-[0.5em] text-lg font-bold mb-4 animate-pulse">
                — 终 局 —
             </div>
          )}

          {/* Main Text - Fade In Effect */}
          <p className={`text-xl md:text-2xl leading-loose tracking-wide font-light text-shadow-sm min-h-[5rem] transition-opacity duration-1000 ease-in-out
            ${currentScene.isEnding ? 'text-stone-300 italic' : 'text-stone-200'}
            ${isTextVisible ? 'opacity-100' : 'opacity-0'}
          `}>
            {currentScene.text}
          </p>

          {/* Choices - Cinematic Buttons */}
          {/* Only render the container if showChoices is true, and control opacity via class */}
          <div className={`flex flex-col gap-4 w-full max-w-lg mt-8 transition-all duration-1000 ease-in-out
            ${showChoices ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {currentScene.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoice(choice);
                  }}
                  className={`group relative py-3 px-6 transition-all duration-500 ease-out overflow-hidden
                    ${currentScene.isEnding 
                      ? 'hover:text-amber-200 text-stone-500' 
                      : 'hover:text-emerald-200 text-stone-400'}`}
                >
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    ${currentScene.isEnding 
                      ? 'bg-gradient-to-r from-transparent via-amber-900/20 to-transparent' 
                      : 'bg-gradient-to-r from-transparent via-emerald-900/20 to-transparent'}`} 
                  />
                  
                  {/* Text */}
                  <span className="relative z-10 tracking-[0.15em] font-light text-lg">
                    {choice.text}
                  </span>
                  
                  {/* Minimalist Underline */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[1px] group-hover:w-1/2 transition-all duration-500
                    ${currentScene.isEnding ? 'bg-amber-700' : 'bg-emerald-700'}`} 
                  />
                </button>
              ))}
            </div>
        </div>

        {/* Stats / Menu Button */}
        {!currentScene.isEnding && (
          <div className="absolute bottom-4 right-6 opacity-30 hover:opacity-80 transition-opacity text-[10px] tracking-widest text-stone-500 font-sans uppercase flex gap-4">
             <span>Melancholy: {stats.melancholy}</span>
             <button onClick={(e) => { e.stopPropagation(); onExit(); }} className="hover:text-emerald-400">
               [ 退出 / EXIT ]
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
