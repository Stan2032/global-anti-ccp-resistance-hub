# Style Guide

> Living reference for visual design, typography, and component usage.

---

## 1. Color Palette

### Backgrounds (dark theme)

| Token             | Tailwind Class    | Hex       | Usage                        |
|-------------------|-------------------|-----------|------------------------------|
| Surface (darkest) | `bg-slate-900`    | `#0f172a` | Page background              |
| Surface raised    | `bg-slate-800`    | `#1e293b` | Cards, sidebar, header       |
| Surface hover     | `bg-slate-700`    | `#334155` | Hover states, dividers       |

### Text

| Token          | Tailwind Class    | Hex       | Usage                        |
|----------------|-------------------|-----------|------------------------------|
| Primary text   | `text-white`      | `#ffffff` | Headings                     |
| Secondary text | `text-slate-300`  | `#cbd5e1` | Body copy                    |
| Tertiary text  | `text-slate-400`  | `#94a3b8` | Labels, captions             |

### Semantic Colors

| Intent  | Tailwind Prefix | Text          | Background           |
|---------|-----------------|---------------|----------------------|
| Success | `green`         | `green-400`   | `green-900/20`       |
| Warning | `yellow`        | `yellow-400`  | `yellow-900/20`      |
| Danger  | `red`           | `red-400`     | `red-900/20`         |
| Info    | `blue`          | `blue-400`    | `blue-900/20`        |

### Status Indicators (keep emojis only for these)

| Symbol | Meaning       |
|--------|---------------|
| 🟢     | Active / Good |
| 🟡     | Caution       |
| 🔴     | Critical      |
| ⚠️     | Warning       |
| ✅     | Complete      |

---

## 2. Typography

| Element         | Size             | Weight       | Line-height |
|-----------------|------------------|--------------|-------------|
| `h1`            | 2.25 rem (36 px) | 700 (bold)   | 1.2         |
| `h2`            | 1.875 rem (30 px)| 700 (bold)   | 1.3         |
| `h3`            | 1.5 rem (24 px)  | 600 (semi)   | 1.4         |
| `h4`            | 1.25 rem (20 px) | 600 (semi)   | 1.4         |
| Body `p`        | 1 rem (16 px)    | 400 (normal) | 1.75        |
| `.text-sm`      | 0.9375 rem (15 px)| —           | 1.6         |
| `.text-xs`      | 0.8125 rem (13 px)| —           | 1.5         |

Font stack: **Inter**, system-ui, sans-serif  
Monospace: **JetBrains Mono**, monospace

---

## 3. Component Patterns

### Cards

```jsx
<div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
  <h3>Title</h3>
  <p className="text-slate-300">Body text.</p>
</div>
```

### Disclaimers

Use the `<GlobalDisclaimer>` component instead of inline disclaimer text:

```jsx
import GlobalDisclaimer from './ui/GlobalDisclaimer';

<GlobalDisclaimer type="verify" />        // "Always verify information"
<GlobalDisclaimer type="sensitive" />     // "Verify organizations before sharing"
<GlobalDisclaimer type="changing" />      // "Information may change"
<GlobalDisclaimer type="security" />      // "Take security precautions"
<GlobalDisclaimer type="verify" compact /> // Inline / compact variant
```

### Empty States

```jsx
import EmptyState from './ui/EmptyState';

<EmptyState
  icon={<AlertTriangle />}
  title="No Data Available"
  message="Could not load data. Please try again."
  action={{ label: 'Retry', onClick: refresh }}
/>
```

### Source Attribution

```jsx
import SourceAttribution from './ui/SourceAttribution';

<SourceAttribution source={{
  name: 'Human Rights Watch',
  url: 'https://www.hrw.org/report/...',
  date: '2024-12-15',
  type: 'NGO Report',
  verified: true
}} />
```

---

## 4. Accessibility

- **Focus outlines**: Blue ring shown only for keyboard navigation (`:focus-visible`)
- **Skip links**: Present at the top of the page (`<SkipLinks />` in App.jsx)
- **Route announcements**: `<RouteAnnouncer />` announces page changes to screen readers
- **ARIA roles**: `role="navigation"`, `role="main"` on layout regions
- **Minimum contrast**: All text meets WCAG AA (4.5:1 ratio)

---

## 5. Emoji Policy

| ✅ Keep                          | ❌ Remove                          |
|----------------------------------|------------------------------------|
| Status indicators (🟢🟡🔴)      | Decorative nav emojis (📊📰👥)   |
| Functional warnings (⚠️)        | Section header emojis              |
| Completion marks (✅)            | Repeated decorative emojis         |
| Campaign/urgent markers (❤️)    | Emoji used purely for aesthetics   |

Target: **≤ 30 functional emojis** site-wide.

---

## 6. Transitions & Animations

Transitions are scoped to interactive elements only (not `*`):

```css
a, button, input, select, textarea, [role="button"], [tabindex] {
  transition: color 0.2s, background-color 0.2s, border-color 0.2s,
              box-shadow 0.2s, opacity 0.2s, transform 0.2s;
}
```

Use Framer Motion for enter/exit animations on cards and modals.  
Avoid layout-triggering properties (width, height, top, left) in transitions.

---

*Last updated: February 18, 2026*
