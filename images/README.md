When your first illustrations are scanned:
Place high-resolution scans into images/fulls/ and cropped thumbnails into images/thumbs/.
In index.html, comment out or delete the <section class="under-construction"> block.
Uncomment the <section class="gallery-grid" id="gallery-grid"> block and add your piece:
```
<article class="gallery-card" data-full="images/fulls/01.jpg" data-title="Orthographic Assembly" data-desc="Ink on vellum, 18x24 in. (2026)">
  <img src="images/thumbs/01.jpg" alt="Orthographic Assembly" loading="lazy" />
  <div class="gallery-overlay">
    <h2 class="gallery-item-title">Orthographic Assembly</h2>
    <p class="gallery-item-desc">Ink on vellum, 18x24 in. (2026)</p>
  </div>
</article>
```
The lightbox will automatically recognize the card, open the high-res scan on click, and handle keyboard navigation.
