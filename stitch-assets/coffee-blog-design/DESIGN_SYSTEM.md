# Design System: The Editorial Muse

## Overview & Creative North Star: "The Artisanal Archive"

The goal is to move away from rigid templates and toward a premium physical magazine feel.

### Key Principles
- **Intentional Asymmetry**: Staggered image placements
- **The Rule of Three-Quarters**: Guide the eye deliberately
- **Breathing Room**: Whitespace as a luxury component

---

## Colors: Tonal Earthiness

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | #fcf9f4 | Base layer |
| `surface-container-low` | #f6f3ee | Low importance sections |
| `surface-container-lowest` | #ffffff | Interactive/elevated elements |
| `surface-container-high` | #ebe8e3 | Focus areas |
| `primary` | #361f1a | Darkest tones (roasted bean) |
| `primary-container` | #4e342e | Primary variant |
| `secondary` | #5c614d | Secondary text/actions |
| `secondary-container` | #e0e5cc | Tasting note chips |
| `on-surface` | #1c1c19 | Text on surface |
| `on-primary` | #ffffff | Text on primary |
| `on-secondary-container` | #626753 | Text on secondary-container |
| `outline-variant` | #d4c3bf | Subtle borders |

### The "No-Line" Rule
**No 1px solid borders.** Use background color shifts to define boundaries.

### The "Glass & Texture" Rule
- **Glassmorphism**: 80% opacity surface colors with 24px backdrop blur
- **Signature Texture**: Linear gradient from `primary` to `primary-container` at 135°

---

## Typography

| Role | Font | Size | Notes |
|------|------|------|-------|
| Display | Plus Jakarta Sans | 3.5rem | Hero moments, tight spacing (-0.02em) |
| Headline | Plus Jakarta Sans | 2rem | Article titles, `primary` color |
| Title | Work Sans | 1.375rem | Card headings |
| Body | Work Sans | 1rem | Line-height 1.6 |
| Label | Work Sans | - | All-caps, letter-spacing 0.05em |

---

## Elevation & Depth

- **Layering Principle**: Stack tiers (e.g., `surface-container-lowest` on `surface-container-low`)
- **Ambient Shadows**: 40px blur, 6% opacity, tint of `on-surface`
- **Ghost Border**: `outline-variant` at 15% opacity for accessibility

---

## Components

### Buttons
| Type | Style | Text |
|------|-------|------|
| Primary | Gradient fill, xl radius | `on-primary` |
| Secondary | Ghost border (20%) | `primary` |
| Tertiary | Text only, underline on hover | `secondary` |

### Cards
- Background: `surface-container-low`
- Radius: `lg` (0.5rem)
- Image radius: `md` (0.375rem)
- Padding: min 2rem (32px)
- **No divider lines**

### Input Fields
- Fill: `surface-container-lowest`
- Indicator: 2px bottom border in `outline-variant` → `primary` on focus

### Tasting Note Chip
- Shape: Pill (full roundedness)
- Background: `secondary-container`
- Text: `on-secondary-container`
- Examples: "Citrus", "Chocolate"

---

## Do's and Don'ts

### Do
- Use asymmetric grids
- Maintain tonal consistency
- Use high-resolution, warm-toned photography

### Don't
- Use pure black (use `primary`)
- Use dividers/HR tags (use 64-80px gaps)
- Over-round (stick to lg/xl for containers)
