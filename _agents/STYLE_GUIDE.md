# Style Guide

> Living reference for visual design, typography, and component usage.
> **Design aesthetic: Modern ASCII/terminal** — readable, accessible, professional.

---

## 1. Color Palette

### Backgrounds (dark theme — terminal)

| Token             | Tailwind Class       | Hex       | Usage                        |
|-------------------|----------------------|-----------|------------------------------|
| Surface (darkest) | `bg-[#0a0e14]`       | `#0a0e14` | Page background              |
| Surface raised    | `bg-[#111820]`       | `#111820` | Cards, sidebar, header       |
| Border / divider  | `border-[#1c2a35]`   | `#1c2a35` | Borders, ASCII box-drawing   |

### Text

| Token          | Tailwind Class    | Hex       | Usage                        |
|----------------|-------------------|-----------|------------------------------|
| Primary text   | `text-white`      | `#ffffff` | Headings                     |
| Secondary text | `text-slate-300`  | `#cbd5e1` | Body copy                    |
| Tertiary text  | `text-slate-400`  | `#94a3b8` | Labels, captions             |
| Terminal green  | `text-[#4afa82]` | `#4afa82` | Active states, links, accents|
| Terminal dim    | `text-[#2a9a52]` | `#2a9a52` | Hover states                 |
| Terminal cyan   | `text-[#22d3ee]` | `#22d3ee` | Info highlights              |

### Semantic Colors

| Intent  | Text          | Background           |
|---------|---------------|----------------------|
| Success | `#4afa82`     | `#4afa82/10`         |
| Warning | `#fbbf24`     | `yellow-900/20`      |
| Danger  | `red-400`     | `red-900/20`         |
| Info    | `#22d3ee`     | `cyan-900/20`        |

---

## 2. Typography

| Element         | Font               | Size             | Weight       | Line-height |
|-----------------|---------------------|------------------|--------------|-------------|
| `h1`            | JetBrains Mono     | 2 rem (32 px)    | 700 (bold)   | 1.2         |
| `h2`            | JetBrains Mono     | 1.625 rem (26 px)| 700 (bold)   | 1.3         |
| `h3`            | JetBrains Mono     | 1.25 rem (20 px) | 600 (semi)   | 1.4         |
| `h4`            | JetBrains Mono     | 1.125 rem (18 px)| 600 (semi)   | 1.4         |
| Body `p`        | Inter              | 1 rem (16 px)    | 400 (normal) | 1.75        |
| `.text-sm`      | Inter              | 0.9375 rem (15 px)| —           | 1.6         |
| `.text-xs`      | Inter              | 0.8125 rem (13 px)| —           | 1.5         |

**Headings:** JetBrains Mono, Fira Code, monospace  
**Body:** Inter, system-ui, sans-serif  
**Code/terminal:** JetBrains Mono, Fira Code, monospace

---

## 3. ASCII Design Elements

### Section headers (sidebar)
```
── section_name ────────────
```

### Active nav indicator
```
▸ Active Item     (green, left-border)
│ Inactive Item   (dim)
```

### Box-drawing borders (footer)
```
╔═══════════════════════════╗
║  Content area             ║
╚═══════════════════════════╝
```

### Terminal-style buttons
```jsx
<Link className="font-mono text-[#4afa82] border border-[#1c2a35] hover:border-[#4afa82]">
  $ command_name
</Link>
```

### Branding
```
[GRH] resistance_hub
      // global coordination
```

---

## 4. Component Patterns

### Cards — square corners
```jsx
<div className="bg-[#111820] border border-[#1c2a35] p-6">
  <h3 className="font-mono">Title</h3>
  <p className="text-slate-300">Body text.</p>
</div>
```

### Disclaimers

Use the `<GlobalDisclaimer>` component:

```jsx
import GlobalDisclaimer from './ui/GlobalDisclaimer';
<GlobalDisclaimer type="verify" />
```

### Source Attribution

```jsx
import SourceAttribution from './ui/SourceAttribution';
<SourceAttribution source={{ name: 'Human Rights Watch', url: '...', verified: true }} />
```

---

## 5. Accessibility

- **Focus outlines**: Terminal green ring (`:focus-visible`) — `#4afa82`
- **Skip links**: Present at the top of the page (`<SkipLinks />` in App.jsx)
- **Route announcements**: `<RouteAnnouncer />` announces page changes to screen readers
- **ARIA roles**: `role="navigation"`, `role="main"` on layout regions
- **Minimum contrast**: All text meets WCAG AA (4.5:1 ratio)
- **ASCII decorators**: All marked `aria-hidden="true"` and `select-none`
- **Chinese text in footer**: Has `sr-only` English translation for screen readers

---

## 6. Emoji Policy

| ✅ Keep                          | ❌ Remove                          |
|----------------------------------|------------------------------------|
| Status indicators (🟢🟡🔴)      | Decorative nav emojis (📊📰👥)   |
| Functional warnings (⚠️)        | Section header emojis              |
| Completion marks (✅)            | Repeated decorative emojis         |
| Campaign/urgent markers (❤️)    | Emoji used purely for aesthetics   |

Target: **≤ 30 functional emojis** site-wide.

---

## 7. Transitions & Animations

Transitions scoped to interactive elements (15ms ease):

```css
a, button, input, select, textarea, [role="button"], [tabindex] {
  transition: color 0.15s ease, background-color 0.15s ease,
              border-color 0.15s ease, box-shadow 0.15s ease;
}
```

Terminal-specific animations:
- `animate-blink` — cursor blink (1.2s step-end)
- `terminal-glow` — text-shadow glow on `[GRH]` branding
- `glow-animation` — green box-shadow pulse (2s)

---

*Last updated: February 20, 2026 (Session 55)*
