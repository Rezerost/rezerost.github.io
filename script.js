// Theme: light by default, dark only when the visitor picks it
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const syncThemeIcon = () => { themeToggle.textContent = root.dataset.theme === 'dark' ? '☀' : '☾'; };
syncThemeIcon();
themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncThemeIcon();
});

// Mosaic: duplicate each column so the scroll loops seamlessly
document.querySelectorAll('.wall-track').forEach((track) => {
  [...track.children].forEach((tile) => {
    const clone = tile.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    track.appendChild(clone);
  });
});
const wall = document.querySelector('.wall');
const wallPause = document.getElementById('wallPause');
wallPause.addEventListener('click', () => {
  const paused = wall.classList.toggle('paused');
  wallPause.setAttribute('aria-pressed', String(paused));
  wallPause.textContent = paused ? '▶ Play' : '❚❚ Pause';
});

// Project filters
const chips = document.querySelectorAll('.fchip');
const cards = document.querySelectorAll('.card');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('active', c === chip));
    const filter = chip.dataset.filter;
    cards.forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && !card.dataset.tags.split(' ').includes(filter));
    });
  });
});

// Case study dialogs
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open]');
  if (opener) {
    const dialog = document.getElementById(opener.dataset.open);
    if (dialog && !dialog.open) {
      // Live demos load only when first opened
      dialog.querySelectorAll('iframe[data-src]:not([src])').forEach((frame) => { frame.src = frame.dataset.src; });
      dialog.showModal();
      dialog.scrollTop = 0;
    }
    return;
  }
  if (event.target.closest('[data-close]')) event.target.closest('dialog')?.close();
});
document.querySelectorAll('dialog.case, dialog.try').forEach((dialog) => {
  // Clicking the dimmed backdrop closes the dialog
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

// Reveal on scroll
const revealTargets = document.querySelectorAll('.head-row, .duo-card, .card, .about-intro, .about-side, .step, .contact');
revealTargets.forEach((el) => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach((el) => revealObserver.observe(el));

// Highlight the nav link for the section in view
const navLinks = document.querySelectorAll('.links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));
