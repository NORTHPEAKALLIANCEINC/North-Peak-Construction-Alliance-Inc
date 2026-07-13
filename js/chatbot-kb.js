/* ================================================================
   KODIAK — Base de conocimiento v2
   North Peak Construction Alliance Inc.

   ÚNICO ARCHIVO A EDITAR para cambiar lo que el asistente sabe o dice.
   El motor (js/chatbot.js) no se toca nunca para añadir contenido.

   ── ANATOMÍA DE UNA ENTRADA ──────────────────────────────────
   {
     topic:  'concrete work',        // etiqueta del tema. Se usa como
                                     // encabezado cuando el visitante
                                     // pregunta varias cosas a la vez.
     keys:   ['concrete', 'slab'],   // todas las formas de preguntarlo
     answer: ['A.', 'B.', 'C.'],     // VARIANTES. Nunca repite seguida.
     more:   ['Detalle largo.'],     // opcional: si dice "cuéntame más"
     nav:    { label: '…', href: '/services' },   // opcional: le lleva
     contactCard: true               // opcional: teléfono/WhatsApp/correo
   }

   ── LAS CUATRO REGLAS ────────────────────────────────────────
   1. CORTO. Dos o tres frases. Lo demás se ofrece, no se suelta.
   2. VARIANTES. Mínimo tres por respuesta. Un cliente que vuelve
      mañana no debe oír el mismo disco.
   3. LENGUAJE NEUTRO. Nunca se presupone género, edad ni cargo. Ni
      "sir", ni "madam", ni "guys". Se habla de "you" y de "the team".
   4. NUNCA INVENTAR. Sin dato confirmado: se dice, y se ofrece una
      persona. ⚠️ marca lo que espera respuesta del cliente.
================================================================ */

window.NP_BOT_KB = {

  bot: {
    name:   'Kodiak',
    role:   'Virtual Assistant',
    avatar: '/images/bot-avatar.webp',

    /* ── DIEZ SALUDOS. Se elige uno al azar, sin repetir el anterior ── */
    greeting: [
      'Hi, I am **Kodiak**, from North Peak Construction Alliance.\n\nWhat brings you here today?',
      'Hello. **Kodiak** here — I help visitors find what they came for.\n\nWhat can I do for you?',
      'Welcome to North Peak. I am **Kodiak**.\n\nTell me what you need in your own words and I will take it from there.',
      'Hi there. I am **Kodiak**, the assistant for North Peak Construction Alliance.\n\nWhat would you like to know?',
      'Good to see you. I am **Kodiak**.\n\nAre you here about a project, about working with us, or just having a look?',
      'Hello, I am **Kodiak**.\n\nAsk me anything about the company — what we build, where we work, or how to reach a person.',
      'Hi. **Kodiak** speaking, so to speak.\n\nWhat can I help you with today?',
      'Welcome. I am **Kodiak**, and I know this company inside out.\n\nWhere would you like to start?',
      'Hello. I am **Kodiak**, here to save you the search.\n\nWhat are you looking for?',
      'Hi, I am **Kodiak**.\n\nIf you are not sure where to begin, just say so — that is a perfectly good place to start.'
    ],

    /* ── Conectores para cuando hay VARIOS temas en un mismo mensaje.
          {topic} se sustituye por la etiqueta del tema.               ── */
    connectors: [
      'On **{topic}** —',
      'About **{topic}**:',
      'As for **{topic}** —',
      'Taking **{topic}** first:',
      'Then there is **{topic}** —',
      'On the **{topic}** side:',
      'Regarding **{topic}** —',
      'And **{topic}**:'
    ],

    /* ── Cuando no sabe. Cinco variantes, todas honestas. ── */
    fallback: [
      'I would rather be useful than quick, and I do not have that one.\n\nA person will:',
      'That is outside what I know, and I will not invent an answer.\n\nHere is the team:',
      'I do not have that, and guessing would not help you.\n\nStraight to a human:',
      'Honestly, I am not sure — and on that I would rather say so.\n\nSomeone here will know:',
      'Not something I can answer reliably. Rather than waste your time:'
    ],

    /* ── No ha entendido el mensaje (mal escrito, muy corto) ──
       No es "no lo sé": es "explícamelo mejor". La diferencia importa. */
    clarify: [
      'I did not quite catch that. Could you put it in a few more words?',
      'Sorry — I am not sure what you mean. Tell me a bit more and I will help.',
      'That one lost me. Can you say it a different way?',
      'I want to help, but I did not understand. What are you trying to do?',
      'Not sure I follow. Could you explain it in a sentence or two?'
    ],

    /* ── Segundo fallo seguido: dejar de insistir, ofrecer una persona ── */
    retry: [
      'I am still not getting it, and I do not want to waste your time.\n\nA person will understand you straight away:',
      'Twice now I have missed your meaning — that is on me, not on you.\n\nGo straight to the team:',
      'I am clearly not the right one for this question. Rather than guess again:'
    ],

    /* ── Tercer fallo: basta. WhatsApp o correo, sin rodeos. ── */
    escalate: [
      'Let us stop going in circles. Write to the team — one message on WhatsApp and someone will answer you properly:',
      'This is a conversation for a human, and I am holding you up.\n\nWhatsApp or email, whichever you prefer:',
      'I am not going to pretend any longer. Take it to a person — they will sort you out in a minute:'
    ],

    quick: [
      { label: 'What you do',      q: 'What services do you offer?' },
      { label: 'Indigenous',       q: 'What is your Indigenous participation?' },
      { label: 'Where you work',   q: 'Where do you work?' },
      { label: 'Start a project',  q: 'How do I start a project with you?' },
      { label: 'Careers',          q: 'Are you hiring?' },
      { label: 'Send my project', q: 'send my project to the team' },
      { label: 'Talk to a person', q: 'I want to talk to a person' },
      { label: 'I am lost',        q: 'I do not know where to start' }
    ],

    contact: {
      phone:     '647 895 0939',
      phoneHref: 'tel:+16478950939',
      email:     'admin@northalliancegroup.ca',
      whatsapp:  'https://wa.me/16478950939',
      page:      '/contact'
    }
  },


  /* ════════════════════════════════════════════════════════════
     CONVERSACIONES GUIADAS  (Fase 1)

     Aquí es donde el bot deja de ser un folleto y pasa a trabajar.
     En lugar de contestar y despedirse, TOMA LOS DATOS y los envía al
     correo de la empresa por Web3Forms — la misma tubería que ya usan
     los formularios de la web, sin servidor y sin coste.

     Cada paso: una pregunta (con variantes), un tipo de validación y
     si es obligatorio. El motor conduce; aquí solo vive el texto.

     Tipos de validación: 'text' | 'name' | 'contact' | 'any'
  ════════════════════════════════════════════════════════════ */
  flows: {

    project: {
      id: 'project',
      subject: 'New project enquiry from the website assistant',
      /* Frases con las que el visitante puede arrancarlo directamente */
      trigger: [
        'send my project', 'take my details', 'take my information',
        'i want to send my project', 'submit my project', 'pass it to the team',
        'send it to the team', 'contact me'
      ],
      /* Lo que dice el bot al ofrecerlo */
      offer: [
        'I can take the details right now and send them straight to the team — it takes a minute, and someone comes back to you.\n\nShall we?',
        'If you like, I will take a few details and put them in front of a person today. Four short questions.\n\nWant to?',
        'Rather than send you off to a form, I can take it from here myself and pass it to the team.\n\nShall I?'
      ],
      start: [
        'Good. Four questions, plain words, no technical language needed.',
        'Right. Four quick things and I will pass it on.',
        'Let us do it. Four questions, and you can stop at any point.'
      ],
      steps: [
        {
          id: 'what',
          type: 'text',
          ask: [
            'First — what needs building, repairing or managing?',
            'What is the work? Describe it however you would to a neighbour.',
            'Tell me what the project involves. No need for technical terms.'
          ]
        },
        {
          id: 'where',
          type: 'text',
          ask: [
            'Where is it? The city is enough.',
            'And whereabouts? City or town will do.',
            'Which city is the project in?'
          ]
        },
        {
          id: 'when',
          type: 'text',
          ask: [
            'When do you need it? A rough idea is fine — "this spring" works.',
            'And the timing? Even "as soon as possible" is a useful answer.',
            'When would you want this done? Approximate is fine.'
          ]
        },
        {
          id: 'name',
          type: 'name',
          ask: [
            'Almost there. What is your name?',
            'And your name?',
            'Who should the team ask for?'
          ]
        },
        {
          id: 'contact',
          type: 'contact',
          ask: [
            'Last one — the best way to reach you. A phone number or an email.',
            'And how do we reach you? Phone or email, whichever you prefer.',
            'Finally: your phone or your email, so a person can come back to you.'
          ]
        }
      ],
      /* Antes de enviar, se lee de vuelta. Nadie manda datos a ciegas. */
      confirm: [
        'Here is what I have. Have a look:',
        'Let me read that back before it goes anywhere:',
        'This is what I would send to the team:'
      ],
      confirmAsk: [
        'Send it? Say **yes**, or tell me what to change ("change the phone").',
        'Shall I send it? **Yes** to go ahead, or name what needs fixing.',
        'Happy with that? **Yes** and it goes. Or tell me what to correct.'
      ],
      success: [
        'Sent. It is in the office inbox now, and someone will come back to you.\n\nIf it is urgent, call **647 895 0939** and mention you spoke to me.',
        'Done — that is with the team. Expect a reply from a person.\n\nIn a hurry? Call **647 895 0939**.',
        'Off it goes. A person will pick that up and get in touch.\n\nAnything else I can do?'
      ],
      /* Si el envío falla (sin red, servicio caído): NO se pierde nada */
      failure: [
        'Something went wrong on my side and I could not send it. That is my fault, not yours — and I am not going to pretend otherwise.\n\nCopy what you told me into an email, or just call. It will get there:',
        'The message did not go through. Rather than leave you thinking it did, here is the direct route:'
      ]
    },

    job: {
      id: 'job',
      subject: 'New candidate enquiry from the website assistant',
      trigger: ['send my application', 'apply through you', 'take my details for a job'],
      offer: [
        'I can pass your details to the team right now — three questions.\n\nWant me to?',
        'If you like, I will take your trade and your contact and put it in front of the right person.\n\nShall we?'
      ],
      start: [
        'Good. Three quick questions.',
        'Right — three things and I will pass it on.'
      ],
      steps: [
        {
          id: 'trade',
          type: 'text',
          ask: [
            'What is your trade, or the role you are after?',
            'What do you do — trade or position?'
          ]
        },
        {
          id: 'experience',
          type: 'text',
          ask: [
            'Roughly how much experience do you have in it?',
            'And how long have you been doing it?'
          ]
        },
        {
          id: 'name',
          type: 'name',
          ask: ['Your name?', 'And what is your name?']
        },
        {
          id: 'contact',
          type: 'contact',
          ask: [
            'Best way to reach you — phone or email.',
            'And your phone or email, so they can come back to you.'
          ]
        }
      ],
      confirm: [
        'Here is what I have:',
        'Let me read it back:'
      ],
      confirmAsk: [
        'Send it? **Yes**, or tell me what to change.',
        'Shall I pass this on? **Yes** to go ahead.'
      ],
      success: [
        'Sent. Your details are with the team.\n\nIf you also want to send a résumé, use the Careers page — the form there takes a file.',
        'Done. That is in the office inbox.\n\nTo attach a résumé, the Careers page has a form that takes one.'
      ],
      failure: [
        'It did not go through, and I will not pretend it did. Use the Careers page or write directly:'
      ]
    }
  },

  /* Respuestas del motor durante una conversación guiada */
  flowTalk: {
    cancelled: [
      'No problem — stopped. Nothing was sent.\n\nAnything else I can help with?',
      'Dropped it. Nothing has gone anywhere.\n\nWhat else can I do?'
    ],
    invalidContact: [
      'That does not look like a phone number or an email. Could you write it again?',
      'I need something a person can actually reach you on — a phone number or an email address.'
    ],
    tooShort: [
      'A little more than that, if you can. Even one sentence helps.',
      'Give me a bit more to work with — a few words.'
    ],
    sending: [
      'Sending it now…',
      'One moment — passing it to the team…'
    ],
    whatToChange: [
      'Which part? Say **what**, **where**, **when**, **name** or **contact**.',
      'Tell me which one to fix: **what**, **where**, **when**, **name** or **contact**.'
    ]
  },

  kb: [

    /* ══ CORTESÍA ═══════════════════════════════════════════ */
    {
      topic: 'greeting',
      keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola', 'bonjour'],
      answer: [
        'Hello. What can I help you with?',
        'Hi there. What would you like to know?',
        'Hello. Ask me anything about the company.',
        'Hi. What are you after today?'
      ]
    },
    {
      topic: 'thanks',
      keys: ['thank you', 'thanks', 'appreciate it', 'cheers', 'perfect', 'great', 'brilliant'],
      answer: [
        'Glad to help. Anything else?',
        'My pleasure. Anything else on your mind?',
        'Any time. What else can I do?',
        'Happy to. Is there anything else?'
      ]
    },
    {
      topic: 'goodbye',
      keys: ['bye', 'goodbye', 'see you', 'that is all', 'nothing else', 'no thanks', 'thats all'],
      answer: [
        'Take care. We are on **647 895 0939** whenever you need us.',
        'Good talking to you. The door is open.',
        'All the best. Come back any time.',
        'Thanks for stopping by. We are here when you need us.'
      ]
    },
    {
      topic: 'the assistant',
      keys: ['who are you', 'what are you exactly', 'are you a robot', 'are you human', 'your name', 'are you a bot', 'am i talking to a person', 'are you real', 'ai'],
      answer: [
        'I am **Kodiak**, an assistant — not a person. I only tell you what the company has confirmed, and I never make things up.\n\nIf you would rather talk to someone real, say the word.',
        'Kodiak, an automated assistant. Honest about it, too: I am software, and I will not pretend otherwise.\n\nWant a human instead? Just ask.',
        'I am the assistant for North Peak. Automated, but on a short leash: if I do not know something, I say so and hand you to a person.'
      ]
    },

    /* ══ "NO SÉ POR DÓNDE EMPEZAR" — la entrada más importante ═
       El visitante perdido es el que se pierde para siempre si nadie
       lo coge de la mano. Aquí se le coge de la mano.                */
    {
      topic: 'getting started',
      keys: [
        'i do not know where to start', 'i am lost', 'help me', 'guide me', 'i need help',
        'where do i start', 'how does this work', 'how do i use this', 'i do not understand',
        'confused', 'show me around', 'not sure', 'first time', 'new here'
      ],
      answer: [
        'No problem at all. Let us keep it simple.\n\nAre you here to:\n\n- **Hire us** for a project\n- **Work with us** (a job, or as a subcontractor)\n- Just **see what we do**\n\nSay which one, in your own words.',
        'Perfectly normal — most people land here without a plan.\n\nTell me one thing: do you have a project in mind, are you looking for work, or are you just having a look around?',
        'Let us start from zero, then. Three doors:\n\n- You need something **built**\n- You want to **work** with us\n- You are just **finding out** who we are\n\nWhich one is closest?'
      ],
      more: [
        'Here is the whole site in one breath:\n\n- **Services** — the ten things we do\n- **Indigenous Procurement** — how we help you meet your targets\n- **About** — who we are\n- **Careers** — jobs and subcontracting\n- **Contact** — a real person\n\nWhich one shall I open for you?'
      ]
    },

    /* ══ GUÍA DE LA WEB — para quien no sabe navegar ════════ */
    {
      topic: 'the website',
      keys: [
        'how do i navigate', 'what is on this website', 'sections', 'menu', 'pages',
        'where do i find', 'how do i get to', 'take me to', 'show me the'
      ],
      answer: [
        'The site has five places worth knowing:\n\n- **Services** — the ten things we do\n- **Indigenous Procurement** — the part most clients come for\n- **About** — the company and its directors\n- **Careers** — jobs and subcontractors\n- **Contact** — a real person\n\nName one and I will take you there.',
        'Not much to it, honestly. Services, Indigenous Procurement, About, Careers and Contact.\n\nTell me what you are after and I will open the right one for you.'
      ]
    },

    /* ══ LA EMPRESA ═════════════════════════════════════════ */
    {
      topic: 'the company',
      keys: [
        'about the company', 'what is north peak', 'tell me about north peak', 'about you',
        'who is north peak', 'company information', 'background', 'your company', 'history'
      ],
      answer: [
        'We are an **Indigenous-owned construction company** based in Toronto, working across Ontario and Canada.\n\nWe build for general contractors, public bodies and private clients. What would you like to know first?',
        'North Peak is a Toronto construction company, Indigenous-owned, federally incorporated (No. **1521162-0**), working right across Canada.\n\nWhat matters most to you — what we build, or who we build it for?',
        'Short version: real construction capability, authentic Indigenous partnership, Toronto base, Canada-wide reach.\n\nWant the longer version?'
      ],
      more: [
        'We cover the full project cycle — from managing a job to putting the crew on site. Ten service areas, from general contracting to concrete and masonry.\n\nWhat sets us apart is that clients do not have to choose between meeting an Indigenous procurement target and hiring someone who can actually build. Here it is the same company.'
      ],
      nav: { label: 'About us', href: '/about' }
    },

    /* ══ SERVICIOS ══════════════════════════════════════════ */
    {
      topic: 'services',
      offerFlow: 'project',
      keys: [
        'services', 'what do you do', 'what you do', 'what do you offer', 'offer', 'work you do',
        'capabilities', 'what can you build', 'trades', 'what type of work', 'lines of work', 'scope'
      ],
      answer: [
        'We can run your project, act as your general contractor, or send you the crew. Add commercial, institutional and infrastructure work, plus masonry, concrete and restoration.\n\nWhich is closest to what you need?',
        'Ten areas, covering the whole job: management, general contracting, labour supply, commercial and institutional builds, infrastructure, restoration, masonry, concrete and specialized work.\n\nWhat kind of project do you have?',
        'From planning it to pouring it. We manage projects, contract them, and do the work on site.\n\nTell me what your project involves and I will tell you if it is our kind of job.'
      ],
      more: [
        'The full ten:\n\n- Project management\n- General contracting\n- Skilled labour supply\n- Commercial construction\n- Institutional construction\n- Infrastructure services\n- Restoration and rehabilitation\n- Masonry and bricklaying\n- Concrete and concrete repair\n- Specialized construction services'
      ],
      nav: { label: 'See all ten', href: '/services' }
    },
    {
      topic: 'project management',
      offerFlow: 'project',
      keys: ['project management', 'manage the project', 'do you manage projects', 'construction management', 'run the project'],
      answer: [
        'Yes. We plan it, coordinate the trades, and keep it on schedule and on budget, start to finish.\n\nIs it a project you already have on the table?',
        'That is one of our ten. One company holding the schedule, the trades and the budget.\n\nWhat stage is your project at?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'general contracting',
      offerFlow: 'project',
      keys: ['general contracting', 'general contractor', 'are you a gc', 'main contractor', 'act as contractor', 'prime contractor'],
      answer: [
        'Yes. As general contractor we take the whole delivery — subcontractors, suppliers, and the result.\n\nWhat is the project?',
        'We do. One company answering for the job, rather than five pointing at each other.\n\nTell me a bit about it.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'labour supply',
      offerFlow: 'project',
      keys: ['labour', 'labor', 'skilled labour', 'workers', 'crew', 'manpower', 'supply workers', 'staff for site', 'trades people', 'short handed'],
      answer: [
        'Yes — qualified site crews, for when what you need is capacity, not a full contract.\n\nWhich trades are you short on?',
        'We supply skilled site personnel. Tell me the trade and the site, and we will tell you what we can put on the ground.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'commercial construction',
      offerFlow: 'project',
      keys: ['commercial construction', 'commercial building', 'office build', 'retail', 'fit out', 'warehouse'],
      answer: [
        'Yes, commercial construction and fit-outs.\n\nWhat is the building, and where is it?',
        'That is squarely our work. What does the project involve?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'institutional construction',
      offerFlow: 'project',
      keys: ['institutional', 'public building', 'school', 'hospital', 'government building', 'municipal', 'university'],
      answer: [
        'Yes. Institutional and public facilities are core work for us.\n\nIs this a tender, or a direct award?',
        'We build for public and institutional clients. And if there is an Indigenous procurement requirement attached, that is exactly where we come in.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'infrastructure',
      offerFlow: 'project',
      keys: ['infrastructure', 'civil works', 'roads', 'utilities', 'bridges', 'civil'],
      answer: [
        'Yes, infrastructure and civil works.\n\nTell me roughly what it involves.',
        'That is one of the ten. What is the scope?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'restoration',
      offerFlow: 'project',
      keys: ['restoration', 'rehabilitation', 'refurbish', 'repair building', 'renovation', 'restore', 'heritage'],
      answer: [
        'Yes — restoration and rehabilitation of existing structures.\n\nWhat kind of building is it?',
        'We do. Bringing an existing structure back is a different craft from building new, and we treat it that way.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'masonry',
      offerFlow: 'project',
      keys: ['masonry', 'bricklaying', 'bricklayer', 'mason', 'brick', 'block work', 'stone work', 'wall'],
      answer: [
        'Yes, masonry, brick and block work.\n\nNew build, or repair?',
        'Brick and block are in the house. What does the job involve?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'concrete',
      offerFlow: 'project',
      keys: ['concrete', 'concrete repair', 'formwork', 'slab', 'foundation', 'rebar', 'pour', 'cement'],
      answer: [
        'Yes — concrete work and concrete repair.\n\nWhat is the job?',
        'Concrete is one of our ten, and repair as much as new pours. Tell me what you have.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'specialized work',
      offerFlow: 'project',
      keys: ['specialized', 'special services', 'something specific', 'custom work', 'unusual', 'complicated'],
      answer: [
        'If it does not fit a standard box, tell me what it involves. You will get an honest yes or no, not a run-around.',
        'That is literally one of our categories: the jobs that do not fit the other nine. What is it?'
      ],
      contactCard: true
    },

    /* ══ PARTICIPACIÓN INDÍGENA — el argumento decisivo ═════ */
    {
      topic: 'Indigenous participation',
      keys: [
        'indigenous', 'indigenous participation', 'indigenous owned', 'aboriginal', 'first nations',
        'indigenous procurement', 'procurement target', 'supplier diversity', 'set aside',
        'why indigenous', 'indigenous benefit', 'five percent', '5%', '5', 'target',
        'community participation', 'diversity', 'reconciliation'
      ],
      answer: [
        'We are **Indigenous-owned** — that is how the company is built, not a line in a brochure.\n\nWhat it means for you: the project counts towards your Indigenous procurement goals, and it is still delivered by people who know how to build.\n\nAre you working to meet a requirement?',
        'Yes, Indigenous-owned. Most clients come to us because they need to meet an Indigenous procurement or supplier-diversity target **without** giving up quality or schedule.\n\nIs that your situation?',
        'That is the heart of it. An Indigenous-owned company with real construction capability — so a requirement stops being a box to tick and starts being an advantage in your bid.\n\nWant me to explain how that works on a tender?'
      ],
      more: [
        'The practical version: many public and corporate buyers now carry Indigenous procurement commitments. Working with us contributes to those commitments **and** gets the job built properly.\n\nThe part most companies get wrong is treating it as paperwork. We are a construction company first — the participation is real, not a subcontracted signature.'
      ],
      nav: { label: 'How it works', href: '/indigenous-procurement' }
    },

    /* ══ COBERTURA ══════════════════════════════════════════ */
    {
      topic: 'coverage',
      offerFlow: 'project',
      keys: [
        'where do you work', 'coverage', 'regions', 'do you work in', 'ontario', 'toronto',
        'canada', 'outside ontario', 'other provinces', 'service area', 'gta', 'do you travel',
        'ottawa', 'hamilton', 'mississauga', 'far'
      ],
      answer: [
        'Toronto is home, and we work across **Ontario and Canada**.\n\nWhere is your project? Name the city and you will get a straight answer about whether we can take it.',
        'Across Ontario, and Canada-wide when the job calls for it.\n\nWhereabouts are you?',
        'We are based in Toronto — 37 Kodiak Crescent — and we work right across the country.\n\nWhere would this project be?'
      ]
    },

    /* ══ CONTACTO ═══════════════════════════════════════════ */
    {
      topic: 'contact',
      keys: [
        'contact', 'phone', 'call', 'telephone', 'email', 'reach you', 'get in touch',
        'talk to a person', 'talk to someone', 'human', 'speak to someone', 'advisor',
        'representative', 'whatsapp', 'address', 'where are you', 'office', 'your location'
      ],
      answer: [
        'Of course. Pick whichever suits you:',
        'Here is the team — any of these reaches a person:',
        'Straight to a human, then:',
        'All three go to the same office. Use the one you like:'
      ],
      contactCard: true
    },

    /* ══ EMPEZAR / PRESUPUESTO ══════════════════════════════ */
    {
      topic: 'starting a project',
      offerFlow: 'project',
      keys: [
        'quote', 'quotation', 'estimate', 'proposal', 'how do i hire', 'how do we start',
        'how do i start a project', 'next step', 'i want to hire you', 'tender', 'bid',
        'how much', 'price', 'cost', 'rates', 'budget', 'expensive', 'pricing'
      ],
      answer: [
        'Easier than you think. Three things: **what** the project is, **where** it is, and **when** you need it. That is enough for us to come back to you.\n\nOn price, I do not give numbers — a figure invented by an assistant helps nobody. A person will give you a real one.',
        'Tell us what, where and when. That is the whole beginning.\n\nI will not quote you a price, and you should be suspicious of any assistant that does. A person will.',
        'You do not need drawings or technical language to start. What is it, where is it, when do you need it. The rest we work out with you.'
      ],
      more: [
        'What happens after you get in touch:\n\n1. We ask a few questions about scope and site.\n2. If it is our kind of work, we say so — and if it is not, we say that too.\n3. You get a real number from a person, not a guess from a machine.'
      ],
      contactCard: true,
      nav: { label: 'Send us your project', href: '/contact' }
    },
    {
      topic: 'the contact form',
      keys: [
        'how do i use the form', 'how does the form work', 'fill the form', 'contact form',
        'what do i write', 'what do i put', 'how do i send', 'submit'
      ],
      answer: [
        'It is short, I promise. Name, an email or phone, and a few lines about the project — plain words, no technical language.\n\nPress send and it lands in the office inbox. Shall I take you there?',
        'Five fields, no jargon. Who you are, how to reach you, and what you need.\n\nWant me to open it?'
      ],
      nav: { label: 'Take me to the form', href: '/contact' }
    },

    /* ══ PROYECTOS — honesto mientras no haya casos reales ══ */
    {
      topic: 'past projects',
      offerFlow: 'project',
      keys: [
        'your projects', 'past projects', 'previous projects', 'portfolio', 'case studies',
        'past work', 'references', 'examples of your work', 'what have you built',
        'track record', 'have you done'
      ],
      /* ⚠️ PENDIENTE: sustituir en cuanto lleguen casos verificados. */
      answer: [
        'Our project pages are being finished with real, verified cases. We would rather show you nothing than show you something that is not ours.\n\nTell me your line of work and someone will walk you through what we have delivered in it.',
        'Honestly: the published cases are not up yet, and I will not dress up placeholders as projects.\n\nIf you want relevant examples, ask the team directly — they will give you the real ones.'
      ],
      contactCard: true
    },

    /* ══ EMPLEO Y SUBCONTRATAS ══════════════════════════════ */
    {
      topic: 'careers',
      offerFlow: 'job',
      keys: [
        'job', 'jobs', 'careers', 'work with you', 'hiring', 'vacancy', 'apply', 'employment',
        'send my resume', 'resume', 'looking for work', 'i need a job', 'position', 'recruiting'
      ],
      answer: [
        'Good. We take on site and trades people, and technical and management roles.\n\nSend your trade and your experience through the Careers page — it takes two minutes.',
        'We are always interested in people who can actually do the work.\n\nTell us your trade and where you are based, through the Careers page.',
        'Yes. Two broad groups: site and trades, and technical and management.\n\nWhich one are you?'
      ],
      nav: { label: 'Careers', href: '/careers' }
    },
    {
      topic: 'subcontracting',
      offerFlow: 'job',
      keys: ['subcontractor', 'subcontract', 'supplier', 'vendor', 'register as supplier', 'work as a sub', 'partner with you'],
      answer: [
        'Yes, we register subcontractors and suppliers. Send your trade, your area and your credentials, and you stay on file for upcoming work.',
        'We do use subcontractors. Register through the Careers page — trade, coverage, credentials.'
      ],
      nav: { label: 'Register', href: '/careers' }
    },

    /* ══ SEGURIDAD Y SEGUROS ════════════════════════════════ */
    {
      topic: 'safety and insurance',
      keys: [
        'safety', 'health and safety', 'accidents', 'safe', 'wsib', 'wsib coverage', 'insurance',
        'insurance coverage', 'insured', 'certified', 'certification', 'licence', 'license',
        'liability', 'bonded', 'compliance', 'prequalification'
      ],
      /* ⚠️ PENDIENTE: seguros, WSIB y certificaciones. NO afirmar nada. */
      answer: [
        'Safety is not something we trade away for a schedule.\n\nFor the actual paperwork — coverage, certificates, numbers — I will not quote what I cannot verify. The office will send you the current documents:',
        'We deliver without compromising on safety. That is the position.\n\nThe documents themselves come from a person, not from me — I am not going to state a certification I cannot confirm:'
      ],
      contactCard: true
    },

    /* ══ HORARIO ════════════════════════════════════════════ */
    {
      topic: 'business hours',
      keys: ['hours', 'opening hours', 'when are you open', 'business hours', 'what time', 'are you open', 'weekend'],
      /* ⚠️ PENDIENTE: horario oficial. */
      answer: [
        'Our hours are not published yet, so I will not guess. Call **647 895 0939** — and if nobody picks up, write, and you will get an answer.',
        'I do not have the official hours to hand. The reliable route is the phone, or a message:'
      ],
      contactCard: true
    },

    /* ══ PLAZOS ═════════════════════════════════════════════ */
    {
      topic: 'timelines',
      offerFlow: 'project',
      keys: ['how long', 'timeline', 'schedule', 'deadline', 'when can you start', 'urgent', 'how soon', 'availability', 'duration'],
      answer: [
        'That depends entirely on the scope and the site — and anyone who gives you a timeline without seeing either is guessing.\n\nTell the team what you have and when you need it, and you will get a real answer:',
        'Honest answer: it depends on the job. What I can tell you is that schedule is one of the three things we do not compromise on, alongside safety and quality.\n\nFor a real date, a person:'
      ],
      contactCard: true
    },

    /* ══════════════════════════════════════════════════════════
       ENTRADAS NACIDAS DE LA SIMULACIÓN DE VISITANTES REALES
    ══════════════════════════════════════════════════════════ */

    /* ── LA SEÑORA MAYOR: no sabe usar esto, y no quiere aprender ── */
    {
      topic: 'speaking to a person',
      keys: [
        'can someone call me', 'call me back', 'i want someone to call', 'i do not use email',
        'i do not use computers', 'i am not good with computers', 'this is too complicated',
        'i do not know how to do this', 'can i just call', 'i prefer to talk', 'phone me',
        'too technical', 'i am old'
      ],
      answer: [
        'Then let us not bother with any of this. Pick up the phone and call **647 895 0939** — a person answers, and you can say it in your own words.',
        'No need to use any of this. Call **647 895 0939** and talk to someone directly. That is the shortest path, and there is nothing wrong with taking it.',
        'You do not have to learn anything. Ring **647 895 0939** and tell them what you need — they will take it from there.'
      ],
      contactCard: true
    },
    {
      topic: 'is the company real',
      boost: 1.5,
      keys: [
        'are you legitimate', 'are you real', 'is this a real company', 'can i trust you',
        'are you registered', 'is this legit', 'scam', 'how do i know you are real',
        'proof', 'verify', 'incorporated', 'corporation number', 'legal name'
      ],
      answer: [
        'Fair question, and here is the answer in plain terms.\n\n**North Peak Construction Alliance Inc.** is federally incorporated in Canada, Corporation No. **1521162-0**, with a physical office at **37 Kodiak Crescent, Unit 11, Toronto**.\n\nYou can call the office and speak to a person, or come by. Nothing here is a mailbox.',
        'You should ask that of anyone you hire.\n\nFederally incorporated, Corporation No. **1521162-0**. Real office at 37 Kodiak Crescent, Toronto. Real phone: 647 895 0939.\n\nVerify any of it — that is what it is there for.'
      ],
      contactCard: true
    },
    {
      topic: 'visiting the office',
      keys: [
        'can i visit', 'come to your office', 'in person', 'meet you', 'meeting', 'drop by',
        'where can i find you', 'face to face', 'sit down'
      ],
      answer: [
        'The office is at **37 Kodiak Crescent, Unit 11, Toronto, ON M3J 3G5**.\n\nCall **647 895 0939** first so someone is expecting you — that way you are not turning up to a locked door.',
        'Yes. 37 Kodiak Crescent, Unit 11, Toronto. Ring ahead on 647 895 0939 and they will make time for you.'
      ],
      contactCard: true
    },
    {
      topic: 'the directors',
      keys: [
        'who runs the company', 'owner', 'owners', 'directors', 'director', 'management',
        'who is in charge', 'leadership', 'founder', 'ceo', 'boss', 'principals'
      ],
      answer: [
        'The company\'s directors are **Riley Birkett** and **Pavel Portelles Rivas**.\n\nIf you want to speak to leadership directly rather than through me, the office will put you through.',
        'Two directors: **Riley Birkett** and **Pavel Portelles Rivas**. It is not a faceless outfit — you can talk to the people who run it.'
      ],
      contactCard: true,
      nav: { label: 'About the company', href: '/about' }
    },

    /* ── EL JOVEN EMPRENDEDOR: "¿esto a mí en qué me sirve?" ── */
    {
      topic: 'how this helps your business',
      offerFlow: 'project',
      keys: [
        'how does this help me', 'how can you help my business', 'what is in it for me',
        'why should i work with you', 'what do i gain', 'benefit for me', 'value',
        'my business', 'my company', 'help my company', 'why you'
      ],
      answer: [
        'Depends what you are building, so tell me that. But in general, clients come to us for one of three reasons:\n\n- They need the work **built properly**.\n- They need to hit an **Indigenous procurement target** on a bid.\n- They need **capacity** — a crew, fast.\n\nWhich of those is you?',
        'Straight answer: we are useful to you if you have something to build, a bid to win, or a site short of hands.\n\nWhich one describes your situation?'
      ],
      more: [
        'The one that surprises people: if you are bidding on public or corporate work, having a genuine Indigenous-owned partner is not a box to tick — it can be the difference between winning and coming second. And unlike a paper arrangement, we actually do the construction.'
      ]
    },
    {
      topic: 'small businesses and startups',
      offerFlow: 'project',
      keys: [
        'small business', 'startup', 'start up', 'small company', 'new business', 'minimum project',
        'too small', 'small project', 'is there a minimum', 'small budget', 'just starting'
      ],
      answer: [
        'We do not have a published minimum, and I am not going to invent one.\n\nTell the team what your project is — they will tell you honestly whether it makes sense for both sides. Nobody wants to take on a job they cannot do well.',
        'Ask, rather than assume. Some small jobs are a good fit and some are not, and a person will tell you which yours is — without wasting your time.'
      ],
      contactCard: true
    },
    {
      topic: 'partnerships and joint ventures',
      keys: [
        'partnership', 'partner', 'joint venture', 'jv', 'team up', 'collaborate', 'work together',
        'alliance', 'consortium'
      ],
      answer: [
        'That conversation is worth having, and it is not one for an assistant.\n\nSend an outline to the office and it goes to the directors:',
        'Partnerships and joint ventures are a leadership conversation. Put it in writing to the office and it reaches the right desk:'
      ],
      contactCard: true
    },
    {
      topic: 'what makes you different',
      offerFlow: 'project',
      keys: [
        'what makes you different', 'why you and not', 'competition', 'competitors', 'better than',
        'compare', 'advantage', 'unique', 'differentiator', 'stand out'
      ],
      answer: [
        'One thing, mainly: most clients have to choose between hiring an Indigenous-owned company and hiring one that can genuinely deliver the construction. Here it is the same company.\n\nThat is the whole proposition, and it is not a small one.',
        'We are Indigenous-owned **and** we build. Plenty of firms offer one or the other; the combination is rarer than it should be.\n\nIf that is not what you need, we will tell you so.'
      ],
      nav: { label: 'The Indigenous advantage', href: '/indigenous-procurement' }
    },

    /* ── EL EJECUTIVO MINUCIOSO: riesgo, control, letra pequeña ── */
    {
      topic: 'delays and change orders',
      keys: [
        'delay', 'delays', 'late', 'behind schedule', 'change order', 'variation', 'overrun',
        'what if something goes wrong', 'contingency', 'dispute', 'penalty'
      ],
      /* ⚠️ PENDIENTE: procedimiento contractual real de la empresa. */
      answer: [
        'That is exactly the right question to ask before signing anything, and exactly the wrong one to answer with a generic line.\n\nHow delays, changes and contingencies are handled belongs in the contract, and belongs to a person who can commit to it. Ask the team:',
        'I am not going to give you a comfortable answer to a serious question. Delay and change-order terms are contract matters — get them from someone who can put their name to them:'
      ],
      contactCard: true
    },
    {
      topic: 'capacity and team size',
      keys: [
        'how many employees', 'team size', 'how big', 'capacity', 'how many people',
        'how many crews', 'resources', 'bandwidth', 'can you handle'
      ],
      /* ⚠️ PENDIENTE: plantilla y capacidad. */
      answer: [
        'I do not publish headcount figures I cannot verify, and you would be right not to trust a number that came from an assistant.\n\nAsk the office about capacity for your specific scope — that is the only answer worth having:',
        'Capacity depends entirely on the job and the window. A person will tell you what can actually be put on the ground and when:'
      ],
      contactCard: true
    },
    {
      topic: 'payment terms',
      keys: [
        'payment terms', 'invoice', 'deposit', 'payment schedule', 'holdback', 'billing',
        'when do i pay', 'progress payments', 'net 30'
      ],
      /* ⚠️ PENDIENTE: condiciones comerciales. */
      answer: [
        'Commercial terms come from the contract, not from me. Ask the office and you will get them in writing:',
        'That belongs in the contract, and I will not paraphrase a contract. The team will send you the terms:'
      ],
      contactCard: true
    },
    {
      topic: 'prequalification documents',
      keys: [
        'prequalification', 'prequal', 'documents', 'paperwork', 'submission', 'due diligence',
        'vendor form', 'compliance package', 'send me your'
      ],
      answer: [
        'Send the office your prequalification package or vendor form and it will be completed and returned by a person who can sign it.\n\nThat is not something an assistant should be filling in:',
        'Yes — send the forms to **admin@northalliancegroup.ca** and they come back completed and signed.'
      ],
      contactCard: true
    },

    /* ── EL ESCÉPTICO: la pregunta incómoda, respondida de frente ── */
    {
      topic: 'authenticity of the Indigenous participation',
      boost: 2,        /* esta pregunta abre siempre; no la eclipsa nadie */
      keys: [
        'shell company', 'front', 'token', 'tokenism', 'just for the quota', 'paper company',
        'fake indigenous', 'is it genuine', 'participation genuine', 'really indigenous', 'genuine', 'rent a native', 'box ticking',
        'washing'
      ],
      answer: [
        'You are right to ask, and the industry has earned that suspicion.\n\nThe distinction is simple: some arrangements exist so a form can be signed, and no Indigenous-owned business does any of the work. That is not this. North Peak is a construction company that builds — the participation is in the ownership and in the delivery, not in the paperwork.\n\nIf you want to test that, ask the directors directly. They will not be offended.',
        'Fair challenge. Plenty of arrangements out there are exactly what you describe, and they damage everyone who is doing it properly.\n\nWe are a construction company first. The work is done by us, not signed over to someone else. And you are welcome to put that question to the directors:'
      ],
      contactCard: true,
      nav: { label: 'Indigenous procurement', href: '/indigenous-procurement' }
    },

    /* ── COMPRADOR PÚBLICO / CONTRATISTA GENERAL ── */
    {
      topic: 'meeting a procurement requirement',
      offerFlow: 'project',
      keys: [
        'we need an indigenous subcontractor', 'need an indigenous partner', 'our bid requires',
        'meet our target', 'procurement requirement', 'indigenous content', 'ibp',
        'indigenous benefits plan', 'set aside contract', 'psib'
      ],
      answer: [
        'That is precisely what we are for.\n\nTell us the scope, the region and the deadline, and the team will tell you straight away whether we can carry the work — not just the requirement.\n\nWhat is the project?',
        'Good. The important part, and the part that trips people up: we do the construction. Your requirement is met **and** the work gets built.\n\nSend the scope and the timeline:'
      ],
      contactCard: true,
      nav: { label: 'Indigenous procurement', href: '/indigenous-procurement' }
    },

    /* ══ RESIDENCIAL ════════════════════════════════════════ */
    {
      topic: 'residential work',
      offerFlow: 'project',
      keys: ['residential', 'my house', 'home renovation', 'basement', 'kitchen', 'small job', 'handyman', 'my home'],
      /* ⚠️ PENDIENTE: confirmar si aceptan residencial. */
      answer: [
        'Our work is mostly commercial, institutional and infrastructure, and supporting general contractors.\n\nIf yours is smaller, ask anyway — you will get a straight yes or no, not a run-around.',
        'That is not our usual ground, I will be honest. But rather than send you away, ask the team: they will tell you plainly whether it is a fit.'
      ],
      contactCard: true
    }

  ]
};
