/* ============================================================
   script.js — Portfolio interactivity
   ============================================================ */

// ── DOM References ───────────────────────────────────────────
const themeToggle   = document.getElementById('theme-toggle');
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileClose   = document.getElementById('mobile-close');
const navCvBtn      = document.getElementById('nav-cv-btn');
const heroCvBtn     = document.getElementById('hero-cv-btn');
const cvPage        = document.getElementById('cv-page');
const cvBackBtn     = document.getElementById('cv-back-btn');
const mmCv          = document.getElementById('mm-cv');
const sections      = document.querySelectorAll('.section');
const navLinks      = document.querySelectorAll('.nav-link');

// ── Theme (Dark / Light) ─────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle.textContent = saved === 'dark' ? '🌙' : '☀️';
})();

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
});

// ── Mobile Menu ───────────────────────────────────────────────
hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

mobileClose.addEventListener('click', closeMobileMenu);

mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ── Smooth Scroll for nav links ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Active Nav Link on Scroll ─────────────────────────────────
const sectionIds = ['hero', 'projects', 'skills', 'education', 'experience'];

const navMap = {
  hero:       document.getElementById('nl-home'),
  projects:   document.getElementById('nl-projects'),
  skills:     document.getElementById('nl-skills'),
  education:  document.getElementById('nl-education'),
  experience: document.getElementById('nl-experience'),
};

function updateActiveNav() {
  let current = 'hero';
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 120) current = id;
  });
  navLinks.forEach(link => link.classList.remove('active'));
  if (navMap[current]) navMap[current].classList.add('active');
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── Scroll-triggered Fade-in for sections ────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

sections.forEach(sec => observer.observe(sec));

// ── CV Page ───────────────────────────────────────────────────
function openCV() {
  cvPage.classList.add('active');
  document.body.style.overflow = 'hidden';
  cvPage.scrollTop = 0;
}

function closeCV() {
  cvPage.classList.remove('active');
  document.body.style.overflow = '';
}

navCvBtn.addEventListener('click', openCV);
heroCvBtn.addEventListener('click', openCV);
cvBackBtn.addEventListener('click', closeCV);
if (mmCv) {
  mmCv.addEventListener('click', () => {
    closeMobileMenu();
    openCV();
  });
}

// Close CV with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (cvPage.classList.contains('active')) closeCV();
    if (mobileMenu.classList.contains('open')) closeMobileMenu();
  }
});

// ── Typing Animation (Hero subtitle) ─────────────────────────
const typedEl  = document.getElementById('typed-text');
const phrases  = [
  'Computer Engineering student',
  'curious problem-solver',
  'self-taught developer',
  'GitHub explorer',
  'aspiring software engineer',
];

let phraseIdx  = 0;
let charIdx    = 0;
let isDeleting = false;
let typingTimeout;

function type() {
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      typingTimeout = setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 40 : 70;
  typingTimeout = setTimeout(type, speed);
}

type();

// ── Project card click → open GitHub ─────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  const link = card.querySelector('.project-link-btn');
  if (!link) return;
  card.addEventListener('click', () => { link.click(); });
  card.style.cursor = 'pointer';
});

// ── Subtle parallax on hero gradient on mouse move ───────────
(function heroParallax() {
  const hero = document.getElementById('hero');
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    hero.style.setProperty('--mx', `${50 + x}%`);
    hero.style.setProperty('--my', `${-10 + y}%`);
  });
})();
