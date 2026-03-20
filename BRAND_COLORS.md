# BizzCRM Brand Colors 🎨

## Color Palette

This document outlines the official color scheme for BizzCRM.

### Primary Colors

- **Primary Blue**: `#e7edfc` 
  - Light, soft blue for backgrounds and highlights
  - Use for: Card backgrounds, hover states, feature highlights

- **Dark Blue**: `#003174`
  - Deep, professional blue for primary actions and text
  - Use for: Buttons, headings, primary CTAs, navigation highlights

- **Accent Red**: `#c51111`
  - Bold red for important actions and alerts
  - Use for: Error states, delete actions, important notifications, brand logo accent

### Supporting Colors

- **Light Background**: `#f8faff`
  - Very light blue-tinted background
  - Use for: Page backgrounds, sections

- **Secondary Blue**: `#0052b4`
  - Brighter blue for hover states
  - Use for: Button hover, link hover, active states

- **Black**: `#000000`
  - For body text and strong contrast

- **White**: `#ffffff`
  - For backgrounds and text on dark backgrounds

## Usage Examples

### Buttons
```tsx
// Primary Button
<button className="bg-[#003174] hover:bg-[#0052b4] text-white">
  Click Me
</button>

// Secondary Button
<button className="bg-[#e7edfc] hover:bg-[#d0ddfa] text-[#003174]">
  Learn More
</button>

// Danger Button
<button className="bg-[#c51111] hover:bg-[#a00e0e] text-white">
  Delete
</button>
```

### Inputs
```tsx
<input className="border-2 border-gray-200 focus:border-[#003174] focus:ring-[#003174]" />
```

### Links
```tsx
<a className="text-[#003174] hover:text-[#0052b4]">
  Click here
</a>
```

### Headings
```tsx
<h1 className="text-[#003174] font-bold">
  Welcome to BizzCRM
</h1>
```

## Tailwind Custom Colors

These colors are also available in the Tailwind config as:
- `brand-primary` → #e7edfc
- `brand-dark` → #003174
- `brand-accent` → #c51111
- `brand-light` → #f8faff
- `brand-blue` → #0052b4

## Design Principles

1. **Consistency**: Always use these exact color codes
2. **Contrast**: Ensure text is readable (WCAG AA minimum)
3. **Hierarchy**: Use dark blue for primary actions, lighter blues for secondary
4. **Accessibility**: Maintain proper color contrast ratios
5. **Brand Identity**: Red accent sparingly for maximum impact

## Color Accessibility

All color combinations have been tested for WCAG 2.1 compliance:
- Dark Blue (#003174) on White: AAA ✓
- White on Dark Blue: AAA ✓
- Dark Blue on Light Blue (#e7edfc): AA ✓
- Red (#c51111) on White: AA ✓

---

*Last updated: February 3, 2026*
