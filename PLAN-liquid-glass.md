# Liquid Glass UI Integration Plan

## Wolf Whale LMS -- Apple-Style Glassmorphism Overhaul

**Author:** Agent Nova
**Date:** 2026-02-10
**Status:** PLAN ONLY -- Do not implement until reviewed

---

## 1. What Liquid Glass Means for This Project

"Liquid Glass" is the design language Apple introduced in 2025 with iOS 26 / macOS Tahoe.
It pushes glassmorphism beyond static frosted panels into a dynamic, living material that
responds to the content behind it. For the Wolf Whale LMS the goal is:

- **Frosted translucent surfaces** -- Sidebar, TopBar, cards, modals, and dropdowns all
  allow the background to subtly bleed through, giving the UI a sense of depth and layering.
- **Backdrop blur at varying intensities** -- Different surface types get different blur
  radii (light blur for large panels, heavier blur for floating elements like tooltips).
- **Translucent borders with inner light** -- Borders rendered in semi-transparent white
  with an `inset` box-shadow highlight along the top edge to mimic a light-catching glass rim.
- **Smooth, spring-based animations** -- Hover lifts, scale transforms, and opacity
  transitions that feel physically responsive rather than mechanical.
- **Layered depth system** -- Background blobs and gradients sit behind glass surfaces,
  making the translucency meaningful (you actually see something through the glass).
- **Respect for accessibility** -- All effects honor `prefers-reduced-motion` and maintain
  WCAG 2.1 AA contrast ratios on text over translucent backgrounds.

### Why it works here

The existing design system already has:
- `glass-panel`, `glass-card`, `glass-card-light` utility classes in `globals.css`
- `backdrop-blur` used in `components/ui/card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`,
  `tooltip.tsx`, and `toast.tsx`
- `ocean-card` class with transparent gradients and soft shadows
- Background blob utilities (`blob-ocean`, `blob-teal`, `blob-midnight`)
- An ocean/arctic color palette that naturally lends itself to translucent layering

The project is **halfway to Liquid Glass already**. The work is to unify these scattered
approaches into a cohesive, consistent system and push the effect further into the layout
shell (Sidebar, TopBar) and the 62+ pages that use `ocean-card`.

---

## 2. CSS Variables and Utilities to Add

### 2a. New CSS custom properties (add to `:root` and `.dark` in `globals.css`)

```css
:root {
  /* Liquid Glass -- Light mode surfaces */
  --glass-bg:             oklch(1 0 0 / 0.60);
  --glass-bg-elevated:    oklch(1 0 0 / 0.72);
  --glass-bg-heavy:       oklch(1 0 0 / 0.82);
  --glass-border:         oklch(1 0 0 / 0.35);
  --glass-border-subtle:  oklch(1 0 0 / 0.20);
  --glass-highlight:      oklch(1 0 0 / 0.60);
  --glass-shadow:         oklch(0 0 0 / 0.06);
  --glass-shadow-heavy:   oklch(0 0 0 / 0.12);
  --glass-blur-sm:        8px;
  --glass-blur-md:        16px;
  --glass-blur-lg:        24px;
  --glass-blur-xl:        40px;
  --glass-saturate:       180%;
}

.dark {
  /* Liquid Glass -- Dark mode surfaces */
  --glass-bg:             oklch(0.18 0.03 258 / 0.55);
  --glass-bg-elevated:    oklch(0.22 0.04 258 / 0.65);
  --glass-bg-heavy:       oklch(0.24 0.04 258 / 0.80);
  --glass-border:         oklch(1 0 0 / 0.12);
  --glass-border-subtle:  oklch(1 0 0 / 0.08);
  --glass-highlight:      oklch(1 0 0 / 0.08);
  --glass-shadow:         oklch(0 0 0 / 0.25);
  --glass-shadow-heavy:   oklch(0 0 0 / 0.40);
  --glass-blur-sm:        8px;
  --glass-blur-md:        16px;
  --glass-blur-lg:        24px;
  --glass-blur-xl:        40px;
  --glass-saturate:       200%;
}
```

### 2b. New utility classes (add to `@layer utilities` in `globals.css`)

```css
/* ============================================
   LIQUID GLASS -- Unified Surface System
   ============================================ */

/* Base liquid glass surface -- use for cards, panels */
.liquid-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow:
    0 8px 32px var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Elevated glass -- for floating elements (dropdowns, tooltips, notifications) */
.liquid-glass-elevated {
  background: var(--glass-bg-elevated);
  backdrop-filter: blur(var(--glass-blur-xl)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur-xl)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow:
    0 16px 48px var(--glass-shadow-heavy),
    0 4px 12px var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Heavy / opaque glass -- for sidebar, modals (needs higher readability) */
.liquid-glass-heavy {
  background: var(--glass-bg-heavy);
  backdrop-filter: blur(var(--glass-blur-xl)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur-xl)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow:
    0 8px 32px var(--glass-shadow-heavy),
    inset 0 1px 0 var(--glass-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Subtle glass -- for inline card sections, stat boxes inside other glass */
.liquid-glass-subtle {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur-sm));
  -webkit-backdrop-filter: blur(var(--glass-blur-sm));
  border: 1px solid var(--glass-border-subtle);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Interactive hover lift for glass cards */
.liquid-glass-hover:hover {
  transform: translateY(-3px) scale(1.005);
  box-shadow:
    0 20px 60px var(--glass-shadow-heavy),
    0 8px 24px var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight);
  border-color: oklch(1 0 0 / 0.30);
}

.dark .liquid-glass-hover:hover {
  border-color: oklch(1 0 0 / 0.18);
  box-shadow:
    0 20px 60px var(--glass-shadow-heavy),
    0 0 20px oklch(0.70 0.12 180 / 0.06),
    inset 0 1px 0 var(--glass-highlight);
}

/* Glass shimmer -- top-edge light refraction effect */
.liquid-glass-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    oklch(1 0 0 / 0.12) 0%,
    oklch(1 0 0 / 0.04) 40%,
    transparent 100%
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
}

.dark .liquid-glass-shimmer::before {
  background: linear-gradient(
    180deg,
    oklch(1 0 0 / 0.06) 0%,
    oklch(1 0 0 / 0.02) 40%,
    transparent 100%
  );
}
```

### 2c. Tailwind `@theme` extension for blur tokens (optional, if not using raw CSS)

Add to the `@theme inline` block if the team prefers Tailwind utilities:

```css
@theme inline {
  /* ... existing tokens ... */
  --blur-glass-sm: 8px;
  --blur-glass-md: 16px;
  --blur-glass-lg: 24px;
  --blur-glass-xl: 40px;
}
```

This enables `backdrop-blur-glass-lg` as a Tailwind class.

---

## 3. Components to Update

### 3a. Layout Shell -- Highest Priority

| Component | File | Current Style | Target Style |
|-----------|------|---------------|--------------|
| **Sidebar `<aside>`** | `components/layout/DashboardLayout.tsx` line 40-45 | `bg-sidebar border-r border-sidebar-border` (opaque) | `liquid-glass-heavy border-r border-sidebar-border/50` -- translucent sidebar that shows a hint of the main content behind it |
| **Sidebar inner `<div>`** | `components/layout/Sidebar.tsx` line 91 | `bg-sidebar text-sidebar-foreground` | Remove `bg-sidebar` (let the outer `<aside>` handle the glass); keep `text-sidebar-foreground` |
| **TopBar `<header>`** | `components/layout/TopBar.tsx` line 60 | `bg-background/80 backdrop-blur-sm` | `liquid-glass-heavy` or `bg-background/60 backdrop-blur-xl` -- heavier blur, more translucent |
| **Mobile overlay** | `DashboardLayout.tsx` line 33 | `bg-black/50` | `bg-black/30 backdrop-blur-sm` -- softer, frosted overlay |
| **Main content area** | `DashboardLayout.tsx` line 64 | `p-4 md:p-6 lg:p-8` (no background) | Keep as-is but add ambient background blobs behind content (see Section 6) |

### 3b. Shadcn UI Components

| Component | File | Current Pattern | Change |
|-----------|------|-----------------|--------|
| **Card (default)** | `components/ui/card.tsx` line 8 | `glass backdrop-blur-xl bg-white/70 dark:bg-slate-800/50 border border-white/30` | Replace with `liquid-glass liquid-glass-hover rounded-2xl` |
| **Card (solid)** | `components/ui/card.tsx` line 9 | Opaque `bg-white` | Keep as escape hatch for data-dense views; no change |
| **Card (fun)** | `components/ui/card.tsx` line 10 | Gradient with `backdrop-blur-lg` | Update gradient to use `liquid-glass` base with gradient overlay |
| **Dialog overlay** | `components/ui/dialog.tsx` line 23 | `backdrop-blur-sm bg-black/50` | `backdrop-blur-md bg-black/30` -- softer, more glass-like |
| **Dialog content** | `components/ui/dialog.tsx` line 41 | `glass backdrop-blur-xl bg-white/95 dark:bg-slate-900/95` | `liquid-glass-elevated rounded-2xl` -- use the unified class |
| **DropdownMenu content** | `components/ui/dropdown-menu.tsx` lines 67-68 | `glass backdrop-blur-lg bg-white/90 dark:bg-slate-900/90` | `liquid-glass-elevated rounded-xl` |
| **DropdownMenu subcontent** | `components/ui/dropdown-menu.tsx` line 49 | Same as above | `liquid-glass-elevated rounded-xl` |
| **Tooltip content** | `components/ui/tooltip.tsx` line 22 | `glass backdrop-blur-lg bg-white/90 dark:bg-slate-900/90` | `liquid-glass-elevated rounded-lg` |
| **Toast** | `components/ui/toast.tsx` line 16 | `glass backdrop-blur-lg bg-white/90 dark:bg-slate-900/90` | `liquid-glass-elevated rounded-xl` |

### 3c. Notification Panel

| Component | File | Current Pattern | Change |
|-----------|------|-----------------|--------|
| **Notification dropdown** | `components/layout/NotificationBell.tsx` line 101 | `bg-background shadow-xl border border-border rounded-xl` (opaque) | `liquid-glass-elevated rounded-2xl` |

### 3d. Ocean Card (62+ pages)

The `ocean-card` class is used across **62 files**. Rather than touching every file, the
strategy is to **update the `ocean-card` class definition in `globals.css`** so it inherits
the Liquid Glass treatment:

```css
.ocean-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow:
    0 4px 16px var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ocean-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px var(--glass-shadow-heavy),
    inset 0 1px 0 var(--glass-highlight);
  border-color: oklch(1 0 0 / 0.30);
}

.dark .ocean-card {
  /* Inherits from --glass variables in .dark scope automatically */
}

.dark .ocean-card:hover {
  box-shadow:
    0 12px 40px var(--glass-shadow-heavy),
    0 0 16px oklch(0.70 0.12 180 / 0.06),
    inset 0 1px 0 var(--glass-highlight);
}
```

This **single change propagates to all 62 pages instantly** with no per-file edits.

### 3e. Student Dashboard Specific Cards

The student dashboard (`app/student/dashboard/page.tsx`) uses inline gradient-heavy cards
for tasks, courses, and achievements. These do NOT use `ocean-card` and have their own
visual language. They should keep their colorful gradients but gain subtle glass effects:

- **Task cards** (line 584): Add `backdrop-blur-sm` to the content `<div>` and
  soften the gradient background to ~85% opacity so the blur is visible.
- **Course cards bottom section** (line 677): Change `bg-white dark:bg-gray-900` to
  `liquid-glass-subtle` so the card bottom has a glass surface.
- **Achievement cards** (line 749): Add `liquid-glass-subtle` as a base, keep the
  gradient as an overlay.
- **Quick action cards** (line 815): Add `liquid-glass-subtle` instead of the current
  color-tinted bg.

---

## 4. Specific Tailwind/CSS Patterns to Use

### Core glass pattern for any element (inline Tailwind approach)

```
Light:  backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg
Dark:   dark:bg-gray-900/55 dark:border-white/10
```

### Sidebar pattern

```
backdrop-blur-[40px] bg-sidebar/75 dark:bg-sidebar/60 border-r border-sidebar-border/50
```

### TopBar pattern

```
backdrop-blur-xl bg-background/60 border-b border-border/30
```

### Floating element pattern (dropdowns, tooltips, notifications)

```
backdrop-blur-[40px] bg-white/72 dark:bg-gray-900/65 border border-white/35 dark:border-white/12 shadow-xl
```

### Stat box inside a glass card (nested glass)

```
backdrop-blur-sm bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/8 rounded-xl
```

### Inner highlight (top-edge light)

```
shadow-[inset_0_1px_0_oklch(1_0_0/0.6)] dark:shadow-[inset_0_1px_0_oklch(1_0_0/0.08)]
```

---

## 5. Animation Additions

### 5a. New keyframes (add to `globals.css`)

```css
/* Spring-like entrance for glass panels */
@keyframes glass-slide-up {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    backdrop-filter: blur(var(--glass-blur-lg));
  }
}

/* Soft scale-in for dropdowns and tooltips */
@keyframes glass-pop-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Gentle hover glow pulse for glass cards */
@keyframes glass-glow {
  0%, 100% {
    box-shadow:
      0 8px 32px var(--glass-shadow),
      inset 0 1px 0 var(--glass-highlight);
  }
  50% {
    box-shadow:
      0 8px 32px var(--glass-shadow-heavy),
      0 0 20px oklch(0.70 0.12 180 / 0.08),
      inset 0 1px 0 var(--glass-highlight);
  }
}

/* Background blob slow drift */
@keyframes blob-drift {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -20px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 15px) scale(0.95);
  }
  75% {
    transform: translate(15px, 25px) scale(1.02);
  }
}
```

### 5b. New animation utility classes

```css
@layer utilities {
  .animate-glass-slide-up {
    animation: glass-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-glass-pop-in {
    animation: glass-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-glass-glow {
    animation: glass-glow 4s ease-in-out infinite;
  }

  .animate-blob-drift {
    animation: blob-drift 20s ease-in-out infinite;
  }
}
```

### 5c. Transition classes for interactive glass elements

```css
@layer utilities {
  /* Standard glass transition for all interactive surfaces */
  .transition-glass {
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Hover lift -- subtle translateY + scale for card interactions */
  .hover-lift:hover {
    transform: translateY(-3px) scale(1.005);
  }

  /* Active press -- feedback for buttons on glass surfaces */
  .active-press:active {
    transform: translateY(0) scale(0.98);
    transition-duration: 0.1s;
  }
}
```

### 5d. `prefers-reduced-motion` (already handled)

The existing rule at line 924-933 of `globals.css` already collapses all animations. No
additional work needed, but verify that the new keyframes respect it.

---

## 6. Phase Plan

### Phase 1: Foundation (globals.css only)

**Scope:** Add new CSS variables, utility classes, keyframes. Update `ocean-card` definition.
**Files touched:** `app/globals.css` only.
**Risk:** LOW -- purely additive, existing classes remain functional.
**Impact:** All 62 pages using `ocean-card` immediately gain Liquid Glass treatment.

Changes:
1. Add `--glass-*` variables to `:root` and `.dark`
2. Add `liquid-glass`, `liquid-glass-elevated`, `liquid-glass-heavy`, `liquid-glass-subtle`,
   `liquid-glass-hover`, `liquid-glass-shimmer` utility classes
3. Add animation keyframes and utility classes
4. Add `transition-glass`, `hover-lift`, `active-press` utilities
5. Rewrite `ocean-card` to use the new `--glass-*` variables (light AND dark)
6. Keep old `glass-panel`, `glass-card`, `glass-card-light` classes but mark them as
   deprecated with a CSS comment pointing to the new `liquid-glass-*` classes

### Phase 2: Layout Shell

**Scope:** Apply glass treatment to Sidebar, TopBar, and DashboardLayout.
**Files touched:** 3 files.
**Risk:** MEDIUM -- layout changes affect every authenticated page.
**Impact:** The entire app shell becomes glass.

Changes:
1. **`components/layout/DashboardLayout.tsx`**:
   - Sidebar `<aside>`: Replace `bg-sidebar` with `liquid-glass-heavy`; keep `border-r
     border-sidebar-border/50`
   - Mobile overlay: Change `bg-black/50` to `bg-black/30 backdrop-blur-sm`
   - Add ambient background blobs to the main content wrapper:
     ```tsx
     <div className="relative flex h-screen overflow-hidden bg-background" data-role={role}>
       {/* Ambient blobs for glass effect depth */}
       <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
         <div className="blob-ocean absolute -top-1/4 -right-1/4 h-[600px] w-[600px] animate-blob-drift opacity-40" />
         <div className="blob-teal absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] animate-blob-drift opacity-30" style={{ animationDelay: '-7s' }} />
       </div>
       {/* ... rest of layout with z-10 on content ... */}
     </div>
     ```

2. **`components/layout/Sidebar.tsx`**:
   - Remove `bg-sidebar` from the inner `<div>` (line 91)
   - Add `relative z-10` so content sits above any inherited background

3. **`components/layout/TopBar.tsx`**:
   - Line 60: Replace `bg-background/80 backdrop-blur-sm` with
     `liquid-glass-heavy border-b border-border/30`
   - Search input: Add `liquid-glass-subtle` for a glass-within-glass look

### Phase 3: Shadcn UI Components

**Scope:** Update Card, Dialog, DropdownMenu, Tooltip, Toast to use Liquid Glass classes.
**Files touched:** 5 files in `components/ui/`.
**Risk:** MEDIUM -- affects any page using these components.

Changes:
1. **`components/ui/card.tsx`**:
   - Default variant: `'liquid-glass liquid-glass-hover rounded-2xl'`
   - Fun variant: Add `liquid-glass` base with gradient overlay
   - Pet variant: Add `liquid-glass` base with gradient overlay

2. **`components/ui/dialog.tsx`**:
   - Overlay: `'backdrop-blur-md bg-black/30'`
   - Content: `'liquid-glass-elevated rounded-2xl shadow-2xl'`
   - Add `animate-glass-slide-up` to replace `data-[state=open]:animate-slide-up`

3. **`components/ui/dropdown-menu.tsx`**:
   - Content + SubContent: `'liquid-glass-elevated rounded-xl'`
   - Add `animate-glass-pop-in` entrance animation

4. **`components/ui/tooltip.tsx`**:
   - Content: `'liquid-glass-elevated rounded-lg'`

5. **`components/ui/toast.tsx`**:
   - Options: `'liquid-glass-elevated rounded-xl'`

### Phase 4: Notification Panel

**Scope:** Apply glass to the notification dropdown.
**Files touched:** 1 file.
**Risk:** LOW.

Changes:
1. **`components/layout/NotificationBell.tsx`**:
   - Line 101: Replace `bg-background shadow-xl border border-border rounded-xl` with
     `liquid-glass-elevated rounded-2xl`
   - Add `animate-glass-pop-in` for open animation
   - Individual notification items: Add `hover:bg-white/10 dark:hover:bg-white/5` for
     glass-appropriate hover state

### Phase 5: Dashboard Pages (Page-Level Polish)

**Scope:** Touch up specific dashboard pages that have custom card patterns.
**Files touched:** 4-6 dashboard page files.
**Risk:** LOW -- cosmetic changes only.

Changes:
1. **`app/student/dashboard/page.tsx`**:
   - Greeting banner (line 481): Keep gradient, add `backdrop-blur-sm` to the content
   - XP bar section (line 513): Add `liquid-glass-shimmer relative overflow-hidden`
   - Course card bottom (line 677): `bg-white dark:bg-gray-900` -> `liquid-glass-subtle`
   - Quick action cards (line 815): Add `liquid-glass-subtle` base
   - Empty states: Add subtle glass border

2. **`app/teacher/dashboard/page.tsx`**:
   - Stat boxes inside the welcome card (line 187): Add `liquid-glass-subtle` instead of
     `border border-border bg-muted/30`
   - Quick action cards (line 223): Add `liquid-glass-subtle` base
   - Course cards (line 322): Add `liquid-glass liquid-glass-hover`
   - Table headers: Add `liquid-glass-subtle` instead of `bg-muted/50`

3. **`app/admin/dashboard/page.tsx`**:
   - Stat cards (line 250-313): Already use `ocean-card`, so they get glass via Phase 1
   - Inner status rows (line 324): Replace `bg-muted/50` with `liquid-glass-subtle`
   - Table headers: `liquid-glass-subtle` instead of `bg-muted/50`
   - `DashboardCard` component (line 19-38): Already uses `ocean-card`, no change needed

4. **`app/parent/dashboard/page.tsx`**: Same pattern as admin -- uses `ocean-card`, gets
   glass treatment from Phase 1 for free. Polish inner elements as needed.

### Phase 6: Secondary Pages (Optional, Lower Priority)

**Scope:** Apply glass polish to remaining 50+ pages using `ocean-card`.
**Risk:** LOW -- most of these are already handled by Phase 1's `ocean-card` rewrite.

Most secondary pages only need attention if they have:
- Inline `bg-muted/50` or `bg-muted/30` stat boxes -> replace with `liquid-glass-subtle`
- Hard-coded `bg-white dark:bg-gray-900` sections -> replace with glass variables
- Tables with `bg-muted/50` headers -> replace with `liquid-glass-subtle`

**These can be done incrementally, page by page, as the team works on each area.**

---

## 7. Example CSS Snippets

### Sidebar Glass (DashboardLayout.tsx)

```tsx
<aside
  className={`
    fixed inset-y-0 left-0 z-50 w-64 transform
    liquid-glass-heavy border-r border-sidebar-border/50
    transition-transform duration-300 ease-in-out
    lg:relative lg:translate-x-0
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
```

### TopBar Glass (TopBar.tsx)

```tsx
<header className="flex h-16 shrink-0 items-center gap-4 liquid-glass-heavy border-b border-border/30 px-4 md:px-6">
```

### Ocean Card as Liquid Glass (globals.css rewrite)

```css
.ocean-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow:
    0 4px 16px var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ocean-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px var(--glass-shadow-heavy),
    inset 0 1px 0 var(--glass-highlight);
}
```

### Notification Panel Glass (NotificationBell.tsx)

```tsx
<div className="absolute right-0 z-50 mt-2 w-80 liquid-glass-elevated rounded-2xl animate-glass-pop-in">
```

### Ambient Background Blobs (DashboardLayout.tsx)

```tsx
{/* Behind all content -- creates the "something to see through glass" */}
<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
  <div
    className="blob-ocean absolute -top-1/4 -right-1/4 h-[600px] w-[600px] animate-blob-drift opacity-40"
  />
  <div
    className="blob-teal absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] animate-blob-drift opacity-30"
    style={{ animationDelay: '-7s' }}
  />
  <div
    className="blob-midnight absolute top-1/2 left-1/3 h-[400px] w-[400px] animate-blob-drift opacity-20"
    style={{ animationDelay: '-14s' }}
  />
</div>
```

### Glass Card Component Variant (card.tsx)

```tsx
const cardVariants = cva('rounded-2xl transition-all duration-200', {
  variants: {
    variant: {
      default: 'liquid-glass liquid-glass-hover',
      solid: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
      fun: 'liquid-glass bg-gradient-to-br from-indigo-300/20 via-purple-300/20 to-pink-300/20 dark:from-indigo-900/15 dark:via-purple-900/15 dark:to-pink-900/15 border-2 border-white/40 dark:border-slate-600/30 rounded-3xl',
      pet: 'liquid-glass relative bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-900/15 dark:to-orange-900/15 border-2 border-white/40 dark:border-slate-600/30 rounded-3xl overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
```

### Nested Glass Stats (inside a glass card)

```tsx
{/* Stat box inside an ocean-card / glass card */}
<div className="liquid-glass-subtle rounded-xl p-4 text-center">
  <BookOpen className="mx-auto mb-1 h-5 w-5 text-primary" />
  <p className="text-3xl font-bold text-primary">{courses.length}</p>
  <p className="mt-1 text-sm text-muted-foreground">Courses</p>
</div>
```

---

## 8. Important Notes and Caveats

### Performance

- `backdrop-filter: blur()` is GPU-composited and performs well on modern browsers, but
  can cause jank on low-end devices when many blurred layers overlap.
- Limit blur layers to a maximum of 3 visible at once (background blobs + sidebar glass +
  card glass). The sidebar and TopBar count as one layer since they don't overlap.
- The ambient background blobs use `filter: blur(50px)` which is applied once at paint
  time (not per-frame), so they are cheap.

### Browser Support

- `backdrop-filter` is supported in all major browsers since 2020.
- `-webkit-backdrop-filter` prefix is still needed for Safari < 18.
- Always include both prefixed and unprefixed versions.

### Accessibility

- The existing `@media (prefers-reduced-motion: reduce)` block handles animations.
- Text over glass surfaces must maintain 4.5:1 contrast ratio. The `--glass-bg-heavy`
  values are tuned to ensure this (82% opacity in light mode, 80% in dark mode).
- If contrast is ever insufficient on a specific page, fall back to `liquid-glass-heavy`
  or the `solid` card variant.

### Role-Scoped Sidebar Colors

- The `[data-role="..."]` CSS rules in `globals.css` set `--sidebar` to opaque colors.
  When the sidebar becomes glass, these colors need to be converted to semi-transparent
  equivalents. For example:
  - `--sidebar: oklch(0.96 0.02 280)` -> `--sidebar: oklch(0.96 0.02 280 / 0.70)`
- This ensures the role-specific tint shows through the glass.
- Update all 5 role blocks (student, teacher, admin/super_admin, parent) in both light
  and dark modes.

### Deprecation of Old Glass Classes

After Phase 3 is complete:
- `glass-panel`, `glass-panel-strong`, `glass-panel-ocean`, `glass-panel-light` ->
  use `liquid-glass` or `liquid-glass-heavy`
- `glass-card`, `glass-card-light` -> use `liquid-glass liquid-glass-hover`
- Do NOT delete the old classes immediately. Add deprecation comments and remove them in
  a later cleanup pass after all pages have been migrated.

---

## 9. File Summary

### Files to modify:

| Phase | File | Type of Change |
|-------|------|----------------|
| 1 | `app/globals.css` | Add variables, rewrite ocean-card, add utilities |
| 2 | `components/layout/DashboardLayout.tsx` | Glass sidebar, blobs, overlay |
| 2 | `components/layout/Sidebar.tsx` | Remove opaque bg |
| 2 | `components/layout/TopBar.tsx` | Glass header |
| 3 | `components/ui/card.tsx` | Use liquid-glass variants |
| 3 | `components/ui/dialog.tsx` | Glass overlay and content |
| 3 | `components/ui/dropdown-menu.tsx` | Glass content |
| 3 | `components/ui/tooltip.tsx` | Glass content |
| 3 | `components/ui/toast.tsx` | Glass toast |
| 4 | `components/layout/NotificationBell.tsx` | Glass dropdown |
| 5 | `app/student/dashboard/page.tsx` | Polish inner cards |
| 5 | `app/teacher/dashboard/page.tsx` | Polish inner cards |
| 5 | `app/admin/dashboard/page.tsx` | Polish inner cards |
| 5 | `app/parent/dashboard/page.tsx` | Polish inner cards |

**Total: 14 files across 5 phases.**

### Files that benefit automatically (no changes needed):

All 62 files using the `ocean-card` class get the Liquid Glass treatment from Phase 1's
CSS-only rewrite of that class. No per-file edits required.

---

## 10. Verification Checklist

After each phase, verify:

- [ ] `npm run build` passes with no errors
- [ ] Light mode: glass surfaces show subtle background bleed-through
- [ ] Dark mode: glass surfaces have the ocean-tinted frosted look
- [ ] Text remains readable (4.5:1 contrast) over all glass surfaces
- [ ] Sidebar role colors (purple, amber, blue-gray, green) tint through glass correctly
- [ ] Mobile sidebar slides in/out smoothly with glass effect
- [ ] Dropdowns, tooltips, and toasts appear with glass treatment
- [ ] `prefers-reduced-motion: reduce` disables all new animations
- [ ] No visible performance jank on scroll in Chrome, Safari, and Firefox
- [ ] Age variants (K-5, 6-8, 9-12) still apply correct border-radius and sizing over glass
