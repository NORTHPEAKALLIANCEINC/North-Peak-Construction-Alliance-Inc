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

/* El header de cristal se intensifica (más opaco/blur) al bajar y,
   además, se retira hacia arriba en cuanto el usuario baja: el
   contenido queda limpio. Vuelve cuando:
     · se regresa al tope de la página,
     · el cursor entra en la franja superior (se le va a buscar),
     · en táctil (sin cursor), al hacer scroll hacia arriba,
     · el menú móvil está abierto.
   Nunca se oculta con el menú desplegado. */
function initHeaderScrollState() {
  const nav = document.getElementById('site-nav');
  const TOP_ZONE = 24;     // por debajo de esto se considera "arriba del todo"
  const HOVER_ZONE = 90;   // franja superior que llama al header con el cursor
  const canHover = window.matchMedia('(hover: hover)').matches;

  let lastY = window.scrollY;
  let called = false;      // el cursor lo está reclamando
  let hidden = false;
  let ticking = false;

  const menuOpen = () => !!nav && nav.classList.contains('is-open');

  const setHidden = (value) => {
    if (value === hidden) return;
    hidden = value;
    document.body.classList.toggle('is-header-hidden', hidden);
  };

  const onScroll = () => {
    const y = window.scrollY;
    document.body.classList.toggle('is-scrolled', y > TOP_ZONE);

    if (y <= TOP_ZONE || called || menuOpen()) {
      setHidden(false);
    } else if (y > lastY) {
      setHidden(true);                 // baja → se retira
    } else if (!canHover) {
      setHidden(false);                // táctil: subir lo devuelve
    }

    lastY = y;
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  };

  onScroll();
  window.addEventListener('scroll', requestUpdate, { passive: true });

  if (canHover) {
    window.addEventListener('pointermove', (e) => {
      const near = e.clientY <= HOVER_ZONE;
      if (near === called) return;
      called = near;
      setHidden(!near && window.scrollY > TOP_ZONE && !menuOpen());
    }, { passive: true });
  }
}

/* Reveal por bloque al entrar en viewport, con stagger opcional
   vía data-stagger en el contenedor padre. */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  /* ═══ CORRECCIÓN IMPORTANTE ═══
     Antes, TODOS los elementos con .reveal arrancaban desplazados 30px
     hacia abajo — incluidos los que ya estaban VISIBLES al cargar la
     página. Resultado: en cada carga, todo el contenido de la pantalla
     inicial "saltaba" de abajo hacia arriba.

     Ese salto quedaba disimulado por el parpadeo blanco entre páginas;
     al añadir el fundido, quedó al descubierto.

     La regla correcta: el reveal es para lo que aparece AL HACER SCROLL.
     Lo que ya se ve al cargar debe estar, sencillamente, en su sitio.

     Aquí se marca como visible SIN animación todo lo que ya está en
     pantalla, y solo se observa lo que queda por debajo del pliegue. */
  const alturaVentana = window.innerHeight;

  targets.forEach(el => {
    const arriba = el.getBoundingClientRect().top;
    if (arriba < alturaVentana * 0.95) {
      // Ya está a la vista: se muestra en su posición final, sin mover nada.
      el.classList.add('is-visible', 'no-anim');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el, i) => {
    if (el.classList.contains('no-anim')) return;   // ya visible: nada que observar
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

/* ═══════════════════════════════════════════════════════════
   FORMULARIOS — Web3Forms
   ───────────────────────────────────────────────────────────
   Envío por fetch (sin recargar la página): el visitante ve la
   confirmación en el sitio, no en una página ajena. Si el JavaScript
   estuviera desactivado, el <form> tiene action y method, así que
   funcionaría igualmente por el método clásico. Nunca queda muerto.
═══════════════════════════════════════════════════════════ */
(function () {
  const forms = [
    { form: 'contactForm', status: 'contactStatus', btn: 'contactSubmit',
      ok: 'Thank you. Your message has been sent — we will get back to you shortly.' },
    { form: 'careersForm', status: 'careersStatus', btn: 'careersSubmit',
      ok: 'Thank you. Your application has been received — we will be in touch.' }
  ];

  forms.forEach(cfg => {
    const f = document.getElementById(cfg.form);
    if (!f) return;
    const status = document.getElementById(cfg.status);
    const btn    = document.getElementById(cfg.btn);
    const label  = btn ? btn.textContent : '';

    f.addEventListener('submit', async e => {
      e.preventDefault();

      // Aviso claro si aún no se ha puesto la clave real
      const key = f.querySelector('[name="access_key"]');
      if (!key || key.value === 'TU_ACCESS_KEY_AQUI') {
        status.textContent = 'Form not configured yet. Please email admin@northalliancegroup.ca directly.';
        status.className = 'form-status form-status--error';
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      status.textContent = '';
      status.className = 'form-status';

      try {
        const res = await fetch(f.action, {
          method: 'POST',
          body: new FormData(f),
          headers: { Accept: 'application/json' }
        });
        const data = await res.json();

        if (res.ok && data.success) {
          status.textContent = cfg.ok;
          status.className = 'form-status form-status--ok';
          f.reset();
        } else {
          /* Si el fallo viene del ARCHIVO ADJUNTO (los adjuntos son función
             de pago en Web3Forms), se reenvía la solicitud SIN el archivo y
             se le pide el CV al candidato solo AHORA, ya con sus datos a
             salvo. Nunca se le adelanta un problema nuestro en el formulario
             antes de que ocurra. */
          const file = f.querySelector('input[type="file"]');
          if (file && file.files.length) {
            const fd = new FormData(f);
            fd.delete(file.name);
            const retry = await fetch(f.action, {
              method: 'POST', body: fd, headers: { Accept: 'application/json' }
            });
            const rdata = await retry.json();
            if (retry.ok && rdata.success) {
              status.innerHTML = 'Your application has been received. We could not process the attachment — ' +
                'please send your résumé to <a href="mailto:admin@northalliancegroup.ca">admin@northalliancegroup.ca</a>.';
              status.className = 'form-status form-status--ok';
              f.reset();
              return;
            }
          }
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please email admin@northalliancegroup.ca directly.';
        status.className = 'form-status form-status--error';
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   RESPLANDOR QUE SIGUE AL CURSOR — tarjetas de servicio
   ───────────────────────────────────────────────────────────
   Publica la posición del ratón como variables CSS (--mx/--my) en la
   tarjeta bajo el cursor. El CSS las usa para centrar ahí un halo
   radial: la luz "sigue" al ratón, como si el cristal reflejara una
   fuente cercana. Es el detalle que separa una tarjeta viva de una
   plana. Se omite en dispositivos táctiles (no hay cursor) y si el
   usuario pide menos movimiento.
═══════════════════════════════════════════════════════════ */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.service-card, .trust-bar__item').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();
