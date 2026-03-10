// =============================================================================
// Ottawa Rage — js/entities.js
//
// Factory functions and update helpers for every entity type.
// These functions are called from inside Kaplay scenes (game.js) and rely on
// Kaplay globals (add, rect, pos, color, z, lifespan, rand, choose, …).
//
// Design rule: entity helpers receive game-state side-effects via callbacks so
// this file stays decoupled from game.js's closure variables.
// =============================================================================


// =============================================================================
// BACKGROUND DRAWING
// =============================================================================

/**
 * Draw the full static background for a level using placeholder coloured rects.
 * TODO: Replace each block with a loadSprite/drawSprite parallax layer.
 * @param {object} lvl — level data object from LEVELS[]
 */
function drawLevelBackground(lvl) {

  // Sky / upper half
  add([rect(SCREEN_W, GROUND_TOP), pos(0, 0),
       color(...lvl.skyCol), fixed(), z(-200)]);

  // Storefront row
  // TODO: Replace with per-store sprite images from assets/bg_*.png
  for (const s of lvl.stores) {

    // Building wall
    add([rect(s.w - 4, s.h), pos(s.x + 2, GROUND_TOP - s.h),
         color(...s.col), fixed(), z(-195)]);

    // Window grid (simple decorative rects)
    for (let wx = s.x + 10; wx < s.x + s.w - 20; wx += 28) {
      for (let wy = GROUND_TOP - s.h + 10; wy < GROUND_TOP - 28; wy += 28) {
        add([rect(14, 13), pos(wx, wy), color(175, 205, 225), fixed(), z(-194)]);
      }
    }

    // Store sign band
    add([rect(s.w - 4, 17), pos(s.x + 2, GROUND_TOP - 21),
         color(200, 40, 40), fixed(), z(-193)]);

    // Sign label text
    // TODO: Render as a pixel-font sprite once assets are ready
    add([text(s.label, { size: 7 }), pos(s.x + 5, GROUND_TOP - 20),
         color(255, 240, 220), fixed(), z(-192)]);
  }

  // Sidewalk surface
  add([rect(SCREEN_W, GROUND_BOTTOM - GROUND_TOP), pos(0, GROUND_TOP),
       color(...lvl.groundCol), fixed(), z(-190)]);

  // Sidewalk slab seams
  for (let cx = 80; cx < SCREEN_W; cx += 120) {
    add([rect(1, GROUND_BOTTOM - GROUND_TOP - 20), pos(cx, GROUND_TOP + 10),
         color(105, 95, 80), fixed(), z(-189)]);
  }

  // Road strip below playfield
  add([rect(SCREEN_W, SCREEN_H - GROUND_BOTTOM), pos(0, GROUND_BOTTOM),
       color(55, 50, 40), fixed(), z(-190)]);

  // Kerb shadow
  add([rect(SCREEN_W, 3), pos(0, GROUND_BOTTOM - 3),
       color(15, 12, 8), fixed(), z(-188)]);

  // Level name plate (top-left strip)
  add([text(`LVL ${lvl.id}  ${lvl.name.toUpperCase()}`, { size: 8 }),
       pos(6, 4), color(180, 180, 180), fixed(), z(600)]);
}


// =============================================================================
// SNOW PARTICLE SYSTEM
// =============================================================================

let _snowParticles = [];

/**
 * Initialise the snow particle pool.  Call once at scene start.
 * @param {number} count — number of snowflakes (default 55)
 */
function initSnow(count = 55) {
  _snowParticles = [];
  for (let i = 0; i < count; i++) {
    _snowParticles.push({
      x:     rand(0, SCREEN_W),
      y:     rand(0, SCREEN_H),
      speed: rand(28, 85),
      drift: rand(-18, 18),   // gentle horizontal float
      size:  rand(1, 3),
      alpha: rand(0.25, 0.85),
    });
  }
}

/** Advance snow physics.  Call in onUpdate(). */
function updateSnow() {
  for (const p of _snowParticles) {
    p.y += p.speed * dt();
    p.x += p.drift * dt();
    if (p.y > SCREEN_H + 4) { p.y = -4;           p.x = rand(0, SCREEN_W); }
    if (p.x < -4)            { p.x = SCREEN_W + 4; }
    if (p.x > SCREEN_W + 4)  { p.x = -4;           }
  }
}

/** Render all snowflakes.  Call in onDraw(). */
function drawSnow() {
  for (const p of _snowParticles) {
    drawRect({
      pos:     vec2(p.x, p.y),
      width:   p.size,
      height:  p.size,
      color:   rgb(215, 228, 255),
      opacity: p.alpha,
    });
  }
}


// =============================================================================
// SPEECH BUBBLE
// =============================================================================

/**
 * Spawn a temporary speech bubble above a character.
 * @param {string} msg       — text to display
 * @param {number} srcX/srcY — world position of the speaker's feet
 * @param {number} duration  — seconds before it fades (default 2.2)
 */
function showSpeechBubble(msg, srcX, srcY, duration = 2.2) {
  const W  = Math.min(msg.length * 6 + 16, 140);
  const bx = clamp(srcX - W / 2, 4, SCREEN_W - W - 4);
  const by = srcY - 58;   // above character's head

  // Bubble background
  add([rect(W, 19), pos(bx, by),
       color(250, 248, 230), opacity(1), z(800), lifespan(duration, { fade: 0.45 })]);

  // Bubble text
  add([text(msg, { size: 8 }), pos(bx + 4, by + 4),
       color(30, 30, 30), opacity(1), z(801), lifespan(duration, { fade: 0.45 })]);

  // Pointer nub below the bubble
  add([rect(7, 7), pos(clamp(srcX - 3, bx + 4, bx + W - 10), by + 17),
       color(250, 248, 230), opacity(1), z(800), lifespan(duration, { fade: 0.45 })]);
}

/** Spawn a floating damage / score number that rises and fades. */
function spawnFloatText(msg, x, y, col) {
  add([text(msg, { size: 11 }),
       pos(x + rand(-10, 10), y),
       color(...col),
       opacity(1),
       z(820),
       lifespan(0.75, { fade: 0.3 }),
       // Drift upward each frame via a tiny onUpdate scoped to this object
       {
         update() { this.pos.y -= 40 * dt(); },
       }]);
}


// =============================================================================
// PLAYER FACTORY
// =============================================================================

/**
 * Spawn a player character.
 * @param {number} idx — 0 = P1 (Luciano), 1 = P2 (Priya)
 * @returns {KAPLAYObj} player game object
 */
function spawnPlayer(idx) {
  const cfg = PLAYER_CONFIGS[idx];
  const startY = lerp(GROUND_TOP + 24, GROUND_BOTTOM, 0.5 + idx * 0.12);

  const useSprite = !!cfg.sprite;
  const p = add([
    useSprite ? sprite(cfg.sprite) : rect(28, 48),
    useSprite ? scale(0.35) : scale(1),
    pos(cfg.startX, startY),
    anchor("bot"),           // pos = feet centre; correct for depth sorting
    color(...cfg.col),
    z(300),
    {
      cfg,
      pidx:           idx,
      hp:             PLAYER_MAX_HP,
      maxHp:          PLAYER_MAX_HP,
      state:          "idle",   // idle | walk | punch | kick | special | hurt
      _lastState:     null,     // used to detect state changes for play()
      attackTimer:    0,        // > 0 while in attack state
      hurtTimer:      0,        // > 0 during invincibility frames
      specialCooldown:0,
      facing:         1,        // 1 = right, −1 = left
      heldWeapon:     null,     // { type, uses, damage } or null
    },
  ]);
  if (useSprite) p.play("idle");
  return p;
}

/**
 * Update player movement each frame.  Attack & hurt-lock respected.
 * Call from onUpdate() in game scene.
 */
function updatePlayerMovement(p) {
  const cfg = p.cfg;

  p.attackTimer     = Math.max(0, p.attackTimer     - dt());
  p.hurtTimer       = Math.max(0, p.hurtTimer       - dt());
  p.specialCooldown = Math.max(0, p.specialCooldown - dt());

  // Colour tint: hurt = red flash, weapon held = weapon colour, normal = neutral
  if (p.hurtTimer > 0) {
    p.color = rgb(...cfg.hurtCol);
  } else if (p.heldWeapon) {
    const d = PICKUP_DEFS[p.heldWeapon.type];
    p.color = rgb(...d.col);   // TODO: show held item as a separate sprite layer
  } else {
    p.color = rgb(...cfg.col);
  }

  // Flip sprite to face movement direction
  if (cfg.sprite) p.flipX = (p.facing < 0);

  const locked = p.attackTimer > 0 || p.hurtTimer > 0;
  if (locked) { p.z = p.pos.y; return; }

  let dx = 0, dy = 0;
  if (isKeyDown(cfg.keys.left))  { dx--; p.facing = -1; }
  if (isKeyDown(cfg.keys.right)) { dx++; p.facing =  1; }
  if (isKeyDown(cfg.keys.up))    { dy--; }
  if (isKeyDown(cfg.keys.down))  { dy++; }

  if (dx !== 0 || dy !== 0) {
    const len = Math.sqrt(dx * dx + dy * dy);
    p.pos.x += (dx / len) * PLAYER_SPEED * dt();
    p.pos.y += (dy / len) * PLAYER_SPEED * dt();
    p.state = "walk";
  } else {
    p.state = "idle";
  }

  // Trigger animation only on state change
  if (cfg.sprite && p.state !== p._lastState) {
    p.play(p.state);
    p._lastState = p.state;
  }

  // Hard clamp to playfield
  p.pos.x = clamp(p.pos.x, 20, SCREEN_W - 20);
  p.pos.y = clamp(p.pos.y, GROUND_TOP + 24, GROUND_BOTTOM);

  // Depth sort — z = feet y so characters lower on screen draw in front
  p.z = p.pos.y;
}


// =============================================================================
// ENEMY FACTORY & AI
// =============================================================================

/**
 * Spawn an enemy.
 * @param {string} type — key into ENEMY_DEFS
 * @param {number} x, y — spawn position (feet)
 * @returns {KAPLAYObj} enemy game object
 */
function spawnEnemy(type, x, y) {
  const def = ENEMY_DEFS[type];

  // TODO: Swap rect/color for sprite(def.sprite) and call e.play("walk") etc.
  const e = add([
    rect(def.w, def.h),
    pos(x, y),
    anchor("bot"),
    color(...def.col),
    z(300),
    {
      def,
      type,
      hp:            def.hp,
      maxHp:         def.hp,
      state:         "walk",   // walk | hurt | dead
      hurtTimer:     0,
      attackCooldown: rand(0.3, def.attackCooldown),  // stagger initial strikes
      tauntCooldown:  rand(4, 10),
      facing:        -1,
    },
  ]);
  return e;
}

/**
 * Run one frame of enemy AI.
 * @param {KAPLAYObj} e        — enemy game object
 * @param {KAPLAYObj} target   — current target player
 * @param {function}  onAttack — callback(damage) when enemy deals a hit
 */
function updateEnemy(e, target, onAttack) {
  e.hurtTimer      = Math.max(0, e.hurtTimer      - dt());
  e.attackCooldown = Math.max(0, e.attackCooldown - dt());
  e.tauntCooldown  = Math.max(0, e.tauntCooldown  - dt());

  // Colour flash when hurt — brighter version of base colour
  const dc = e.def.col;
  e.color = e.hurtTimer > 0
    ? rgb(Math.min(255, dc[0]+90), Math.min(255, dc[1]+90), Math.min(255, dc[2]+90))
    : rgb(...dc);

  // Recover from hurt stun
  if (e.state === "hurt" && e.hurtTimer <= 0) e.state = "walk";

  // Still stunned — depth sort and bail
  if (e.state !== "walk") { e.z = e.pos.y; return; }

  // Taunt player (speech bubble)
  if (e.tauntCooldown <= 0) {
    e.tauntCooldown = rand(6, 14);
    showSpeechBubble(choose(e.def.taunts), e.pos.x, e.pos.y);
  }

  // Vector toward target
  const dx   = target.pos.x - e.pos.x;
  const dy   = target.pos.y - e.pos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  e.facing   = dx >= 0 ? 1 : -1;

  if (dist <= e.def.attackRange) {
    // Close enough — strike if cooldown ready
    if (e.attackCooldown <= 0) {
      e.attackCooldown = e.def.attackCooldown;
      onAttack(e.def.damage);
      // Tiny red flash on attack
      add([rect(14, 14), pos(e.pos.x + e.facing * 14, e.pos.y - 28),
           anchor("center"), color(255, 60, 60), opacity(1), z(e.pos.y + 5), lifespan(0.1)]);
      // TODO: e.play("attack") on sprite
    }
  } else {
    // Walk toward target
    e.pos.x += (dx / dist) * e.def.speed * dt();
    e.pos.y += (dy / dist) * e.def.speed * dt();
    e.pos.x  = clamp(e.pos.x, 20, SCREEN_W - 20);
    e.pos.y  = clamp(e.pos.y, GROUND_TOP + 24, GROUND_BOTTOM);
  }

  e.z = e.pos.y;  // depth sort
}


// =============================================================================
// NPC FACTORY & AI
// =============================================================================

/**
 * Spawn a passive background NPC.
 * @param {string} type — key into NPC_DEFS
 * @param {number} x, y — spawn position (feet)
 * @returns {KAPLAYObj} NPC game object
 */
function spawnNPC(type, x, y) {
  const def = NPC_DEFS[type];

  // TODO: Swap rect/color for sprite(def.sprite) and add walk animation.
  //       Accent colour (turban, keffiyeh, etc.) rendered as a small separate rect.
  const n = add([
    rect(def.w, def.h),
    pos(x, y),
    anchor("bot"),
    color(...def.col),
    z(290),   // NPCs slightly behind player/enemies by default
    {
      def,
      type,
      state:        "walk",   // walk | flee | react
      dir:          choose([-1, 0, 1]),
      walkTimer:    rand(1, 4),
      reactCooldown:rand(2, 6),
      facing:       1,
    },
  ]);
  return n;
}

/**
 * Run one frame of NPC AI.  NPCs wander, react to nearby fights, and flee
 * from enemies that get too close.
 * @param {KAPLAYObj}   n       — NPC game object
 * @param {KAPLAYObj[]} players — all player objects
 * @param {KAPLAYObj[]} enemies — all enemy objects
 */
function updateNPC(n, players, enemies) {
  n.walkTimer      = Math.max(0, n.walkTimer      - dt());
  n.reactCooldown  = Math.max(0, n.reactCooldown  - dt());

  // Check if a brawl is happening nearby (player + enemy both within 200 px)
  const alivePlayers = players.filter(p => p.hp > 0);
  const aliveEnemies = enemies.filter(e => e.state !== "dead");
  const fightNearby  = alivePlayers.some(p => n.pos.dist(p.pos) < 200) &&
                       aliveEnemies.some(e => n.pos.dist(e.pos) < 200);

  // Flee if an enemy is dangerously close
  const dangerEnemy = aliveEnemies.find(e => n.pos.dist(e.pos) < 70);
  if (dangerEnemy) {
    n.state  = "flee";
    n.facing = n.pos.x < dangerEnemy.pos.x ? -1 : 1;
    n.pos.x += n.facing * n.def.speed * 1.9 * dt();
  } else if (n.state === "flee") {
    n.state = "walk";
  }

  // React to a nearby fight with a speech bubble
  if (fightNearby && n.reactCooldown <= 0 && Math.random() < 0.25) {
    n.reactCooldown = rand(3.5, 8);
    showSpeechBubble(choose(n.def.phrases), n.pos.x, n.pos.y);
    n.state = "react";
    wait(1.2, () => { if (n.state === "react") n.state = "walk"; });
  }

  // Wandering
  if (n.state === "walk") {
    if (n.walkTimer <= 0) {
      n.dir       = choose([-1, 0, 1]);
      n.walkTimer = rand(1.5, 4.5);
    }
    if (n.dir !== 0) n.facing = n.dir;
    n.pos.x += n.dir * n.def.speed * dt();
    n.pos.x  = clamp(n.pos.x, 20, SCREEN_W - 20);
  }

  n.z = n.pos.y;  // depth sort
}


// =============================================================================
// PICKUP FACTORY
// =============================================================================

/**
 * Spawn a pickup item on the ground.
 * @param {string} type — key into PICKUP_DEFS
 * @param {number} x, y — spawn position (feet)
 * @returns {KAPLAYObj} pickup game object
 */
function spawnPickup(type, x, y) {
  const def = PICKUP_DEFS[type];

  // TODO: Swap rect/color for sprite of the pickup item.
  const pk = add([
    rect(def.w, def.h),
    pos(x, y),
    anchor("bot"),
    color(...def.col),
    z(285),   // below characters
    {
      pickupType: type,
      def,
      bobTimer:   rand(0, Math.PI * 2),   // phase offset so not all bobs are in sync
    },
  ]);

  // Tiny label above the pickup
  // TODO: Replace with a sprite icon once assets exist
  add([
    text(def.label, { size: 7 }),
    pos(x - def.w / 2, y - def.h - 14),
    color(255, 240, 180),
    opacity(1),
    z(286),
    lifespan(4, { fade: 0.5 }),   // fades away after 4s; pickup stays until collected
  ]);

  return pk;
}


// =============================================================================
// HUD  (called from onDraw() in game scene)
// =============================================================================

/**
 * Draw the full game HUD.  Coordinate space = screen (no camera transform
 * needed as long as camera hasn't been panned — add a fixed() wrapper when
 * camera scrolling is introduced).
 *
 * @param {KAPLAYObj[]} players  — all player objects
 * @param {number}      waveIdx  — current wave index (0-based)
 * @param {object}      lvl      — current level data
 * @param {KAPLAYObj[]} enemies  — all enemy objects
 * @param {KAPLAYObj[]} bossObjs — boss objects (may be empty)
 * @param {string}      phase    — "wave" | "bossIntro" | "boss" | "levelClear"
 */
function drawHUD(players, waveIdx, lvl, enemies, bossObjs, phase) {

  // ── Per-player bars ──────────────────────────────────────────────────────
  for (let i = 0; i < players.length; i++) {
    const p  = players[i];
    const bx = 14 + i * 228;
    const by = 14;

    // Name
    drawText({ text: p.cfg.name, pos: vec2(bx, by),      size: 8,  color: rgb(...p.cfg.col) });
    // HP bar track
    drawRect({ pos: vec2(bx, by + 11), width: 200, height: 12, color: rgb(22, 22, 22) });
    // HP bar fill — turns red below 25 HP
    const ratio = Math.max(0, p.hp / p.maxHp);
    drawRect({ pos: vec2(bx, by + 11), width: 200 * ratio, height: 12,
               color: p.hp < 25 ? rgb(210, 40, 40) : rgb(60, 195, 60) });
    // HP number
    drawText({ text: `${p.hp}`, pos: vec2(bx + 4, by + 12), size: 9, color: rgb(240, 240, 240) });

    // Held weapon
    if (p.heldWeapon) {
      const wdef = PICKUP_DEFS[p.heldWeapon.type];
      drawText({ text: `[${wdef.label} ×${p.heldWeapon.uses}]`,
                 pos: vec2(bx, by + 27), size: 8, color: rgb(255, 200, 60) });
    }

    // Special cooldown / ready indicator
    if (p.specialCooldown > 0) {
      drawText({ text: `SPL ${Math.ceil(p.specialCooldown)}s`,
                 pos: vec2(bx + 142, by + 27), size: 8, color: rgb(160, 100, 200) });
    } else {
      drawText({ text: "SPL RDY",
                 pos: vec2(bx + 142, by + 27), size: 8, color: rgb(210, 160, 255) });
    }
  }

  // ── Centre: wave or boss indicator ──────────────────────────────────────
  if (phase === "wave") {
    drawText({ text: `WAVE  ${waveIdx + 1} / ${lvl.waves.length}`,
               pos: vec2(SCREEN_W / 2 - 34, 14), size: 13, color: rgb(255, 215, 60) });
  } else if (phase === "bossIntro" || phase === "boss") {
    drawText({ text: "BOSS!",
               pos: vec2(SCREEN_W / 2 - 22, 14), size: 15, color: rgb(255, 50, 50) });
  }

  // ── Enemy count (top-right) ──────────────────────────────────────────────
  const alive = enemies.filter(e => e.state !== "dead").length;
  drawText({ text: `× ${alive}`, pos: vec2(SCREEN_W - 56, 14),
             size: 13, color: rgb(215, 85, 85) });

  // ── Boss HP bar (bottom of screen) ──────────────────────────────────────
  if (phase === "boss" && bossObjs.length > 0) {
    const bossBarW = 420;
    const bossBarX = (SCREEN_W - bossBarW) / 2;
    const bossBarY = SCREEN_H - 36;

    // Combined HP across all boss instances (The Duo = 2 health bars merged)
    let totalHp    = 0, totalMaxHp = 0;
    let bossLabel  = "";
    for (const b of bossObjs) {
      if (b.state !== "dead") {
        totalHp    += b.hp;
        totalMaxHp += b.def.hp;
        bossLabel   = b.def.label;
      }
    }

    if (totalMaxHp > 0) {
      drawRect({ pos: vec2(bossBarX - 2, bossBarY - 2), width: bossBarW + 4, height: 18,
                 color: rgb(12, 12, 12) });
      drawRect({ pos: vec2(bossBarX, bossBarY), height: 14,
                 width: bossBarW * (totalHp / totalMaxHp), color: rgb(180, 25, 25) });
      drawText({ text: `${bossLabel}  ${totalHp} / ${totalMaxHp}`,
                 pos: vec2(bossBarX + 5, bossBarY + 1), size: 10,
                 color: rgb(255, 195, 195) });
    }
  }

  // ── Controls legend (bottom) ─────────────────────────────────────────────
  drawText({
    text:  "P1 WASD Move  Z Punch  X Kick  Q Special  |  P2 IJKL / U O P",
    pos:   vec2(SCREEN_W / 2 - 215, SCREEN_H - 13),
    size:  8,
    color: rgb(95, 95, 95),
  });
}
