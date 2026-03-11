# Ottawa Rage — Streets of Winter

2D side-scrolling beat 'em up set in Ottawa's winter streets. Web-based (HTML5/JS), mobile-responsive, using Kaplay.js engine.

## Project Structure

```
index.html          — Entry point, canvas, virtual gamepad (touch controls)
game.js             — Scenes (title/game/gameover/victory), combat, wave system, asset loading
js/constants.js     — All tuning values, level defs, enemy/NPC/pickup stats
js/entities.js      — Factory functions (player, enemy, NPC, pickup), AI, HUD, snow
assets/             — Sprites, sounds (see assets/CLAUDE.md for sprite guidelines)
.github/workflows/  — GitHub Pages deploy on push to main
```

**Load order:** index.html → Kaplay CDN → constants.js → entities.js → game.js
**No build step** — static site, deployed directly to GitHub Pages.

## Architecture

### Scene Flow
```
title → game → gameover → retry/title
                └→ victory → replay/title
```

### Entity System
- **Players** (1-2): WASD/IJKL movement, Z/X/Q or U/O/P attacks. Spawned via `spawnPlayer(idx)`.
- **Enemies** (6 basic + 5 bosses): AI targets nearest player, pathfinds, attacks in range. Spawned via `spawnEnemy(type, x, y)`.
- **NPCs** (7 cultural archetypes): Wander, flee danger, react to fights with speech bubbles.
- **Pickups** (4 health + 7 weapons): Dropped by enemies (28% chance) or pre-spawned.

### Wave System
Each level: 3 enemy waves → boss fight → next level. 5 levels total (Bank St → ByWard → Canal → Curry St → Parliament Hill).

### Combat
- Punch (68px range, 12 dmg), Kick (90px range, 22 dmg), Special (115px AoE, 35 dmg, costs 20 HP)
- Weapons boost damage/range, break after N uses
- Hit → 0.3s enemy stun, 22px knockback; Player hurt → 0.45s iframes

### Z-Ordering
Depth-sorted by Y position. NPCs at z~290, pickups at z~285, players/enemies at z~300 (dynamic).

## Key Conventions

- **No magic numbers** — all tuning in `js/constants.js` (speeds, HP, ranges, colors, etc.)
- **Factory pattern** — entities created via `spawn*()` functions in `js/entities.js`
- **Placeholder rects** — entities without sprites use `rect()` + `color()` fallback
- **Canvas-dispatched events** — mobile gamepad fires synthetic KeyboardEvents on the canvas element (not window)
- **Kaplay animations** — sprite sheets must have **exact integer frame dimensions** (width/sliceX and height/sliceY must be whole numbers)

## Player Controls

| Action   | P1 (Keyboard) | P2 (Keyboard) | Mobile Gamepad |
|----------|---------------|---------------|----------------|
| Move     | WASD          | IJKL          | D-pad          |
| Punch    | Z             | U             | PUNCH button   |
| Kick     | X             | O             | KICK button    |
| Special  | Q             | P             | ★ SPEC button  |
| Start    | Enter         | Enter         | START button   |

## What's Done

- Full game loop: title → 5 levels with waves/bosses → victory
- Player movement, combat, weapons, special attacks
- Enemy AI (pathfinding, attacking, taunting)
- NPC system (wandering, fleeing, reacting)
- Pickup system (health items, weapons with durability)
- HUD (HP bars, wave counter, boss HP, controls legend)
- Snow particle system
- Mobile virtual gamepad with landscape lock
- GitHub Pages CI/CD
- Hero "Taxpayer" sprite sheet (12×6 grid, 1392×756px)

## What's Missing / TODO

### Sprites (Critical)
- **Player 2 (Priya)** sprite sheet — no sprite exists yet
- **All enemy sprites** (6 types + 5 bosses) — using colored rectangles
- **All NPC sprites** (7 types) — using colored rectangles
- **Background layers** (5 levels) — using programmatic colored rects for storefronts
- **Impact effects** (punch/kick VFX)
- See `assets/CLAUDE.md` for sprite creation guidelines

### Audio
- No sound effects loaded (punch, kick, hurt, pickup)
- No music (street theme, boss themes)
- `loadSound()` stubs exist in game.js but are commented out

### Features
- Character select screen (P1/P2 character choice)
- Difficulty modes
- Score persistence / high score table
- Combo system
- Player 2 full integration testing

### Polish
- Attack animations need visual feedback beyond flash rects
- Death animations for enemies (currently just flash + destroy)
- Level transition animations
- Boss intro cinematics (currently just text banners)
