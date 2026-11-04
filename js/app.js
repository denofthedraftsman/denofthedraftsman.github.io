/**
 * Den of the Draftsman — Main Interactive Application Script
 * 100% bespoke vanilla JavaScript (ES6+) — Zero external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initGalleryState();
  initLightbox();
  initContactForm();
  initCurriculumFilters();
  initLexiconSearch();
  initSmoothScroll();
});

/* ==========================================================================
   Slide-out Drawer Panel (About / Contact)
   ========================================================================== */
function initDrawer() {
  const toggleBtn = document.getElementById('drawer-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const panel = document.getElementById('drawer-panel');

  if (!toggleBtn || !panel) return;

  function openDrawer() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  }

  function closeDrawer() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (panel.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  });

  // Close when clicking outside of the drawer contents
  document.addEventListener('click', (e) => {
    if (
      panel.classList.contains('is-open') &&
      !panel.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeDrawer();
    }
  });

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Static Gallery Card Enhancement & Empty State Toggle
   ========================================================================== */
const ZOOM_ICON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z"/></svg>`;

function enhanceStaticGalleryCards(container) {
  if (!container) return;
  const cards = container.querySelectorAll('.gallery-card:not([data-enhanced="true"])');
  cards.forEach((card) => {
    card.setAttribute('data-enhanced', 'true');
    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
    if (!card.querySelector('.gallery-zoom-btn')) {
      const actions = document.createElement('div');
      actions.className = 'gallery-card-actions';
      const zoomBtn = document.createElement('button');
      zoomBtn.type = 'button';
      zoomBtn.className = 'gallery-zoom-btn';
      zoomBtn.setAttribute('aria-label', 'Open almost full-page rendering');
      zoomBtn.setAttribute('title', 'Open almost full-page rendering');
      zoomBtn.innerHTML = ZOOM_ICON_SVG;
      actions.appendChild(zoomBtn);
      card.appendChild(actions);
    }
  });
}

function initGalleryState() {
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryEmpty = document.getElementById('gallery-empty-state');
  const homeGrid = document.getElementById('home-gallery-grid');
  const homeEmpty = document.getElementById('home-gallery-empty');

  if (galleryGrid) {
    enhanceStaticGalleryCards(galleryGrid);
    const totalCount = galleryGrid.querySelectorAll('.gallery-card').length;
    if (galleryEmpty) {
      galleryEmpty.classList.toggle('is-hidden', totalCount > 0);
    }
  }

  if (homeGrid) {
    enhanceStaticGalleryCards(homeGrid);
    const homeCount = homeGrid.querySelectorAll('.gallery-card').length;
    if (homeEmpty) {
      homeEmpty.classList.toggle('is-hidden', homeCount > 0);
    }
  }
}

/* ==========================================================================
   Full-Page Vanilla Lightbox (Pop-up Full-Page Image Rendering)
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox) return;

  let currentIndex = 0;

  function getGalleryItems() {
    return Array.from(document.querySelectorAll('.gallery-card'));
  }

  function showImage(index) {
    const items = getGalleryItems();
    if (items.length === 0) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    currentIndex = index;
    const item = items[currentIndex];
    const fullSrc = item.getAttribute('data-full') || item.querySelector('img')?.src;
    const title = item.getAttribute('data-title') || item.querySelector('.gallery-item-title')?.textContent || '';
    const desc = item.getAttribute('data-desc') || item.querySelector('.gallery-item-desc')?.textContent || '';

    lightboxImg.src = fullSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    const showNav = items.length > 1;
    if (prevBtn) prevBtn.style.display = showNav ? '' : 'none';
    if (nextBtn) nextBtn.style.display = showNav ? '' : 'none';
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Event delegation for clicking a gallery card or its expand/zoom icon
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (!card) return;
    const items = getGalleryItems();
    const index = items.indexOf(card);
    if (index !== -1) {
      e.preventDefault();
      openLightbox(index);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest?.('.gallery-card');
      if (card) {
        const items = getGalleryItems();
        const index = items.indexOf(card);
        if (index !== -1) {
          e.preventDefault();
          openLightbox(index);
        }
      }
    }
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showImage(currentIndex + 1));

  // Close when clicking the dark backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Mobile touch swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      showImage(currentIndex + 1); // Swipe left -> Next
    } else if (touchEndX > touchStartX + threshold) {
      showImage(currentIndex - 1); // Swipe right -> Prev
    }
  }
}

/* ==========================================================================
   Static Contact Form Handler (Formspree or direct mailto fallback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const action = form.getAttribute('action');
    if (!action || action === '#' || action === '') {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Guest';
      const email = form.querySelector('[name="email"]')?.value || '';
      const message = form.querySelector('[name="message"]')?.value || '';
      
      const mailtoUrl = `mailto:contact@denofthedraftsman.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
      window.location.href = mailtoUrl;
    }
  });
}

/* ==========================================================================
   Curriculum Phase Filter
   ========================================================================== */
function initCurriculumFilters() {
  const filterBtns = document.querySelectorAll('.phase-filters .filter-btn');
  const phaseGroups = document.querySelectorAll('.phase-group');

  if (filterBtns.length === 0 || phaseGroups.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetPhase = btn.getAttribute('data-phase');

      phaseGroups.forEach((group) => {
        const groupPhase = group.getAttribute('data-phase');
        if (targetPhase === 'all' || targetPhase === groupPhase) {
          group.classList.remove('is-hidden');
        } else {
          group.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   Draftsman's Lexicon Search & Filter
   ========================================================================== */
function initLexiconSearch() {
  const searchInput = document.getElementById('lexicon-search');
  const clearBtn = document.getElementById('search-clear');
  const catPills = document.querySelectorAll('.cat-pill');
  const alphaBtns = document.querySelectorAll('.alpha-btn');
  const termCards = Array.from(document.querySelectorAll('.term-card'));
  const counterEl = document.getElementById('lexicon-count');
  const noResultsEl = document.getElementById('lexicon-no-results');
  const emptyStateEl = document.getElementById('lexicon-empty-state');

  if (!searchInput && termCards.length === 0) return;

  let activeCategory = 'all';
  let activeLetter = 'all';
  let searchQuery = '';

  function updateLexicon() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    termCards.forEach((card) => {
      const term = (card.getAttribute('data-term') || '').toLowerCase();
      const cat = (card.getAttribute('data-category') || '').toLowerCase();
      const def = (card.querySelector('.term-definition')?.textContent || '').toLowerCase();
      const note = (card.querySelector('.term-drafting-note')?.textContent || '').toLowerCase();
      const firstLetter = term.charAt(0).toUpperCase();

      const matchesSearch = !query || term.includes(query) || def.includes(query) || note.includes(query) || cat.includes(query);
      const matchesCategory = activeCategory === 'all' || cat === activeCategory;
      const matchesLetter = activeLetter === 'all' || firstLetter === activeLetter;

      if (matchesSearch && matchesCategory && matchesLetter) {
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    // Update Counter
    if (counterEl) {
      counterEl.textContent = `Showing ${visibleCount} of ${termCards.length} terms`;
    }

    // Toggle Empty State vs. No Search Results View
    if (emptyStateEl) {
      emptyStateEl.classList.toggle('is-hidden', termCards.length > 0);
    }

    if (noResultsEl) {
      if (termCards.length > 0 && visibleCount === 0) {
        noResultsEl.classList.add('is-visible');
      } else {
        noResultsEl.classList.remove('is-visible');
      }
    }

    // Toggle Clear button
    if (clearBtn) {
      if (searchQuery.length > 0) {
        clearBtn.classList.add('is-active');
      } else {
        clearBtn.classList.remove('is-active');
      }
    }
  }

  // Search input handler
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateLexicon();
  });

  // Clear search button handler
  clearBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchQuery = '';
      searchInput.focus();
      updateLexicon();
    }
  });

  // Category filter handlers
  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'all';
      updateLexicon();
    });
  });

  // Alphabetical jump / filter handlers
  alphaBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const letter = btn.getAttribute('data-letter') || 'all';
      if (activeLetter === letter) {
        // Toggle off if already active
        activeLetter = 'all';
        btn.classList.remove('active');
      } else {
        alphaBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeLetter = letter;
      }
      updateLexicon();
    });
  });

  // Check available letters on init to disable non-present letters
  const availableLetters = new Set();
  termCards.forEach((card) => {
    const term = (card.getAttribute('data-term') || '').trim();
    if (term.length > 0) {
      availableLetters.add(term.charAt(0).toUpperCase());
    }
  });

  alphaBtns.forEach((btn) => {
    const letter = btn.getAttribute('data-letter');
    if (letter && letter !== 'all' && !availableLetters.has(letter)) {
      btn.classList.add('disabled');
      btn.setAttribute('title', 'No terms starting with ' + letter);
    }
  });

  // Initial count display
  updateLexicon();
}

/* ==========================================================================
   Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
