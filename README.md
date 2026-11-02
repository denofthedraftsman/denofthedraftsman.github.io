# Den of the Draftsman — Open Studio, Study Log & Draftsman's Lexicon

Custom-built, high-performance static website for **Den of the Draftsman** (`denofthedraftsman.com`). Designed to document a 6-phase master curriculum in classical drawing, perspective, anatomy, ink rendering, industrial design, and precision drafting in public.

Hosted on GitHub Pages with 100% bespoke, dependency-free vanilla HTML5, CSS3, and modern JavaScript.

---

## Features

- **Open Studio Station & Hero**: Active drafting board status card showing your current book milestone (*Perspective Made Easy* by Ernest R. Norling), active exercises, and live stream callouts (Twitch, YouTube, Patreon).
- **Interactive 6-Phase Curriculum**: Fully sequenced roadmap containing all 22 books with phase badges, sequence numbers, "Why this text" rationales, and real-time phase filter buttons.
- **Study Plates & Exercise Gallery**: Responsive grid displaying your drawing plates and master studies, connected to a built-in full-screen vanilla JS lightbox with keyboard (Left/Right/Esc) and mobile swipe navigation.
- **The Draftsman's Lexicon (`dictionary.html`)**: A dedicated dictionary page featuring 40+ foundational terms across perspective, light physics, anatomy, composition/Notan, inking, markers, and precision drafting. Includes real-time instant search, category filter pills, A–Z jump bar, and drafting application notes.
- **Drafting Slate Aesthetic**: Custom dark drafting theme (`#15181b`) with blueprint grid lines, turquoise accents (`#2dd4bf`), responsive typography, and mobile-friendly bottom/top navigation bar.
- **Slide-out About Drawer**: Accessible slide-out panel with artist statement, social connections, and direct inquiry form.

---

## Site Structure

```
denofthedraftsman.github.io/
├── index.html          # Main Open Studio, Curriculum Roadmap & Study Plates
├── dictionary.html     # The Draftsman's Lexicon (Interactive Dictionary)
├── CNAME               # Custom domain (denofthedraftsman.com)
├── css/
│   └── style.css       # Bespoke responsive stylesheet & drafting theme
├── js/
│   └── app.js          # Vanilla JS: Lightbox, drawer, filters, lexicon search
├── images/
│   ├── fulls/          # High-resolution plate scans (SVG / JPG / PNG)
│   └── thumbs/         # Plate thumbnail crops
└── README.md           # Documentation & guides
```

---

## How to Add New Scanned Plates

When you complete a new study sheet or finished drawing:

1. Save your full-size image scan into `images/fulls/` (e.g. `plate-04.jpg` or `.png`).
2. Save your thumbnail crop into `images/thumbs/` (e.g. `plate-04.jpg`).
3. In `index.html`, add a `<article class="gallery-card">` entry under `#gallery-grid`:

```html
<article class="gallery-card" data-full="images/fulls/plate-04.jpg" data-title="Plate 04: Harold Speed Sight-Size Study" data-desc="Charcoal on Strathmore 500, 18x24 in. (2026).">
  <span class="gallery-plate-badge">Plate 04 // Phase 1</span>
  <img src="images/thumbs/plate-04.jpg" alt="Plate 04: Harold Speed Sight-Size Study" loading="lazy" />
  <div class="gallery-overlay">
    <h3 class="gallery-item-title">Harold Speed Sight-Size Study</h3>
    <p class="gallery-item-desc">Plumb lines, horizontal sighting levels, and contour proportions.</p>
  </div>
</article>
```

---

## How to Add New Definitions to the Lexicon

In `dictionary.html`, duplicate an `<article class="term-card">` block under `#lexicon-grid`:

```html
<article class="term-card" data-term="Your Term Name" data-category="perspective">
  <div>
    <div class="term-header">
      <h3 class="term-name">Your Term Name</h3>
      <span class="term-category-badge">Perspective &amp; Space</span>
    </div>
    <p class="term-definition">
      The theoretical definition explaining the geometric or physical principle.
    </p>
    <div class="term-drafting-note">
      <span class="term-note-label">Drafting Application</span>
      Tactile tip on how to construct or render this on the drawing board.
    </div>
  </div>
  <div class="term-footer">
    <span class="term-source">Core Text: <span>Author or Book Reference</span></span>
  </div>
</article>
```

Categories available: `perspective`, `light-value`, `composition`, `anatomy`, `inking`, `markers`, `drafting`. The real-time search, counter, and category pills will automatically recognize and index the new entry.
