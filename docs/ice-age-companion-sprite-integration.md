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

Until then, the LMS uses a lightweight CSS fallback so the companion feature works without broken images.

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

## Code Touchpoints

- Companion rules and local/mock persistence: `lib/companion/ice-age-companion.ts`
- Sprite atlas contract and species-to-asset map: `lib/companion/sprite-assets.ts`
- Sprite renderer: `components/companion/CompanionSprite.tsx`
- Student dashboard pet panel: `components/lms/StudentCompanionWidget.tsx`
- Single-player prototype world: `app/student/companion-world/page.tsx`
- World client: `components/companion/IceAgeWorldClient.tsx`

The service boundary is intentionally localStorage-backed for the MVP. When backend persistence is ready, keep the same `StudentCompanionProfile` shape and replace `loadCompanionProfile` / `saveCompanionProfile` with Supabase-backed reads and writes.
