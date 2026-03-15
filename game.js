// =============================================================================
// Ottawa Rage — Streets of Winter
// game.js: Kaplay initialisation, scenes, wave/boss system, combat logic.
//
// Depends on (loaded before this file):
//   js/constants.js  — all tuning data & level definitions
//   js/entities.js   — factory functions, AI helpers, HUD draw
// =============================================================================

kaplay({
  width:      SCREEN_W,
  height:     SCREEN_H,
  letterbox:  true,        // maintain aspect ratio with black bars on resize
  background: [18, 18, 28],
  pixelDensity: window.devicePixelRatio,
});


// =============================================================================
// ASSET LOADING STUBS
// Uncomment each block as you drop files into assets/.
// =============================================================================

// ── Hero spritesheets ─────────────────────────────────────────────────────────
loadSprite("hero_taxpayer", "assets/hero_taxpayer.png", {
  sliceX: 12, sliceY: 6,
  anims: {
    idle:    { from: 0,  to: 0,  loop: true,  speed: 1  },   // row 0, single frame
    walk:    { from: 12, to: 23, loop: true,  speed: 10 },   // row 1, 12 frames
    punch:   { from: 24, to: 27, loop: false, speed: 12 },   // row 2, cols 0-3
    kick:    { from: 28, to: 31, loop: false, speed: 10 },   // row 2, cols 4-7
    special: { from: 36, to: 47, loop: false, speed: 8  },   // row 3 (Audit Slam / ice burst)
    hurt:    { from: 54, to: 59, loop: false, speed: 6  },   // row 4, cols 6-11
  },
});
// loadSprite("hero_priya", "assets/hero_priya.png", { /* same layout */ });

// ── Enemy spritesheets ────────────────────────────────────────────────────────
loadSprite("enemy_grunt", "assets/grunt_art.png", {
  sliceX: 8, sliceY: 4,
  anims: {
    walk:   { from: 0,  to: 7,  loop: true,  speed: 10 },  // row 0: walk cycle (all standing)
    attack: { from: 8,  to: 15, loop: false, speed: 12 },  // row 1: attack (standing, arms extend)
    hurt:   { from: 16, to: 20, loop: false, speed: 8  },  // row 2 cols 0-4: hurt (standing)
    death:  { from: 21, to: 23, loop: false, speed: 6  },  // row 2 cols 5-7: collapse (lying)
    idle:   { from: 24, to: 31, loop: true,  speed: 6  },  // row 3: idle/patrol (all standing)
  },
});
loadSprite("enemy_agile", "assets/agile_art.png", {
  sliceX: 8, sliceY: 4,
  anims: {
    walk:   { from: 0,  to: 7,  loop: true,  speed: 9  },   // row 0: skating approach
    attack: { from: 8,  to: 15, loop: false, speed: 10 },   // row 1: slash attack
    hurt:   { from: 16, to: 19, loop: false, speed: 8  },   // row 2 cols 0-3: flinch
    death:  { from: 20, to: 23, loop: false, speed: 6  },   // row 2 cols 4-7: collapse
    idle:   { from: 24, to: 31, loop: true,  speed: 6  },   // row 3: idle
  },
});
loadSprite("enemy_heavy", "assets/heavy_art.png", {
  sliceX: 8, sliceY: 4,
  anims: {
    walk:   { from: 0,  to: 7,  loop: true,  speed: 8  },   // row 0: walk cycle
    attack: { from: 8,  to: 15, loop: false, speed: 10 },   // row 1: attack (arms extend)
    hurt:   { from: 16, to: 20, loop: false, speed: 8  },   // row 2 cols 0-4: hurt (standing)
    death:  { from: 21, to: 23, loop: false, speed: 6  },   // row 2 cols 5-7: collapse (lying)
    idle:   { from: 24, to: 31, loop: true,  speed: 6  },   // row 3: idle/patrol
  },
});
loadSprite("enemy_stripper", "assets/stripper_art.png", {
  sliceX: 8, sliceY: 4,
  anims: {
    walk:   { from: 0,  to: 7,  loop: true,  speed: 8  },   // row 0: walk cycle
    attack: { from: 8,  to: 15, loop: false, speed: 10 },   // row 1: whip/scarf attack
    hurt:   { from: 16, to: 19, loop: false, speed: 8  },   // row 2 cols 0-3: flinch
    death:  { from: 20, to: 23, loop: false, speed: 6  },   // row 2 cols 4-7: collapse
    idle:   { from: 24, to: 31, loop: true,  speed: 6  },   // row 3: idle/posing
  },
});
// loadSprite("enemy_crackhead","assets/enemy_crackhead.png",{ /* same layout */ });
// loadSprite("enemy_kicker",   "assets/enemy_kicker.png",   { /* same layout */ });

// ── Boss spritesheets ─────────────────────────────────────────────────────────
loadSprite("boss_earl", "assets/heavy_boss_art.png", {
  sliceX: 8, sliceY: 4,
  anims: {
    walk:   { from: 0,  to: 7,  loop: true,  speed: 7  },  // row 0: heavy stride
    attack: { from: 8,  to: 15, loop: false, speed: 10 },  // row 1: punch combo
    hurt:   { from: 16, to: 19, loop: false, speed: 8  },  // row 2 cols 0-3: stagger (standing)
    death:  { from: 20, to: 23, loop: false, speed: 5  },  // row 2 cols 4-7: collapse (lying)
    idle:   { from: 24, to: 31, loop: true,  speed: 5  },  // row 3: idle/menacing
  },
});
loadSprite("boss_duo", "assets/boss_duo_art.png", {
  sliceX: 8, sliceY: 4,
  anims: {
    idle:   { from: 0,  to: 7,  loop: true,  speed: 6  },   // row 0: idle/taunt
    walk:   { from: 8,  to: 15, loop: true,  speed: 7  },   // row 1: walk
    attack: { from: 16, to: 23, loop: false, speed: 10 },   // row 2: attack combo
    hurt:   { from: 24, to: 27, loop: false, speed: 8  },   // row 3 cols 0-3: hurt
    death:  { from: 28, to: 31, loop: false, speed: 5  },   // row 3 cols 4-7: death
  },
});
// loadSprite("boss_chain",     "assets/boss_chain.png",     { sliceX:8, sliceY:5 });
// loadSprite("boss_chef",      "assets/boss_chef.png",      { sliceX:8, sliceY:5 });
// loadSprite("boss_overlord",  "assets/boss_overlord.png",  { sliceX:8, sliceY:5 });

// ── NPC spritesheets ──────────────────────────────────────────────────────────
loadSprite("npc_turban", "assets/npc_turban.png", {
  sliceX: 4, sliceY: 1,
  anims: {
    walk: { from: 0, to: 3, loop: true, speed: 6 },
  },
});
loadSprite("npc_lgbtq", "assets/npc_lgbtq.png", {
  sliceX: 4, sliceY: 1,
  anims: {
    walk: { from: 0, to: 3, loop: true, speed: 6 },
  },
});
// loadSprite("npc_hijab",      "assets/npc_hijab.png",      { sliceX:4 });
loadSprite("npc_african", "assets/npc_african.png", {
  sliceX: 4, sliceY: 1,
  anims: {
    walk: { from: 0, to: 3, loop: true, speed: 6 },
  },
});
loadSprite("npc_quebecois", "assets/npc_quebecois.png", {
  sliceX: 4, sliceY: 1,
  anims: {
    walk: { from: 0, to: 3, loop: true, speed: 6 },
  },
});
loadSprite("npc_ukrainian", "assets/npc_ukrainian.png", {
  sliceX: 4, sliceY: 1,
  anims: {
    walk: { from: 0, to: 3, loop: true, speed: 6 },
  },
});
// loadSprite("npc_palestinian","assets/npc_palestinian.png",{ sliceX:4 });

// ── Pet spritesheets ────────────────────────────────────────────────────────
loadSprite("pet_raccoon", "assets/npc_raccoon.png", {
  sliceX: 4, sliceY: 1,
  anims: {
    walk: { from: 0, to: 3, loop: true, speed: 8 },
  },
});

// ── Pickup sprites ───────────────────────────────────────────────────────────
loadSprite("pickup_donut",  "assets/pickup_donut.png");
loadSprite("pickup_coffee", "assets/pickup_coffee.png");
loadSprite("pickup_samosa", "assets/pickup_samosa.png");
loadSprite("pickup_cart",   "assets/pickup_cart.png");
loadSprite("pickup_bottle","assets/pickup_bottle.png");

// ── Backgrounds ───────────────────────────────────────────────────────────────
// loadSprite("bg_bankstreet",  "assets/bg_bankstreet.png");
// loadSprite("bg_byward",      "assets/bg_byward.png");
// loadSprite("bg_canal",       "assets/bg_canal.png");
// loadSprite("bg_curry",       "assets/bg_curry.png");
// loadSprite("bg_parliament",  "assets/bg_parliament.png");

// ── Sounds & music ────────────────────────────────────────────────────────────
// loadSound("sfx_punch",  "assets/sfx_punch.wav");
// loadSound("sfx_kick",   "assets/sfx_kick.wav");
// loadSound("sfx_hurt",   "assets/sfx_hurt.wav");
// loadSound("sfx_pickup", "assets/sfx_pickup.wav");
// loadSound("sfx_boss",   "assets/sfx_boss.wav");
// loadSound("music_main", "assets/music_street.mp3");


// =============================================================================
// SCENE — TITLE
// =============================================================================

scene("title", () => {
  // Background
  add([rect(SCREEN_W, SCREEN_H), pos(0, 0), color(10, 12, 22), fixed(), z(0)]);

  // Gradient bands (decorative — mimics a lit street from below)
  add([rect(SCREEN_W, 80),  pos(0, SCREEN_H - 80),  color(30, 20, 10),  fixed(), z(1)]);
  add([rect(SCREEN_W, 40),  pos(0, SCREEN_H - 40),  color(45, 30, 12),  fixed(), z(1)]);

  // Title
  add([text("OTTAWA RAGE", { size: 44, align: "center" }),
       pos(SCREEN_W / 2, 80), anchor("center"),
       color(255, 200, 50), fixed(), z(10)]);
  add([text("Streets of Winter", { size: 16, align: "center" }),
       pos(SCREEN_W / 2, 140), anchor("center"),
       color(160, 200, 220), fixed(), z(10)]);

  // Subtitle / tagline
  add([text("Ottawa's last hope fights through 5 neighbourhoods of winter chaos.",
            { size: 8, align: "center", width: 600 }),
       pos(SCREEN_W / 2, 175), anchor("center"),
       color(130, 130, 150), fixed(), z(10)]);

  // Controls prompt (flashing)
  const prompt = add([
    text("[ ENTER ]  1 Player        [ TAB ]  2 Players", { size: 12, align: "center" }),
    pos(SCREEN_W / 2, 235), anchor("center"),
    color(255, 245, 120), fixed(), z(10),
  ]);
  // Flash
  let flashT = 0;
  prompt.onUpdate(() => {
    flashT += dt();
    prompt.opacity = 0.5 + 0.5 * Math.sin(flashT * 3.5);
  });

  // Controls legend
  add([text("P1: WASD Move   Z Punch   X Kick   Q Special",
            { size: 9, align: "center" }),
       pos(SCREEN_W / 2, 272), anchor("center"),
       color(130, 180, 130), fixed(), z(10)]);
  add([text("P2: IJKL Move   U Punch   O Kick   P Special",
            { size: 9, align: "center" }),
       pos(SCREEN_W / 2, 288), anchor("center"),
       color(130, 180, 220), fixed(), z(10)]);

  // Pickup hint
  add([text("Walk over items to collect them.  Weapons boost your attack range & damage.",
            { size: 7, align: "center", width: 600 }),
       pos(SCREEN_W / 2, 316), anchor("center"),
       color(100, 100, 110), fixed(), z(10)]);

  // Copyright / flavour
  add([text("© Unofficial Ottawa Love Letter — no politicians were harmed.",
            { size: 7, align: "center" }),
       pos(SCREEN_W / 2, SCREEN_H - 18), anchor("center"),
       color(70, 70, 80), fixed(), z(10)]);

  // Snow on title screen
  initSnow(45);
  onUpdate(() => updateSnow());
  onDraw(() => drawSnow());

  onKeyPress("enter", () => go("game", { numPlayers: 1, levelIdx: 0 }));
  onKeyPress("tab",   () => go("game", { numPlayers: 2, levelIdx: 0 }));
});


// =============================================================================
// SCENE — MAIN GAME
// =============================================================================

scene("game", ({ numPlayers = 1, levelIdx = 0 }) => {

  const lvl = LEVELS[levelIdx];

  // ── Scene state ─────────────────────────────────────────────────────────────
  let players  = [];   // player game objects
  let enemies  = [];   // active enemy game objects
  let npcs     = [];   // background NPC game objects
  let pickups  = [];   // pickup game objects
  let waveIdx  = -1;   // current wave (incremented by advanceWave)
  let bossObjs = [];   // boss game object(s) for current encounter
  let phase    = "wave"; // "wave" | "bossIntro" | "boss" | "levelClear"


  // ── Build the scene ─────────────────────────────────────────────────────────
  drawLevelBackground(lvl);
  initSnow(52);

  // Background NPCs
  const npcCount = 5 + lvl.npcTypes.length * 2;
  for (let i = 0; i < npcCount; i++) {
    const type = choose(lvl.npcTypes);
    npcs.push(spawnNPC(type, rand(50, SCREEN_W - 50), rand(GROUND_TOP + 28, GROUND_BOTTOM - 8)));
  }

  // Background pets
  if (lvl.petTypes) {
    const petCount = levelIdx === 1 ? 4 : 2;   // extra raccoons on ByWard
    for (let i = 0; i < petCount; i++) {
      const type = choose(lvl.petTypes);
      npcs.push(spawnPet(type, rand(50, SCREEN_W - 50), rand(GROUND_TOP + 28, GROUND_BOTTOM - 8)));
    }
  }

  // Initial pickups scattered around the level
  for (let i = 0; i < 3; i++) {
    const type = choose(lvl.pickups);
    pickups.push(spawnPickup(type, rand(80, SCREEN_W - 80), rand(GROUND_TOP + 40, GROUND_BOTTOM - 12)));
  }

  // Spawn player(s)
  for (let i = 0; i < numPlayers; i++) {
    const p = spawnPlayer(i);
    players.push(p);
    setupPlayerAttacks(p);   // registers onKeyPress handlers (defined below)
  }

  // Kick off wave 1
  advanceWave();

  // ── ByWard raccoon scatter event (near McDonald's) ───────────────────────
  if (levelIdx === 1) {
    let raccoonScatterDone = false;
    const mcStore = lvl.stores.find(s => s.isMcDonalds);
    if (mcStore) {
      const scatterX = mcStore.x + mcStore.w / 2;
      onUpdate(() => {
        if (raccoonScatterDone) return;
        for (const p of players) {
          if (p.hp <= 0) continue;
          if (Math.abs(p.pos.x - scatterX) < 50) {
            raccoonScatterDone = true;
            showBanner("RACCOON INCIDENT ZONE", 2);
            for (let i = 0; i < 4; i++) {
              const r = spawnPet("raccoon",
                scatterX + rand(-15, 15),
                rand(GROUND_TOP + 30, GROUND_BOTTOM - 10));
              r.dir = choose([-1, 1]);
              r.facing = r.dir;
              r.walkTimer = 3;   // run in chosen direction for 3s
              npcs.push(r);
            }
            break;
          }
        }
      });
    }
  }


  // ── Wave / boss system ──────────────────────────────────────────────────────

  function advanceWave() {
    waveIdx++;

    if (waveIdx < lvl.waves.length) {
      phase = "wave";
      showBanner(`WAVE  ${waveIdx + 1}`, 1.5);
      spawnWaveEnemies(lvl.waves[waveIdx]);
    } else {
      beginBossSequence();
    }
  }

  function spawnWaveEnemies(waveDef) {
    let delay = 0.5;
    for (const group of waveDef) {
      for (let i = 0; i < group.count; i++) {
        wait(delay, () => {
          if (phase !== "wave") return;
          const y = rand(GROUND_TOP + 30, GROUND_BOTTOM - 10);
          enemies.push(spawnEnemy(group.type, SCREEN_W + rand(20, 80), y));
        });
        delay += 0.65;
      }
    }
  }

  function beginBossSequence() {
    phase = "bossIntro";
    showBanner(lvl.bossIntro, 2.5);
    // TODO: play("sfx_boss") here

    wait(3, () => {
      phase    = "boss";
      bossObjs = [];

      const count = lvl.boss.count || 1;
      for (let i = 0; i < count; i++) {
        const bossY = lerp(GROUND_TOP + 30, GROUND_BOTTOM - 10, (i + 1) / (count + 1));
        const boss  = spawnEnemy(lvl.boss.type, SCREEN_W - 60 - i * 55, bossY);
        enemies.push(boss);
        bossObjs.push(boss);
      }
    });
  }

  function checkWaveCleared() {
    if (enemies.length > 0) return;

    if (phase === "wave") {
      showBanner("WAVE  CLEAR!", 1.2);
      wait(1.8, () => advanceWave());

    } else if (phase === "boss") {
      phase = "levelClear";
      showBanner(`${lvl.name.toUpperCase()}  CLEAR!`, 3);

      wait(4, () => {
        const next = levelIdx + 1;
        if (next < LEVELS.length) {
          go("game", { numPlayers, levelIdx: next });
        } else {
          go("victory", { numPlayers });
        }
      });
    }
  }


  // ── Player attack input ─────────────────────────────────────────────────────
  // Registered per player so P1 and P2 keys are independent.

  function setupPlayerAttacks(p) {
    const cfg = p.cfg;

    onKeyPress(cfg.keys.punch, () => {
      if (canAttack(p)) doAttack(p, "punch");
    });
    onKeyPress(cfg.keys.kick, () => {
      if (canAttack(p)) doAttack(p, "kick");
    });
    onKeyPress(cfg.keys.special, () => {
      if (canSpecial(p)) doSpecial(p);
    });
  }

  function canAttack(p)  { return p.attackTimer <= 0 && p.hurtTimer <= 0 && p.hp > 0; }
  function canSpecial(p) {
    return p.specialCooldown <= 0 && p.hurtTimer <= 0 && p.hp > SPECIAL_HP_COST;
  }

  function doAttack(p, type) {
    const atk    = ATTACKS[type];
    const damage = p.heldWeapon ? p.heldWeapon.damage : atk.damage;
    const range  = p.heldWeapon ? atk.range * 1.4     : atk.range;

    p.state       = type;
    p.attackTimer = ATTACK_DURATION;

    // Hit flash in front of player
    // TODO: Replace with attack-arc sprite / particle effect
    const fxX = p.pos.x + p.facing * (14 + range * 0.5);
    add([rect(22, 22), pos(fxX, p.pos.y - 30),
         anchor("center"), color(...atk.fxColor), opacity(1),
         z(p.pos.y + 10), lifespan(0.12)]);

    // TODO: play("sfx_punch") / play("sfx_kick")

    // Hit detection — snapshot the array so mid-loop kills are safe
    for (const e of [...enemies]) {
      if (e.state === "dead") continue;
      const horizDist = (e.pos.x - p.pos.x) * p.facing;  // positive = in front
      const vertDist  = Math.abs(e.pos.y - p.pos.y);
      if (horizDist > 0 && horizDist <= range && vertDist <= atk.width) {
        hitEnemy(p, e, damage);
      }
    }

    // Drain held weapon
    if (p.heldWeapon) {
      p.heldWeapon.uses--;
      if (p.heldWeapon.uses <= 0) {
        showSpeechBubble("BROKE!", p);
        p.heldWeapon = null;
      }
    }
  }

  function doSpecial(p) {
    // Area-of-effect spin attack — costs HP, clears a radius
    p.hp              -= SPECIAL_HP_COST;
    p.specialCooldown  = SPECIAL_COOLDOWN;
    p.attackTimer      = 0.5;
    p.state            = "special";

    // Visual burst
    // TODO: Replace with spinning/radial sprite effect
    add([rect(SPECIAL_RADIUS * 2, SPECIAL_RADIUS * 2),
         pos(p.pos.x, p.pos.y), anchor("center"),
         color(255, 255, 140), opacity(0.35),
         z(p.pos.y + 20), lifespan(0.28)]);

    for (const e of [...enemies]) {
      if (e.state === "dead") continue;
      if (p.pos.dist(e.pos) <= SPECIAL_RADIUS) hitEnemy(p, e, SPECIAL_DAMAGE);
    }
  }


  // ── Damage helpers ──────────────────────────────────────────────────────────

  function hitEnemy(attacker, e, damage) {
    if (e.state === "dead") return;

    e.hp        = Math.max(0, e.hp - damage);
    e.hurtTimer = 0.3;
    e.state     = "hurt";

    // Knockback away from attacker
    if (attacker) {
      e.pos.x += attacker.facing * KNOCKBACK;
      e.pos.x  = clamp(e.pos.x, 20, SCREEN_W - 20);
    }

    spawnFloatText(`-${damage}`, e.pos.x, e.pos.y - 50, [255, 220, 50]);

    if (e.hp <= 0) killEnemy(e);
  }

  function killEnemy(e) {
    if (e.state === "dead") return;  // guard against double-kill in same frame
    e.state = "dead";

    // Score popup
    const pts = e.def.isBoss ? 500 : 100;
    spawnFloatText(`+${pts}`, e.pos.x, e.pos.y - 68, [255, 255, 70]);

    // Chance to drop a health pickup
    if (!e.def.isBoss && Math.random() < 0.28) {
      const drop = choose(["donut", "coffee", "samosa"]);
      pickups.push(spawnPickup(drop, e.pos.x, e.pos.y));
    }

    if (e.def.sprite) {
      e.play("death");
      wait(0.5, () => {
        destroy(e);
        enemies = enemies.filter(x => x !== e);
        checkWaveCleared();
      });
    } else {
      e.color = rgb(255, 255, 255);   // death flash
      wait(0.14, () => {
        destroy(e);
        enemies = enemies.filter(x => x !== e);
        checkWaveCleared();
      });
    }
  }

  function hitPlayer(p, damage) {
    if (p.hurtTimer > 0 || p.hp <= 0) return;   // invincibility or already dead

    p.hp        = Math.max(0, p.hp - damage);
    p.state     = "hurt";
    p.hurtTimer = HURT_IFRAMES;

    spawnFloatText(`-${damage}`, p.pos.x, p.pos.y - 58, [255, 80, 80]);

    // TODO: play("sfx_hurt")
  }


  // ── Debug cheats (remove before release) ────────────────────────────────────
  // Keyboard: ` = skip wave, - = skip level
  // Mobile:   hold BACK + tap PUNCH = skip wave, hold BACK + tap KICK = skip level
  function debugSkipWave() { [...enemies].forEach(e => killEnemy(e)); }
  function debugSkipLevel() {
    const next = levelIdx + 1;
    if (next < LEVELS.length) go("game", { numPlayers, levelIdx: next });
  }
  onKeyPress("}", debugSkipWave);
  onKeyPress("-", debugSkipLevel);
  onKeyPress("z", () => { if (isKeyDown("tab")) debugSkipWave(); });   // BACK+PUNCH
  onKeyPress("x", () => { if (isKeyDown("tab")) debugSkipLevel(); });  // BACK+KICK

  // ── Main update loops ───────────────────────────────────────────────────────

  // Player movement (attack/hurt timers are ticked inside updatePlayerMovement)
  onUpdate(() => {
    for (const p of players) {
      if (p.hp <= 0) continue;
      updatePlayerMovement(p);
    }
  });

  // Enemy AI — target the closest living player
  onUpdate(() => {
    const livingPlayers = players.filter(p => p.hp > 0);

    for (const e of [...enemies]) {
      if (e.state === "dead") continue;

      // Closest living player as target
      const target = livingPlayers.slice().sort(
        (a, b) => e.pos.dist(a.pos) - e.pos.dist(b.pos)
      )[0];
      if (!target) continue;

      updateEnemy(e, target, (dmg) => hitPlayer(target, dmg));
    }
  });

  // NPC AI
  onUpdate(() => {
    for (const n of npcs) updateNPC(n, players, enemies);
  });

  // Pickup collection — walk over to grab
  onUpdate(() => {
    for (const p of players) {
      if (p.hp <= 0) continue;

      for (let i = pickups.length - 1; i >= 0; i--) {
        const pk = pickups[i];
        if (p.pos.dist(pk.pos) < 30) {
          collectPickup(p, pk);
          destroy(pk);
          pickups.splice(i, 1);
        }
      }
    }
  });

  function collectPickup(p, pk) {
    const def = pk.def;
    if (def.heal > 0) {
      p.hp = Math.min(p.maxHp, p.hp + def.heal);
      spawnFloatText(`+${def.heal} HP`, pk.pos.x, pk.pos.y - 40, [80, 255, 80]);
      // TODO: play("sfx_pickup")
    } else if (def.isWeapon) {
      p.heldWeapon = { type: pk.pickupType, uses: def.uses, damage: def.damage };
      showSpeechBubble(`${def.label} picked up!`, p, 1.5);
    }
  }

  // Pickup bobbing (visual)
  onUpdate(() => {
    for (const pk of pickups) {
      pk.bobTimer = (pk.bobTimer || 0) + dt() * 2.5;
      pk.pos.y   += Math.sin(pk.bobTimer) * 0.28;
    }
  });

  // Snow + HUD
  onUpdate(() => updateSnow());
  onDraw(() => {
    drawSnow();
    drawHUD(players, waveIdx, lvl, enemies, bossObjs, phase);
  });

  // Game-over check — all players dead
  onUpdate(() => {
    if (players.length > 0 && players.every(p => p.hp <= 0)) {
      wait(0.6, () => go("gameover", { numPlayers, levelIdx }));
    }
  });


  // ── Utility ─────────────────────────────────────────────────────────────────

  function showBanner(msg, duration) {
    add([text(msg, { size: 28, align: "center" }),
         pos(SCREEN_W / 2, SCREEN_H / 2 - 20), anchor("center"),
         color(255, 215, 60), opacity(1), fixed(), z(500),
         lifespan(duration, { fade: 0.4 })]);
  }

}); // end scene("game")


// =============================================================================
// SCENE — GAME OVER
// =============================================================================

scene("gameover", ({ numPlayers = 1, levelIdx = 0 }) => {
  const lvl = LEVELS[levelIdx];

  // Dark overlay
  add([rect(SCREEN_W, SCREEN_H), pos(0, 0), color(0, 0, 0), opacity(0.82), fixed(), z(998)]);

  add([text(`GAME OVER\n\nFell on  ${lvl.name}\n\n[ ENTER ]  Try Again\n[ TAB ]  Title Screen`,
            { size: 21, align: "center" }),
       pos(SCREEN_W / 2, SCREEN_H / 2), anchor("center"),
       color(255, 70, 70), fixed(), z(999)]);

  initSnow(30);
  onUpdate(() => updateSnow());
  onDraw(() => drawSnow());

  onKeyPress("enter", () => go("game", { numPlayers, levelIdx }));
  onKeyPress("tab",   () => go("title"));
});


// =============================================================================
// SCENE — VICTORY
// =============================================================================

scene("victory", ({ numPlayers = 1 }) => {
  add([rect(SCREEN_W, SCREEN_H), pos(0, 0), color(10, 20, 10), fixed(), z(0)]);

  add([text("OTTAWA IS SAVED!", { size: 38, align: "center" }),
       pos(SCREEN_W / 2, 90), anchor("center"),
       color(100, 255, 100), fixed(), z(10)]);

  add([text("You fought through every neighbourhood.\nOttawa thanks you, eh.",
            { size: 14, align: "center" }),
       pos(SCREEN_W / 2, 180), anchor("center"),
       color(180, 240, 180), fixed(), z(10)]);

  add([text("[ ENTER ]  Play Again       [ TAB ]  Title Screen",
            { size: 12, align: "center" }),
       pos(SCREEN_W / 2, 265), anchor("center"),
       color(255, 245, 120), fixed(), z(10)]);

  // Celebratory heavy snow
  initSnow(90);
  onUpdate(() => updateSnow());
  onDraw(() => drawSnow());

  onKeyPress("enter", () => go("game", { numPlayers, levelIdx: 0 }));
  onKeyPress("tab",   () => go("title"));
});


// =============================================================================
// LAUNCH
// =============================================================================

go("title");
