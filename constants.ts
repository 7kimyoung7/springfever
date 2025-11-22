
// Visuals updated for a "Green/Gloomy/Rainy" noir aesthetic.
// Using specific Picsum seeds to get darker, moodier images.

export const BACKGROUNDS = {
  RAINY_WINDOW: 'https://picsum.photos/seed/rainy_mood_dark/1920/1080?grayscale&blur=1', 
  NANJING_STREET: 'https://picsum.photos/seed/street_night_rain/1920/1080?grayscale',
  CLUB: 'https://picsum.photos/seed/neon_club_green/1920/1080?blur=2',
  PARK: 'https://picsum.photos/seed/park_mist/1920/1080?grayscale',
  ROOM_MESSY: 'https://picsum.photos/seed/messy_bed_dark/1920/1080?grayscale',
  RIVER: 'https://picsum.photos/seed/river_fog/1920/1080?grayscale',
  BOOKSTORE: 'https://picsum.photos/seed/old_books_dim/1920/1080?grayscale',
  BEDROOM_MORNING: 'https://picsum.photos/seed/window_light_dust/1920/1080?grayscale',
  FOGGY_ROAD: 'https://picsum.photos/seed/road_fog/1920/1080?grayscale',
  CHAOS_BED: 'https://picsum.photos/seed/sheets_texture/1920/1080?grayscale',
  DARK_WATER: 'https://picsum.photos/seed/water_ripples_dark/1920/1080?grayscale&contrast=1.5',
};

// Character portraits placeholders
export const CHARACTERS = {
  JIANG_CHENG: 'https://picsum.photos/seed/man_melancholy/600/900?grayscale',
  LUO_HAITAO: 'https://picsum.photos/seed/man_free/600/900?grayscale',
  LI_JING: 'https://picsum.photos/seed/woman_sad/600/900?grayscale',
  WANG_PING: 'https://picsum.photos/seed/man_obsessed/600/900?grayscale',
  LIN_XUE: 'https://picsum.photos/seed/woman_factory/600/900?grayscale',
};

// MUSIC
// NOTE: Ideally, replace THEME_MAIN with the actual MP3 file of "He Lu - Let Her Land" (让她降落).
// Since we cannot host copyrighted files directly, we use a melancholic placeholder track that fits the vibe.
// For the full experience, please replace the URL below with your local file: '/assets/music/let_her_land.mp3'
export const MUSIC = {
  // Placeholder for "Let Her Land" - using Satie's Gnossienne No.1 for that haunting, repetitive, smoky atmosphere
  THEME_MAIN: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Erik_Satie_-_Gnossienne_1.ogg',
  
  // Club ambiance
  THEME_CLUB: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Gymnop%C3%A9die_No._1_%28Satie%29.ogg', 
  
  // Rain/Sadness
  THEME_RAIN: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Erik_Satie_-_Gymnop%C3%A9die_No._3.ogg',
  
  // Ending/Resolution
  THEME_ENDING: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Erik_Satie_-_Gymnop%C3%A9die_No._2.ogg',
};

export interface EndingMeta {
  id: string;
  title: string;
  description: string;
  character: string;
  type: 'GOOD' | 'NORMAL' | 'BAD' | 'CHAOS' | 'DEATH';
}

export const ENDING_LIST: Record<string, EndingMeta> = {
  // Jiang Cheng
  'ENDING_JIANG_TRUE': {
    id: 'ENDING_JIANG_TRUE',
    title: '春风沉醉',
    description: '（True End）接受了这段关系的残缺。在南京的雨夜里，你们互相依偎。不需要承诺，此刻即是永恒。',
    character: '江诚',
    type: 'GOOD'
  },
  'ENDING_JIANG_NORMAL': {
    id: 'ENDING_JIANG_NORMAL',
    title: '灰',
    description: '（Normal End）你们依然在同一个城市，偶尔见面，像两个熟悉的陌生人。激情褪去后，只剩下一层擦不掉的灰。',
    character: '江诚',
    type: 'NORMAL'
  },
  'ENDING_JIANG_BAD': {
    id: 'ENDING_JIANG_BAD',
    title: '死水',
    description: '（Bad End）嫉妒和占有欲让你发疯。你变成了另一个王平，而他依旧在不同的怀抱中流浪。',
    character: '江诚',
    type: 'BAD'
  },

  // Luo Haitao
  'ENDING_LUO_TRUE': {
    id: 'ENDING_LUO_TRUE',
    title: '莲花的旅程',
    description: '（True End）彻底逃离。在国道上，风是自由的。不管这算不算爱情，至少你们冲破了那层雾。',
    character: '罗海涛',
    type: 'GOOD'
  },
  'ENDING_LUO_NORMAL': {
    id: 'ENDING_LUO_NORMAL',
    title: '工厂',
    description: '（Normal End）旅行没有成行。他回到了工厂，回到了正轨。你只是他青春期延后的一场梦。',
    character: '罗海涛',
    type: 'NORMAL'
  },
  'ENDING_LUO_BAD': {
    id: 'ENDING_LUO_BAD',
    title: '迷雾',
    description: '（Bad End）他选择了林雪，选择了所谓正常的生活。你被丢在了那场大雾里，找不到方向。',
    character: '罗海涛',
    type: 'BAD'
  },

  // Li Jing
  'ENDING_LI_TRUE': {
    id: 'ENDING_LI_TRUE',
    title: '晚风',
    description: '（True End）她剪短了头发，你也放下了执念。你们是彼此在沉船后唯一抓住的浮木。',
    character: '李静',
    type: 'GOOD'
  },
  'ENDING_LI_NORMAL': {
    id: 'ENDING_LI_NORMAL',
    title: '秘密',
    description: '（Normal End）你们维持着一种微妙的友谊，小心翼翼地避开那个死去的男人的名字。',
    character: '李静',
    type: 'NORMAL'
  },
  'ENDING_LI_BAD': {
    id: 'ENDING_LI_BAD',
    title: '合谋',
    description: '（Bad End）你们成了共犯。她通过折磨你来怀念王平，而你甘之如饴。',
    character: '李静',
    type: 'BAD'
  },

  // Special
  'ENDING_CHAOS': {
    id: 'ENDING_CHAOS',
    title: '花',
    description: '（Chaos End）并没有所谓的一对一。在这个疯狂的夜晚，所有人纠缠在一起。就像花开到极致后的腐烂。',
    character: '群体',
    type: 'CHAOS'
  },
  'ENDING_DEATH': {
    id: 'ENDING_DEATH',
    title: '沉没',
    description: '（Death End）你走进了江水里。既然无法在这个春天呼吸，那就永远睡去吧。',
    character: '自我',
    type: 'DEATH'
  },
  
  // Solo
  'ENDING_SOLO_NORMAL': {
    id: 'ENDING_SOLO_NORMAL',
    title: '读者',
    description: '（Normal End）你离开了所有人，独自生活。书里的故事结束了，而你的日子还在继续。平淡，但也安全。',
    character: '自我',
    type: 'NORMAL'
  }
};