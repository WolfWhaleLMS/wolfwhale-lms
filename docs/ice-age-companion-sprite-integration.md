# WolfWhale Ice Age Companion Sprite Integration

## Approved Roster

The MVP companion roster is now six creatures:

- Woolly Mammoth
- Saber-Tooth Cat / Smilodon
- Giant Ground Sloth
- Woolly Rhino
- Giant Elk / Megaloceros
- Glyptodont

Removed from the MVP: wolf, bear, dodo, and Macrauchenia.

## Reference Art

The current animation/emotion bible is saved at:

`public/images/ice-age-companion/reference/animation-bible.png`

Use it as the visual source of truth for expression language, sparkle-flash moments, and anatomy checks. It is a reference sheet, not a production atlas.

The available base creature art found from the hatch-pet runs is now copied into the LMS as static previews:

```text
public/images/ice-age-companion/base/woolly-mammoth.png
public/images/ice-age-companion/base/saber-tooth-cat.png
public/images/ice-age-companion/base/giant-ground-sloth.png
public/images/ice-age-companion/base/woolly-rhino.png
public/images/ice-age-companion/base/giant-elk.png
```

These preview files are used by `CompanionSprite` while the final transparent WebP atlases are still `planned`, including the student companion hatch selector so the creatures are visible before a pet is fully hatched. Glyptodont still needs base/final generated art before it can render from real art instead of the CSS fallback.

## Runtime Contract

Each final pet sprite must be a Codex-style atlas:

- `1536 x 1872`
- `8 columns x 9 rows`
- `192 x 208` per cell
- transparent background
- unused cells fully transparent
- hard pixel art, no soft glow or detached shadow

Rows:

1. `idle`, 6 frames
2. `running-right`, 8 frames
3. `running-left`, 8 frames
4. `greeting`, 4 frames
5. `celebrating`, 5 frames with attached sparkle-flash accents
6. `sad`, 8 frames with gentle student-safe emotion
7. `waiting`, 6 frames
8. `front-running`, 6 frames
9. `review`, 6 frames

## Emotion + Sparkle Cue Contract

The LMS now treats cute emotion cues as part of the sprite contract, not optional polish. Each animation row in `lib/companion/sprite-assets.ts` includes:

- `requiredCue`: the required visual emotion read for that row
- `effectRule`: cleanup rules so the effect stays usable as a transparent pet sprite

The important production rules:

- Every creature needs a readable cute face cue: large eyes, blush pixels, soft smile, droopy eyes, or focused eye shine depending on state.
- Every creature needs a sparkle-flash celebration row. Sparkles must be hard pixel stars attached to the pet silhouette, not loose decorations.
- Greeting can use one attached heart sparkle or cheek sparkle.
- Sad/waiting states must stay gentle and student-safe. No punishment symbols, injury marks, guilt copy, or dramatic failure effects.
- Running states should show charm through expression and pose. Avoid speed lines, dust, shadows, and motion trails.
- Review/focus states should use eyes, brow, posture, or a tiny attached sparkle. Do not add papers, UI panels, question marks, or speech bubbles.

Each species entry also includes:

- `sparkleAnchor`: where the flash effects should attach
- `emoticonCue`: the cute face/expression language for that animal
- `anatomyLock`: the audit rule that prevents duplicated trunks, extra feet, duplicate heads, duplicate antlers, and other malformed frames

## Final Asset Paths

Drop final transparent WebP atlases here:

```text
public/images/ice-age-companion/sprites/woolly-mammoth.webp
public/images/ice-age-companion/sprites/saber-tooth-cat.webp
public/images/ice-age-companion/sprites/giant-ground-sloth.webp
public/images/ice-age-companion/sprites/woolly-rhino.webp
public/images/ice-age-companion/sprites/giant-elk.webp
public/images/ice-age-companion/sprites/glyptodont.webp
```

Then change each asset status from `planned` to `ready` in:

`lib/companion/sprite-assets.ts`

Until then, the LMS uses the available static base preview art first and a lightweight CSS fallback for any species without preview art, so the companion feature works without broken images.

## Anatomy QA

Before marking a sprite atlas ready:

- Mammoth has exactly one trunk, two tusks, four legs.
- Smilodon has one head, two saber canines, four legs, short tail.
- Ground sloth has two long arms, two hind legs, no floating extra claws.
- Woolly rhino has one large front horn and one smaller rear horn only.
- Giant elk has one head, four legs, one pair of broad palmate antlers.
- Glyptodont has one head, four squat legs, one shell, one clubbed tail.
- Sparkles, blush, tears, and emoticon-like details stay attached to the pet silhouette.
- No letters, speech bubbles, thought bubbles, speed lines, dust clouds, floor shadows, or loose effect sprites.
- Check every frame of every row for duplicated body parts before changing the species status to `ready`.

## Code Touchpoints

- Companion rules and local/mock persistence: `lib/companion/ice-age-companion.ts`
- Sprite atlas contract, emotion row rules, species sparkle anchors, and anatomy locks: `lib/companion/sprite-assets.ts`
- Sprite renderer: `components/companion/CompanionSprite.tsx`
- Student dashboard pet panel: `components/lms/StudentCompanionWidget.tsx`
- Single-player prototype world: `app/student/companion-world/page.tsx`
- World client: `components/companion/IceAgeWorldClient.tsx`
- Sprite contract tests: `tests/ice-age-companion.test.ts`

Companion progress now uses authenticated Supabase persistence through `/api/companion/profile` with localStorage as a fast offline/cache fallback. The server row carries a `version` value so stale browser tabs receive a 409 conflict instead of silently overwriting newer pet progress. Keep the same `StudentCompanionProfile` shape when adding future companion features; extend the API envelope rather than storing server metadata inside the pet profile itself.
