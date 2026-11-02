# Den of the Draftsman — Static Portfolio Website

Custom-built, high-performance static website designed for technical illustration, isometric drawings, and traditional drafting portfolios. Hosted on GitHub Pages with zero external frameworks, libraries, or template licenses.

---

## Features

- **100% Bespoke Code**: Authored from scratch without third-party template snippets, dependencies, or attribution requirements.
- **Drafting Slate Theme**: Deep drafting aesthetic with blueprint accents, responsive typography, and mobile-friendly layouts.
- **Fixed Navigation Bar**: Docked at the bottom on desktop and at the top on mobile. Includes your exact YouTube, Twitch, Twitter/X, Instagram, and Patreon links.
- **Under Construction Screen**: A clean status card featuring a drafting compass badge, live stream callouts, and social links while artwork is being drafted.
- **Built-in Lightbox**: Vanilla JavaScript modal supporting full-res inspection, caption details, keyboard navigation (Left/Right/Escape), and mobile touch swipe gestures.
- **Slide-out About Drawer**: Accessible panel featuring your artist statement, social connections, and an inquiry/commission form.

---

## Project Structure

```
html5up-multiverse/
├── index.html        # Main HTML5 document
├── css/
│   └── style.css     # Bespoke CSS styles & responsive layouts
├── js/
│   └── app.js        # Vanilla JS for lightbox, drawer panel, and forms
├── images/
│   ├── fulls/        # High-resolution artwork scans
│   └── thumbs/       # Cropped gallery thumbnails
└── README.md         # Documentation
```

---

## How to Add Artwork to the Gallery

When you have scanned drawings or illustrations ready to display:

1. Save your full-size image scan into `images/fulls/` (e.g. `01.jpg`).
2. Save your thumbnail crop into `images/thumbs/` (e.g. `01.jpg`).
3. In `index.html`:
   - Remove or comment out the `<section class="under-construction">` block.
   - Uncomment the `<section class="gallery-grid" id="gallery-grid">` block and add your card:

```html
<article class="gallery-card" data-full="images/fulls/01.jpg" data-title="Orthographic Assembly" data-desc="Ink on vellum, 18x24 in. (2026)">
  <img src="images/thumbs/01.jpg" alt="Orthographic Assembly" loading="lazy" />
  <div class="gallery-overlay">
    <h2 class="gallery-item-title">Orthographic Assembly</h2>
    <p class="gallery-item-desc">Ink on vellum, 18x24 in. (2026)</p>
  </div>
</article>
```

The lightbox will automatically detect each `.gallery-card`, open the full image on click, display the title and description, and enable arrow-key/swipe navigation.

---

## Publishing to GitHub Pages

1. Create a repository on [GitHub](https://github.com) named `<your-username>.github.io`.
2. In Terminal:
   ```bash
   cd /Users/home_folder/Downloads/html5up-multiverse
   git init
   git add .
   git commit -m "Initial launch: Den of the Draftsman"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings** &rarr; **Pages**, set **Source** to `Deploy from a branch` (`main` / `/ (root)`), and click **Save**.
4. Your site will be live at `https://<your-username>.github.io`.
