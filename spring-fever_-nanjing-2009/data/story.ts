
import { Scene } from '../types';
import { BACKGROUNDS, CHARACTERS, MUSIC, ENDING_LIST } from '../constants';

// Helper to determine the ending based on stats and final choice
const determineEnding = (choiceId: string, stats: any): string => {
  
  // 1. 死亡判定 (Death End)
  // 如果忧郁值极高(>7)，无论选谁，都会走向毁灭
  if (stats.melancholy > 7) {
    return 'ENDING_DEATH';
  }

  // 2. 混乱判定 (Chaos End)
  // 如果疯狂值极高(>7)，且与多人有纠缠(关系值总和高)，进入混乱结局
  const totalRelationship = stats.relationship_jiang + stats.relationship_luo + stats.relationship_li;
  if (stats.madness > 7 && totalRelationship > 8) {
    return 'ENDING_CHAOS';
  }

  // 3. 线路判定
  switch (choiceId) {
    case 'choose_jiang':
      // True End (难度降低): 
      // 极高好感(>=5, 新增剧情后容易达成) 
      // 较高忧郁(>=3, 下调了门槛，只要能懂他的痛) 
      // 适度疯狂(<7, 上调了上限，稍微疯一点也没事)
      if (stats.relationship_jiang >= 5 && stats.melancholy >= 3 && stats.madness < 7) {
        return 'ENDING_JIANG_TRUE';
      }
      // Normal End: 好感及格(>=3)
      if (stats.relationship_jiang >= 3) {
        return 'ENDING_JIANG_NORMAL';
      }
      // Bad End
      return 'ENDING_JIANG_BAD';

    case 'choose_luo':
      // True End: 极高好感(>=5) + 极高自由(>=5, 能带他走)
      if (stats.relationship_luo >= 5 && stats.freedom >= 5) {
        return 'ENDING_LUO_TRUE';
      }
      // Normal End: 好感及格(>=3)
      if (stats.relationship_luo >= 3) {
        return 'ENDING_LUO_NORMAL';
      }
      // Bad End
      return 'ENDING_LUO_BAD';

    case 'choose_li':
      // True End: 极高好感(>=5) + 低疯狂(>=3, 只有理智才能拯救她) + 高自由
      if (stats.relationship_li >= 5 && stats.madness < 4 && stats.freedom >= 3) {
        return 'ENDING_LI_TRUE';
      }
      // Normal End: 好感及格(>=3)
      if (stats.relationship_li >= 3) {
        return 'ENDING_LI_NORMAL';
      }
      // Bad End
      return 'ENDING_LI_BAD';

    case 'choose_solo':
    default:
      // Solo Normal
      return 'ENDING_SOLO_NORMAL';
  }
};

export const SCENES: Record<string, Scene> = {
  'start': {
    id: 'start',
    text: "2009年，南京。空气里总是弥漫着湿润的水汽，像一层洗不掉的霉斑。你坐在出租车的后座，窗外的霓虹灯被雨水晕染成模糊的色块。",
    background: BACKGROUNDS.RAINY_WINDOW,
    music: MUSIC.THEME_RAIN,
    choices: [
      {
        text: "伸手擦去窗户上的雾气",
        nextSceneId: 'scene_1_fog',
        effect: (s) => ({ ...s, melancholy: s.melancholy + 1 })
      },
      {
        text: "闭上眼睛，听雨声",
        nextSceneId: 'scene_1_sleep',
        effect: (s) => ({ ...s, freedom: s.freedom + 1 })
      }
    ]
  },
  'scene_1_fog': {
    id: 'scene_1_fog',
    text: "指尖传来冰凉的触感。外面的世界清晰了一瞬，随即又模糊了。你看到了路边的一家书店，名叫“春风”。",
    background: BACKGROUNDS.RAINY_WINDOW,
    choices: [
      { text: "让司机停车", nextSceneId: 'scene_meet_jiang' },
      { text: "继续向前开，去酒吧", nextSceneId: 'scene_bar_intro' }
    ]
  },
  'scene_1_sleep': {
    id: 'scene_1_sleep',
    text: "梦里也是湿漉漉的。直到一阵刺耳的刹车声把你惊醒。司机骂骂咧咧地说前面堵车了。",
    background: BACKGROUNDS.RAINY_WINDOW,
    choices: [
      { text: "下车步行", nextSceneId: 'scene_meet_jiang' },
      { text: "等待", nextSceneId: 'scene_bar_intro', effect: (s) => ({...s, madness: s.madness + 1}) }
    ]
  },
  // Path A: Meet Jiang Cheng early
  'scene_meet_jiang': {
    id: 'scene_meet_jiang',
    text: "你走进那个昏暗的巷子。雨水打湿了你的风衣。一个男人站在阴影里抽烟，火星在黑暗中忽明忽暗。那是江诚。",
    speaker: "???",
    background: BACKGROUNDS.NANJING_STREET,
    characterSprite: CHARACTERS.JIANG_CHENG,
    choices: [
      { 
        text: "向他借个火", 
        nextSceneId: 'scene_jiang_interaction_1',
        effect: (s) => ({ ...s, relationship_jiang: s.relationship_jiang + 1 })
      },
      { 
        text: "从他身边走过，但回头看了一眼", 
        nextSceneId: 'scene_jiang_interaction_1',
        effect: (s) => ({ ...s, melancholy: s.melancholy + 1 })
      }
    ]
  },
  'scene_jiang_interaction_1': {
    id: 'scene_jiang_interaction_1',
    text: "他抬起头，眼神像是一潭死水，却又藏着某种挑衅。'有烟吗？' 他问你，声音沙哑。",
    speaker: "江诚",
    background: BACKGROUNDS.NANJING_STREET,
    characterSprite: CHARACTERS.JIANG_CHENG,
    choices: [
      { 
        text: "递给他一支烟", 
        nextSceneId: 'scene_bar_together',
        effect: (s) => ({ ...s, relationship_jiang: s.relationship_jiang + 1 })
      },
      { 
        text: "我不抽烟", 
        nextSceneId: 'scene_bar_together',
        effect: (s) => ({ ...s, freedom: s.freedom + 1 })
      }
    ]
  },
  // Path B: Bar Scene
  'scene_bar_intro': {
    id: 'scene_bar_intro',
    text: "酒吧里的空气浑浊，充满了廉价香水和酒精的味道。罗海涛正坐在吧台边，看起来和这里格格不入。不远处的阴影里，坐着一个神色黯淡的女人。",
    background: BACKGROUNDS.CLUB,
    music: MUSIC.THEME_CLUB,
    choices: [
      { 
        text: "走向吧台边的男人（罗海涛）", 
        nextSceneId: 'scene_luo_talk',
        effect: (s) => ({ ...s, relationship_luo: s.relationship_luo + 1 })
      },
      {
        text: "走向那个女人（李静）",
        nextSceneId: 'scene_lijing_intro',
        effect: (s) => ({ ...s, relationship_li: s.relationship_li + 1 })
      },
      { 
        text: "独自去角落喝酒", 
        nextSceneId: 'scene_solitary_drink',
        effect: (s) => ({ ...s, melancholy: s.melancholy + 1 })
      }
    ]
  },
  // Li Jing Sub-path
  'scene_lijing_intro': {
    id: 'scene_lijing_intro',
    text: "李静手里握着一杯没怎么动的酒。她的眼神总是飘向舞池，那里她的丈夫王平正在疯狂地扭动。她看起来像一只误入陷阱的鹿。",
    speaker: "李静",
    background: BACKGROUNDS.CLUB,
    characterSprite: CHARACTERS.LI_JING,
    choices: [
      { 
        text: "坐在她对面，递给她一张纸巾", 
        nextSceneId: 'scene_lijing_confide',
        effect: (s) => ({ ...s, relationship_li: s.relationship_li + 1, melancholy: s.melancholy + 1 })
      },
      { 
        text: "只是默默地站在旁边陪她", 
        nextSceneId: 'scene_lijing_confide',
        effect: (s) => ({ ...s, relationship_li: s.relationship_li + 1 })
      }
    ]
  },
  'scene_lijing_confide': {
    id: 'scene_lijing_confide',
    text: "“有时候我觉得自己像是透明的。”她低声说，声音几乎被喧闹的音乐淹没，“看着他们在那里跳舞，我感觉只有我一个人醒着。”",
    speaker: "李静",
    background: BACKGROUNDS.CLUB,
    characterSprite: CHARACTERS.LI_JING,
    choices: [
      { text: "清醒是痛苦的，不如一起醉。", nextSceneId: 'scene_mid_game', effect: (s) => ({...s, madness: s.madness + 1}) },
      { text: "醒着的人才能找到出口。", nextSceneId: 'scene_mid_game', effect: (s) => ({...s, freedom: s.freedom + 1, relationship_li: s.relationship_li + 1}) }
    ]
  },
  'scene_solitary_drink': {
    id: 'scene_solitary_drink',
    text: "你点了一杯廉价的威士忌。角落里，你看到舞池中央有一个男人，跳得忘乎所以，像是要甩掉身上的某种重负。",
    background: BACKGROUNDS.CLUB,
    choices: [
      { text: "注视那个男人（江诚）", nextSceneId: 'scene_dance', effect: (s) => ({...s, relationship_jiang: s.relationship_jiang + 1}) },
      { text: "低头看杯子里的冰块", nextSceneId: 'scene_mid_game', effect: (s) => ({...s, melancholy: s.melancholy + 1}) }
    ]
  },
  'scene_bar_together': {
    id: 'scene_bar_together',
    text: "不知怎么，你和江诚一起来到了酒吧。他在舞池里像着了魔一样扭动。你看着他，觉得他像是一朵快要腐烂的花。",
    background: BACKGROUNDS.CLUB,
    music: MUSIC.THEME_CLUB,
    characterSprite: CHARACTERS.JIANG_CHENG,
    choices: [
      { 
        text: "加入他", 
        nextSceneId: 'scene_dance',
        effect: (s) => ({ ...s, madness: s.madness + 1, relationship_jiang: s.relationship_jiang + 2 })
      },
      { 
        text: "在远处观察", 
        nextSceneId: 'scene_observe_wang',
        effect: (s) => ({ ...s, melancholy: s.melancholy + 1 })
      }
    ]
  },
  'scene_observe_wang': {
    id: 'scene_observe_wang',
    text: "你注意到角落里还有一双眼睛。那是王平，他的眼神里充满了绝望和嫉妒。",
    background: BACKGROUNDS.CLUB,
    characterSprite: CHARACTERS.WANG_PING,
    choices: [
      { text: "无视他", nextSceneId: 'scene_dance' },
      { text: "感到一丝同情", nextSceneId: 'scene_dance', effect: (s) => ({...s, madness: s.madness + 1}) }
    ]
  },
  'scene_luo_talk': {
    id: 'scene_luo_talk',
    text: "罗海涛有些局促地笑了笑。'我朋友在里面跳舞，' 他指了指舞池里的李静，'你是来找人的吗？'",
    speaker: "罗海涛",
    background: BACKGROUNDS.CLUB,
    characterSprite: CHARACTERS.LUO_HAITAO,
    choices: [
      { text: "我是来找自己的", nextSceneId: 'scene_mid_game', effect: (s) => ({...s, melancholy: s.melancholy + 1}) },
      { text: "随便转转", nextSceneId: 'scene_dance' }
    ]
  },
  'scene_dance': {
    id: 'scene_dance',
    text: "音乐震耳欲聋。光怪陆离的灯光下，所有人的脸都变得模糊。你感到一种久违的释放，又或是彻底的空虚。",
    background: BACKGROUNDS.CLUB,
    choices: [
      { text: "大声喊叫", nextSceneId: 'scene_mid_game', effect: (s) => ({...s, madness: s.madness + 1}) },
      { text: "离开舞池", nextSceneId: 'scene_mid_game' }
    ]
  },
  'scene_mid_game': {
    id: 'scene_mid_game',
    text: "夜深了。几个人聚在一起吃宵夜。王平一直盯着江诚，那种眼神让你感到不安。李静默默地吃着混沌。这是一种奇怪的平衡。",
    background: BACKGROUNDS.NANJING_STREET,
    music: MUSIC.THEME_MAIN,
    choices: [
      { 
        text: "打破沉默，读一段郁达夫的诗", 
        nextSceneId: 'scene_poetry', 
        effect: (s) => ({...s, melancholy: s.melancholy + 1})
      },
      { 
        text: "看着李静，轻声询问她还好吗", 
        nextSceneId: 'scene_lijing_check', 
        effect: (s) => ({...s, relationship_li: s.relationship_li + 1})
      },
      { 
        text: "提议大家一起去旅行", 
        nextSceneId: 'scene_travel_proposal', 
        effect: (s) => ({...s, freedom: s.freedom + 1})
      }
    ]
  },
  'scene_lijing_check': {
    id: 'scene_lijing_check',
    text: "李静愣了一下，眼眶微红。'我没事，'她撒谎道。但她在桌下轻轻抓住了你的衣袖，仿佛那是唯一的浮木。",
    speaker: "李静",
    background: BACKGROUNDS.NANJING_STREET,
    characterSprite: CHARACTERS.LI_JING,
    choices: [
      { text: "回握她的手", nextSceneId: 'scene_climax', effect: (s) => ({...s, relationship_li: s.relationship_li + 1}) },
      { text: "点点头，不再追问", nextSceneId: 'scene_climax' }
    ]
  },
  'scene_poetry': {
    id: 'scene_poetry',
    text: "“曾因酒醉鞭名马，生怕情多累美人...” 你低声念道。江诚停下了筷子，转头看向你，眼中闪过一丝光亮。",
    background: BACKGROUNDS.NANJING_STREET,
    characterSprite: CHARACTERS.JIANG_CHENG,
    choices: [
      { 
        text: "对他微笑", 
        // 引导向新增的激情线路
        nextSceneId: 'scene_jiang_hotel',
        effect: (s) => ({...s, relationship_jiang: s.relationship_jiang + 1, melancholy: s.melancholy + 1})
      },
      { text: "移开视线", nextSceneId: 'scene_climax' }
    ]
  },
  // 新增：江诚线扩展剧情 - 旅馆
  'scene_jiang_hotel': {
    id: 'scene_jiang_hotel',
    text: "宵夜后，王平先走了。你和江诚鬼使神差地走进了一家廉价旅馆。房间狭小，墙纸剥落，散发着一股受潮的烟味。他坐在床边，低头解着衬衫的扣子，动作缓慢而颓废。",
    speaker: "江诚",
    background: BACKGROUNDS.ROOM_MESSY,
    music: MUSIC.THEME_RAIN,
    characterSprite: CHARACTERS.JIANG_CHENG,
    choices: [
      { 
        text: "走过去，直接吻他", 
        nextSceneId: 'scene_jiang_morning',
        effect: (s) => ({...s, relationship_jiang: s.relationship_jiang + 2, madness: s.madness + 1})
      },
      { 
        text: "从背后抱住他，感受他的体温", 
        nextSceneId: 'scene_jiang_morning',
        effect: (s) => ({...s, relationship_jiang: s.relationship_jiang + 1, melancholy: s.melancholy + 1})
      }
    ]
  },
  // 新增：江诚线扩展剧情 - 清晨
  'scene_jiang_morning': {
    id: 'scene_jiang_morning',
    text: "清晨的光线灰蒙蒙的，照在他赤裸的后背上。那里有一道伤疤，像是一条干涸的河流。他还在睡，呼吸很沉。这一刻，你感觉在这个混乱的世界里抓住了某种实感。",
    background: BACKGROUNDS.BEDROOM_MORNING,
    music: MUSIC.THEME_ENDING,
    choices: [
      { 
        text: "静静地躺在他身边，什么也不做", 
        nextSceneId: 'scene_climax',
        effect: (s) => ({...s, relationship_jiang: s.relationship_jiang + 1, melancholy: s.melancholy + 1})
      },
      { 
        text: "起身点一支烟，看着窗外的雨", 
        nextSceneId: 'scene_climax',
        effect: (s) => ({...s, freedom: s.freedom + 1, melancholy: s.melancholy + 1})
      }
    ]
  },
  'scene_travel_proposal': {
    id: 'scene_travel_proposal',
    text: "罗海涛眼睛亮了：'好啊，我们走吧，离开南京，去哪里都行。' 李静也轻轻点了点头。",
    background: BACKGROUNDS.NANJING_STREET,
    characterSprite: CHARACTERS.LUO_HAITAO,
    choices: [
      { text: "约定明天出发", nextSceneId: 'scene_climax', effect: (s) => ({...s, relationship_luo: s.relationship_luo + 1, freedom: s.freedom + 1}) }
    ]
  },
  'scene_climax': {
    id: 'scene_climax',
    text: "时间过得很快，转眼到了春末。王平自杀了，这个消息像一块石头压在所有人胸口。空气里的躁动因子达到了顶峰，你需要做出最后的抉择。",
    background: BACKGROUNDS.RIVER,
    music: MUSIC.THEME_RAIN,
    choices: [
      { 
        text: "去找江诚，告诉他你不在乎一切", 
        nextSceneId: 'check_ending_jiang', 
        effect: (s) => ({...s, relationship_jiang: s.relationship_jiang + 2}) 
      },
      { 
        text: "去找罗海涛，带他离开", 
        nextSceneId: 'check_ending_luo', 
        effect: (s) => ({...s, relationship_luo: s.relationship_luo + 2}) 
      },
      {
        text: "去找李静，带她逃离这里",
        nextSceneId: 'check_ending_li',
        effect: (s) => ({...s, relationship_li: s.relationship_li + 2})
      },
      { 
        text: "谁也不找，独自去江边", 
        nextSceneId: 'check_ending_solo', 
        effect: (s) => ({...s, melancholy: s.melancholy + 2}) 
      }
    ]
  },
  
  // --- ENDINGS ---
  
  // Jiang Cheng
  'ENDING_JIANG_TRUE': {
    id: 'ENDING_JIANG_TRUE',
    text: "【True End：春风沉醉】\n\n你理解了他的痛苦，也接受了自己的疯狂。在南京潮湿的夜里，你们不再言语。你明白，爱不是占有，而是一起在泥潭里呼吸。这个夜晚，春风沉醉。",
    background: BACKGROUNDS.BEDROOM_MORNING,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.JIANG_CHENG,
    isEnding: true,
    endingId: 'ENDING_JIANG_TRUE',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_JIANG_NORMAL': {
    id: 'ENDING_JIANG_NORMAL',
    text: "【Normal End：灰】\n\n那天之后，你们偶尔还会见面。在书店，在街角，像两个普通的旧识。没有激烈的争吵，也没有刻骨的拥抱。王平的死像一层灰，永远隔在你们中间。",
    background: BACKGROUNDS.NANJING_STREET,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.JIANG_CHENG,
    isEnding: true,
    endingId: 'ENDING_JIANG_NORMAL',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_JIANG_BAD': {
    id: 'ENDING_JIANG_BAD',
    text: "【Bad End：死水】\n\n你变成了第二个王平。你监视他，质问他，由于过度的占有欲而日夜折磨自己。江诚看着你的眼神再次变回了死水。你明白，你们都烂在了这滩泥里，无法自拔。",
    background: BACKGROUNDS.ROOM_MESSY,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.JIANG_CHENG,
    isEnding: true,
    endingId: 'ENDING_JIANG_BAD',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },

  // Luo Haitao
  'ENDING_LUO_TRUE': {
    id: 'ENDING_LUO_TRUE',
    text: "【True End：莲花的旅程】\n\n你和罗海涛彻底离开了南京。不管李静是否同行，在国道上的那一刻，你们是自由的。风吹乱了头发，车里放着那首《春风沉醉的夜晚》。你们不知道终点在哪里，但这正是旅程的意义。",
    background: BACKGROUNDS.FOGGY_ROAD,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.LUO_HAITAO,
    isEnding: true,
    endingId: 'ENDING_LUO_TRUE',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_LUO_NORMAL': {
    id: 'ENDING_LUO_NORMAL',
    text: "【Normal End：工厂】\n\n旅行的计划搁浅了。罗海涛回到了工厂，穿上了蓝色的工装。几个月后你见过他一次，他笑着和你打招呼，眼神清澈而平庸。那场关于自由的梦，醒了。",
    background: BACKGROUNDS.NANJING_STREET,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.LUO_HAITAO,
    isEnding: true,
    endingId: 'ENDING_LUO_NORMAL',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_LUO_BAD': {
    id: 'ENDING_LUO_BAD',
    text: "【Bad End：迷雾】\n\n罗海涛犹豫了。他最终还是选择了林雪，选择了所谓的“正常生活”。那天早上雾很大，你看着他的背影消失在白茫茫的雾气中，知道再也见不到他了。",
    background: BACKGROUNDS.FOGGY_ROAD,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.LUO_HAITAO,
    isEnding: true,
    endingId: 'ENDING_LUO_BAD',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },

  // Li Jing
  'ENDING_LI_TRUE': {
    id: 'ENDING_LI_TRUE',
    text: "【True End：晚风】\n\n李静剪掉了她的长发。她不再是谁的妻子，也不再是谁的同妻。你们并肩走在长江大桥上，晚风吹起了衣角。她终于笑了，那笑容里没有阴霾。你们是彼此的救生艇。",
    background: BACKGROUNDS.RIVER,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.LI_JING,
    isEnding: true,
    endingId: 'ENDING_LI_TRUE',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_LI_NORMAL': {
    id: 'ENDING_LI_NORMAL',
    text: "【Normal End：秘密】\n\n你们保持着一种默契的距离。偶尔你会去她的服装店坐坐，聊聊无关紧要的小事。王平的名字是禁忌，也是连接你们唯一的纽带。这是一种带着苦味的友情。",
    background: BACKGROUNDS.NANJING_STREET,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.LI_JING,
    isEnding: true,
    endingId: 'ENDING_LI_NORMAL',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_LI_BAD': {
    id: 'ENDING_LI_BAD',
    text: "【Bad End：合谋】\n\n王平死后，李静似乎失去了灵魂。你留在了她身边，试图填补那个空洞。但每当深夜，她看着你的眼神总让你想起已故的人。你们共享着秘密和罪恶感，在这座城市里继续沉沦。",
    background: BACKGROUNDS.ROOM_MESSY,
    music: MUSIC.THEME_ENDING,
    characterSprite: CHARACTERS.LI_JING,
    isEnding: true,
    endingId: 'ENDING_LI_BAD',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },

  // Special Endings
  'ENDING_CHAOS': {
    id: 'ENDING_CHAOS',
    text: "【Chaos End：花】\n\n你无法做出选择，或者说，你选择了所有人。在这个疯狂的夜晚，酒精、汗水、泪水混杂在一起。没有道德，没有明天，只有当下腐烂而甜美的快乐。像一朵盛开到极致后崩塌的花。",
    background: BACKGROUNDS.CHAOS_BED,
    music: MUSIC.THEME_CLUB,
    isEnding: true,
    endingId: 'ENDING_CHAOS',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_DEATH': {
    id: 'ENDING_DEATH',
    text: "【Death End：沉没】\n\n忧郁像水草一样缠住了你的脚踝。你来到了王平自杀的地方。江水冰冷且浑浊。你向前走了一步，又一步。世界安静了。春天结束了。",
    background: BACKGROUNDS.DARK_WATER,
    music: MUSIC.THEME_RAIN,
    isEnding: true,
    endingId: 'ENDING_DEATH',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  },
  'ENDING_SOLO_NORMAL': {
    id: 'ENDING_SOLO_NORMAL',
    text: "【Normal End：读者】\n\n你离开了所有的纷扰。那些爱恨情仇像是一场重感冒，痊愈后你获得了一种新的抗体。你坐在长江边，读着未读完的书，成为了这座城市里最孤独也最清醒的旁观者。",
    background: BACKGROUNDS.RIVER,
    music: MUSIC.THEME_ENDING,
    isEnding: true,
    endingId: 'ENDING_SOLO_NORMAL',
    choices: [
      { text: "返回主菜单", nextSceneId: 'MENU' },
      { text: "重新开始", nextSceneId: 'start' }
    ]
  }
};

export const getScene = (id: string, stats: any): Scene => {
  if (id.startsWith('check_ending_')) {
    const target = id.replace('check_ending_', '');
    let choiceId = 'choose_solo';
    if (target === 'jiang') choiceId = 'choose_jiang';
    if (target === 'luo') choiceId = 'choose_luo';
    if (target === 'li') choiceId = 'choose_li';
    
    const endingId = determineEnding(choiceId, stats);
    return SCENES[endingId];
  }
  return SCENES[id] || SCENES['start'];
};
