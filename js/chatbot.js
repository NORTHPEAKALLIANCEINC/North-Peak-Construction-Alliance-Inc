/* ================================================================
   KODIAK — Motor del asistente virtual
   North Peak Construction Alliance Inc.

   QUÉ ES: un asistente 100 % local. Sin API, sin servidor, sin
   claves, sin coste. Todo lo que sabe está en js/chatbot-kb.js.

   QUÉ NO HACE (a propósito):
   · No consulta Wikipedia ni ninguna fuente externa. En el proyecto
     anterior eso provocaba respuestas enciclopédicas fuera de lugar.
     Aquí, si no lo sabe, lo dice y ofrece una persona.
   · No inventa. No estima precios. No afirma certificaciones.
   · No habla español: el sitio es inglés y su público, canadiense.
     (La estructura queda intacta por si algún día se reactiva.)

   QUÉ SÍ HACE:
   · Reconoce varias preguntas dentro de un mismo mensaje y responde
     a cada una por separado.
   · Tolera erratas, sinónimos y frases coloquiales.
   · Guía: cuando la respuesta vive en otra página, ofrece el botón
     que lleva allí, y la conversación sobrevive al cambio de página.
   · Escribe con efecto máquina, con pausas proporcionales al texto.

   INTEGRACIÓN (3 líneas por página):
     <link rel="stylesheet" href="/css/chatbot.css?v=1">
     <script src="/js/chatbot-kb.js?v=1"></script>
     <script src="/js/chatbot.js?v=1"></script>
   El widget se inyecta solo. No hay que tocar el HTML.
================================================================ */

(function () {
  'use strict';

  var DATA = window.NP_BOT_KB;
  if (!DATA || !DATA.kb) return;           // sin KB, no arranca

  var BOT     = DATA.bot;
  var STORE   = 'np-chat-history';         // sobrevive a la navegación
  var OPEN    = 'np-chat-open';

  /* ── Sinónimos: la diferencia entre "entiende" y "es un menú" ──
     El visitante no escribe como la web. Escribe como habla.        */
  var SYNONYMS = {
    price:      ['cost', 'quote', 'quotation', 'estimate', 'budget', 'rate', 'fee', 'expensive', 'charge'],
    hire:       ['contract', 'engage', 'book', 'start', 'work with', 'retain'],
    indigenous: ['aboriginal', 'first nations', 'native', 'metis', 'inuit'],
    work:       ['job', 'project', 'build', 'construction', 'site'],
    person:     ['human', 'someone', 'advisor', 'representative', 'agent', 'staff', 'manager'],
    area:       ['region', 'location', 'coverage', 'zone', 'territory', 'province', 'city'],
    company:    ['firm', 'business', 'organisation', 'organization', 'you guys']
  };

  /* Ruido que no aporta significado. Se descarta antes de puntuar. */
  var STOPWORDS = ('a an the and or but of to in on for with at by from is are was were be been ' +
    'do does did can could would should will i you we they it my your our their me us them ' +
    'this that these those what which who whom how when where why please tell give want need ' +
    'like just get got have has had about there here if so as also very really ok okay hello hi'
  ).split(' ');

  /* ════════════════════════════════════════════════════════
     1. TEXTO
  ════════════════════════════════════════════════════════ */

  /* Contracciones: la gente escribe "dont", "im", "whats". Sin esto,
     "I dont know where to start" no casaba con "i do not know…".
     Fallo real detectado en pruebas. */
  var CONTRACTIONS = [
    [/\bdont\b|\bdon't\b/g, 'do not'],
    [/\bcant\b|\bcan't\b/g, 'can not'],
    [/\bwont\b|\bwon't\b/g, 'will not'],
    [/\bim\b|\bi'm\b/g,     'i am'],
    [/\bive\b|\bi've\b/g,   'i have'],
    [/\bwhats\b|\bwhat's\b/g, 'what is'],
    [/\bhows\b|\bhow's\b/g, 'how is'],
    [/\byoure\b|\byou're\b/g, 'you are'],
    [/\bdoesnt\b|\bdoesn't\b/g, 'does not'],
    [/\bisnt\b|\bisn't\b/g, 'is not']
  ];

  function normalize(str) {
    var s = String(str || '').toLowerCase();
    CONTRACTIONS.forEach(function (c) { s = s.replace(c[0], c[1]); });
    return s
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // acentos
      .replace(/[^\w\s?]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Distancia de edición acotada: absorbe erratas ("cocnrete"). */
  function isTypo(a, b) {
    if (Math.abs(a.length - b.length) > 2) return false;
    if (a.length < 5) return false;
    var m = a.length, n = b.length, prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1,
                          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur.slice();
    }
    return prev[n] <= 1;
  }

  function keywords(text) {
    /* Fuera el '?': normalize lo conserva para detectar preguntas, pero
       aquí ensuciaba la palabra ("insured?" no casaba con "insured").
       Fallo real detectado en pruebas. */
    return normalize(text).replace(/\?/g, '').split(' ').filter(function (w) {
      /* Los números cuentan aunque sean cortos: "5" en "my 5% target"
         es justo la palabra que importa. */
      if (/\d/.test(w)) return true;
      return w.length > 2 && STOPWORDS.indexOf(w) === -1;
    });
  }

  function expand(words) {
    var out = words.slice();
    words.forEach(function (w) {
      Object.keys(SYNONYMS).forEach(function (root) {
        if (w === root || SYNONYMS[root].indexOf(w) !== -1) {
          out.push(root);
          out = out.concat(SYNONYMS[root]);
        }
      });
    });
    return out;
  }

  /* ── Multi-intención ──────────────────────────────────────
     "Do you work in Ottawa? And how do I get a quote?"
     Se parte en preguntas independientes y se responde a cada una. */
  function segment(text) {
    var parts = String(text)
      .split(/(?<=\?)\s+|\s+(?:and also|also,|and then|;)\s+/i)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 2; });

    if (parts.length <= 1) return [text];
    return parts.slice(0, 3);              // techo sensato: 3 respuestas
  }

  /* ════════════════════════════════════════════════════════
     2. BÚSQUEDA EN LA BASE DE CONOCIMIENTO
  ════════════════════════════════════════════════════════ */

  function score(entry, norm, words, expanded) {
    var s = 0;
    entry.keys.forEach(function (key) {
      var k = normalize(key);

      /* Frase completa presente: la señal más fuerte. */
      if (k.indexOf(' ') !== -1 && norm.indexOf(k) !== -1) {
        s += 10 + k.split(' ').length;
        return;
      }
      /* Palabra exacta. */
      if (words.indexOf(k) !== -1) { s += 6; return; }
      /* Sinónimo. */
      if (expanded.indexOf(k) !== -1) { s += 3; return; }
      /* Errata. */
      for (var i = 0; i < words.length; i++) {
        if (isTypo(words[i], k)) { s += 2; return; }
      }
    });
    return s;
  }

  function find(text) {
    var norm     = normalize(text);
    var words    = keywords(text);
    var expanded = expand(words);
    var best = null, bestScore = 0;

    DATA.kb.forEach(function (entry) {
      var s = score(entry, norm, words, expanded);
      if (s > bestScore) { bestScore = s; best = entry; }
    });

    /* Umbral: por debajo, preferimos admitir que no lo sabemos.
       Un bot que adivina mal hace más daño que uno que deriva. */
    return bestScore >= 5 ? best : null;
  }

  function pick(list) {
    if (!Array.isArray(list)) return list;
    return list[Math.floor(Math.random() * list.length)];
  }

  /* ════════════════════════════════════════════════════════
     3. INTERFAZ
  ════════════════════════════════════════════════════════ */

  var elChat, elMsgs, elInput, elFab, elQuick, typing = false;

  function html(text) {
    return String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<span class="np-chat__li">$1</span>')
      .replace(/\n/g, '<br>');
  }

  function build() {
    var wrap = document.createElement('div');
    wrap.className = 'np-chat-root';
    wrap.innerHTML =
      '<button class="np-chat-fab" id="npFab" aria-label="Open chat">' +
        /* Oleadas: dos anillos desfasados que salen del botón. */
        '<span class="np-chat-fab__wave"></span>' +
        '<span class="np-chat-fab__wave np-chat-fab__wave--2"></span>' +
        /* Globo de conversación: se lee como chat al instante. */
        '<svg class="np-chat-fab__ico" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' +
          '<path d="M20 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v3.2a.8.8 0 0 0 1.3.62L13.5 18H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" ' +
                'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>' +
          '<circle cx="8"  cy="10" r="1.15" fill="currentColor"/>' +
          '<circle cx="12" cy="10" r="1.15" fill="currentColor"/>' +
          '<circle cx="16" cy="10" r="1.15" fill="currentColor"/>' +
        '</svg>' +
        '<svg class="np-chat-fab__ico np-chat-fab__ico--x" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
          '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
          '<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>' +
        /* Punto rojo: hay un mensaje esperando. Desaparece al abrir. */
        '<span class="np-chat-fab__dot" id="npDot"></span>' +
      '</button>' +
      '<section class="np-chat" id="npChat" role="dialog" aria-label="' + BOT.name + ' assistant" aria-hidden="true">' +
        '<header class="np-chat__head">' +
          '<img class="np-chat__av" src="' + BOT.avatar + '" alt="" width="40" height="40">' +
          '<div class="np-chat__id">' +
            '<span class="np-chat__name">' + BOT.name + '</span>' +
            '<span class="np-chat__status"><i></i>Online</span>' +
          '</div>' +
          /* Botón de temas: abre la lista. Sustituye a la pila de
             botones que antes se amontonaba abajo. */
          '<button class="np-chat__topics" id="npTopics" aria-expanded="false" aria-label="Common questions">' +
            '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">' +
              '<line x1="4" y1="7"  x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="14" y2="17"/>' +
            '</svg>' +
            '<span>Topics</span>' +
          '</button>' +
          '<button class="np-chat__x" id="npClose" aria-label="Close chat">&times;</button>' +
          '<div class="np-chat__menu" id="npMenu" role="menu" aria-hidden="true"></div>' +
        '</header>' +
        '<div class="np-chat__msgs" id="npMsgs" role="log" aria-live="polite"></div>' +
        '<div class="np-chat__bar">' +
          '<textarea id="npInput" class="np-chat__input" rows="1" maxlength="600" ' +
            'placeholder="Ask me anything…" aria-label="Message"></textarea>' +
          '<button class="np-chat__send" id="npSend" aria-label="Send">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
            '<path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="currentColor"/></svg>' +
          '</button>' +
        '</div>' +
        '<p class="np-chat__foot">' + BOT.name + ' · ' + BOT.role + ' · automated answers</p>' +
      '</section>';
    document.body.appendChild(wrap);

    elChat  = document.getElementById('npChat');
    elMsgs  = document.getElementById('npMsgs');
    elInput = document.getElementById('npInput');
    elFab   = document.getElementById('npFab');
    elQuick = document.getElementById('npMenu');

    /* Lista de temas: filas de ancho completo, todas iguales. Nada que
       se desborde, nada que quede corto. */
    BOT.quick.forEach(function (q) {
      var b = document.createElement('button');
      b.className = 'np-chat__mi';
      b.setAttribute('role', 'menuitem');
      b.textContent = q.label;
      b.addEventListener('click', function () {
        closeMenu();
        send(q.q);
      });
      elQuick.appendChild(b);
    });

    var topics = document.getElementById('npTopics');
    topics.addEventListener('click', function (e) {
      e.stopPropagation();
      elQuick.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('click', function (e) {
      if (!elQuick.contains(e.target)) closeMenu();
    });

    elFab.addEventListener('click', toggle);
    document.getElementById('npClose').addEventListener('click', close);
    document.getElementById('npSend').addEventListener('click', function () { send(elInput.value); });

    elInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(elInput.value); }
    });
    elInput.addEventListener('input', function () {
      elInput.style.height = 'auto';
      elInput.style.height = Math.min(elInput.scrollHeight, 96) + 'px';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && elChat.classList.contains('is-open')) close();
    });
  }

  /* ── Mensajes ─────────────────────────────────────────── */

  function bubble(role) {
    var b = document.createElement('div');
    b.className = 'np-msg np-msg--' + role;
    elMsgs.appendChild(b);
    return b;
  }

  function bottom() { elMsgs.scrollTop = elMsgs.scrollHeight; }

  function addUser(text) {
    var b = bubble('user');
    b.textContent = text;
    bottom();
    save('user', text);
  }

  /* Efecto máquina de escribir. La velocidad se adapta al largo:
     un texto corto que tarda una eternidad se siente falso.        */
  function typewrite(el, text, done) {
    var out = html(text);
    var speed = out.length > 400 ? 4 : out.length > 200 ? 8 : 14;
    var i = 0;
    (function step() {
      /* Avanza saltando etiquetas completas para no romper el HTML. */
      if (out[i] === '<') { i = out.indexOf('>', i) + 1; }
      else { i++; }
      el.innerHTML = out.slice(0, i);
      bottom();
      if (i < out.length) { setTimeout(step, speed); }
      else if (done) { done(); }
    })();
  }

  function addBot(text, entry, animate) {
    var b = bubble('bot');
    var render = function () {
      if (entry && entry.nav) {
        var a = document.createElement('a');
        a.className = 'np-chat__nav';
        a.href = entry.nav.href;
        a.textContent = entry.nav.label + ' →';
        b.appendChild(a);
      }
      if (entry && entry.contactCard) b.appendChild(contactCard());
      bottom();
    };
    if (animate === false) { b.innerHTML = html(text); render(); }
    else { typewrite(b, text, render); }
    save('bot', text, entry);
  }

  /* Iconos SVG, NO emojis. Un emoji en la web de una constructora que
     licita con organismos públicos abarata todo lo demás. */
  var ICO = {
    phone: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail:  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
    wa:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.5.1.2 1.7 2.6 4.2 3.7 1.4.6 2 .6 2.7.5.4 0 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1z"/></svg>'
  };

  function contactCard() {
    var c = document.createElement('div');
    c.className = 'np-chat__card';
    c.innerHTML =
      '<a href="' + BOT.contact.phoneHref + '">' + ICO.phone + '<span>' + BOT.contact.phone + '</span></a>' +
      '<a href="mailto:' + BOT.contact.email + '">' + ICO.mail + '<span>' + BOT.contact.email + '</span></a>' +
      '<a href="' + BOT.contact.whatsapp + '" target="_blank" rel="noopener">' + ICO.wa + '<span>WhatsApp</span></a>';
    return c;
  }

  function showTyping() {
    if (typing) return;
    typing = true;
    var b = bubble('bot');
    b.id = 'npTyping';
    b.className += ' np-msg--typing';
    b.innerHTML = '<i></i><i></i><i></i>';
    bottom();
  }

  function hideTyping() {
    var t = document.getElementById('npTyping');
    if (t) t.remove();
    typing = false;
  }

  /* ── Historial: la conversación sobrevive al cambio de página ── */

  function save(role, text, entry) {
    try {
      var h = JSON.parse(sessionStorage.getItem(STORE) || '[]');
      h.push({ r: role, t: text, nav: entry && entry.nav, card: entry && entry.contactCard });
      sessionStorage.setItem(STORE, JSON.stringify(h.slice(-30)));
    } catch (e) { /* sin almacenamiento: se pierde, no se rompe */ }
  }

  function restore() {
    var h = [];
    try { h = JSON.parse(sessionStorage.getItem(STORE) || '[]'); } catch (e) {}
    /* Sin historial NO se pinta nada. El saludo se escribe cuando el
       visitante abre el chat, con sus puntos de "escribiendo" — así se
       siente que alguien te está atendiendo, no un cartel ya puesto. */
    if (!h.length) return;
    h.forEach(function (m) {
      if (m.r === 'user') { var b = bubble('user'); b.textContent = m.t; }
      else addBot(m.t, { nav: m.nav, contactCard: m.card }, false);
    });
    /* Se repintó el historial: no hay que volver a guardarlo. */
    try { sessionStorage.setItem(STORE, JSON.stringify(h)); } catch (e) {}
    bottom();
  }

  /* ── Envío ────────────────────────────────────────────── */

  function send(raw) {
    var text = String(raw || '').trim();
    if (!text || typing) return;

    addUser(text);
    elInput.value = '';
    elInput.style.height = 'auto';

    var parts = segment(text);
    var i = 0;

    (function next() {
      if (i >= parts.length) return;
      var part  = parts[i++];
      var entry = find(part);
      var answer, e;

      if (entry) {
        answer = pick(entry.answer);
        e = entry;
      } else {
        answer = pick(BOT.fallback);
        e = { contactCard: true, nav: { label: 'Contact page', href: BOT.contact.page } };
      }

      showTyping();
      /* Pausa proporcional: leer una pregunta lleva un momento. */
      setTimeout(function () {
        hideTyping();
        addBot(answer, e, true);
        setTimeout(next, 500);
      }, 450 + Math.min(part.length * 8, 700));
    })();
  }

  /* ── Menú de temas ────────────────────────────────────── */

  function openMenu() {
    elQuick.classList.add('is-open');
    elQuick.setAttribute('aria-hidden', 'false');
    document.getElementById('npTopics').setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    elQuick.classList.remove('is-open');
    elQuick.setAttribute('aria-hidden', 'true');
    var t = document.getElementById('npTopics');
    if (t) t.setAttribute('aria-expanded', 'false');
  }

  /* ── Abrir / cerrar ───────────────────────────────────── */

  function open() {
    var dot = document.getElementById('npDot');
    if (dot) dot.remove();
    try { sessionStorage.setItem('np-chat-seen', '1'); } catch (e) {}
    elFab.classList.remove('np-chat-fab--call');
    elChat.classList.add('is-open');
    elChat.setAttribute('aria-hidden', 'false');
    elFab.classList.add('is-open');
    setTimeout(function () { elInput.focus(); }, 260);
    try { sessionStorage.setItem(OPEN, '1'); } catch (e) {}

    /* Primera apertura: Kodiak saluda EN VIVO. Pausa, puntos, y escribe.
       Es la diferencia entre "hay un bot" y "alguien me está atendiendo". */
    if (!elMsgs.children.length && !typing) {
      setTimeout(function () {
        showTyping();
        setTimeout(function () {
          hideTyping();
          addBot(pick(BOT.greeting), null, true);
        }, 900);
      }, 400);
    }
    bottom();
  }

  function close() {
    elChat.classList.remove('is-open');
    elChat.setAttribute('aria-hidden', 'true');
    elFab.classList.remove('is-open');
    try { sessionStorage.removeItem(OPEN); } catch (e) {}
  }

  function toggle() { elChat.classList.contains('is-open') ? close() : open(); }

  /* ── Arranque ─────────────────────────────────────────── */

  function init() {
    build();
    restore();

    var wasOpen = false, seen = false;
    try {
      wasOpen = sessionStorage.getItem(OPEN) === '1';
      seen    = sessionStorage.getItem('np-chat-seen') === '1';
    } catch (e) {}

    if (wasOpen) { open(); return; }

    if (seen) {
      var dot = document.getElementById('npDot');
      if (dot) dot.remove();
      return;
    }

    /* Primera visita: a los 2 s el icono se hace notar una vez. No es un
       parpadeo eterno; es un golpecito en el hombro y se calla. */
    setTimeout(function () {
      if (!elChat.classList.contains('is-open')) {
        elFab.classList.add('np-chat-fab--call');
      }
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
