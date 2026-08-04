/* ============================================
   Stanley Kong · Portfolio v2
   Interactions & Animations
   ============================================ */

(function () {
  'use strict';

  // Mark body as JS-ready
  document.body.classList.add('js-ready');

  // ===== Custom Cursor (dot + ring) =====
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let targetX = 0, targetY = 0;
  let hovering = false;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.classList.add('is-active');
    ring.classList.add('is-active');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('is-active');
    ring.classList.remove('is-active');
  });

  function animateCursor() {
    // Dot follows tightly
    dotX += (targetX - dotX) * 0.5;
    dotY += (targetY - dotY) * 0.5;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

    // Ring follows with lag
    ringX += (targetX - ringX) * 0.15;
    ringY += (targetY - ringY) * 0.15;

    if (hovering) {
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(1.6)`;
      ring.style.borderColor = 'var(--accent)';
      dot.style.opacity = '0.5';
    } else {
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(1)`;
      ring.style.borderColor = '';
      dot.style.opacity = '';
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state on interactive elements
  document.querySelectorAll('a, button, .work-card, .filter__btn, .timeline__item').forEach(el => {
    el.addEventListener('mouseenter', () => { hovering = true; });
    el.addEventListener('mouseleave', () => { hovering = false; });
  });

  // ===== Nav scroll state =====
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ===== Reveal on scroll =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));

    // Failsafe
    setTimeout(() => {
      reveals.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 2500);
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ===== Works filter =====
  const filterButtons = document.querySelectorAll('.filter__btn');
  const workCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        workCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  // ===== Smooth anchor scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== Year =====
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Magnetic buttons =====
  document.querySelectorAll('.btn-primary, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ===== Hero parallax (subtle) =====
  const heroTitle = document.querySelector('.hero__title');
  const heroIndex = document.querySelector('.hero__index');
  if (heroTitle) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY * 0.12, 50);
      heroTitle.style.transform = `translateY(${y}px)`;
      if (heroIndex) {
        heroIndex.style.transform = `translateY(${y * 1.5}px)`;
      }
    }, { passive: true });
  }

  // ===== Active nav link on scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => navObserver.observe(s));
  }
})();