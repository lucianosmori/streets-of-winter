# Session Notes — Calles de Alberdi

## Branch
`claude/calles-de-alberdi-game-d2TWT`

## What Was Done This Session

### Commit 1: Supabase leaderboard + Vercel config (`322c659`)
- **`js/multiplayer.js`**: Replaced stubs with real Supabase integration
  - `getSupabase()` — lazy-init Supabase client from CDN
  - `submitScore(player, score, level)` — inserts to `leaderboard` table
  - `fetchLeaderboard(limit)` — fetches top N scores sorted by score desc
  - SQL schema for `leaderboard` table included as comments
  - QR code multiplayer still a stub (Realtime channel pattern documented)
- **`vercel.json`**: Static site deploy config, 1h cache for pages, 24h for assets

### Commit 2: Score tracking, combo system, leaderboard integration (`c4a7c92`)
- **Score tracking** in `game.js`:
  - `score` variable carries over between levels via scene params
  - `SCORE_ENEMY_KILL` (100), `SCORE_BOSS_KILL` (500), `SCORE_LEVEL_CLEAR` (1000)
  - Passed to gameover/victory scenes
- **Combo system**:
  - `comboCount` increments on each hit, resets after `COMBO_WINDOW` (2s) of no hits
  - 3+ hits applies `SCORE_COMBO_MULTIPLIER` (1.5x) to kill scores
  - HUD shows "COMBO ×N" when combo >= 3
- **HUD updates** in `js/entities.js`:
  - `drawHUD()` now accepts `score` and `comboCount` params
  - Score displayed top-right, combo indicator below it
  - Enemy count shifts down when combo is active
- **Leaderboard wiring**:
  - `submitScore()` called on gameover and victory
  - Victory scene shows "Puntaje Final" and fetches top 5 ranking
  - Title screen fetches and displays "TOP SCORES" section
  - Gameover shows score in the death message

### Commit 3: package-lock.json update (`63f09ed`)
- `npm install` ran to get Playwright deps (browsers not installed in env)

## Current State

### Working
- Full game loop: title → 4 levels with waves/bosses → victory/gameover
- Score tracking across all levels with combo multiplier
- Leaderboard functions ready (need Supabase URL/key to activate)
- HUD: HP bars, wave counter, boss HP, score, combo, controls legend
- Mobile virtual gamepad, camera follow, snow particles
- All UI text in Argentine Spanish

### Supabase Setup Needed
In `js/multiplayer.js`, fill in:
```js
const SUPABASE_URL  = ""; // your project URL
const SUPABASE_ANON = ""; // your anon key
```
Then create the `leaderboard` table using the SQL in the comments.

## Remaining TODOs (from CLAUDE.md)

### High Priority
- [ ] **Sprites** — everything is colored rectangles. Need: 2 players, 3 enemy types, 4 bosses, 5 NPC types, 4 pickups
- [ ] **Audio** — no music or SFX files exist yet (`assets/music_level.mp3`, `assets/music_boss.mp3` referenced but missing)
- [ ] **Supabase config** — add real URL/anon key to multiplayer.js

### Medium Priority
- [ ] **QR code multiplayer** — Supabase Realtime channel pattern documented but not implemented
- [ ] **Character select** — two player configs exist (GAUCHO, CORDOBESA) but no selection UI
- [ ] **Level backgrounds** — storefronts are colored rects, Level 1 should show Comisaría Central

### Low Priority
- [ ] **Responsive layout** — desktop vs mobile edge cases
- [ ] **Online leaderboard UI** — currently just text, could be a proper table/overlay
- [ ] **Combo visual feedback** — could add screen shake, flash, or particle burst

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Entry point, canvas, virtual gamepad, CDN scripts |
| `game.js` | Scenes (title/game/gameover/victory), combat, waves, score |
| `js/constants.js` | All tuning values, level defs, enemy/NPC/pickup stats |
| `js/entities.js` | Factory functions, AI, HUD drawing, snow |
| `js/multiplayer.js` | Supabase leaderboard + multiplayer stubs |
| `vercel.json` | Vercel static deploy config |
| `tests/` | Playwright E2E tests (need `npx playwright install` to run) |

## Test Commands
```bash
npm install
npx playwright install
npx playwright test
```
