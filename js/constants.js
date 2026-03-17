// =============================================================================
// Ottawa Rage — js/constants.js
// All tuning values, level definitions, and entity stat tables.
// Edit numbers here; never scatter magic values through game logic.
// =============================================================================

// ── Canvas / layout ───────────────────────────────────────────────────────────
const SCREEN_W = 800;
const SCREEN_H = 400;

// Belt-scroll ground band.  Characters are confined to this vertical strip.
// Smaller y = further back in perspective; larger y = closer to camera.
const GROUND_TOP    = 260;
const GROUND_BOTTOM = 365;

// ── Player tuning ─────────────────────────────────────────────────────────────
const PLAYER_SPEED    = 185;   // px / sec
const PLAYER_MAX_HP   = 100;
const ATTACK_DURATION = 0.22;  // sec — movement locked while attacking
const HURT_IFRAMES    = 0.45;  // sec — invincibility after being hit
const KNOCKBACK       = 22;    // px — applied to enemy on hit
const SPECIAL_HP_COST = 20;    // HP spent on special move
const SPECIAL_RADIUS  = 115;   // px — area-of-effect radius
const SPECIAL_DAMAGE  = 35;
const SPECIAL_COOLDOWN = 5;    // sec

// Attack configs: range (depth reach), width (lateral tolerance), damage, flash colour
const ATTACKS = {
  punch:   { range: 68,  width: 32, damage: 12, fxColor: [255, 230, 80]  },
  kick:    { range: 90,  width: 42, damage: 22, fxColor: [255, 130, 40]  },
};

// ── Player character roster ───────────────────────────────────────────────────
// TODO: Add a character-select screen and expand this array with more heroes.
const PLAYER_CONFIGS = [
  {
    name:    "TAXPAYER",
    col:     [255, 255, 255],   // white = neutral sprite tint
    hurtCol: [255, 80,  80 ],
    sprite:  "hero_taxpayer",
    keys: { up:"w", down:"s", left:"a", right:"d", punch:"z", kick:"x", special:"q" },
    startX: 120,
  },
  {
    name:    "PRIYA",
    col:     [80,  220, 120],
    hurtCol: [255, 200, 60 ],
    // TODO: sprite: "hero_priya"
    keys: { up:"i", down:"k", left:"j", right:"l", punch:"u", kick:"o", special:"p" },
    startX: 175,
  },
];

// ── Level definitions ─────────────────────────────────────────────────────────
// Each level has:
//   stores     — placeholder storefronts rendered as coloured rects + sign text
//   npcTypes   — pool of NPC archetypes to spawn in background
//   waves      — array of wave definitions; each wave = array of {type, count}
//   boss       — { type, name, count? }  (count defaults to 1)
//   pickups    — types available in this level (health drops + weapon pickups)
//   bossIntro  — banner text when the boss spawns
//   skyCol     — [r,g,b] sky/upper-half colour
//   groundCol  — [r,g,b] sidewalk surface colour
const LEVELS = [
  // ── Level 1 ────────────────────────────────────────────────────────────────
  {
    id: 1, name: "Bank Street", subtitle: "The Strip",
    skyCol: [60, 65, 80], groundCol: [200, 195, 185],
    stores: [
      { label: "TIM HORTONS", x: 0, w: 156, h: 195,
        col: [100, 28, 22], signCol: [195, 25, 25],
        signTextCol: [255, 255, 255], awningCol: [130, 20, 15] },
      { label: "DOLLARAMA", x: 164, w: 140, h: 170,
        col: [25, 95, 25], signCol: [0, 148, 0],
        signTextCol: [255, 230, 0], awningCol: [0, 100, 0] },
      { label: "CURRY PALACE", x: 312, w: 168, h: 182,
        col: [160, 110, 30], signCol: [180, 30, 15],
        signTextCol: [255, 220, 80], awningCol: [140, 95, 25] },
      { label: "DEP", x: 488, w: 132, h: 155,
        col: [65, 65, 130], signCol: [40, 50, 140],
        signTextCol: [255, 255, 255], awningCol: [50, 50, 100] },
      { label: "SMOKE SHOP", x: 628, w: 172, h: 188,
        col: [75, 50, 35], signCol: [55, 38, 22],
        signTextCol: [255, 170, 50], awningCol: [50, 35, 20] },
    ],
    npcTypes: ["turban", "quebecois", "hijab"],
    waves: [
      [{ type:"grunt",  count:3 }],
      [{ type:"grunt",  count:2 }, { type:"heavy",  count:1 }],
      [{ type:"grunt",  count:3 }, { type:"heavy",  count:1 }],
    ],
    boss:      { type:"heavy_boss",    name:"Big Earl" },
    pickups:   ["donut", "cart", "coffee"],
    bossIntro: "BIG EARL blocks the Tim Hortons exit!",
  },

  // ── Level 2 ────────────────────────────────────────────────────────────────
  {
    id: 2, name: "ByWard Market", subtitle: "The Market",
    skyCol: [30, 32, 50], groundCol: [170, 165, 158],
    stores: [
      { label: "BYWARD MUFFIN", x: 0, w: 152, h: 175,
        col: [130, 80, 35], signCol: [160, 100, 35],
        signTextCol: [255, 240, 200], awningCol: [110, 65, 25] },
      { label: "BAREFAX", x: 160, w: 162, h: 195,
        col: [90, 18, 90], signCol: [150, 20, 130],
        signTextCol: [255, 100, 220], awningCol: [100, 15, 85] },
      { label: "McDONALD'S", x: 330, w: 132, h: 170,
        col: [110, 25, 22], signCol: [218, 170, 0],
        signTextCol: [255, 50, 50], awningCol: [100, 18, 12],
        isMcDonalds: true },
      { label: "MARKET STALL", x: 470, w: 162, h: 140,
        col: [140, 105, 25], signCol: [160, 120, 20],
        signTextCol: [255, 240, 180], awningCol: [120, 85, 15] },
      { label: "CHEESE PLACE", x: 640, w: 160, h: 168,
        col: [170, 150, 45], signCol: [180, 160, 30],
        signTextCol: [255, 255, 255], awningCol: [145, 130, 25] },
    ],
    npcTypes: ["lgbtq", "ukrainian", "turban"],
    petTypes: ["raccoon"],
    waves: [
      [{ type:"grunt",    count:2 }, { type:"stripper", count:1 }],
      [{ type:"agile",    count:2 }, { type:"stripper", count:2 }],
      [{ type:"stripper", count:2 }, { type:"heavy",    count:1 }, { type:"agile", count:2 }],
    ],
    boss: {
      types: [
        { type:"stripper_boss",   name:"Roxanne"    },
        { type:"raccoon_thrower", name:"Trash King" },
      ],
      name: "The Duo",
    },
    pickups:   ["bottle", "fruit_cart", "donut"],
    bossIntro: "THE DUO guard the Barefax door — one packing heat, one packing RACCOONS!",
  },

  // ── Level 3 ────────────────────────────────────────────────────────────────
  {
    id: 3, name: "Wellington Street", subtitle: "The Parade",
    skyCol: [50, 55, 75], groundCol: [195, 188, 175],
    stores: [
      { label: "HUMMUS HOUSE",   x: 0,   w: 150, h: 178,
        col: [190, 155, 75],  signCol: [185, 30, 15],
        signTextCol: [255, 230, 80],  awningCol: [160, 130, 55] },
      { label: "PRIDE CORNER",   x: 158, w: 158, h: 192,
        col: [220, 100, 160], signCol: [255, 80, 180],
        signTextCol: [255, 255, 255], awningCol: [190, 70, 130] },
      { label: "THE WELLINGTON", x: 324, w: 172, h: 185,
        col: [65, 70, 110],   signCol: [55, 60, 120],
        signTextCol: [230, 225, 200], awningCol: [50, 55, 90]  },
      { label: "FLAG STORE",     x: 504, w: 138, h: 162,
        col: [140, 35, 35],   signCol: [150, 25, 25],
        signTextCol: [255, 255, 255], awningCol: [115, 28, 28] },
      { label: "KEBAB SPOT",     x: 650, w: 150, h: 175,
        col: [160, 110, 30],  signCol: [170, 95, 20],
        signTextCol: [255, 240, 160], awningCol: [135, 90, 22] },
    ],
    npcTypes: ["hijab", "lgbtq", "turban"],
    waves: [
      [{ type:"arab",     count:3 }, { type:"grunt",    count:1 }],
      [{ type:"stripper", count:2 }, { type:"agile",    count:2 }],
      [{ type:"arab",     count:2 }, { type:"stripper", count:2 }, { type:"agile", count:1 }],
    ],
    boss:      { type:"big_trans", name:"Big Trans" },
    pickups:   ["flagpole", "bottle", "coffee"],
    bossIntro: "BIG TRANS steps out of the Pride float!",
  },

  // ── Level 4 ────────────────────────────────────────────────────────────────
  {
    id: 4, name: "Parliament Hill", subtitle: "The Finale",
    skyCol: [40, 50, 70], groundCol: [215, 220, 215],
    stores: [
      { label: "EAST BLOCK", x: 0, w: 148, h: 190,
        col: [50, 62, 50], signCol: [42, 55, 42],
        signTextCol: [220, 200, 140], awningCol: [38, 50, 38] },
      { label: "PARLIAMENT", x: 156, w: 488, h: 220,
        col: [45, 72, 45], signCol: [38, 65, 38],
        signTextCol: [255, 230, 140], awningCol: [32, 55, 32] },
      { label: "WEST BLOCK", x: 652, w: 148, h: 190,
        col: [50, 62, 50], signCol: [42, 55, 42],
        signTextCol: [220, 200, 140], awningCol: [38, 50, 38] },
    ],
    npcTypes: ["palestinian", "turban", "hijab", "quebecois"],
    waves: [
      [{ type:"heavy",    count:2 }, { type:"grunt",    count:2 }],
      [{ type:"heavy",    count:2 }, { type:"stripper", count:2 }, { type:"grunt",  count:2 }],
      [{ type:"heavy",    count:3 }, { type:"kicker",   count:2 }, { type:"stripper", count:2 }],
    ],
    boss:      { type:"syndicate_boss", name:"The Overlord" },
    pickups:   ["flagpole", "statue", "samosa"],
    bossIntro: "THE OVERLORD stands atop Parliament!",
  },

  /* ── DISABLED LEVELS (preserved for future reactivation) ─────────────────
  {
    id: 3, name: "Rideau Canal", subtitle: "The Canal",
    skyCol: [70, 80, 100], groundCol: [210, 220, 230],
    stores: [
      { label: "SKATE SHACK", x: 0, w: 148, h: 155, col: [70, 70, 110], signCol: [55, 65, 120], signTextCol: [255, 255, 255], awningCol: [50, 55, 90] },
      { label: "HOT CHOC",    x: 156, w: 142, h: 145, col: [110, 60, 25], signCol: [100, 55, 20], signTextCol: [255, 230, 180], awningCol: [85, 45, 15] },
      { label: "PARLIAMENT >>", x: 306, w: 198, h: 130, col: [45, 72, 45], signCol: [40, 65, 40], signTextCol: [220, 200, 140], awningCol: [35, 55, 35] },
      { label: "CANAL TRAIL", x: 512, w: 148, h: 138, col: [60, 80, 100], signCol: [50, 70, 95], signTextCol: [255, 255, 255], awningCol: [42, 62, 82] },
      { label: "FISH HUT",    x: 668, w: 132, h: 145, col: [82, 55, 35],  signCol: [75, 48, 28],  signTextCol: [255, 240, 200], awningCol: [62, 40, 22] },
    ],
    npcTypes: ["hijab", "quebecois", "african"],
    waves: [
      [{ type:"agile", count:3 }],
      [{ type:"agile", count:2 }, { type:"crackhead", count:2 }],
      [{ type:"kicker", count:2 }, { type:"crackhead", count:2 }, { type:"agile", count:1 }],
    ],
    boss: { type:"heavy_chain", name:"Chain Daddy" },
    pickups: ["skate", "fish", "coffee"],
    bossIntro: "CHAIN DADDY descends from the barge!",
  },
  {
    id: 4, name: "Curry Street", subtitle: "The Strip",
    skyCol: [50, 45, 60], groundCol: [185, 175, 160],
    stores: [
      { label: "DESI KITCHEN",  x: 0,   w: 156, h: 190, col: [170, 120, 20], signCol: [180, 30, 15],  signTextCol: [255, 230, 80],  awningCol: [145, 100, 18] },
      { label: "SPICE WORLD",   x: 164, w: 146, h: 175, col: [185, 65, 15],  signCol: [200, 60, 10],  signTextCol: [255, 240, 120], awningCol: [155, 50, 10]  },
      { label: "BIRYANI HOUSE", x: 318, w: 166, h: 192, col: [155, 115, 18], signCol: [160, 28, 10],  signTextCol: [255, 220, 80],  awningCol: [130, 95, 15]  },
      { label: "HALAL MEATS",   x: 492, w: 136, h: 162, col: [135, 35, 35],  signCol: [140, 25, 25],  signTextCol: [255, 255, 255], awningCol: [110, 28, 25]  },
      { label: "SWEET SHOP",    x: 636, w: 164, h: 175, col: [175, 135, 45], signCol: [180, 140, 30], signTextCol: [255, 255, 255], awningCol: [150, 115, 22] },
    ],
    npcTypes: ["turban", "ukrainian", "lgbtq"],
    waves: [
      [{ type:"crackhead", count:3 }, { type:"grunt",  count:1 }],
      [{ type:"crackhead", count:3 }, { type:"kicker", count:2 }],
      [{ type:"crackhead", count:2 }, { type:"grunt",  count:2 }, { type:"kicker", count:2 }],
    ],
    boss: { type:"drug_lord", name:"The Chef" },
    pickups: ["samosa", "spice_cart", "coffee"],
    bossIntro: "THE CHEF steps off the food truck!",
  },
  ── END DISABLED LEVELS ─────────────────────────────────────────────────── */
];

// ── Enemy stat table ──────────────────────────────────────────────────────────
// TODO: Add "sprite" key to each entry once spritesheet is in assets/.
//       Remove the matching rect/color in spawnEnemy() and add sprite() component.
const ENEMY_DEFS = {
  grunt: {
    label:"GRUNT",   col:[160, 80, 80],  w:26, h:46,
    hp:50,  speed:58,  damage:8,  attackRange:38, attackCooldown:1.4,
    taunts:["Get lost, eh!", "Stay from away!", "Puck off!"],
    sprite:"enemy_grunt",
  },
  agile: {
    label:"SLIDER",  col:[120, 80, 140], w:24, h:44,
    hp:35,  speed:90,  damage:6,  attackRange:45, attackCooldown:0.9,
    taunts:["Too slow, bud!", "Catch this deke!", "Shinny's over!"],
    sprite:"enemy_agile",
  },
  heavy: {
    label:"HEAVY",   col:[140, 60, 40],  w:34, h:50,
    hp:90,  speed:40,  damage:14, attackRange:42, attackCooldown:1.8,
    taunts:["Crush time, eh!", "Burly smash!", "Take the body!"],
    sprite:"enemy_heavy",
  },
  stripper: {
    label:"WHIPLASH", col:[220, 100, 160], w:22, h:46,
    hp:45,  speed:80,  damage:10, attackRange:62, attackCooldown:1.1,
    taunts:["Back off!", "Dance with me!", "Whip it!"],
    sprite:"enemy_stripper",
  },
  crackhead: {
    label:"ADDICT",  col:[110, 100, 75], w:22, h:42,
    hp:30,  speed:72,  damage:7,  attackRange:40, attackCooldown:0.8,
    taunts:["Gimme that!", "Heh heh, mine!", "Burn ya!"],
    // TODO: sprite:"enemy_crackhead"
  },
  kicker: {
    label:"KICKER",  col:[80, 120, 160], w:24, h:46,
    hp:55,  speed:65,  damage:12, attackRange:52, attackCooldown:1.0,
    taunts:["Kick your ass!", "Feel the burn!", "Block this!"],
    // TODO: sprite:"enemy_kicker"
  },
  arab: {
    label:"PROTESTER", col:[180, 140, 80], w:24, h:44,
    hp:40,  speed:65,  damage:9,  attackRange:42, attackCooldown:1.4,
    taunts:["Free Palestine!", "Allahu Akbar!", "Intifada!"],
    sprite:"enemy_arab",
  },
  // ── Boss variants ──────────────────────────────────────────────────────────
  heavy_boss: {
    label:"BIG EARL",    col:[120, 40, 20],  w:40, h:72,
    hp:200, speed:35, damage:16, attackRange:52, attackCooldown:2.0, isBoss:true,
    taunts:["Bank Street's mine!", "You're done in Ottawa!"],
    sprite:"boss_earl",
  },
  stripper_boss: {
    label:"THE DUO",     col:[200, 50, 140], w:30, h:52,
    hp:180, speed:75, damage:14, attackRange:70, attackCooldown:1.2, isBoss:true,
    taunts:["You can't handle us!", "Two's company!"],
    sprite:"boss_duo",
  },
  heavy_chain: {
    label:"CHAIN DADDY", col:[80, 80, 40],   w:42, h:54,
    hp:220, speed:38, damage:18, attackRange:68, attackCooldown:1.8, isBoss:true,
    taunts:["Chain check, buddy!", "Nobody passes the barge!"],
    // TODO: sprite:"boss_chain"
  },
  drug_lord: {
    label:"THE CHEF",    col:[160, 120, 20], w:36, h:52,
    hp:240, speed:45, damage:15, attackRange:56, attackCooldown:1.6, isBoss:true,
    taunts:["This is my street!", "You mess with the chef?"],
    // TODO: sprite:"boss_chef"
  },
  syndicate_boss: {
    label:"OVERLORD",    col:[40, 40, 80],   w:44, h:60,
    hp:300, speed:30, damage:20, attackRange:62, attackCooldown:2.2, isBoss:true,
    taunts:["Ottawa belongs to me!", "The Hill is mine!"],
    // TODO: sprite:"boss_overlord"
  },
  raccoon_thrower: {
    label:"TRASH KING",  col:[90, 80, 65],   w:32, h:52,
    hp:180, speed:45, damage:12, attackRange:220, attackCooldown:2.0, isBoss:true,
    taunts:["You wanna piece of me?!", "I got friends!", "CATCH!"],
    isRaccoonThrower: true,
    // TODO: sprite:"boss_raccoon_thrower"
  },
  big_trans: {
    label:"BIG TRANS",   col:[100, 180, 220], w:40, h:72,
    hp:260, speed:38, damage:18, attackRange:58, attackCooldown:1.1, isBoss:true,
    taunts:["You can't cancel me!", "PRIDE AND POWER!", "Yaaas slay!"],
    sprite:"boss_big_trans",
  },
};

// ── NPC archetypes ────────────────────────────────────────────────────────────
// NPCs are always passive.  They wander, react to fights, flee from enemies.
// TODO: Add "sprite" key once NPC spritesheets exist in assets/.
const NPC_DEFS = {
  turban: {
    col:[210, 170, 110], accentCol:[255, 120, 0],   w:22, h:44, speed:25,
    phrases:["Arre yaar!", "Bas karo!", "Chai piyoge?"],
    sprite: "npc_turban",
  },
  lgbtq: {
    col:[255, 140, 200], accentCol:[255, 80, 200],  w:22, h:44, speed:30,
    phrases:["Love wins!", "Stay fabulous!", "You go girl!"],
    sprite: "npc_lgbtq",
  },
  hijab: {
    col:[100, 120, 200], accentCol:[60, 80, 160],   w:22, h:44, speed:20,
    phrases:["Astaghfirullah!", "SubhanAllah!", "Peace be upon you."],
    sprite:"npc_hijab",
  },
  african: {
    col:[160, 100, 50],  accentCol:[220, 160, 40],  w:22, h:44, speed:28,
    phrases:["Habari!", "Selam!", "Insha'Allah!"],
    sprite: "npc_african",
  },
  quebecois: {
    col:[220, 180, 140], accentCol:[200, 60, 60],   w:24, h:44, speed:22,
    phrases:["Tabarnak!", "Câlisse!", "Go Sens go!"],
    sprite: "npc_quebecois",
  },
  ukrainian: {
    col:[255, 220, 180], accentCol:[30, 120, 220],  w:22, h:44, speed:25,
    phrases:["Slava Ukraini!", "Davai!", "Nemozhlyvo!"],
    sprite: "npc_ukrainian",
  },
  palestinian: {
    col:[210, 190, 160], accentCol:[20, 120, 40],   w:22, h:44, speed:30,
    phrases:["Free Palestine!", "Intifada!", "Ya free!"],
    // TODO: sprite:"npc_palestinian"
  },
  // ── Pets (isPet: true) ────────────────────────────────────────────────
  raccoon: {
    col:[100, 90, 75], accentCol:[60, 55, 45], w:14, h:16, speed:40,
    isPet: true,
    phrases:[],
    sprite: "pet_raccoon",
    spriteH: 512,
  },
};

// ── Pickup table ──────────────────────────────────────────────────────────────
// heal > 0  → restores HP on contact
// isWeapon  → player holds it; attacks use weapon damage/uses until it breaks
// TODO: Add sprite keys once pickup sprites exist in assets/.
const PICKUP_DEFS = {
  donut:      { col:[220,170,100], label:"DONUT",   heal:20, isWeapon:false,                   w:18, h:14, sprite:"pickup_donut" },
  samosa:     { col:[200,150, 50], label:"SAMOSA",  heal:25, isWeapon:false,                   w:16, h:16, sprite:"pickup_samosa" },
  coffee:     { col:[100, 60, 30], label:"COFFEE",  heal:15, isWeapon:false,                   w:14, h:20, sprite:"pickup_coffee" },
  fish:       { col:[150,200,220], label:"FISH",    heal:10, isWeapon:false,                   w:28, h:14 },
  bottle:     { col:[100,160, 80], label:"BOTTLE",  heal: 0, isWeapon:true,  damage:18, uses:3, w:10, h:24, sprite:"pickup_bottle" },
  cart:       { col:[160,160,160], label:"CART",    heal: 0, isWeapon:true,  damage:30, uses:2, w:40, h:28, sprite:"pickup_cart" },
  spice_cart: { col:[200,100, 20], label:"SPICE",   heal: 0, isWeapon:true,  damage:22, uses:3, w:36, h:28, sprite:"pickup_spice_cart" },
  fruit_cart: { col:[220,140, 60], label:"FRUITS",  heal: 0, isWeapon:true,  damage:25, uses:2, w:40, h:28, sprite:"pickup_fruit_cart" },
  flagpole:   { col:[200, 50, 50], label:"FLAG",    heal: 0, isWeapon:true,  damage:28, uses:4, w: 8, h:55 },
  skate:      { col:[180,200,220], label:"SKATE",   heal: 0, isWeapon:true,  damage:20, uses:2, w:30, h:12 },
  statue:     { col:[160,140,100], label:"STATUE",  heal: 0, isWeapon:true,  damage:40, uses:1, w:20, h:50 },
};
