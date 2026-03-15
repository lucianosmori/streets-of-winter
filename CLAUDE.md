# Ottawa Rage — Streets of Winter

2D side-scrolling beat 'em up set in Ottawa's winter streets. Web-based (HTML5/JS), mobile-responsive, using Kaplay.js engine.

## Project Structure

```
index.html          — Entry point, canvas, virtual gamepad (touch controls)
game.js             — Scenes (title/game/gameover/victory), combat, wave system, asset loading
js/constants.js     — All tuning values, level defs, enemy/NPC/pickup stats
js/entities.js      — Factory functions (player, enemy, NPC, pickup), AI, HUD, snow
assets/             — Sprites, sounds (see assets/CLAUDE.md for sprite guidelines)
tests/              — Playwright E2E tests (smoke, constants regression, gameplay flow)
package.json        — Dev deps: @playwright/test, serve
playwright.config.js — Test runner config (webServer, chromium, landscape viewport)
.github/workflows/  — deploy.yml (push to main) + playwright.yml (workflow_dispatch)
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
- **Pets** (5 animal types): Sub-type of friendly NPC. Smaller than human NPCs (~10–14px wide, ~12–20px tall). Same wander/flee behaviour as human NPCs but **no speech bubbles**. Archetypes: `squirrel`, `cat`, `dog`, `raccoon`, `raven`. Higher speeds than human NPCs (squirrel ~60, cat/dog ~35–50, raccoon ~40, raven ~38 hopping gait). Raccoons are especially numerous on the ByWard Market level.
- **Pickups** (4 health + 7 weapons): Dropped by enemies (28% chance) or pre-spawned.

### Wave System
Each level: 3 enemy waves → boss fight → next level. 5 levels total (Bank St → ByWard → Canal → Curry St → Parliament Hill).

#### Level 2 — ByWard Market (Raccoon Incident)
The Market level is set at night. The old Rideau Centre McDonald's — infamous for its wildlife incidents and eventual closure — casts a golden-arched glow on the snowy street. Key narrative elements:
- **McDonald's storefront** added to the store layout (replaces or joins the current 5 stores). Golden arches sign, boarded partial windows, lit from inside. A sign reads "RIDEAU LOCATION — CLOSED DUE TO INCIDENT".
- **Raccoon NPCs** are abundant on this level specifically. A cluster of raccoons scatters from overturned garbage bags near the McDonald's entrance when the player passes.
- The `bossIntro` banner and NPC speech bubbles reference the incident (e.g. *"Did you hear what happened at that McDonald's??"*, *"The raccoons took OVER, man"*).
- Enemy waves remain: stripper+grunt → agile+stripper → stripper+heavy+agile. Boss: **The Duo** (stripper bosses ×2) guarding the Barefax door. Strippers/slashers are still the primary enemy threat.
- The raccoon incident is **ambient flavour** for now; future mechanic idea: raccoon NPCs distract enemies briefly when startled.

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
- Enemy "Grunt" sprite sheet (8×4 grid, 1408×768px) — first sprited enemy
- Sprite-aware enemy system: `spawnEnemy`/`updateEnemy`/`killEnemy` auto-detect `def.sprite` and use animated sprites with facing, state transitions, and death anims
- Detailed pixel-art storefront rendering with windows, signs, awnings, doors
- Proportional building layout (upper floors 65% / ground floor 35%)
- `assets/SPRITE_PROMPT.md` — ready-to-use prompts for Gemini/Imagen sprite generation
- Enemy "Heavy" sprite sheet (8×4 grid, 1408×768px)
- Enemy "Agile/Slider" sprite sheet (8×4 grid) — rollerblader with mohawk
- Enemy "Stripper/Whiplash" sprite sheet (8×4 grid) — integrated with animations
- Boss "Big Earl" sprite sheet (8×4 grid, 2560×880px) — COM-repacked from Gemini output, **still broken** (unaligned carousel effect, needs regen)
- Boss "The Duo" sprite sheet (8×4 grid) — dual stripper bosses for ByWard level
- AI Sprite QA Pipeline in `assets/CLAUDE.md` — dimension check, content analysis, COM stability, repack procedures
- `/sprite-qa` skill in `.claude/skills/sprite-qa/SKILL.md` — automated QA pipeline
- `/remove-bg` skill — removes white background from Gemini-generated sprites via flood-fill
- `/update-docs` skill — syncs CLAUDE.md, MEMORY.md, and memory files with codebase state
- `spriteH` per-entity override for non-standard frame heights in scaling formula
- NPC sprites: turban, quebecois, african, lgbtq, ukrainian (4×1 grid, 116×126 per frame)
- Pickup sprites: donut, coffee, samosa, cart, bottle (48×48 single frame PNGs)
- Sprite-aware pickup system: `spawnPickup` auto-detects `def.sprite`, scales via `def.h / 48`
- Speech bubble QoL: follow characters, auto-stack to avoid overlap, proximity fade near player, suppression within 60px of player
- McDonald's storefront on ByWard level — golden arches, boarded windows, CLOSED sign, garbage bags, amber glow
- Pet system: `spawnPet()` factory wrapper, raccoon def in `NPC_DEFS` with `isPet: true`, pets skip speech bubbles
- ByWard raccoon scatter event: 4 raccoons burst from McDonald's garbage when player walks near (banner: "RACCOON INCIDENT ZONE")
- ByWard sky darkened to night setting [30,32,50]
- Playwright E2E test suite: 20 tests across smoke/constants/gameplay, `workflow_dispatch` CI via `.github/workflows/playwright.yml`

## What's Missing / TODO

### Sprites (Critical)
- **Player 2 (Priya)** sprite sheet — no sprite exists yet
- **2 enemy sprites** (crackhead, kicker) — using colored rectangles
- **3 boss sprites** (Chain Daddy, Chef, Overlord) — using colored rectangles
- **2 NPC sprites** (hijab, palestinian) — using colored rectangles
- **5 pet sprites** (squirrel, cat, dog, raccoon, raven) — no sprites yet; 4×1 walk-cycle grid, tiny frames (see `assets/CLAUDE.md` for per-animal dimensions)
- **6 pickup sprites** (fish, spice_cart, fruit_cart, flagpole, skate, statue)
- **Impact effects** (punch/kick VFX)
- See `assets/CLAUDE.md` for sprite guidelines, `assets/SPRITE_PROMPT.md` for generation prompts

### Audio
- No sound effects loaded (punch, kick, hurt, pickup)
- No music (street theme, boss themes)
- `loadSound()` stubs exist in game.js but are commented out

### Features & Polish — Idea Backlog

Priority tiers: **1** = core/blocking, **2** = important gameplay, **3** = nice-to-have, **4** = stretch/flavour

#### Tier 1 — Core / Blocking
- Player 2 (Priya) full integration testing — controls, hitboxes, co-op flow
- Death animations for enemies without sprites (currently just flash + destroy)

#### Tier 2 — Important Gameplay
- Combo system — chain punches/kicks for multiplied damage or extra hits
- Character select screen — P1/P2 pick their fighter before the game starts
- Boss intro cinematics — brief pan or banner with boss name/portrait, not just text

#### Tier 3 — Nice to Have
- **Street traffic** — cars pass through the background lane one at a time, alternating directions (left-to-right / right-to-left), at irregular intervals. Players and enemies are not affected (traffic is in the road lane, behind the action). Adds life to the scene. Different car colours/types per level. Honk SFX optional.
- Level transition animations — fade or slide between levels
- Difficulty modes — Easy / Normal / Hard toggle on title screen
- Score persistence / high score table — localStorage-backed leaderboard

#### Tier 4 — Stretch / Flavour
- **NPCs can take damage** — enemies can accidentally hit civilians during combat (stray punch/kick with AoE overlap). NPC flashes, stumbles, plays a hurt phrase (*"Hey, watch it!"*). No kill — NPCs bottom out at 1 HP and flee permanently. Optional: triggers a penalty or just adds chaos flavour.
- ~~Speech bubble overlap / readability~~ — DONE (stacking, proximity fade, suppression)
