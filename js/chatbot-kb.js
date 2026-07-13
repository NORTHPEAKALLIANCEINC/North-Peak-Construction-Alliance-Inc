/* ================================================================
   KODIAK — Base de conocimiento del asistente virtual
   North Peak Construction Alliance Inc.

   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA CAMBIAR LO QUE
   EL ASISTENTE SABE O DICE. El motor (js/chatbot.js) no se toca.

   ── LAS TRES REGLAS DEL TONO ─────────────────────────────────
   1. CORTO. Dos o tres frases. Nadie quiere una enciclopedia por
      preguntar "¿qué hacéis?". Si hay más que contar, se ofrece,
      no se suelta.
   2. DEVOLVER LA PELOTA. Casi toda respuesta termina en una
      pregunta. Así el visitante no se queda mirando la pantalla
      sin saber qué hacer: es una conversación, no un folleto.
   3. NUNCA DEJAR SIN SALIDA. Si no lo sabe, lo dice y ofrece una
      persona. No inventa jamás: ni precios, ni certificaciones,
      ni proyectos.

   ── Cómo se escribe una entrada ──────────────────────────────
   {
     keys:   ['todas las formas de preguntar lo mismo'],
     answer: ['Respuesta.', 'Variante 2.'],       // elige una al azar
     nav:    { label: 'View services', href: '/services' },  // opcional
     contactCard: true                             // opcional
   }
   El texto admite **negrita**, listas con "- " y saltos con \n.

   ⚠️ PENDIENTE = respuesta que espera datos del cliente. No miente,
   pero hay que sustituirla en cuanto lleguen.
================================================================ */

window.NP_BOT_KB = {

  bot: {
    name:   'Kodiak',
    role:   'Virtual Assistant',
    avatar: '/images/bot-avatar.webp',

    greeting: [
      'Hi, I am **Kodiak**. I help visitors find their way around North Peak.\n\nWhat brings you here today?',
      'Hello. I am **Kodiak**, from North Peak Construction Alliance.\n\nTell me what you are looking for and I will take you there. What do you need?'
    ],

    fallback: [
      'I want to get that right rather than guess, and I do not have it.\n\nLet me put you through to someone who does:',
      'That one is beyond me, and I would rather not invent an answer.\n\nA person will sort you out in a minute:'
    ],

    quick: [
      { label: 'What you do',     q: 'What services do you offer?' },
      { label: 'Indigenous',      q: 'What is your Indigenous participation?' },
      { label: 'Where you work',  q: 'Where do you work?' },
      { label: 'Start a project', q: 'How do I start a project with you?' },
      { label: 'Talk to a person', q: 'I want to talk to a person' },
      { label: 'I am lost',       q: 'I do not know where to start' }
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

    /* ═══ CORTESÍA ═══════════════════════════════════════════ */
    {
      keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      answer: [
        'Hello. What can I help you with?',
        'Hi there. What would you like to know?'
      ]
    },
    {
      keys: ['thank you', 'thanks', 'appreciate it', 'cheers', 'great', 'perfect'],
      answer: [
        'Glad to help. Anything else?',
        'My pleasure. Anything else on your mind?'
      ]
    },
    {
      keys: ['bye', 'goodbye', 'see you', 'that is all', 'nothing else', 'no thanks'],
      answer: [
        'Take care. If you need us, we are on **647 895 0939**.',
        'Good talking to you. We are here whenever you need us.'
      ]
    },
    {
      keys: ['who are you', 'what are you', 'are you a robot', 'are you human', 'your name', 'are you a bot', 'am i talking to a person'],
      answer: [
        'I am **Kodiak**, an assistant. Not a person — I only tell you what the company has confirmed, and I never make things up.\n\nIf you would rather talk to someone real, just say the word.'
      ]
    },

    /* ═══ "NO SÉ POR DÓNDE EMPEZAR" — la entrada más importante ═
       El visitante que llega perdido es el que se pierde para siempre
       si nadie lo coge de la mano. Aquí se le coge de la mano.       */
    {
      keys: [
        'i do not know where to start', 'i am lost', 'help me', 'guide me', 'i need help',
        'where do i start', 'how does this work', 'how do i use this', 'i do not understand',
        'what do i do', 'confused', 'show me around', 'not sure'
      ],
      answer: [
        'No problem at all. Let us keep it simple.\n\nAre you here to:\n\n- **Hire us** for a project\n- **Work with us** (job or subcontract)\n- Just **understand what we do**\n\nTell me which one, in your own words, and I will take it from there.'
      ]
    },

    /* ═══ LA EMPRESA ═════════════════════════════════════════ */
    {
      keys: [
        'about the company', 'what is north peak', 'tell me about north peak', 'about you',
        'who is north peak', 'company information', 'background', 'your company'
      ],
      answer: [
        'We are an **Indigenous-owned construction company** based in Toronto, working across Ontario and Canada.\n\nWe build for general contractors, public bodies and private clients. Would you like the detail, or is there something specific you need?',
        'North Peak is a Toronto construction company, Indigenous-owned, working right across Canada.\n\nWhat would you like to know first — what we build, or who we build it for?'
      ],
      nav: { label: 'About us', href: '/about' }
    },

    /* ═══ SERVICIOS ══════════════════════════════════════════ */
    {
      keys: [
        'services', 'what do you do', 'what you do', 'what do you offer', 'offer', 'work you do',
        'capabilities', 'what can you build', 'trades', 'what type of work', 'lines of work'
      ],
      answer: [
        'We cover the whole job — from managing the project to doing the work on site. Ten areas in total: project management, general contracting, labour supply, commercial and institutional builds, infrastructure, restoration, masonry, concrete and specialized work.\n\nWhich of those is closest to what you need?',
        'In short: we can run your project, act as your general contractor, or send you the crew. Commercial, institutional and infrastructure work, plus masonry, concrete and restoration.\n\nWhat kind of project do you have?'
      ],
      nav: { label: 'See all ten', href: '/services' }
    },
    {
      keys: ['project management', 'manage the project', 'do you manage projects', 'construction management'],
      answer: ['Yes. We plan it, coordinate the trades and keep it on schedule and on budget, from start to finish.\n\nIs it a project you already have on the table?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['general contracting', 'general contractor', 'are you a gc', 'main contractor', 'act as contractor'],
      answer: ['Yes. As general contractor we take the whole delivery: subcontractors, suppliers and the result. One company answering for the job.\n\nWhat is the project?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['labour', 'labor', 'skilled labour', 'workers', 'crew', 'manpower', 'supply workers', 'staff for site'],
      answer: ['Yes, we supply qualified site crews when what you need is capacity, not a full contract.\n\nWhich trades are you short on?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['commercial construction', 'commercial building', 'office build', 'retail', 'fit out'],
      answer: ['Yes, commercial construction and fit-outs are one of our ten areas.\n\nWhat is the building, and where?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['institutional', 'public building', 'school', 'hospital', 'government building', 'municipal'],
      answer: ['Yes. Institutional and public facilities are core work for us.\n\nIs this a tender, or a direct job?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['infrastructure', 'civil works', 'roads', 'utilities'],
      answer: ['Yes, infrastructure and civil works.\n\nTell me roughly what it involves and I will point you to the right person.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['restoration', 'rehabilitation', 'refurbish', 'repair building', 'renovation', 'restore'],
      answer: ['Yes — restoration and rehabilitation of existing structures is one of our areas.\n\nWhat kind of building is it?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['masonry', 'bricklaying', 'bricklayer', 'mason', 'brick', 'block work', 'stone work'],
      answer: ['Yes, masonry, brick and block work.\n\nIs it new build or repair?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['concrete', 'concrete repair', 'formwork', 'slab', 'foundation', 'rebar', 'pour'],
      answer: ['Yes, concrete work and concrete repair.\n\nWhat does the job involve?'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['specialized', 'special services', 'something specific', 'custom work', 'unusual'],
      answer: ['If it does not fit a standard box, tell me what it involves. We will give you an honest yes or no rather than string you along.'],
      contactCard: true
    },

    /* ═══ PARTICIPACIÓN INDÍGENA ═════════════════════════════ */
    {
      keys: [
        'indigenous', 'indigenous participation', 'indigenous owned', 'aboriginal', 'first nations',
        'indigenous procurement', 'procurement target', 'supplier diversity', 'set aside',
        'why indigenous', 'indigenous benefit', 'five percent', '5%', '5', 'target', 'community participation', 'diversity'
      ],
      answer: [
        'We are **Indigenous-owned** — that is how the company is built, not a line in a brochure.\n\nFor you it means one thing: the project counts towards your Indigenous procurement goals, and it is still delivered by people who know how to build.\n\nAre you working to meet a procurement requirement?',
        'Yes, Indigenous-owned. Most clients come to us because they need to meet an Indigenous procurement or supplier-diversity target **without** giving up quality or schedule.\n\nIs that your situation? I can go deeper if it helps.'
      ],
      nav: { label: 'How it works', href: '/indigenous-procurement' }
    },

    /* ═══ COBERTURA ══════════════════════════════════════════ */
    {
      keys: [
        'where do you work', 'coverage', 'area', 'regions', 'do you work in', 'ontario', 'toronto',
        'canada', 'outside ontario', 'other provinces', 'service area', 'gta', 'do you travel'
      ],
      answer: [
        'Toronto is home, and we work across **Ontario and Canada**.\n\nWhere is your project? Tell me the city and I will be straight with you about whether we can take it.'
      ]
    },

    /* ═══ CONTACTO ═══════════════════════════════════════════ */
    {
      keys: [
        'contact', 'phone', 'call', 'telephone', 'email', 'reach you', 'get in touch',
        'talk to a person', 'talk to someone', 'human', 'speak to someone', 'advisor',
        'representative', 'whatsapp', 'address', 'where are you', 'office', 'your location'
      ],
      answer: [
        'Of course. Here is the team — pick whichever suits you:',
        'Here you go. Any of these reaches a person:'
      ],
      contactCard: true
    },

    /* ═══ EMPEZAR UN PROYECTO / PRESUPUESTO ══════════════════ */
    {
      keys: [
        'quote', 'quotation', 'estimate', 'proposal', 'how do i hire', 'how do we start',
        'how do i start a project', 'next step', 'i want to hire you', 'tender', 'bid',
        'how much', 'price', 'cost', 'rates', 'budget', 'expensive'
      ],
      answer: [
        'Easier than you think. Three things: **what** the project is, **where** it is, and **when** you need it. That is enough for us to come back to you.\n\nYou can tell a person directly, or send it through the form — whichever you prefer.\n\nOn price: I do not give numbers. A figure invented by an assistant helps nobody. A person will give you a real one.'
      ],
      contactCard: true,
      nav: { label: 'Send us your project', href: '/contact' }
    },
    /* Guía paso a paso del formulario, para quien nunca ha usado uno. */
    {
      keys: [
        'how do i use the form', 'how does the form work', 'fill the form', 'contact form',
        'what do i write', 'what do i put', 'how do i send'
      ],
      answer: [
        'It is short, I promise. The form asks for your **name**, your **email or phone**, and a few lines about the project — in plain words, no technical language needed.\n\nYou press send, and it lands in the office inbox. Someone comes back to you.\n\nShall I take you there?'
      ],
      nav: { label: 'Take me to the form', href: '/contact' }
    },

    /* ═══ PROYECTOS — honesto mientras no haya casos reales ══ */
    {
      keys: [
        'projects', 'portfolio', 'case studies', 'past work', 'references', 'examples',
        'what have you built', 'previous projects', 'experience'
      ],
      /* ⚠️ PENDIENTE: sustituir en cuanto lleguen casos verificados. */
      answer: [
        'Our project pages are being finished with real, verified cases. We would rather show you nothing than show you something that is not ours.\n\nIf you tell me your line of work, someone can walk you through what we have delivered in it.'
      ],
      contactCard: true
    },

    /* ═══ EMPLEO Y SUBCONTRATAS ══════════════════════════════ */
    {
      keys: [
        'job', 'jobs', 'careers', 'work with you', 'hiring', 'vacancy', 'apply', 'employment',
        'send my resume', 'cv', 'looking for work', 'i need a job'
      ],
      answer: [
        'Good. We take on site and trades people, and technical and management roles.\n\nTell us your trade and your experience through the Careers page — it takes two minutes.'
      ],
      nav: { label: 'Careers', href: '/careers' }
    },
    {
      keys: ['subcontractor', 'subcontract', 'supplier', 'vendor', 'register as supplier', 'work as a sub'],
      answer: [
        'Yes, we register subcontractors and suppliers. Send your trade, your area and your credentials and we keep you on file for upcoming work.'
      ],
      nav: { label: 'Register', href: '/careers' }
    },

    /* ═══ SEGURIDAD Y SEGUROS ════════════════════════════════ */
    {
      keys: [
        'safety', 'health and safety', 'accidents', 'safe', 'wsib', 'wsib coverage', 'insurance',
        'insurance coverage', 'insured', 'certified', 'certification', 'licence', 'license',
        'liability', 'bonded'
      ],
      /* ⚠️ PENDIENTE: seguros, WSIB y certificaciones. No afirmar nada. */
      answer: [
        'Safety is not something we trade away for a schedule.\n\nFor the actual paperwork — coverage, certificates, numbers — I will not quote anything I cannot verify. Ask the office and they will send you the current documents:'
      ],
      contactCard: true
    },

    /* ═══ HORARIO ════════════════════════════════════════════ */
    {
      keys: ['hours', 'opening hours', 'when are you open', 'business hours', 'what time', 'are you open'],
      /* ⚠️ PENDIENTE: horario oficial. */
      answer: [
        'Our hours are not published yet, so I will not guess. Call **647 895 0939** — and if nobody picks up, write and you will get an answer.'
      ],
      contactCard: true
    },

    /* ═══ RESIDENCIAL ════════════════════════════════════════ */
    {
      keys: ['residential', 'my house', 'home renovation', 'basement', 'kitchen', 'small job', 'handyman'],
      /* ⚠️ PENDIENTE: confirmar si aceptan residencial. */
      answer: [
        'Our work is mostly commercial, institutional and infrastructure, and supporting general contractors.\n\nIf yours is smaller, ask anyway — you will get a straight yes or no, not a run-around.'
      ],
      contactCard: true
    }

  ]
};
