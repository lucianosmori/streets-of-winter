# Sprite & Asset Management

## Sprite Sheet Requirements (Kaplay.js)

**Critical rule:** The sprite sheet dimensions MUST be exactly divisible by sliceX/sliceY. Non-integer frame sizes cause visible tearing (frames bleed into adjacent cells).

```
✅ 1392px / 12 cols = 116px per frame (exact)
❌ 1394px / 12 cols = 116.17px per frame (TEARING)
```

### Before adding a new sprite sheet:
1. Check dimensions: `python -c "from PIL import Image; img = Image.open('file.png'); print(img.size)"`
2. Verify clean division: `width % sliceX == 0` and `height % sliceY == 0`
3. If not clean, **repack** the sheet (see repack procedure below)

## Current Sprites

### hero_taxpayer.png (Player 1)
- **Dimensions:** 1392×756 (repacked from original 1394×755)
- **Grid:** 12 columns × 6 rows = 72 frames, each 116×126px
- **Row layout:**
  - Row 0 (frames 0-11): Idle poses
  - Row 1 (frames 12-23): Walk cycle (12 frames)
  - Row 2 (frames 24-35): Punch (cols 0-3, wider poses) + Kick (cols 4-7)
  - Row 3 (frames 36-47): Special / Audit Slam with ice effects
  - Row 4 (frames 48-59): Hurt/death — first 5 cells have overlapping content from original, clean individual frames at cols 6-11
  - Row 5 (frames 60-71): Additional animation frames (unused currently)
- **Animation config in game.js:**
  ```js
  sliceX: 12, sliceY: 6,
  anims: {
    idle:    { from: 0,  to: 0  },  // single frame
    walk:    { from: 12, to: 23 },  // 12-frame cycle
    punch:   { from: 24, to: 27 },  // 4 frames
    kick:    { from: 28, to: 31 },  // 4 frames
    special: { from: 36, to: 47 },  // 12 frames
    hurt:    { from: 54, to: 59 },  // 6 frames (row 4, cols 6-11)
  }
  ```

### grunt_art.png (Enemy: Grunt)
- **Dimensions:** 1408×768 (clean, no repack needed)
- **Grid:** 8 columns × 4 rows = 32 frames, each 176×192px
- **Row layout (verified via per-frame bounding box analysis):**
  - Row 0 (frames 0-7): Walk cycle — all standing, ~87px wide content
  - Row 1 (frames 8-15): Attack — standing, arms extend (frames widen 96→135px)
  - Row 2 (frames 16-23): Hurt (cols 0-4, standing) + Death (cols 5-7, LYING ~156px wide)
  - Row 3 (frames 24-31): Idle/patrol — all standing, ~80px wide
- **Animation config in game.js:**
  ```js
  sliceX: 8, sliceY: 4,
  anims: {
    walk:   { from: 0,  to: 7  },  // row 0
    attack: { from: 8,  to: 15 },  // row 1
    hurt:   { from: 16, to: 20 },  // row 2, standing only
    death:  { from: 21, to: 23 },  // row 2, collapse/lying
    idle:   { from: 24, to: 31 },  // row 3
  }
  ```
- **Important lesson:** Don't guess row contents from visual inspection. Use the Python bounding-box analysis script to classify frames as STANDING vs LYING (width > height × 1.3 = lying). Row order in AI-generated sheets often doesn't match intuitive expectations.

## Sprite Sheet Repack Procedure

When sprite sheets have non-uniform frame spacing or non-divisible dimensions:

1. **Analyze the grid** — find actual frame boundaries using transparency gaps:
   ```python
   from PIL import Image
   img = Image.open('sheet.png').convert('RGBA')
   # Check average alpha per column/row to find gaps
   ```

2. **Identify cell boundaries** — midpoints of transparent gaps between frames

3. **Extract and repack** — crop each cell from original positions, paste into uniform grid:
   ```python
   CELL_W = target_width // num_cols  # must be integer
   CELL_H = target_height // num_rows
   new_img = Image.new('RGBA', (num_cols * CELL_W, num_rows * CELL_H), (0,0,0,0))
   # paste each extracted cell at uniform positions
   ```

4. **Verify** the output dimensions divide cleanly

## Sprite Frame Analysis Script

Use this to verify row contents of AI-generated sprite sheets before mapping animations:

```python
from PIL import Image
img = Image.open('sheet.png').convert('RGBA')
w, h = img.size
cols, rows = 8, 4  # adjust per sheet
fw, fh = w // cols, h // rows
for r in range(rows):
    for c in range(cols):
        cell = img.crop((c*fw, r*fh, (c+1)*fw, (r+1)*fh))
        pixels = list(cell.getdata())
        vis = [(i%fw, i//fw) for i,p in enumerate(pixels) if p[3]>10]
        if len(vis) < 50: print(f'Frame {r*cols+c} (r{r}c{c}): EMPTY'); continue
        xs, ys = zip(*vis)
        cw, ch = max(xs)-min(xs)+1, max(ys)-min(ys)+1
        orient = 'LYING' if cw > ch*1.3 else 'STANDING'
        print(f'Frame {r*cols+c} (r{r}c{c}): {cw}x{ch} [{orient}]')
```

## Planned Sprites (TODO)

### Enemies (suggested 8×4 grids)
| Sprite | Type | Status |
|--------|------|--------|
| grunt_art.png | grunt | DONE |
| enemy_agile.png | agile/slider | TODO, fast low HP |
| enemy_heavy.png | heavy | Slow, tanky |
| enemy_stripper.png | stripper/whiplash | Long range |
| enemy_crackhead.png | crackhead/addict | Erratic, fast cooldown |
| enemy_kicker.png | kicker | Mid-range kick attacks |

### Bosses (suggested 10×5 grids — more frames for complex attacks)
| Sprite | Type | Level |
|--------|------|-------|
| boss_heavy.png | heavy_boss / Big Earl | Bank Street |
| boss_stripper.png | stripper_boss / The Duo (×2) | ByWard Market |
| boss_chain.png | heavy_chain / Chain Daddy | Rideau Canal |
| boss_druglord.png | drug_lord / The Chef | Curry Street |
| boss_syndicate.png | syndicate_boss / The Overlord | Parliament Hill |

### NPCs (suggested 4×1 — simple walk cycle)
turban, lgbtq, hijab, african, quebecois, ukrainian, palestinian

### Backgrounds (single images, 800×260px upper area)
bg_bankstreet, bg_byward, bg_canal, bg_currystreet, bg_parliament
(Note: GROUND_TOP is now 260, not 195)

### Effects
fx_punch.png, fx_kick.png (3-4 frame impact animations)

## Generating New Sprites

See [SPRITE_PROMPT.md](SPRITE_PROMPT.md) for ready-to-use prompts for Gemini/Imagen.
Covers all entity types with exact dimensions, style guide, and post-generation checklist.

## Audio (all TODO)
- sfx_punch.wav, sfx_kick.wav, sfx_hurt.wav, sfx_pickup.wav
- sfx_enemy_hit.wav, sfx_enemy_die.wav
- music_street.mp3 (main loop), music_boss.mp3
