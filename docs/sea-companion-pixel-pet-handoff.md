# Sea Companion Pixel Pet Handoff

Date: 2026-05-09

## Goal

Create six original sea-themed digital pets for WolfWhale LMS. These should feel like cute anime/manga-inspired pixel companions with thick readable outlines, strong silhouettes, and clear animation states for a Codex-style pet system.

This file is the pass-off spec for artists, animation generation, or implementation work. The concept images are reference guides, not final production sprite atlases.

## Approved Roster

1. Puffer Fish
2. Starfish
3. Seahorse
4. Manta Ray
5. Jellyfish
6. Hermit Crab

Removed from this roster: clownfish and whale shark.

## Concept Art References

Use these as visual direction only:

```text
public/images/sea-companion/concepts/puffer-fish-design-bible.png
public/images/sea-companion/concepts/starfish-design-bible.png
public/images/sea-companion/concepts/seahorse-design-bible.png
public/images/sea-companion/concepts/manta-ray-design-bible.png
public/images/sea-companion/concepts/jellyfish-design-bible.png
public/images/sea-companion/concepts/hermit-crab-design-bible.png
```

Important: if any concept sheet includes drafting shorthand such as question marks, books, bubbles, loose icons, or floating symbols, treat those as non-production artifacts. Do not include them in final sprite sheets.

## Global Visual Rules

- Original cute sea-pet mascots, anime/manga-inspired, but not imitating any existing franchise.
- Thick black or dark navy pixel outlines, about 2-3 px at concept scale.
- Gender-neutral eyes: simple oval or dot-oval eyes only.
- No eyelashes, lipstick, bows, hair, clothing, makeup, or gender-coded accessories.
- Compact silhouettes that remain readable inside a small LMS companion widget.
- Bright aquatic palette with clean cel-shaded pixel colors.
- Hard pixel edges. No soft glow, blur, painterly rendering, or 3D clay look for these final pets.
- No speech bubbles, letters, labels, props, UI panels, books, question marks, punctuation, speed lines, dust, floor shadows, or loose effect sprites.
- Sparkles are allowed only in celebration states and must touch or overlap the pet outline.
- Every pose must be transparent-sprite-ready with generous padding and no neighboring-frame overlap.

## Runtime Sprite Atlas Contract

Use the same MVP companion atlas structure already planned for WolfWhale/Codex-style pets:

```text
1536 x 1872 atlas
8 columns x 9 rows
192 x 208 per cell
transparent background
unused cells fully transparent
```

Rows:

1. `idle`, 6 frames
2. `running-right`, 8 frames, adapted as swim/drift/scuttle right
3. `running-left`, 8 frames, adapted as swim/drift/scuttle left
4. `greeting`, 4 frames
5. `celebrating`, 5 frames with attached sparkle flash
6. `sad`, 8 frames, gentle and student-safe
7. `waiting`, 6 frames, sleepy/resting
8. `front-running`, 6 frames, adapted as float/swim forward
9. `review`, 6 frames, focused/studying

## Required Angles And Poses

Each pet needs these concept poses before production atlas generation:

- Main three-quarter front idle pose
- Front angle
- Left side
- Right side
- Back
- Three-quarter left
- Three-quarter right
- Float/swim/scuttle up
- Float/swim/scuttle down
- Drift left
- Drift right
- Tiny bounce
- Hover or rest still

## Required Emotions And Actions

Each pet needs:

- Neutral idle
- Happy
- Celebrating
- Sleepy/resting
- Focused/studying
- Surprised
- Gentle sad
- Curious
- Greeting

Emotion rules:

- Idle: neutral face, soft bob, blink.
- Happy: small smile, open friendly eyes.
- Celebrating: attached sparkle flash only; no floating symbols.
- Sleepy/resting: half-closed eyes, relaxed body.
- Focused/studying: gently narrowed eyes or attentive posture; no books or UI props.
- Surprised: wider simple oval eyes, small mouth.
- Gentle sad: droopy eyes or one tiny attached tear touching the face; never punitive.
- Curious: head/body tilt or eye direction change.
- Greeting: body tilt, fin curl, claw wave, arm curl, or tentacle curl depending on anatomy.

## Species Rules

### Puffer Fish

Reference: `public/images/sea-companion/concepts/puffer-fish-design-bible.png`

Anatomy lock:

- Exactly one round body.
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

### Starfish

Reference: `public/images/sea-companion/concepts/starfish-design-bible.png`

Anatomy lock:

- Exactly one star body.
- Exactly five arms in every frame.
- Exactly two eyes.
- One small mouth when visible.
- No extra arms, missing arms, fins, legs, shell, horns, or random appendages.

Animation language:

- Movement is gentle drift, tiny bounce, and soft arm squash/stretch.
- Greeting is one arm curl.
- Celebration sparkles attach to arm tips.
- Focus is slight forward lean with calm eyes.

### Seahorse

Reference: `public/images/sea-companion/concepts/seahorse-design-bible.png`

Anatomy lock:

- Exactly one head.
- One torso.
- Exactly two eyes.
- One rounded snout.
- One small dorsal fin.
- Exactly one curled tail.
- No extra tails, extra fins, legs, arms, crowns, horns, or stray appendages.

Animation language:

- Movement is upright float, tail curl/un-curl, and dorsal fin wiggle.
- Greeting is a snout nod or gentle body bow.
- Celebration sparkles attach to tail curl or cheek edge.
- Focus is upright stillness with gently narrowed eyes.

### Manta Ray

Reference: `public/images/sea-companion/concepts/manta-ray-design-bible.png`

Anatomy lock:

- Exactly one broad body.
- Exactly two wing-like fins.
- Exactly two eyes.
- One small mouth when visible.
- Exactly one short tail.
- No extra fins, tails, legs, arms, horns, shells, or stray appendages.

Animation language:

- Movement is glide, fin flap, float up/down, and hover.
- Greeting is a fin tilt.
- Celebration sparkles attach to fin tips.
- Focus is calm hovering with narrowed eyes.

### Jellyfish

Reference: `public/images/sea-companion/concepts/jellyfish-design-bible.png`

Anatomy lock:

- Exactly one rounded bell/body.
- Exactly two eyes.
- One small mouth when visible.
- Exactly six short rounded tentacles under the bell.
- No extra arms, extra eyes, side limbs, fins, or stray appendages.

Animation language:

- Movement is bell pulse, float up/down, drift left/right, and hover.
- Greeting is one tentacle curl.
- Celebration sparkles attach to the bell edge.
- Focus is a still float with gently narrowed eyes.

### Hermit Crab

Reference: `public/images/sea-companion/concepts/hermit-crab-design-bible.png`

Anatomy lock:

- Exactly one crab body.
- Exactly two claws.
- Exactly two eye stalks with two eyes total.
- One spiral shell home.
- Small matched walking legs.
- One small mouth when visible.
- No extra claws, extra eyes, extra shells, fish fins, horns, or stray appendages.

Animation language:

- Movement is scuttle left/right, tiny bounce, shell tuck, and peek out.
- Greeting is a claw wave.
- Celebration sparkles attach to shell edge or claw tip.
- Focus is low, steady posture with gently narrowed eyes.

## Production Prompt Template

Use this template for each final atlas generation, replacing bracketed values:

```text
Create a transparent pixel-art sprite atlas for one original cute [SPECIES] digital pet companion.
Style: anime/manga-inspired but original, gender-neutral, thick dark pixel outlines, compact chibi sea-pet silhouette, bright aquatic cel-shaded pixel colors, hard pixel edges.
Use the provided concept reference as identity lock.

Atlas contract:
- 1536 x 1872
- 8 columns x 9 rows
- 192 x 208 per cell
- transparent background
- unused cells fully transparent

Rows:
1. idle, 6 frames
2. running-right / [swim-drift-scuttle] right, 8 frames
3. running-left / [swim-drift-scuttle] left, 8 frames
4. greeting, 4 frames
5. celebrating, 5 frames with attached sparkle flash
6. gentle sad, 8 frames
7. waiting/sleepy, 6 frames
8. front-running / forward float, 6 frames
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
public/images/sea-companion/sprites/puffer-fish.webp
public/images/sea-companion/sprites/starfish.webp
public/images/sea-companion/sprites/seahorse.webp
public/images/sea-companion/sprites/manta-ray.webp
public/images/sea-companion/sprites/jellyfish.webp
public/images/sea-companion/sprites/hermit-crab.webp
```

## QA Checklist

Before any sprite is marked ready:

- Anatomy lock passes in every frame.
- Eyes are gender-neutral in every frame.
- No props, punctuation, text, labels, or loose icons.
- Sparkles are attached only and appear only in celebration/greeting if approved.
- No frame crosses into neighboring cells.
- Background is transparent.
- Pet remains recognizable at small widget size.
- Mood is encouraging, never punitive.
- Motion works in stationary widget mode, follow-pointer mode, mini tank/terrarium mode, and future world-walking/swimming mode.
