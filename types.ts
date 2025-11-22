
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'NonBinary'
}

export enum Orientation {
  Heterosexual = 'Heterosexual',
  Homosexual = 'Homosexual',
  Bisexual = 'Bisexual',
  Pansexual = 'Pansexual'
}

export interface PlayerStats {
  name: string;
  gender: Gender;
  orientation: Orientation;
  madness: number;     // 疯狂/偏执 (Wang Ping style)
  melancholy: number;  // 忧郁/诗意 (Jiang Cheng style)
  freedom: number;     // 自由/迷茫 (Luo Haitao style)
  relationship_jiang: number;
  relationship_luo: number;
  relationship_li: number;
}

export interface Choice {
  text: string;
  nextSceneId: string;
  effect?: (stats: PlayerStats) => PlayerStats;
  condition?: (stats: PlayerStats) => boolean;
}

export interface Scene {
  id: string;
  text: string;
  speaker?: string;
  background: string;
  music?: string;
  choices: Choice[];
  characterSprite?: string;
  characterName?: string;
  isEnding?: boolean; // Flag to mark this scene as an ending
  endingId?: string;  // The specific ID of the ending if applicable
}

export interface SaveData {
  currentSceneId: string;
  stats: PlayerStats;
  history: string[];
  timestamp: number;
}

export interface GlobalState {
  unlockedEndings: string[];
}

export const INITIAL_STATS: PlayerStats = {
  name: '陈默',
  gender: Gender.Male,
  orientation: Orientation.Homosexual,
  madness: 0,
  melancholy: 0,
  freedom: 0,
  relationship_jiang: 0,
  relationship_luo: 0,
  relationship_li: 0,
};
