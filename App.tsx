
import React, { useState } from 'react';
import { GameEngine } from './components/GameEngine';
import { CharacterCreation } from './components/CharacterCreation';
import { EndingGallery } from './components/EndingGallery';
import { PlayerStats, INITIAL_STATS } from './types';
import { loadGame, hasSave } from './services/storageService';

enum AppState {
  MENU,
  CREATION,
  GAME,
  GALLERY
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.MENU);
  const [gameStats, setGameStats] = useState<PlayerStats>(INITIAL_STATS);
  const [startScene, setStartScene] = useState<string>('start');

  const handleStartNew = () => {
    setAppState(AppState.CREATION);
  };

  const handleLoadGame = () => {
    const saved = loadGame();
    if (saved) {
      setGameStats(saved.stats);
      setStartScene(saved.currentSceneId);
      setAppState(AppState.GAME);
    }
  };

  const handleCreationComplete = (stats: PlayerStats) => {
    setGameStats(stats);
    setStartScene('start');
    setAppState(AppState.GAME);
  };

  return (
    <div className="w-full h-screen bg-stone-950 text-stone-200 font-serif selection:bg-emerald-900 selection:text-white">
      {appState === AppState.MENU && (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
           {/* Movie Poster Background */}
           <div className="absolute inset-0 z-0">
             <img 
                src="https://picsum.photos/seed/nanjing_rain_dark/1920/1080?grayscale&blur=1" 
                alt="Background" 
                className="w-full h-full object-cover opacity-40 grayscale contrast-125 brightness-75 animate-breathe"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
           </div>
           
           <div className="z-20 flex flex-col items-center space-y-16 animate-fade-in duration-2000">
              {/* Title Block */}
              <div className="text-center flex flex-col items-center gap-4 relative">
                 <div className="absolute -inset-10 bg-emerald-900/20 blur-3xl rounded-full opacity-20"></div>
                 <h1 className="text-7xl md:text-9xl font-bold font-serif-sc text-stone-100 tracking-widest opacity-90 drop-shadow-2xl"
                     style={{ textShadow: '0 0 40px rgba(4, 120, 87, 0.5)' }}>
                    春风沉醉
                 </h1>
                 <div className="h-[1px] w-24 bg-emerald-800/50 my-4"></div>
                 <p className="text-lg md:text-2xl text-emerald-100/40 font-light tracking-[1.5em] uppercase ml-4">
                    Spring Fever
                 </p>
                 <p className="text-xs text-stone-600 mt-6 font-mono tracking-widest uppercase">
                    A film by Lou Ye (Inspired) <br/> Nanjing 2009
                 </p>
              </div>

              {/* Menu Actions */}
              <div className="flex flex-col gap-8 items-center mt-12">
                <button 
                  onClick={handleStartNew}
                  className="group relative px-8 py-2 overflow-hidden"
                >
                  <span className="relative z-10 text-stone-400 group-hover:text-emerald-100 transition-colors tracking-[0.5em] text-sm uppercase">
                    Start Journey
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-800 group-hover:bg-emerald-600 transition-colors duration-500"></div>
                </button>
                
                <button 
                  onClick={handleLoadGame}
                  disabled={!hasSave()}
                  className={`group relative px-8 py-2 overflow-hidden ${!hasSave() && 'opacity-30 cursor-not-allowed'}`}
                >
                  <span className="relative z-10 text-stone-400 group-hover:text-emerald-100 transition-colors tracking-[0.5em] text-sm uppercase">
                    Continue
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-800 group-hover:bg-emerald-600 transition-colors duration-500"></div>
                </button>

                <button 
                  onClick={() => setAppState(AppState.GALLERY)}
                  className="group relative px-8 py-2 overflow-hidden"
                >
                  <span className="relative z-10 text-stone-500 group-hover:text-amber-100 transition-colors tracking-[0.5em] text-sm uppercase">
                    Endings
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-800 group-hover:bg-amber-900 transition-colors duration-500"></div>
                </button>
              </div>
           </div>
           
           {/* Footer Quote */}
           <div className="absolute bottom-12 text-stone-600/50 text-[10px] tracking-[0.5em] uppercase font-sans">
             Let her land · He Lu
           </div>
        </div>
      )}

      {appState === AppState.CREATION && (
        <CharacterCreation 
          onComplete={handleCreationComplete}
          onCancel={() => setAppState(AppState.MENU)}
        />
      )}

      {appState === AppState.GAME && (
        <GameEngine 
          initialStats={gameStats}
          initialSceneId={startScene}
          onExit={() => setAppState(AppState.MENU)}
        />
      )}

      {appState === AppState.GALLERY && (
        <EndingGallery onBack={() => setAppState(AppState.MENU)} />
      )}
    </div>
  );
};

export default App;
