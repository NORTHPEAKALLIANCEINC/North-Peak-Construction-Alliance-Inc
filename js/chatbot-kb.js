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

    quick: [
      { label: 'What you do',      q: 'What services do you offer?' },
      { label: 'Indigenous',       q: 'What is your Indigenous participation?' },
      { label: 'Where you work',   q: 'Where do you work?' },
      { label: 'Start a project',  q: 'How do I start a project with you?' },
      { label: 'Careers',          q: 'Are you hiring?' },
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
      keys: ['who are you', 'what are you', 'are you a robot', 'are you human', 'your name', 'are you a bot', 'am i talking to a person', 'are you real', 'ai'],
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
      keys: ['project management', 'manage the project', 'do you manage projects', 'construction management', 'run the project'],
      answer: [
        'Yes. We plan it, coordinate the trades, and keep it on schedule and on budget, start to finish.\n\nIs it a project you already have on the table?',
        'That is one of our ten. One company holding the schedule, the trades and the budget.\n\nWhat stage is your project at?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'general contracting',
      keys: ['general contracting', 'general contractor', 'are you a gc', 'main contractor', 'act as contractor', 'prime contractor'],
      answer: [
        'Yes. As general contractor we take the whole delivery — subcontractors, suppliers, and the result.\n\nWhat is the project?',
        'We do. One company answering for the job, rather than five pointing at each other.\n\nTell me a bit about it.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'labour supply',
      keys: ['labour', 'labor', 'skilled labour', 'workers', 'crew', 'manpower', 'supply workers', 'staff for site', 'trades people', 'short handed'],
      answer: [
        'Yes — qualified site crews, for when what you need is capacity, not a full contract.\n\nWhich trades are you short on?',
        'We supply skilled site personnel. Tell me the trade and the site, and we will tell you what we can put on the ground.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'commercial construction',
      keys: ['commercial construction', 'commercial building', 'office build', 'retail', 'fit out', 'warehouse'],
      answer: [
        'Yes, commercial construction and fit-outs.\n\nWhat is the building, and where is it?',
        'That is squarely our work. What does the project involve?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'institutional construction',
      keys: ['institutional', 'public building', 'school', 'hospital', 'government building', 'municipal', 'university'],
      answer: [
        'Yes. Institutional and public facilities are core work for us.\n\nIs this a tender, or a direct award?',
        'We build for public and institutional clients. And if there is an Indigenous procurement requirement attached, that is exactly where we come in.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'infrastructure',
      keys: ['infrastructure', 'civil works', 'roads', 'utilities', 'bridges', 'civil'],
      answer: [
        'Yes, infrastructure and civil works.\n\nTell me roughly what it involves.',
        'That is one of the ten. What is the scope?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'restoration',
      keys: ['restoration', 'rehabilitation', 'refurbish', 'repair building', 'renovation', 'restore', 'heritage'],
      answer: [
        'Yes — restoration and rehabilitation of existing structures.\n\nWhat kind of building is it?',
        'We do. Bringing an existing structure back is a different craft from building new, and we treat it that way.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'masonry',
      keys: ['masonry', 'bricklaying', 'bricklayer', 'mason', 'brick', 'block work', 'stone work', 'wall'],
      answer: [
        'Yes, masonry, brick and block work.\n\nNew build, or repair?',
        'Brick and block are in the house. What does the job involve?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'concrete',
      keys: ['concrete', 'concrete repair', 'formwork', 'slab', 'foundation', 'rebar', 'pour', 'cement'],
      answer: [
        'Yes — concrete work and concrete repair.\n\nWhat is the job?',
        'Concrete is one of our ten, and repair as much as new pours. Tell me what you have.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'specialized work',
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
      keys: [
        'projects', 'portfolio', 'case studies', 'past work', 'references', 'examples',
        'what have you built', 'previous projects', 'experience', 'track record'
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
      keys: ['how long', 'timeline', 'schedule', 'deadline', 'when can you start', 'urgent', 'how soon', 'availability', 'duration'],
      answer: [
        'That depends entirely on the scope and the site — and anyone who gives you a timeline without seeing either is guessing.\n\nTell the team what you have and when you need it, and you will get a real answer:',
        'Honest answer: it depends on the job. What I can tell you is that schedule is one of the three things we do not compromise on, alongside safety and quality.\n\nFor a real date, a person:'
      ],
      contactCard: true
    },

    /* ══ RESIDENCIAL ════════════════════════════════════════ */
    {
      topic: 'residential work',
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
