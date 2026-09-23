# HIM GATHA — Design System Specification

> **Aesthetic Philosophy**: "Himalayan Stone & Deodar Timber"  
> **Guiding Principle**: Calm, human, trustworthy, editorial, and culturally rooted. Never futuristic, cyberpunk, or generic SaaS.

---

## 1. Color Palette & Semantic Tokens

### Primitives
* **Sandstone Cream (Light Base)**: `#F8F5F0`
* **Birch Bark (Light Surface)**: `#F1EDE4`
* **Card Surface (Light Raised)**: `#FFFFFF`
* **Slate Obsidian (Dark Base)**: `#0E0D0B`
* **Smoked Timber (Dark Surface)**: `#181613`
* **Deodar Hearth (Dark Raised)**: `#221E19`
* **Sacred Brass Gold**: `#C59B27` (Hover: `#B0871E`)
* **Temple Crimson**: `#8E2800` (Hover: `#752200`)
* **Himalayan Cedar Pine**: `#2D4F38`
* **Devanagari Ink (Primary Text)**: `#1C1917` (Light) / `#F5F2EC` (Dark)
* **Pahari Slate (Muted Text)**: `#57534E` (Light) / `#A8A29E` (Dark) — *Enforces 4.5:1 WCAG contrast*

### Semantic Mapping
```css
:root {
  --bg-primary: #0E0D0B;
  --bg-secondary: #181613;
  --bg-card: #221E19;
  --text-primary: #F5F2EC;
  --text-secondary: #A8A29E;
  --text-muted: #78716C;
  --border-color: rgba(197, 155, 39, 0.18);
  --accent-color: #C59B27;
  --accent-crimson: #8E2800;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}

.light-mode {
  --bg-primary: #F8F5F0;
  --bg-secondary: #F1EDE4;
  --bg-card: #FFFFFF;
  --text-primary: #1C1917;
  --text-secondary: #57534E;
  --text-muted: #78716C;
  --border-color: rgba(142, 40, 0, 0.12);
  --accent-color: #8E2800;
  --accent-crimson: #752200;
}
```

---

## 2. Typography

* **Serif Headings**: `'Playfair Display', Georgia, serif` (Dignified, timeless, editorial)
* **Sans Body & Metadata**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` (Neutral, highly legible)
* **Devanagari / Hindi**: `'Nirmala UI', 'Kohinoor Devanagari', sans-serif`
* **Purged**: `'Space Grotesk'` (Deprecating all techno/futuristic references).

### Scale
* **Display / Hero**: `3rem` – `4.5rem` (48px – 72px), Leading `1.1`, Weight `700`
* **H1 (Page Title)**: `2.25rem` – `3rem` (36px – 48px), Leading `1.2`, Weight `700`
* **H2 (Section Header)**: `1.75rem` – `2.25rem` (28px – 36px), Leading `1.25`, Weight `600`
* **H3 (Card / Monograph Title)**: `1.25rem` – `1.5rem` (20px – 24px), Leading `1.3`, Weight `600`
* **Body**: `1rem` (16px), Line Height `1.6`, Weight `400`
* **Small / Label**: `0.875rem` (14px), Line Height `1.4`, Weight `500`
* **Caption / Timestamp / Metadata**: `0.75rem` (12px), Tracking `0.05em`, Weight `500`

---

## 3. Spacing, Elevation & Radius

* **Spacing Grid**: Multiples of 4px / 8px (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
* **Radius Scale**:
  * Badges & Pills: `9999px` (Full round)
  * Buttons & Form Inputs: `8px` (`rounded-lg`)
  * Content Cards & Panels: `16px` (`rounded-2xl`)
  * Avoid over-rounded `32px+` children's UI shapes.
* **Elevation**:
  * Level 1 (Card): `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`
  * Level 2 (Hover/Raised): `0 4px 12px -2px rgba(0,0,0,0.15)`
  * Level 3 (Modal/Dropdown): `0 20px 25px -5px rgba(0,0,0,0.25)`
  * Remove artificial glowing neon box-shadows.

---

## 4. Motion Guidelines

* **Fast (Buttons, Toggles, Links)**: `150ms ease-out`
* **Medium (Card Expansions, Dropdowns, Tab Switches)**: `250ms cubic-bezier(0.16, 1, 0.3, 1)`
* **Slow (Modal Open, Page Transitions)**: `350ms cubic-bezier(0.16, 1, 0.3, 1)`
* **Reduced Motion**:
  * Always respect `@media (prefers-reduced-motion: reduce)`.
  * Replace transform shifts (`translateY`) with gentle opacity fades (`opacity: 0 -> 1`).

---

## 5. Component Patterns

* **Cultural Badge**: Subtle border, 10% opacity tinted background, crisp icon, no neon glow.
* **Deity Card**: Dignified photo container (16:10 aspect ratio), subtle border, clear location metadata, primary Devanagari/English name, no hover tilt/displacement gimmicks.
* **Search Field**: Accessible label, clear leading search icon, instant clear button, keyboard shortcut hint (`Cmd/Ctrl + K`).
* **Breadcrumb**: Clean chevron separator, fully linkable parent hierarchy, schema.org BreadcrumbList metadata.
