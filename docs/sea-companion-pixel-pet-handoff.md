# Fish Companion Pixel Pet Handoff

Date: 2026-05-10

## Goal

WolfWhale LMS uses fish-only learning companions. The starter set is intentionally small for beta so the product can polish two recognizable fish pets instead of carrying a broad mixed-animal roster.

This file is the handoff spec for artists, animation generation, and implementation work. Concept images are reference guides, not final production sprite atlases.

## Approved Roster

1. Clownfish
2. Pufferfish

No other companion species are approved for the LMS beta.

## Concept Art References

Use these as visual direction only:

```text
public/clownfish.svg
public/images/sea-companion/concepts/puffer-fish-design-bible.png
public/images/sea-companion/concepts/sea-companion-contact-sheet.png
```

If a concept sheet includes drafting shorthand such as question marks, books, bubbles, loose icons, or floating symbols, treat those as non-production artifacts. Do not include them in final sprite sheets.

## Global Visual Rules

- Original cute fish mascots, anime/manga-inspired, but not imitating any existing franchise.
- Thick black or dark navy pixel outlines, about 2-3 px at concept scale.
- Gender-neutral eyes: simple oval or dot-oval eyes only.
- No eyelashes, lipstick, bows, hair, clothing, makeup, or gender-coded accessories.
- Compact silhouettes that remain readable inside a small LMS companion widget.
- Bright aquatic palette with clean cel-shaded pixel colors.
- Hard pixel edges. No soft glow, blur, painterly rendering, or 3D clay look for final pets.
- No speech bubbles, letters, labels, props, UI panels, books, question marks, punctuation, speed lines, dust, floor shadows, or loose effect sprites.
- Sparkles are allowed only in celebration states and must touch or overlap the fish outline.
- Every pose must be transparent-sprite-ready with generous padding and no neighboring-frame overlap.

## Runtime Sprite Atlas Contract

Use the MVP companion atlas structure already planned for WolfWhale/Codex-style pets:

```text
1536 x 1872 atlas
8 columns x 9 rows
192 x 208 per cell
transparent background
unused cells fully transparent
```

Rows:

1. `idle`, 6 frames
2. `running-right`, 8 frames, adapted as swim/drift right
3. `running-left`, 8 frames, adapted as swim/drift left
4. `greeting`, 4 frames
5. `celebrating`, 5 frames with attached sparkle flash
6. `sad`, 8 frames, gentle and student-safe
7. `waiting`, 6 frames, sleepy/resting
8. `front-running`, 6 frames, adapted as forward swim
9. `review`, 6 frames, focused/studying

## Species Rules

### Clownfish

Reference: `public/clownfish.svg`

Anatomy lock:

- Exactly one fish body.
- Exactly two eyes.
- One small mouth when visible.
- Two side fins.
- One dorsal fin.
- One tail fin.
- Three clear white body stripes.
- No extra fins, extra tails, legs, horns, or stray appendages.

Animation language:

- Movement is swim, drift, bob, and tail wiggle.
- Greeting is a side-fin wave.
- Celebration sparkles attach to cheek stripe or tail fin.
- Focus is gently narrowed eyes and a still hover.

### Pufferfish

Reference: `public/images/sea-companion/concepts/puffer-fish-design-bible.png`

Anatomy lock:

- Exactly one round fish body.
- Exactly two eyes.
- One small mouth when visible.
- Two side fins.
- One tiny tail fin.
- Puff spikes must be small, evenly spaced, and attached to the body.
- No extra fins, extra tails, legs, horns, or stray appendages.

Animation language:

- Movement is float, drift, bob, and tiny fin wiggle.
- Greeting is a side-fin wave.
- Celebration sparkles attach to cheek/body edge.
- Focus is gently narrowed eyes and a still hover.

## Production Prompt Template

Use this template for each final atlas generation, replacing bracketed values:

```text
Create a transparent pixel-art sprite atlas for one original cute [CLOWNFISH OR PUFFERFISH] digital pet companion.
Style: anime/manga-inspired but original, gender-neutral, thick dark pixel outlines, compact chibi fish silhouette, bright aquatic cel-shaded pixel colors, hard pixel edges.
Use the provided concept reference as identity lock.

Atlas contract:
- 1536 x 1872
- 8 columns x 9 rows
- 192 x 208 per cell
- transparent background
- unused cells fully transparent

Rows:
1. idle, 6 frames
2. running-right / swim-drift right, 8 frames
3. running-left / swim-drift left, 8 frames
4. greeting, 4 frames
5. celebrating, 5 frames with attached sparkle flash
6. gentle sad, 8 frames
7. waiting/sleepy, 6 frames
8. front-running / forward swim, 6 frames
9. review/focused, 6 frames

Face rules:
simple gender-neutral oval eyes, no eyelashes, no lipstick, no bows, no hair, no clothing, no gender-coded makeup.

Anatomy lock:
[SPECIES ANATOMY LOCK FROM THIS DOCUMENT]

Effects:
Sparkles only in celebration, physically attached to [SPARKLE ANCHOR]. No floating icons, question marks, speech bubbles, books, UI, labels, shadows, speed lines, dust, or loose effects.
```

## Final Asset Paths

When production atlases are ready, place them here:

```text
public/images/sea-companion/sprites/clownfish.webp
public/images/sea-companion/sprites/pufferfish.webp
```

## QA Checklist

- Anatomy lock passes in every frame.
- Eyes are gender-neutral in every frame.
- No props, punctuation, text, labels, or loose icons.
- Sparkles are attached only and appear only in celebration/greeting if approved.
- No frame crosses into neighboring cells.
- Background is transparent.
- Fish remains recognizable at small widget size.
- Mood is encouraging, never punitive.
- Motion works in stationary widget mode, follow-pointer mode, mini tank mode, and future world-swimming mode.
