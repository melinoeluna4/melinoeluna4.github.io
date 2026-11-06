# DESIGN.md: Constructivism

The look of Constructivism: a distinctive UI style. Source: design trend and product references; values are approximations.

## Principles

- Asymmetric: dynamic, off-center layouts.
- Red and black: high-contrast revolutionary palette.
- Geometric dynamism: diagonal lines and rotated shapes.
- Propaganda aesthetic: bold, direct, urgent.
- Functional: every element serves communication.

## Color

| Token            | Light     | Dark      | Use                           |
| ---------------- | --------- | --------- | ----------------------------- |
| `background`     | `#F5F5F5` | `#111111` | App background                |
| `surface`        | `#FFFFFF` | `#1A1A1A` | Cards, panels                 |
| `surface-sunken` | `#ECECEC` | `#0B0B0B` | Chips, code, quiet panels     |
| `text`           | `#1A1A1A` | `#F5F5F5` | Body text                     |
| `text-muted`     | `#555555` | `#B8B8B8` | Secondary text                |
| `accent`         | `#C40000` | `#FF5A5A` | Primary actions, links, focus |
| `on-accent`      | `#FFFFFF` | `#111111` | Text on accent                |
| `success`        | `#005EA8` | `#7CC4FF` | Completed status              |
| `danger`         | `#8A4B00` | `#FFD166` | Warnings, scattered sparingly |
| `border`         | `#D4D4D4` | `#3A3A3A` | Hairlines                     |
| `border-strong`  | `#1A1A1A` | `#F5F5F5` | Constructivist edges, focus   |

- Accent is used for primary actions, links, focus and the in-progress status; large surfaces stay neutral.
- Every token has a light and a dark value. With no stored preference the app follows `prefers-color-scheme`; the manual toggle has Light and Dark and persists the choice. `light-dark()` resolves the tokens before JavaScript runs.
- Dark is not inverted light: the background drops to near-black, surfaces get lighter as they rise, the text warms to off-white and the accent brightens so links keep contrast on dark surfaces.
- Success and danger never rely on red vs green alone: status badges include an icon and text (`✓ Completed`, `◷ In Progress`), and the roadmap prints its state.
- Contrast pairs are checked with axe in both themes; the accent text and `on-accent` values are chosen per theme, not copied.

## Typography

Fonts: system sans (`ui-sans-serif`, Helvetica Neue, Arial, Noto Sans) for UI and display; system mono for code. No third-party font requests.

| Role       | Size / line height | Weight | Use                            |
| ---------- | ------------------ | ------ | ------------------------------ |
| Display    | 44–96px / 0.92     | 900    | Hero headings                  |
| Heading    | 28–48px / 1.02     | 900    | Section titles                 |
| Subheading | 20–28px / 1.15     | 900    | Card and subsection titles     |
| Body       | 16–18px / 1.6      | 400    | Long-form text                 |
| UI         | 14px / 1.4         | 700    | Controls, inputs, card body    |
| Small      | 12px / 1.45        | 400    | Metadata, hints                |
| Micro      | 11px / 1.4         | 700    | Chips, eyebrows, status labels |

- Use consistent type scale and line height for readability.

## Spacing and layout

- 4px base; common steps 4, 8, 12, 16, 24, 32, 48 (approx.).
- Content centered with a comfortable max width (`--container-content: 78rem`) and side padding `clamp(1rem, 4vw, 3rem)`.
- A top header owns the brand, navigation, theme control and the native `<details>` mobile menu; there is no sidebar.
- The home hero is asymmetric: a 7/5 copy/art split on desktop, a single column on mobile. Cards use a responsive 1 → 2 → 3 column grid.
- Mobile first: design at 320 px and 360 px, then adapt at `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` px.
- Fluid type and spacing with `clamp()` between the smallest and largest breakpoint (body `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`).
- Content measure 60-75 characters; the post reading column is centered at `68ch`. The page never scrolls sideways at 320 px.
- 8 px grid (4 px for fine adjustments), rows 44-48 px, controls 44 px high on touch, body text 16-18 px.
- Sections separated by 24-32 px; cards with 16-24 px padding.

## Shape and elevation

- Radius: 4px for cards, 2px for controls; the Constructivist look keeps corners sharp.
- Borders: 2px strong edges around cards, buttons and code blocks; 1px hairlines for separators.
- Elevation is a hard offset shadow (`4px 4px 0`), not a soft blur; the hover state lifts to `8px 8px 0`. The dark theme uses the accent as the shadow color.
- Floating layers (mobile menu, empty panels) use a border plus the offset shadow.

## Motion

| Token            | Value     |
| ---------------- | --------- |
| duration-fast    | 100–150ms |
| duration-default | 150–250ms |
| easing           | ease-out  |

- Hover and state changes are subtle; the mobile menu opens natively without animation.
- Reduced motion: all transitions and animations collapse to 0.01ms; only the state change remains.
- There are no springs, parallax, shared-element transitions or auto-playing sequences in this build.
- Micro-interactions: link arrows shift on hover, cards lift, the theme icon swaps. All are decorative and never the only feedback.

## Components

- **Layout**: top header + main content; `<details>` mobile menu; one `<main>` per page.
- **Cards**: surface background, 2px border, hard offset shadow, hover lift on hover-capable devices.
- **Buttons**: primary (accent), secondary (surface), ghost (underlined); 44px minimum height.
- **Inputs**: labeled search and tag controls with helper text and a visible result count.
- **Feedback**: inline empty states, `aria-live` result count, status badges with icon + text.
- **Empty states**: one sentence plus a clear action (the zero-result filter links back to `/blog/`).
- Navigation collapses to a native `<details>` menu below `md`; the links work without JavaScript.
- Hover is an enhancement: every action works with touch and keyboard (`@media (hover: hover)` for hover-only styles).

## Accessibility

- Text and `text-muted` meet 4.5:1 on their surfaces; body text aims for 7:1.
- Focus visible on every interactive element with a 3px accent outline and offset.
- Keyboard navigation covers primary flows, including the skip link, nav, theme toggle, filter, tag links and post links.
- Color never alone for status; icons and labels accompany color (`✓ Completed`, `◷ In Progress`, roadmap text).
- Targets ≥ 44px on touch; the header controls and filter controls are 44px high.
- With `prefers-reduced-motion: reduce`, transitions and animations collapse to 0.01ms; no parallax, auto-playing animation or spinner moves across the screen.
- Every screen is checked with axe in light and dark themes. The palette is red/black/off-white plus labels, so status does not depend on hue; a manual color-blindness spot check remains a good release step.
- GUI: semantic HTML/native controls first, landmarks, headings in order, every control named, live regions for async updates.
- Text contrast at least 4.5:1 for normal text (AA), targets at least 44×44 px, no timing that cannot be extended, no flashing at all.
- Line height ≥ 1.5, paragraph spacing ≥ 2× font size, measure ≤ 80 characters, text resizable to 200% without loss.
- Context help for every non-obvious input; the filter explains the 100-character limit and the no-JS tag path.

## Rules for agents

- Implement tokens as CSS variables; components never hardcode colors.
- Support light and dark themes from the same tokens where applicable.
- Keep components consistent with the style's principles.
- Use the accent sparingly; keep surfaces neutral.
- Prefer subtle borders and lightness steps over shadows.
- Every new action is keyboard reachable.
- Test every screen at 320, 360, 768, 1280 and 1920 px wide and at 200% browser zoom.
- Use relative units (`rem`, `%`, `ch`) for sizes; `px` only for borders and hairlines.
- Never write a color that only exists in one theme; test every screen in both before it is done.
- Animate only `transform`, `opacity` and `filter`; measure 60 fps on a mid-range phone.
- Every animation is behind the motion preference check; test with it on.
- Never convey state only visually; every icon-only control has an accessible name.
- New colors, sizes or radii go into `@theme` first, then are used as utilities.
- No `@apply` chains to rebuild a CSS framework; components are markup. Repeated surfaces live in `@layer components` with token variables.

## Toolkit

| Design | Tailwind CSS v4 |
| Color token | `--color-<token>` variables in `@theme` in `src/styles/app.css`; `bg-background`, `text-muted`, `bg-accent`, `border-border-strong` then exist |
| Type scale | `--text-<step>` (+ `--text-<step>--line-height`) and `--font-<family>` in `@theme` |
| Spacing | `--spacing` is the base unit; use the scale (`p-4`, `gap-6`), never arbitrary `p-[13px]` |
| Radius / shadow | `--radius-card`, `--radius-control`, `--shadow-card`, `--shadow-lift` in `@theme` |
| Dark mode | `light-dark()` tokens plus `[data-theme=light]`/`[data-theme=dark]` setting `color-scheme`; the pre-paint script applies the stored value |
| Layout | flex and grid utilities; containers `max-w-content` + `mx-auto`; breakpoints `sm md lg xl` mobile first |
| Motion | `--animate-<name>` + `@keyframes` in `@theme`; `motion-safe:` / `motion-reduce:` variants; global reduced-motion override in `motion.css` |
| Components | a component = one markup pattern with its utilities in one place; repeated raw CSS classes live in `components.css` |

- Every value the design names exists as a theme variable; a class never carries a raw hex or pixel value.
- Class order is kept consistent by hand where Biome does not format Astro templates; do not add Prettier or its Tailwind plugin.
