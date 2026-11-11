const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const header = document.querySelector('.site-header');
const filterButtons = document.querySelectorAll('.filter-button');
const serviceItems = document.querySelectorAll('.service-item');
const serviceCount = document.querySelector('#service-count');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

try {
  const savedTheme = localStorage.getItem('elite-style-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;
} catch {}

function updateThemeButton() {
  const dark = root.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#1c1b1a' : '#eeece9');
}

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('elite-style-theme', root.dataset.theme); } catch {}
  updateThemeButton();
});
updateThemeButton();

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Menu';
  nav.classList.toggle('is-open', open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
  nav.classList.remove('is-open');
}));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menu';
    nav.classList.remove('is-open');
    menuToggle.focus();
  }
});

filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  serviceItems.forEach(item => {
    item.hidden = filter !== 'all' && item.dataset.category !== filter;
  });
  const count = [...serviceItems].filter(item => !item.hidden).length;
  serviceCount.textContent = 'Showing ' + count + ' sample service' + (count === 1 ? '' : 's');
}));

if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));
} else {
  document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
}

const loader = document.querySelector('.loader');
if (!reducedMotion) window.addEventListener('load', () => window.setTimeout(() => loader.classList.add('is-done'), 220), { once: true });
else loader.remove();
if (!reducedMotion) window.setTimeout(() => loader.classList.add('is-done'), 1600);

const heroVisual = document.querySelector('[data-tilt]');
if (heroVisual && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  heroVisual.addEventListener('pointermove', event => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    heroVisual.style.setProperty('--tilt-y', (x * 2.2).toFixed(2) + 'deg');
    heroVisual.style.setProperty('--tilt-x', (-y * 1.6).toFixed(2) + 'deg');
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--tilt-y', '0deg');
    heroVisual.style.setProperty('--tilt-x', '0deg');
  });
}
