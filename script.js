// ── Scroll progress bar ───────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// ── Nav shadow on scroll ──────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── IntersectionObserver fade-up ─────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Animated counters in hero stats ──────────
function animateCount(el, target, suffix, useSpan) {
  const duration = 1400;
  const isDecimal = target % 1 !== 0;
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal
      ? (eased * target).toFixed(2)
      : Math.floor(eased * target);
    if (progress < 1) {
      el.textContent = current + suffix;
      requestAnimationFrame(step);
    } else {
      const finalNum = isDecimal ? target.toFixed(2) : target;
      el.innerHTML = useSpan ? finalNum + '<span>' + suffix + '</span>' : finalNum + suffix;
    }
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent.trim();
        const match = text.match(/^([\d.]+)([+%]?)$/);
        if (match) {
          const val = parseFloat(match[1]);
          const span = num.querySelector('span');
          const suf = span ? span.textContent : (match[2] || '');
          animateCount(num, val, suf, !!span);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Parallax on hero ──────────────────────────
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (window.scrollY < hero.offsetHeight * 1.5) {
    hero.style.backgroundPositionY = (window.scrollY * 0.35) + 'px';
  }
}, { passive: true });

// ── Mobile nav hamburger toggle ───────────────
const navToggle = document.getElementById('nav-toggle');
const navList = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => navList.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navList.classList.remove('open'));
  });
}

// ── Active nav link highlight ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--blue)' : '';
  });
}, { passive: true });
