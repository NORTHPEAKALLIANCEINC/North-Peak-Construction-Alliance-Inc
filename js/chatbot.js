/* ================================================================
   KODIAK — Motor v2
   North Peak Construction Alliance Inc.

   100 % local. Sin API, sin servidor, sin claves, sin coste.
   Todo lo que sabe vive en js/chatbot-kb.js.

   ── QUÉ HACE ESTE MOTOR QUE NO HACE UN CHATBOT DE BOTONES ─────

   1. MULTI-TEMA REAL. Si en un mismo párrafo le hablas de tres cosas
      (un muro de ladrillo, si trabajáis en Ottawa, y cuánto cuesta),
      detecta los TRES y contesta a cada uno EN SU PROPIO MENSAJE,
      encabezado por el tema al que responde, con sus puntos de
      "escribiendo" en medio. No un párrafo kilométrico.

   2. NO SE REPITE. Cada respuesta tiene variantes y el motor recuerda
      cuál usó: nunca da dos veces seguidas la misma frase.

   3. ENTIENDE MAL ESCRITO. Erratas (distancia de edición), sinónimos,
      contracciones sin apóstrofo, plurales y números con símbolos.

   4. TIENE MEMORIA CORTA. Sabe de qué se acaba de hablar: "sí",
      "cuéntame más" o "¿y eso cuánto cuesta?" se entienden en contexto.

   5. GUÍA. Cuando la respuesta vive en otra página, ofrece el botón
      que lleva allí — y la conversación continúa al otro lado.

   ── QUÉ NO HACE, A PROPÓSITO ─────────────────────────────────
   · No consulta fuentes externas. Si no lo sabe, lo dice y pasa a una
     persona. Un bot que adivina es un pasivo, no un activo.
   · No da precios. No afirma certificaciones. No inventa proyectos.
   · Lenguaje neutro: no presupone género, ni edad, ni cargo.
================================================================ */

(function () {
  'use strict';

  var DATA = window.NP_BOT_KB;
  if (!DATA || !DATA.kb) return;

  var BOT   = DATA.bot;
  var STORE = 'np-chat-history';
  var OPEN  = 'np-chat-open';
  var SEEN  = 'np-chat-seen';

  /* Memoria de variantes: qué frase se usó la última vez en cada
     entrada. Es lo que impide que el bot suene a disco rayado. */
  var lastVariant = {};
  /* Memoria de conversación: el último tema, para las preguntas que
     dependen de lo anterior. */
  var lastEntry = null;
  /* ── CONVERSACIÓN GUIADA (Fase 1) ──────────────────────────
     Estado de la toma de datos. Mientras esto no sea null, el motor
     NO puntúa temas: conduce. Sobrevive a la navegación entre páginas,
     porque perder los datos de alguien a mitad de camino es imperdonable. */
  var flow = null;          // { id, step, data, stage }
  var pendingFlow = null;   // flujo ofrecido, esperando un "sí"

  /* [FALLO CORREGIDO] pendingFlow y lastEntry vivían SOLO en memoria: al
     recargar la página o al navegar, se perdían, y un "yes" del visitante
     caía en la rama de "cuéntame más" repitiendo la respuesta anterior.
     Ahora ambos sobreviven, como el resto de la conversación. */
  function savePending() {
    try {
      sessionStorage.setItem('np-chat-pending', pendingFlow || '');
      sessionStorage.setItem('np-chat-last', (lastEntry && (lastEntry.topic || lastEntry.keys[0])) || '');
    } catch (e) {}
  }

  function loadPending() {
    try {
      pendingFlow = sessionStorage.getItem('np-chat-pending') || null;
      var t = sessionStorage.getItem('np-chat-last');
      if (t) {
        DATA.kb.forEach(function (e) {
          if ((e.topic || e.keys[0]) === t) lastEntry = e;
        });
      }
    } catch (e) {}
  }

  /* Se ofrece la toma de datos UNA vez por sesión y por tipo. Un bot que
     lo ofrece en cada respuesta es un vendedor pesado, no un asistente.
     (Si el visitante lo pide él mismo, se abre siempre: eso es otra cosa.) */
  function alreadyOffered(id) {
    try { return sessionStorage.getItem('np-chat-offered-' + id) === '1'; }
    catch (e) { return false; }
  }
  function markOffered(id) {
    try { sessionStorage.setItem('np-chat-offered-' + id, '1'); } catch (e) {}
  }

  /* Clave de Web3Forms: la MISMA que ya usan los formularios del sitio.
     Sin servidor, sin coste, 250 envíos al mes. La tubería ya estaba
     puesta; simplemente no la estábamos usando. */
  var W3F_KEY = '50ceecdb-5b1e-432e-8954-225883a79ba4';

  /* Fallos seguidos. Un bot que no entiende y sigue insistiendo es una
     pared. A la primera pide que se lo expliquen mejor; a la segunda
     ofrece una persona; a la tercera deja de marear y manda a WhatsApp
     o al correo. Se reinicia en cuanto entiende algo. */
  var misses = 0;

  /* ════════════════════════════════════════════════════════
     1. LENGUA
  ════════════════════════════════════════════════════════ */

  var CONTRACTIONS = [
    [/\bdon'?t\b/g, 'do not'],      [/\bcan'?t\b/g, 'can not'],
    [/\bwon'?t\b/g, 'will not'],    [/\bisn'?t\b/g, 'is not'],
    [/\bdoesn'?t\b/g, 'does not'],  [/\bwouldn'?t\b/g, 'would not'],
    [/\bi'?m\b/g, 'i am'],          [/\bi'?ve\b/g, 'i have'],
    [/\bwhat'?s\b/g, 'what is'],    [/\bhow'?s\b/g, 'how is'],
    [/\bwhere'?s\b/g, 'where is'],  [/\byou'?re\b/g, 'you are'],
    [/\bwe'?re\b/g, 'we are'],      [/\bit'?s\b/g, 'it is'],
    [/\blet'?s\b/g, 'let us'],      [/\bthats\b/g, 'that is']
  ];

  var SYNONYMS = {
    price:      ['cost', 'costs', 'quote', 'quotation', 'estimate', 'budget', 'rate', 'rates', 'fee', 'pricing', 'charge', 'expensive', 'cheap'],
    hire:       ['contract', 'engage', 'retain', 'commission', 'award'],
    indigenous: ['aboriginal', 'nations', 'native', 'metis', 'inuit', 'reconciliation'],
    work:       ['job', 'project', 'build', 'construction', 'site', 'works'],
    person:     ['human', 'someone', 'somebody', 'advisor', 'adviser', 'representative', 'agent', 'staff', 'manager', 'estimator'],
    area:       ['region', 'location', 'coverage', 'zone', 'territory', 'province', 'city', 'town'],
    company:    ['firm', 'business', 'organisation', 'organization', 'outfit'],
    schedule:   ['timeline', 'deadline', 'timeframe', 'duration', 'urgent'],
    safety:     ['insurance', 'insured', 'wsib', 'liability', 'bonded', 'compliance']
  };

  var STOPWORDS = ('a an the and or but of to in on for with at by from is are was were be been am ' +
    'do does did can could would should will i you we they it my your our their me us them ' +
    'this that these those which who whom please tell give want need like just get got have has ' +
    'had about there here if so as also very really ok okay hi hello thanks thank some any').split(' ');

  function normalize(str) {
    var s = String(str || '').toLowerCase();
    CONTRACTIONS.forEach(function (c) { s = s.replace(c[0], c[1]); });
    return s
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s?%]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function stem(w) {
    if (w.length < 6) return w;
    return w.replace(/(ing|ies|es|s)$/, '');
  }

  /* Tolerancia adaptativa: en palabras largas la gente comete DOS
     erratas ("cocnrete repiar"). Con una sola de margen no se cazaban.
     Fallo real detectado en pruebas. */
  function isTypo(a, b) {
    if (a.length < 5 || Math.abs(a.length - b.length) > 2) return false;
    var margin = (a.length >= 7) ? 2 : 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1,
                          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur.slice();
    }
    return prev[b.length] <= margin;
  }

  function tokens(text) {
    return normalize(text).replace(/\?/g, '').split(' ').filter(function (w) {
      if (/\d/.test(w)) return true;                       // "5", "5%"
      return w.length > 2 && STOPWORDS.indexOf(w) === -1;
    });
  }

  function expand(words) {
    var out = words.slice();
    words.forEach(function (w) {
      var s = stem(w);
      if (s !== w) out.push(s);
      Object.keys(SYNONYMS).forEach(function (root) {
        if (w === root || SYNONYMS[root].indexOf(w) !== -1) {
          out.push(root);
          out = out.concat(SYNONYMS[root]);
        }
      });
    });
    return out;
  }

  /* ════════════════════════════════════════════════════════
     2. DETECCIÓN DE TEMAS — el corazón del asunto
  ════════════════════════════════════════════════════════ */

  function scoreEntry(entry, norm, words, wide) {
    var s = 0, pos = 9999, at;
    entry.keys.forEach(function (key) {
      var k = normalize(key);

      /* El mensaje ENTERO es la clave ("hello", "thanks", "bye").
         Sin esto, un saludo suelto se perdía: sus palabras están en la
         lista de vacías y el mensaje se quedaba sin fichas que puntuar. */
      if (norm === k) { s += 14; pos = 0; return; }

      if (k.indexOf(' ') !== -1) {                        // frase entera
        at = norm.indexOf(k);
        if (at !== -1) {
          s += 12 + k.split(' ').length;
          if (at < pos) pos = at;
        }
        return;
      }
      if (words.indexOf(k) !== -1) {                      // palabra exacta
        s += 7;
        at = norm.indexOf(k);
        if (at !== -1 && at < pos) pos = at;
        return;
      }
      if (wide.indexOf(k) !== -1) { s += 3; return; }     // sinónimo o raíz

      /* Errata. Una palabra LARGA mal escrita es una señal tan fuerte
         como la palabra bien escrita: "cocnrete" no puede ser otra cosa
         que "concrete". Antes valía 2 puntos y no llegaba al umbral:
         el mensaje entero se perdía. */
      for (var i = 0; i < words.length; i++) {
        if (isTypo(words[i], k)) {
          s += (words[i].length >= 7) ? 7 : 5;
          at = norm.indexOf(words[i]);
          if (at !== -1 && at < pos) pos = at;
          return;
        }
      }
    });

    /* Peso: algunas entradas deben ganar aunque compartan palabras con
       otras. "¿No seréis una empresa fachada?" contiene "indigenous" y
       "set aside", así que la entrada genérica la eclipsaba — y esa
       pregunta merece su respuesta de frente, no un folleto. */
    if (entry.boost) s = Math.round(s * entry.boost);

    return { score: s, pos: pos };
  }

  /* Devuelve TODOS los temas presentes en el mensaje, sin repetir tema.
     Máximo tres: más de tres respuestas seguidas abruman a cualquiera. */
  function detectTopics(text) {
    var norm  = normalize(text);
    var words = tokens(text);
    var wide  = expand(words);
    var hits  = [];

    DATA.kb.forEach(function (entry) {
      var r = scoreEntry(entry, norm, words, wide);
      if (r.score >= 7) hits.push({ entry: entry, score: r.score, pos: r.pos });
    });

    if (!hits.length) return [];

    var byTopic = {};
    hits.forEach(function (h) {
      var t = h.entry.topic || h.entry.keys[0];
      if (!byTopic[t] || byTopic[t].score < h.score) byTopic[t] = h;
    });

    var list = Object.keys(byTopic).map(function (t) { return byTopic[t]; });

    /* El tema con más señal abre; los demás siguen por orden de
       aparición en la frase, y solo si tienen señal sólida. */
    /* El tema con más señal abre; los demás siguen por orden de
       aparición. El umbral del secundario es el mismo que el del
       principal: con uno más alto se perdían preguntas legítimas
       ("¿hacéis hormigón? ¿y tenéis seguro?" se quedaba en el seguro). */
    var top = list.reduce(function (a, b) { return b.score > a.score ? b : a; });
    var rest = list
      .filter(function (h) { return h !== top && h.score >= 7; })
      .sort(function (a, b) { return a.pos - b.pos; });

    return [top].concat(rest).slice(0, 3);
  }

  /* Mensajes que no son una pregunta: tres letras, un "asdf", un emoji
     suelto. No merecen un "no lo sé": merecen "explícamelo mejor". */
  function isUnintelligible(text) {
    var words = tokens(text);
    if (!words.length) return true;
    var meaty = words.filter(function (w) { return w.length >= 4; });
    return meaty.length === 0;
  }

  function isFollowUp(text) {
    var n = normalize(text);
    return n.split(' ').length <= 4 &&
      /^(yes|yeah|yep|sure|okay|ok|please|go on|tell me more|more|continue|and)\b/.test(n);
  }

  function pickVariant(list, memoKey) {
    if (!Array.isArray(list)) return list;
    if (list.length === 1) return list[0];
    var last = lastVariant[memoKey], i, guard = 0;
    do { i = Math.floor(Math.random() * list.length); guard++; }
    while (i === last && guard < 10);
    lastVariant[memoKey] = i;
    return list[i];
  }

  /* ════════════════════════════════════════════════════════
     3. INTERFAZ
  ════════════════════════════════════════════════════════ */

  var elChat, elMsgs, elInput, elFab, elMenu, typing = false, busy = false;

  var ICO = {
    phone: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail:  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
    wa:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.5.1.2 1.7 2.6 4.2 3.7 1.4.6 2 .6 2.7.5.4 0 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1z"/></svg>'
  };

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
        '<span class="np-chat-fab__wave"></span>' +
        '<span class="np-chat-fab__wave np-chat-fab__wave--2"></span>' +
        '<svg class="np-chat-fab__ico" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' +
          '<path d="M20 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v3.2a.8.8 0 0 0 1.3.62L13.5 18H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>' +
          '<circle cx="8" cy="10" r="1.15" fill="currentColor"/><circle cx="12" cy="10" r="1.15" fill="currentColor"/><circle cx="16" cy="10" r="1.15" fill="currentColor"/>' +
        '</svg>' +
        '<svg class="np-chat-fab__ico np-chat-fab__ico--x" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
          '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
          '<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>' +
        '<span class="np-chat-fab__dot" id="npDot"></span>' +
      '</button>' +
      '<section class="np-chat" id="npChat" role="dialog" aria-label="' + BOT.name + ' assistant" aria-hidden="true">' +
        '<header class="np-chat__head">' +
          '<img class="np-chat__av" src="' + BOT.avatar + '" alt="" width="38" height="38">' +
          '<div class="np-chat__id">' +
            '<span class="np-chat__name">' + BOT.name + '</span>' +
            '<span class="np-chat__status"><i></i>Online</span>' +
          '</div>' +
          '<button class="np-chat__topics" id="npTopics" aria-expanded="false" aria-label="Common questions">' +
            '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">' +
              '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="14" y2="17"/>' +
            '</svg><span>Topics</span>' +
          '</button>' +
          '<button class="np-chat__x" id="npClose" aria-label="Close chat">&times;</button>' +
          '<div class="np-chat__menu" id="npMenu" role="menu" aria-hidden="true"></div>' +
        '</header>' +
        '<div class="np-chat__msgs" id="npMsgs" role="log" aria-live="polite"></div>' +
        '<div class="np-chat__bar">' +
          '<textarea id="npInput" class="np-chat__input" rows="1" maxlength="800" placeholder="Ask me anything…" aria-label="Message"></textarea>' +
          '<button class="np-chat__send" id="npSend" aria-label="Send">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="currentColor"/></svg>' +
          '</button>' +
        '</div>' +
        '<p class="np-chat__foot">' + BOT.name + ' · ' + BOT.role + ' · automated answers</p>' +
      '</section>';
    document.body.appendChild(wrap);

    elChat  = document.getElementById('npChat');
    elMsgs  = document.getElementById('npMsgs');
    elInput = document.getElementById('npInput');
    elFab   = document.getElementById('npFab');
    elMenu  = document.getElementById('npMenu');

    BOT.quick.forEach(function (q) {
      var b = document.createElement('button');
      b.className = 'np-chat__mi';
      b.setAttribute('role', 'menuitem');
      b.textContent = q.label;
      b.addEventListener('click', function () { closeMenu(); send(q.q); });
      elMenu.appendChild(b);
    });

    var topics = document.getElementById('npTopics');
    topics.addEventListener('click', function (e) {
      e.stopPropagation();
      elMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('click', function (e) {
      if (!elMenu.contains(e.target)) closeMenu();
    });

    elFab.addEventListener('click', toggle);
    document.getElementById('npClose').addEventListener('click', close);
    document.getElementById('npSend').addEventListener('click', function () { send(elInput.value); });

    elInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(elInput.value); }
    });
    elInput.addEventListener('input', function () {
      elInput.style.height = 'auto';
      elInput.style.height = Math.min(elInput.scrollHeight, 90) + 'px';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && elChat.classList.contains('is-open')) close();
    });
  }

  /* ── Burbujas ─────────────────────────────────────────── */

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

  /* Tarjeta de contacto. Teléfono y WhatsApp son el MISMO número, y
     está bien: hay quien llama y hay quien jamás llamaría pero sí
     escribe. Por eso se etiqueta por la ACCIÓN, no por el dato. Y el
     correo va abreviado: la dirección entera se partía contra el borde. */
  function contactCard() {
    var c = document.createElement('div');
    c.className = 'np-chat__card';
    c.innerHTML =
      '<a href="' + BOT.contact.phoneHref + '">' + ICO.phone +
        '<span><b>Call</b><em>' + BOT.contact.phone + '</em></span></a>' +
      '<a href="' + BOT.contact.whatsapp + '" target="_blank" rel="noopener">' + ICO.wa +
        '<span><b>WhatsApp</b><em>Same number, if you prefer to write</em></span></a>' +
      '<a href="mailto:' + BOT.contact.email + '">' + ICO.mail +
        '<span><b>Email</b><em>Opens your mail app</em></span></a>';
    return c;
  }

  function typewrite(el, text, done) {
    var out = html(text);
    var speed = out.length > 400 ? 4 : out.length > 200 ? 7 : 12;
    var i = 0;
    (function step() {
      if (out[i] === '<') i = out.indexOf('>', i) + 1;
      else i++;
      el.innerHTML = out.slice(0, i);
      bottom();
      if (i < out.length) setTimeout(step, speed);
      else if (done) done();
    })();
  }

  function addBot(text, entry, animate) {
    var b = bubble('bot');
    var tail = function () {
      if (entry && entry.nav) {
        var a = document.createElement('a');
        a.className = 'np-chat__nav';
        a.href = entry.nav.href;
        a.textContent = entry.nav.label + ' \u2192';
        b.appendChild(a);
      }
      if (entry && entry.contactCard) b.appendChild(contactCard());
      bottom();
    };
    if (animate === false) { b.innerHTML = html(text); tail(); }
    else typewrite(b, text, tail);
    save('bot', text, entry);
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

  /* ── Historial ────────────────────────────────────────── */

  function save(role, text, entry) {
    try {
      var h = JSON.parse(sessionStorage.getItem(STORE) || '[]');
      h.push({ r: role, t: text, nav: entry && entry.nav, card: entry && entry.contactCard });
      sessionStorage.setItem(STORE, JSON.stringify(h.slice(-40)));
    } catch (e) {}
  }

  function restore() {
    var h = [];
    try { h = JSON.parse(sessionStorage.getItem(STORE) || '[]'); } catch (e) {}
    if (!h.length) return;              // el saludo se escribe al abrir
    h.forEach(function (m) {
      if (m.r === 'user') { var b = bubble('user'); b.textContent = m.t; }
      else addBot(m.t, { nav: m.nav, contactCard: m.card }, false);
    });
    bottom();
  }

  /* ════════════════════════════════════════════════════════
     4. CONVERSACIÓN
  ════════════════════════════════════════════════════════ */

  /* Pausa humana: proporcional a lo que hay que decir, con tope. Ni
     instantánea (delata la máquina) ni eterna. */
  function pause(text) {
    return 480 + Math.min(String(text).length * 5, 850);
  }

  function speak(text, entry, done) {
    showTyping();
    setTimeout(function () {
      hideTyping();
      addBot(text, entry, true);
      setTimeout(done || function () {}, 450);
    }, pause(text));
  }

  /* ════════════════════════════════════════════════════════
     3-BIS. CONVERSACIÓN GUIADA
     El bot deja de contestar y empieza a CONDUCIR: pregunta, valida,
     lee de vuelta, y envía al correo de la empresa.
  ════════════════════════════════════════════════════════ */

  /* ── Sí, no, y cancelar ────────────────────────────────────
     [FALLOS CORREGIDOS, los dos gordos]

     1. Solo se reconocía el inglés. Un visitante que escribe "sí" — o
        que usa el traductor del navegador, que es lo que hace medio
        mundo — no era entendido. Ahora se reconocen inglés, español y
        francés, que es lo que se habla en Canadá y en la práctica.

     2. "no hay que corregir nada, así está bien" EMPEZABA por "no", y el
        bot lo leía como CANCELAR. Una frase de aprobación se tomaba por
        un rechazo. Ahora: se busca la aprobación en TODA la frase, y
        solo cancela quien lo dice explícitamente ("cancel", "cancelar").
        Un "no" suelto ya no destruye una toma de datos. */

  var YES = new RegExp('\\b(' + [
    'yes', 'yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'sounds good', 'go ahead',
    'please do', 'do it', 'send it', 'send', 'submit', 'correct', 'right', 'perfect',
    'looks good', 'thats right', 'that is right', 'all good', 'fine', 'alright', 'confirm',
    'si', 'claro', 'dale', 'adelante', 'correcto', 'perfecto', 'enviar', 'envialo',
    'envialo ya', 'esta bien', 'todo bien', 'esta correcto', 'de acuerdo', 'vale',
    'oui', 'daccord', 'envoyer'
  ].join('|') + ')\\b');

  var CANCEL = new RegExp('\\b(' + [
    'cancel', 'cancelled', 'stop', 'forget it', 'never mind', 'nevermind', 'quit', 'exit',
    'not now', 'maybe later', 'abort', 'drop it',
    'cancelar', 'cancela', 'olvidalo', 'olvidate', 'detener', 'parar', 'no quiero',
    'no gracias', 'mas tarde', 'annuler'
  ].join('|') + ')\\b');

  /* Rechazo suave: solo válido cuando se OFRECE algo, nunca dentro de
     una toma de datos ya empezada. */
  var DECLINE = new RegExp('^(no|nope|non|nah)\\b');

  /* NEGACIÓN de corrección: "no hay que corregir nada", "nothing to change".
     Contiene la palabra "corregir", pero significa lo contrario. Sin esto,
     la frase de aprobación más natural del mundo mandaba a corregir. */
  var NOFIX = new RegExp('(' + [
    'nada que (corregir|cambiar|arreglar)',
    'no hay que (corregir|cambiar|arreglar)',
    'no (corrijas|cambies|hace falta)',
    'sin cambios', 'todo esta bien', 'esta todo bien',
    'nothing to (change|fix|correct)', 'no changes', 'no need to change',
    'do not change', 'dont change', 'leave it'
  ].join('|') + ')');

  /* Petición de corregir algo. */
  var FIXWORD = new RegExp('\\b(' + [
    'change', 'fix', 'correct it', 'edit', 'modify', 'wrong', 'mistake',
    'cambiar', 'cambia', 'corregir', 'corrige', 'arreglar', 'arregla', 'esta mal',
    'incorrecto', 'error', 'modifier'
  ].join('|') + ')\\b');

  /* Cada paso responde también por su nombre traducido: el visitante ve
     la web traducida por el navegador y escribe lo que ve. */
  var STEP_ALIASES = {
    what:       ['what', 'work', 'project', 'obra', 'trabajo', 'proyecto'],
    where:      ['where', 'city', 'location', 'donde', 'dónde', 'ciudad', 'lugar', 'ou'],
    when:       ['when', 'date', 'timing', 'cuando', 'cuándo', 'fecha', 'plazo', 'quand'],
    name:       ['name', 'nombre', 'nom'],
    contact:    ['contact', 'phone', 'email', 'mail', 'contacto', 'correo', 'telefono',
                 'teléfono', 'numero', 'número', 'courriel'],
    trade:      ['trade', 'role', 'oficio', 'puesto', 'metier'],
    experience: ['experience', 'experiencia']
  };

  function mentionsStep(norm, stepId) {
    var list = STEP_ALIASES[stepId] || [stepId];
    for (var i = 0; i < list.length; i++) {
      if (new RegExp('\\b' + normalize(list[i]) + '\\b').test(norm)) return true;
    }
    return false;
  }

  function saveFlow() {
    try { sessionStorage.setItem('np-chat-flow', JSON.stringify(flow)); } catch (e) {}
  }
  function loadFlow() {
    try { flow = JSON.parse(sessionStorage.getItem('np-chat-flow') || 'null'); } catch (e) { flow = null; }
  }
  function clearFlow() {
    flow = null;
    try { sessionStorage.removeItem('np-chat-flow'); } catch (e) {}
  }

  function flowDef() { return flow && DATA.flows[flow.id]; }

  function startFlow(id, done) {
    var def = DATA.flows[id];
    if (!def) { if (done) done(); return; }
    flow = { id: id, step: 0, data: {}, stage: 'asking' };
    pendingFlow = null;
    savePending();
    saveFlow();
    speak(pickVariant(def.start, id + '#start'), null, function () {
      askStep(done);
    });
  }

  function askStep(done) {
    var def = flowDef();
    if (!def) { if (done) done(); return; }
    var step = def.steps[flow.step];
    saveFlow();
    speak(pickVariant(step.ask, flow.id + '#' + step.id), null, done);
  }

  /* Validación. Amable, pero no deja pasar un teléfono que no es un
     teléfono: un contacto que no se puede contactar no vale nada. */
  function looksLikeContact(v) {
    var email = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v);
    var phone = (v.replace(/\D/g, '').length >= 7);
    return email || phone;
  }

  /* Países y regiones enteras. Responder "Canadá" a "¿en qué ciudad?" no
     es un error del visitante: es una respuesta razonable a una pregunta
     mal acotada. Un humano no la daría por buena — la afinaría. */
  var TOO_BROAD = [
    'canada', 'usa', 'us', 'united states', 'america', 'mexico', 'europe',
    'north america', 'everywhere', 'anywhere', 'all over', 'nationwide',
    'canada wide', 'across canada', 'varios sitios', 'todo el pais'
  ];

  function validate(step, value) {
    var v = value.trim();
    if (step.type === 'contact') {
      return looksLikeContact(v) ? null : 'invalidContact';
    }
    if (step.type === 'place') {
      if (looksLikeContact(v)) return 'looksLikeContact';
      var n = normalize(v);
      if (TOO_BROAD.indexOf(n) !== -1) return 'tooBroadPlace';
      return v.length >= 3 ? null : 'tooShort';
    }
    if (step.type === 'name') {
      /* Un correo tampoco es un nombre. */
      if (looksLikeContact(v)) return 'looksLikeContact';
      return v.length >= 2 ? null : 'tooShort';
    }
    if (step.type === 'text') {
      /* El visitante suelta su correo cuando se le pregunta por la obra.
         Antes se tragaba y quedaba de descripción del proyecto. Ahora se
         apunta como contacto y se le vuelve a preguntar. */
      if (looksLikeContact(v) && v.split(' ').length <= 3) return 'looksLikeContact';
      if (v.length < 3) return 'tooShort';
      /* Una sola palabra no le sirve a nadie: ni al equipo, ni al cliente. */
      if (v.split(/\s+/).length < 2 && v.length < 12) return 'tooVague';
      return null;
    }
    return null;
  }

  function summary() {
    var def = flowDef();
    var lines = def.steps.map(function (s) {
      var label = s.id.charAt(0).toUpperCase() + s.id.slice(1);
      return '- **' + label + ':** ' + (flow.data[s.id] || '—');
    });
    return lines.join('\n');
  }

  /* Envío real. Si falla, el visitante SE ENTERA: nada de fingir que
     salió cuando no salió. */
  function submitLead(done) {
    var def = flowDef();
    var payload = {
      access_key: W3F_KEY,
      subject: def.subject,
      from_name: 'Kodiak — website assistant',
      botcheck: false,
      source: 'Kodiak assistant (' + window.location.pathname + ')'
    };
    def.steps.forEach(function (s) { payload[s.id] = flow.data[s.id]; });

    showTyping();
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      hideTyping();
      if (res && res.success) {
        addBot(pickVariant(def.success, flow.id + '#ok'), null, true);
        clearFlow();
      } else { throw new Error('web3forms'); }
      if (done) done();
    })
    .catch(function () {
      hideTyping();
      addBot(pickVariant(def.failure, flow.id + '#fail'), { contactCard: true }, true);
      clearFlow();
      if (done) done();
    });
  }

  /* Cada mensaje del visitante mientras el flujo está vivo. */
  function handleFlow(text, done) {
    var def = flowDef();
    var n = normalize(text);

    if (CANCEL.test(n) && flow.stage === 'asking') {
      clearFlow();
      speak(pickVariant(DATA.flowTalk.cancelled, 'cancel'), null, done);
      return;
    }

    /* Está esperando confirmación final.
       ORDEN IMPORTANTE: primero se mira si pide corregir algo concreto,
       DESPUÉS si aprueba, y solo al final si cancela. Con el orden al
       revés, "no hay que corregir nada, así está bien" se cancelaba. */
    if (flow.stage === 'confirm') {

      /* "no hay que corregir nada, así está bien" → es un SÍ. Va primero. */
      if (NOFIX.test(n)) { submitLead(done); return; }

      /* ¿Señala un campo concreto? ("cambia el teléfono", "el nombre está mal") */
      var target = null;
      def.steps.forEach(function (s, i) {
        if (mentionsStep(n, s.id)) target = i;
      });

      if (target !== null && (FIXWORD.test(n) || !YES.test(n))) {
        flow.step = target;
        flow.stage = 'fixing';
        askStep(done);
        return;
      }

      /* ¿Aprueba? Se busca en TODA la frase, no solo al principio. */
      if (YES.test(n) && !FIXWORD.test(n)) { submitLead(done); return; }

      /* ¿Cancela de verdad? Palabras explícitas, nunca un "no" suelto. */
      if (CANCEL.test(n)) {
        clearFlow();
        speak(pickVariant(DATA.flowTalk.cancelled, 'cancel'), null, done);
        return;
      }

      /* Pide corregir, pero no dice qué. */
      if (FIXWORD.test(n) || DECLINE.test(n)) {
        speak(pickVariant(DATA.flowTalk.whatToChange, 'change'), null, done);
        return;
      }

      /* No se ha entendido la confirmación: se pregunta claro. */
      speak(pickVariant(DATA.flowTalk.confirmUnclear, 'confirmUnclear'), null, done);
      return;
    }

    /* Está respondiendo a un paso. */
    var step = def.steps[flow.step];

    /* Paso de contacto y ya teníamos uno apuntado: se ofrece reutilizarlo. */
    if (step.type === 'contact' && flow.saved && YES.test(n) && !looksLikeContact(text)) {
      flow.data[step.id] = flow.saved;
      advance(done);
      return;
    }

    var err = validate(step, text);
    if (err) {
      if (err === 'looksLikeContact') {
        flow.saved = text.trim();     // se apunta para el final
        saveFlow();
      }
      speak(pickVariant(DATA.flowTalk[err], err), null, done);
      return;
    }

    flow.data[step.id] = text.trim();

    advance(done);
  }

  /* Avanza al paso siguiente, o cierra pidiendo confirmación. */
  function advance(done) {
    var def = flowDef();

    /* Corrigiendo un dato suelto: vuelve directo a la confirmación. */
    if (flow.stage === 'fixing') {
      flow.stage = 'confirm';
      saveFlow();
      askConfirm(done);
      return;
    }

    flow.step++;

    if (flow.step < def.steps.length) {
      var next = def.steps[flow.step];
      /* Si ya nos dio un contacto sin querer, no se lo pedimos como si
         no hubiéramos escuchado: se lo recordamos. */
      if (next.type === 'contact' && flow.saved) {
        saveFlow();
        speak(pickVariant(DATA.flowTalk.useSaved, 'useSaved')
                .replace('{contact}', flow.saved), null, done);
        return;
      }
      askStep(done);
      return;
    }

    flow.stage = 'confirm';
    saveFlow();
    askConfirm(done);
  }

  function askConfirm(done) {
    var def = flowDef();
    speak(pickVariant(def.confirm, flow.id + '#confirm') + '\n\n' + summary() +
          '\n\n' + pickVariant(def.confirmAsk, flow.id + '#confirmAsk'), null, done);
  }

  /* ¿El mensaje arranca un flujo por sí solo? */
  function flowTrigger(text) {
    var n = normalize(text);
    var found = null;
    Object.keys(DATA.flows).forEach(function (id) {
      (DATA.flows[id].trigger || []).forEach(function (t) {
        if (n.indexOf(normalize(t)) !== -1) found = id;
      });
    });
    return found;
  }

  function send(raw) {
    var text = String(raw || '').trim();
    if (!text || busy) return;

    busy = true;
    addUser(text);
    elInput.value = '';
    elInput.style.height = 'auto';
    closeMenu();

    var release = function () { busy = false; };

    /* 1. ¿Hay una toma de datos en marcha? Entonces se conduce. */
    if (flow) { handleFlow(text, release); return; }

    /* 2. ¿Se ofreció una y el visitante ha dicho que sí? */
    if (pendingFlow) {
      var n0 = normalize(text);
      if (YES.test(n0)) { startFlow(pendingFlow, release); return; }
      if (DECLINE.test(n0) || CANCEL.test(n0)) {
        pendingFlow = null;
        savePending();
        speak(pickVariant(DATA.flowTalk.cancelled, 'cancel'), null, release);
        return;
      }
      pendingFlow = null;   // ha cambiado de tema: se sigue como siempre
      savePending();
    }

    /* 3. ¿Lo pide directamente? ("send my project") */
    var direct = flowTrigger(text);
    if (direct) { startFlow(direct, release); return; }

    /* Red de seguridad: si lo último que se habló ofrecía tomar los datos
       y el visitante dice "sí", se abre el flujo. Pase lo que pase con la
       memoria, un "sí" nunca vuelve a repetir la respuesta anterior. */
    if (YES.test(normalize(text)) && normalize(text).split(' ').length <= 4 &&
        lastEntry && lastEntry.offerFlow && DATA.flows[lastEntry.offerFlow]) {
      startFlow(lastEntry.offerFlow, release);
      return;
    }

    /* Continuación de lo anterior: "tell me more", "go on". */
    if (isFollowUp(text) && lastEntry) {
      var key  = lastEntry.topic || lastEntry.keys[0];
      var more = lastEntry.more
        ? pickVariant(lastEntry.more, key + '#more')
        : pickVariant(lastEntry.answer, key + '#a');
      speak(more, { nav: lastEntry.nav, contactCard: lastEntry.contactCard },
            function () { busy = false; });
      return;
    }

    var topics = detectTopics(text);

    if (!topics.length) {
      lastEntry = null;
      misses++;

      /* Escalada en tres tiempos. */
      var text2, extra;
      if (misses === 1 && isUnintelligible(text)) {
        /* No lo he entendido: no es que no lo sepa. */
        text2 = pickVariant(BOT.clarify, 'clarify');
        extra = null;
      } else if (misses === 1) {
        text2 = pickVariant(BOT.fallback, 'fallback');
        extra = { contactCard: true, nav: { label: 'Contact page', href: BOT.contact.page } };
      } else if (misses === 2) {
        text2 = pickVariant(BOT.retry, 'retry');
        extra = { contactCard: true };
      } else {
        /* Ya van tres. Dejar de marear a la persona es lo respetuoso. */
        text2 = pickVariant(BOT.escalate, 'escalate');
        extra = { contactCard: true };
      }

      speak(text2, extra, function () { busy = false; });
      return;
    }

    misses = 0;                  // ha entendido: cuenta a cero
    lastEntry = topics[0].entry;
    savePending();
    var multi = topics.length > 1;
    var i = 0;

    (function next() {
      if (i >= topics.length) { busy = false; return; }

      var entry = topics[i].entry;
      var key   = entry.topic || entry.keys[0];
      var body  = pickVariant(entry.answer, key + '#a');
      var out   = body;

      /* Con varios temas, cada respuesta se presenta: el visitante ve
         que se le entendió TODO y sabe a qué contesta cada bloque. Los
         conectores rotan, así que nunca suena a plantilla. */
      if (multi) {
        var lead = pickVariant(BOT.connectors, 'connector' + i);
        out = lead.replace('{topic}', key) + '\n\n' + body;
      }

      i++;

      /* Al terminar de responder, si esa entrada lo merece, el bot se
         OFRECE a tomar los datos. Es el paso que convierte una charla
         agradable en un cliente en el buzón de la empresa. */
      var isLast = (i >= topics.length);
      speak(out, entry, function () {
        if (isLast && entry.offerFlow && DATA.flows[entry.offerFlow] &&
            !alreadyOffered(entry.offerFlow)) {
          pendingFlow = entry.offerFlow;
          savePending();
          markOffered(entry.offerFlow);
          speak(pickVariant(DATA.flows[entry.offerFlow].offer, entry.offerFlow + '#offer'),
                null, next);
          return;
        }
        next();
      });
    })();
  }

  /* ── Menú de temas ────────────────────────────────────── */

  function openMenu() {
    elMenu.classList.add('is-open');
    elMenu.setAttribute('aria-hidden', 'false');
    document.getElementById('npTopics').setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!elMenu) return;
    elMenu.classList.remove('is-open');
    elMenu.setAttribute('aria-hidden', 'true');
    var t = document.getElementById('npTopics');
    if (t) t.setAttribute('aria-expanded', 'false');
  }

  /* ── Abrir / cerrar ───────────────────────────────────── */

  function open() {
    var dot = document.getElementById('npDot');
    if (dot) dot.remove();
    try { sessionStorage.setItem(SEEN, '1'); sessionStorage.setItem(OPEN, '1'); } catch (e) {}
    elFab.classList.remove('np-chat-fab--call');
    elFab.classList.add('is-open');
    elChat.classList.add('is-open');
    elChat.setAttribute('aria-hidden', 'false');
    setTimeout(function () { elInput.focus(); }, 260);

    /* Kodiak saluda EN VIVO: pausa, puntos, y escribe. Nunca un cartel
       ya puesto esperando. Diez saludos posibles, sin repetir. */
    if (!elMsgs.children.length && !busy) {
      busy = true;
      setTimeout(function () {
        speak(pickVariant(BOT.greeting, 'greeting'), null, function () { busy = false; });
      }, 350);
    }
    bottom();
  }

  function close() {
    closeMenu();
    elChat.classList.remove('is-open');
    elChat.setAttribute('aria-hidden', 'true');
    elFab.classList.remove('is-open');
    try { sessionStorage.removeItem(OPEN); } catch (e) {}
  }

  function toggle() { elChat.classList.contains('is-open') ? close() : open(); }

  /* ── Arranque ─────────────────────────────────────────── */

  function init() {
    build();
    loadFlow();      // una toma de datos a medias sobrevive al cambio de página
    loadPending();   // y también el ofrecimiento en el aire
    restore();

    var wasOpen = false, seen = false;
    try {
      wasOpen = sessionStorage.getItem(OPEN) === '1';
      seen    = sessionStorage.getItem(SEEN) === '1';
    } catch (e) {}

    if (wasOpen) { open(); return; }
    if (seen) {
      var d = document.getElementById('npDot');
      if (d) d.remove();
      return;
    }

    setTimeout(function () {
      if (!elChat.classList.contains('is-open')) elFab.classList.add('np-chat-fab--call');
    }, 2000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
