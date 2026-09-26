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

### Disclosures — native `<details>`

Anything that shows and hides content is a `<details>` with a `<summary>`;
for a titled page section, use `DisclosureSection`. Never a React-state
button with `{open && (…)}`: without JavaScript, which is how this site tells
readers in China to browse, the button does nothing and the content is not in
the page. A native disclosure opens with no script, and find-in-page opens
the one holding a match.

```jsx
<details className="bg-[#111820] border border-[#1c2a35]">
  <summary className="flex items-center gap-3 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
    <span className="flex-1 min-w-0 font-mono text-white">Title</span>
    <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform summary-open:rotate-180" aria-hidden="true" />
  </summary>
  <div className="p-4 border-t border-[#1c2a35]">Body.</div>
</details>
```

- **A summary holds only phrasing content**, plus a heading as its direct
  child. Where you would reach for a `<div>`, use `<span className="block">`.
  The build fails otherwise (`scripts/prerender.mjs`).
- **Style the open state with `summary-open:`**, never `group-open:`, and
  don't put `group` on a `<details>`. `group-open:` matches any open
  ancestor, so every card inside an open section looked open. A test fails
  on `group-open:` anywhere in `src/`.
- **Don't cap a list inside a disclosure.** It is closed until opened, so a
  cap saves no room, and a title that says "(29)" must show 29.
- **A preview cut short in a summary lifts when opened**
  (`truncate summary-open:whitespace-normal summary-open:overflow-visible`,
  or `line-clamp-2 summary-open:line-clamp-none`), unless the body repeats
  the text. A test fails otherwise.
- **No click handler on an element that is not a control** (a `<div>`, an
  `<li>`, an SVG shape). A keyboard cannot reach it. If it reveals content,
  use a `<details>`. If it does something, use a `<button>` or a link.
- **A control that only works with JavaScript** (copy a link, "Expand all")
  renders only once JavaScript runs:
  `const scripted = useBrowserValue(() => true, false)` from
  `src/utils/ssr.ts`, then `{scripted && …}`. Search boxes and filters are
  the exception (see Filters below).
- **At 390px wide:** a row of badges gets `flex-wrap`, an icon beside text
  gets `flex-shrink-0`, and no `truncate` or `line-clamp` on text the reader
  cannot read in full some other way.

### Filters — toggle buttons in a named group

A row of buttons that narrows one list is a filter, not tabs. Tab markup
promises a panel per tab and arrow keys between them, and a screen reader
announces "tab, 1 of 6".

```jsx
<div className="flex flex-wrap gap-2" role="group" aria-label="Filter stories by category">
  {categories.map(cat => (
    <button key={cat.id} type="button" onClick={() => setActive(cat.id)} aria-pressed={active === cat.id}>
      {cat.name}
    </button>
  ))}
</div>
```

- **The group's `aria-label` says what it filters, and by what.**
- **Start on "All".** Without JavaScript the buttons do nothing, so the list
  must be complete before any click. They stay in the page anyway: the
  `<noscript>` banner names search boxes and filters, and hiding them until
  JavaScript runs would shift the page when it does.
- **No `role="tab"`, `tablist` or `tabpanel`** anywhere in `src`: to show and
  hide, use a `<details>`. A test fails on them.

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

*Last updated: September 25, 2026 (Session 281)*
