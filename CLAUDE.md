# Claude Code Instructions — Add "Services" Tab to Product Intake Framework

## Objective
Add a **Services** tab to the existing Aetna Medicaid Product Intake & Delivery Framework site.
The Services tab links to a new standalone page (`services.html`) that contains three tools:
1. HCD Services Overview (30 services across 5 phases)
2. Project Intake & Scoping template
3. Service Decision Guide

---

## Repo
`mlchiongcvs/product-intake-delivery-framework`
GitHub Pages URL: `https://mlchiongcvs.github.io/product-intake-delivery-framework/`

---

## Files provided
- `services.html` — The complete, fully self-contained Services page. **Do not modify its internal content.**

---

## Step 1 — Add `services.html` to the repo root

Place `services.html` in the **root of the repository** (same level as `index.html`).

```
/
├── index.html          ← existing
├── services.html       ← ADD THIS FILE
└── (any other existing files)
```

---

## Step 2 — Inspect `index.html`

Read `index.html` in full before making any changes. Identify:
- The navigation element (look for `<nav>`, `<ul>`, `<header>`, or tab bar elements)
- The existing tab items or nav links (look for `<a>`, `<li>`, `<button>`, or similar)
- The CSS classes used on active and inactive nav items
- Any JavaScript that handles tab switching (look for `onclick`, `addEventListener`, data attributes)
- The site's color scheme and font stack (to confirm `services.html` header violet `#7D3F98` is consistent)

---

## Step 3 — Add the "Services" nav link

In `index.html`, find the main navigation and add a **Services** link as the **last tab item**.

### Pattern A — If nav uses `<a>` anchor links (most common for GitHub Pages):
```html
<a href="services.html">Services</a>
```

### Pattern B — If nav uses `<li>` list items:
```html
<li><a href="services.html">Services</a></li>
```

### Pattern C — If nav uses buttons with JS tab switching:
```html
<button onclick="window.location.href='services.html'">Services</button>
```

**Match the exact element type, class names, and structure of the existing nav items.**
Copy the markup pattern from an existing nav item and change only the label and href/destination.

---

## Step 4 — Add "back" navigation to `services.html` (optional but recommended)

If the existing site has a consistent page header or site-wide nav bar that appears on all pages,
replicate that nav bar at the top of `services.html` **above** the `<header class="page-header">` element,
so users can navigate back to the main framework from the Services page.

Use this insertion point in `services.html`:
```html
<!-- INSERT SITE-WIDE NAV HERE if the existing site has one -->
<header class="page-header">
```

If there is no site-wide nav and the existing pages are self-contained, skip this step.

---

## Step 5 — Verify style consistency

Check `index.html` for:
- **Font import** — if the site uses a specific Google Font, `services.html` already imports `DM Sans`.
  If the existing site uses a different font, update the `<link>` import and `--font` variable in `services.html`
  to match. Do not change any other styles.
- **Favicon** — if `index.html` has a `<link rel="icon">`, add the same favicon link to `services.html`'s `<head>`.
- **Meta tags** — if `index.html` has Open Graph or other meta tags, copy them into `services.html`'s `<head>`.

---

## Step 6 — Do NOT do any of the following
- Do not modify the internal HTML, CSS, or JavaScript inside `services.html` beyond Steps 4 and 5 above.
- Do not convert `services.html` into a JS-injected tab panel inside `index.html` — it must remain a separate page.
- Do not remove or rename any existing files.
- Do not change the layout, colors, or content of any existing pages.
- Do not add any build tools, package managers, or dependencies. This is a static HTML/CSS/JS site.

---

## Step 7 — Test locally before pushing

If you can serve the files locally, verify:
- [ ] Clicking "Services" in the nav on `index.html` loads `services.html`
- [ ] All three inner tabs (Services overview, Project intake, Decision guide) switch correctly
- [ ] Phase tabs in the Services overview display the correct service cards
- [ ] The Project intake form generates a scoping summary when services are selected and "Generate" is clicked
- [ ] The Decision guide shows recommendations when all three dropdowns are selected
- [ ] The page is readable on mobile (viewport 375px+)
- [ ] No console errors

---

## Step 8 — Commit and push

```bash
git add services.html index.html
git commit -m "Add Services tab with HCD services overview, project intake, and decision guide"
git push origin main
```

GitHub Pages will rebuild automatically. Allow 1–2 minutes, then verify at:
`https://mlchiongcvs.github.io/product-intake-delivery-framework/services.html`

---

## Summary of changes
| File | Action |
|------|--------|
| `services.html` | Add to repo root (new file, do not modify content) |
| `index.html` | Add one "Services" nav link pointing to `services.html` |

That's it. Two file touches, no framework changes, no build step.
