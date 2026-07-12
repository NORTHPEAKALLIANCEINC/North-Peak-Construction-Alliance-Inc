/* ═══════════════════════════════════════════════
   ETEXCA — main.js
   ───────────────────────────────────────────────
   Interacción de header/nav, reveal al hacer scroll y
   comportamiento del CTA flotante.
   Todo respeta prefers-reduced-motion.
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavToggle();
  initHeaderScrollState();
  initScrollReveal();
  initFloatCta();
  initTraitFlip();
  initThemeToggle();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Año dinámico en el footer */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* Hamburguesa del header */
function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* El header de cristal se intensifica (más opaco/blur) al bajar */
function initHeaderScrollState() {
  const onScroll = () => {
    document.body.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Reveal por bloque al entrar en viewport, con stagger opcional
   vía data-stagger en el contenedor padre. */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el, i) => {
    el.style.setProperty('--i', i % 6);
    observer.observe(el);
  });
}

/* CTA flotante: en páginas con hero, aparece al salir del hero.
   En páginas sin hero (nosotros, servicios, etc.) se muestra
   directamente. Siempre se oculta en la propia página de contacto,
   donde sería redundante. */
function initFloatCta() {
  const cta = document.querySelector('.float-cta');
  if (!cta) return;

  // En la página de contacto el CTA sobra: se oculta y no se hace nada más.
  const isContactPage = /(^|\/)contacto\.html$/.test(window.location.pathname);
  if (isContactPage) {
    cta.classList.add('is-hidden');
    return;
  }

  const hero = document.querySelector('.hero');

  // Sin hero: mostrar el CTA de entrada (no hay sección que lo dispare).
  if (!hero) {
    cta.classList.remove('is-hidden');
    return;
  }

  cta.classList.add('is-hidden');

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      cta.classList.toggle('is-hidden', entry.isIntersecting);
    });
  }, { threshold: 0.05 });
  heroObserver.observe(hero);
}

/* Tarjetas de eje: toque/clic para voltear y mostrar el reverso.
   Cada tarjeta se controla de forma independiente. */
function initTraitFlip() {
  document.querySelectorAll('.trait-card').forEach(card => {
    const flip = () => card.classList.toggle('is-flipped');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });
}

/* Interruptor de modo claro / oscuro. El atributo data-theme en
   <html> ya viene aplicado por el script inline del <head> (para
   evitar parpadeo); aquí solo se sincroniza el botón con ese
   estado inicial y se conecta el clic para alternarlo, guardando
   la preferencia. El cambio de imágenes de fondo (hero/banner) ya
   no lo maneja JS: son dos <img> superpuestas por CSS que hacen
   crossfade solo con el atributo data-theme, sin depender de red. */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;
  const order = ['light', 'dark'];
  const labels = {
    light: 'Switch to dark mode',
    dark:  'Switch to light mode'
  };

  const current = () => {
    const t = root.getAttribute('data-theme');
    return order.includes(t) ? t : 'light';
  };

  const applyTheme = (theme, persist) => {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', labels[theme] || labels.light);
    if (persist) {
      try { localStorage.setItem('etexca-theme', theme); } catch (e) { /* almacenamiento no disponible */ }
    }
  };

  // Sincroniza la etiqueta con el tema que ya aplicó el script del <head>.
  applyTheme(current(), false);

  toggle.addEventListener('click', () => {
    const i = order.indexOf(current());
    applyTheme(order[(i + 1) % order.length], true);
  });
}
