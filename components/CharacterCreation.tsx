
import React, { useState } from 'react';
import { PlayerStats, Gender, Orientation, INITIAL_STATS } from '../types';

interface Props {
  onComplete: (stats: PlayerStats) => void;
  onCancel: () => void;
}

export const CharacterCreation: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [name, setName] = useState('陈默');
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [orientation, setOrientation] = useState<Orientation>(Orientation.Homosexual);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...INITIAL_STATS,
      name,
      gender,
      orientation
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-stone-300 z-50 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/foggy_window/1920/1080?grayscale&blur=4')] bg-cover opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md p-10 bg-black/60 border-y border-emerald-900/30 backdrop-blur-sm">
        <h2 className="text-3xl font-serif mb-10 text-stone-200 text-center tracking-[0.5em] text-shadow">
          角色档案
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-10 font-serif">
          <div className="group">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-emerald-900/60 mb-3 group-hover:text-emerald-700 transition-colors">姓名 / NAME</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-stone-800 py-2 text-xl text-stone-300 focus:border-emerald-800 focus:outline-none transition-colors text-center placeholder-stone-700"
              placeholder="输入姓名..."
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-emerald-900/60 mb-4 text-center">性别 / GENDER</label>
            <div className="flex justify-center gap-6">
              {Object.values(Gender).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 text-sm transition-all duration-500 ${gender === g ? 'text-emerald-400 border-b border-emerald-900' : 'text-stone-600 hover:text-stone-400'}`}
                >
                  {g === Gender.Male ? '男' : g === Gender.Female ? '女' : '非二元'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-emerald-900/60 mb-4 text-center">取向 / ORIENTATION</label>
            <div className="relative">
              <select 
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as Orientation)}
                className="w-full bg-black/40 border border-stone-800 py-3 text-center text-stone-400 focus:border-emerald-900 focus:outline-none appearance-none hover:bg-stone-900/30 transition-colors cursor-pointer"
              >
                <option value={Orientation.Homosexual}>同性恋</option>
                <option value={Orientation.Bisexual}>双性恋</option>
                <option value={Orientation.Pansexual}>泛性恋</option>
                <option value={Orientation.Heterosexual}>异性恋</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-emerald-900">
                ▼
              </div>
            </div>
          </div>

          <div className="pt-12 flex justify-between gap-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="text-xs tracking-[0.2em] text-stone-600 hover:text-stone-400 transition-colors uppercase"
            >
              [ 返回 ]
            </button>
            <button 
              type="submit" 
              className="text-xs tracking-[0.2em] text-emerald-800 hover:text-emerald-500 transition-colors uppercase font-bold"
            >
              [ 开始旅程 ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
