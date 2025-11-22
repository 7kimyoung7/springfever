
import { SaveData, GlobalState } from '../types';

const SAVE_KEY = 'spring_fever_save_v1';
const GLOBAL_KEY = 'spring_fever_global_v1';

// --- Game Progress Storage ---

export const saveGame = (data: SaveData): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, serialized);
  } catch (e) {
    console.error("Failed to save game", e);
  }
};

export const loadGame = (): SaveData | null => {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as SaveData;
  } catch (e) {
    console.error("Failed to load game", e);
    return null;
  }
};

export const hasSave = (): boolean => {
  return !!localStorage.getItem(SAVE_KEY);
};

// --- Global Settings/Gallery Storage ---

export const getGlobalState = (): GlobalState => {
  try {
    const serialized = localStorage.getItem(GLOBAL_KEY);
    if (!serialized) return { unlockedEndings: [] };
    return JSON.parse(serialized) as GlobalState;
  } catch (e) {
    return { unlockedEndings: [] };
  }
};

export const unlockEnding = (endingId: string): void => {
  try {
    const current = getGlobalState();
    if (!current.unlockedEndings.includes(endingId)) {
      const updated = {
        ...current,
        unlockedEndings: [...current.unlockedEndings, endingId]
      };
      localStorage.setItem(GLOBAL_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Failed to unlock ending", e);
  }
};
