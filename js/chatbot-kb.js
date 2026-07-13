/* ================================================================
   KODIAK — Base de conocimiento del asistente virtual
   North Peak Construction Alliance Inc.

   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA CAMBIAR LO QUE
   EL ASISTENTE SABE O DICE. El motor (js/chatbot.js) no se toca.

   REGLA DE ORO: el asistente NO inventa. Si un dato no está aquí,
   responde que no lo tiene y ofrece pasar con una persona. En una
   empresa que licita con organismos públicos, una respuesta
   inventada es un problema real, no una anécdota.

   ── Cómo se escribe una entrada ──────────────────────────────
   {
     keys:    ['palabra', 'frase que el visitante podría escribir', ...],
     answer:  ['Respuesta.', 'Variante 2.'],   // elige una al azar
     nav:     { label: 'View services', href: '/services' }   // opcional
   }

   · keys   → todas las formas de preguntar lo mismo. Cuantas más,
              mejor reconoce. Se comparan en minúsculas y sin acentos.
   · answer → una o varias variantes; evita que suene a robot.
              Admite **negrita**, listas con "- " y saltos con \n.
   · nav    → añade un botón que lleva al visitante a la página
              correcta. Es lo que convierte al bot en un guía.

   MARCADO ⚠️ PENDIENTE: respuestas que esperan datos del cliente.
   Están redactadas con honestidad (no mienten), pero deben
   sustituirse en cuanto lleguen.
================================================================ */

window.NP_BOT_KB = {

  /* ── Identidad del asistente ────────────────────────────── */
  bot: {
    name:   'Kodiak',
    role:   'Virtual Assistant',
    avatar: '/images/bot-avatar.webp',
    /* Primer mensaje. Cálido, sin jerga, y siempre con una salida. */
    greeting: [
      'Hello. I am **Kodiak**, the virtual assistant for North Peak Construction Alliance.\n\nI can explain what we do, where we work, and how to get in touch. Ask me anything in plain words — or pick one of the buttons below.',
      'Welcome to **North Peak Construction Alliance**. I am Kodiak.\n\nTell me what you need and I will point you in the right direction. If you would rather speak to a person, just say so.'
    ],
    /* Cuando no entiende. Nunca deja al visitante en un callejón. */
    fallback: [
      'I am not sure I have that answer, and I would rather not guess.\n\nThe fastest way to a reliable answer is a person:',
      'That one is outside what I know. Rather than give you something wrong, let me put you in touch with the team:'
    ],
    /* Botones sugeridos bajo el chat */
    quick: [
      { label: 'What you do',   q: 'What services do you offer?' },
      { label: 'Indigenous',    q: 'What is your Indigenous participation?' },
      { label: 'Coverage',      q: 'Where do you work?' },
      { label: 'Get a quote',   q: 'How do I get a quote?' },
      { label: 'Talk to a person', q: 'I want to talk to a person' }
    ],
    /* Tarjeta de contacto: datos CONFIRMADOS */
    contact: {
      phone:     '647 895 0939',
      phoneHref: 'tel:+16478950939',
      email:     'admin@northalliancegroup.ca',
      whatsapp:  'https://wa.me/16478950939',
      page:      '/contact'
    }
  },

  /* ════════════════════════════════════════════════════════
     CONOCIMIENTO
  ════════════════════════════════════════════════════════ */
  kb: [

    /* ── Saludos y cortesía ───────────────────────────────── */
    {
      keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      answer: [
        'Hello. How can I help you today?',
        'Hi. What would you like to know about North Peak?'
      ]
    },
    {
      keys: ['thank you', 'thanks', 'appreciate it', 'cheers'],
      answer: [
        'You are welcome. Anything else I can help with?',
        'Happy to help. If you need anything else, I am here.'
      ]
    },
    {
      keys: ['bye', 'goodbye', 'see you', 'that is all', 'nothing else'],
      answer: [
        'Thank you for your time. When you are ready, call **647 895 0939** or write to **admin@northalliancegroup.ca**.',
        'Good to speak with you. We are here whenever you need us.'
      ]
    },
    {
      keys: ['who are you', 'what are you', 'are you a robot', 'are you human', 'your name', 'who am i talking to'],
      answer: [
        'I am **Kodiak**, an automated assistant for North Peak Construction Alliance. I am not a person — I answer with information the company has confirmed.\n\nIf you want to speak to a human, say so and I will give you the direct line.'
      ]
    },

    /* ── Qué es la empresa ────────────────────────────────── */
    {
      keys: [
        'who are you as a company', 'about the company', 'what is north peak', 'tell me about north peak',
        'about you', 'who is north peak', 'what does the company do', 'company information', 'background'
      ],
      answer: [
        '**North Peak Construction Alliance Inc.** is an Indigenous-owned construction company based in Toronto, working across Ontario and Canada.\n\nWe deliver projects for general contractors, public bodies and private clients — combining real construction capability with authentic Indigenous partnership.',
        'We are a federally incorporated construction company (Corporation No. **1521162-0**), Indigenous-owned, based at 37 Kodiak Crescent in Toronto.\n\nWe cover the full project cycle: management, general contracting and specialized on-site execution.'
      ],
      nav: { label: 'About the company', href: '/about' }
    },

    /* ── Servicios (general) ──────────────────────────────── */
    {
      keys: [
        'services', 'what do you do', 'what you do', 'what do you offer', 'offer', 'work you do',
        'capabilities', 'what can you build', 'trades', 'lines of work', 'what type of work'
      ],
      answer: [
        'We cover ten service areas, across the whole project cycle:\n\n- **Project management**\n- **General contracting**\n- **Skilled labour supply**\n- **Commercial construction**\n- **Institutional construction**\n- **Infrastructure services**\n- **Restoration and rehabilitation**\n- **Masonry and bricklaying**\n- **Concrete and concrete repair**\n- **Specialized construction services**\n\nTell me which one interests you and I will go deeper.',
        'From planning to execution: project management, general contracting, skilled labour, commercial and institutional builds, infrastructure, restoration, masonry, concrete work and specialized services.\n\nTen areas in total. Which one matters to you?'
      ],
      nav: { label: 'See all services', href: '/services' }
    },

    /* ── Servicios (individuales) ─────────────────────────── */
    {
      keys: ['project management', 'manage the project', 'do you manage projects', 'construction management'],
      answer: ['**Project management**: planning, coordination and control of the project from start to finish. We keep the schedule, the trades and the budget under one hand.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['general contracting', 'general contractor', 'are you a gc', 'act as contractor', 'main contractor'],
      answer: ['**General contracting**: we take full delivery of the works as general contractor, managing subcontractors and suppliers, and answering for the result.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['labour', 'labor', 'skilled labour', 'workers', 'crew', 'manpower', 'staff for site', 'supply workers'],
      answer: ['**Skilled labour supply**: qualified site personnel for construction projects, when you need capacity rather than a full contract.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['commercial construction', 'commercial building', 'office build', 'retail build', 'fit out'],
      answer: ['**Commercial construction**: construction and fit-out of commercial buildings.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['institutional', 'public building', 'school', 'hospital', 'government building'],
      answer: ['**Institutional construction**: works for public and institutional facilities.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['infrastructure', 'civil works', 'roads', 'utilities'],
      answer: ['**Infrastructure services**: execution of infrastructure and civil works.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['restoration', 'rehabilitation', 'refurbish', 'repair building', 'renovation'],
      answer: ['**Restoration and rehabilitation**: restoration and rehabilitation of existing structures.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['masonry', 'bricklaying', 'bricklayer', 'mason', 'brick', 'block work', 'stone work'],
      answer: ['**Masonry and bricklaying**: masonry, brick and block work.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['concrete', 'concrete repair', 'formwork', 'slab', 'foundation', 'rebar', 'pour'],
      answer: ['**Concrete and concrete repair**: execution and repair of concrete elements.'],
      nav: { label: 'Services', href: '/services' }
    },
    {
      keys: ['specialized', 'special services', 'something specific', 'custom work'],
      answer: ['**Specialized construction services**: specific solutions built around the technical requirements of your project.\n\nIf your job does not fit a standard category, tell us what it involves and we will tell you honestly whether it is for us.'],
      nav: { label: 'Contact us', href: '/contact' }
    },

    /* ── Participación indígena (el argumento más importante) ── */
    {
      keys: [
        'indigenous', 'indigenous participation', 'indigenous owned', 'aboriginal', 'first nations',
        'indigenous procurement', 'procurement target', 'supplier diversity', 'set aside',
        'why indigenous', 'indigenous benefit', 'five percent', '5%', 'community participation'
      ],
      answer: [
        'North Peak is an **Indigenous-owned** construction company. That is not a label we added to a brochure — it is how the company is structured.\n\nFor a client, it means two things at once:\n\n- Your project is delivered by a company with **real technical capability**.\n- That same project **counts towards your Indigenous procurement and supplier-diversity goals**.\n\nMost companies make you choose between the two. Here you do not have to.',
        'We are Indigenous-owned, and we work with general contractors, public bodies and private clients who need to meet **Indigenous procurement or community-participation requirements** without compromising on quality, safety or schedule.\n\nWe turn a requirement into an advantage for your bid.'
      ],
      nav: { label: 'Indigenous procurement', href: '/indigenous-procurement' }
    },

    /* ── Cobertura geográfica ─────────────────────────────── */
    {
      keys: [
        'where do you work', 'coverage', 'area', 'regions', 'do you work in', 'ontario', 'toronto',
        'canada', 'outside ontario', 'other provinces', 'location of work', 'service area', 'gta'
      ],
      answer: [
        'We are based in **Toronto** and work across **Ontario and Canada**.\n\nIf your project is outside the Greater Toronto Area, tell us where it is and we will tell you straight whether we can take it on.'
      ],
      nav: { label: 'Contact us', href: '/contact' }
    },

    /* ── Contacto ─────────────────────────────────────────── */
    {
      keys: [
        'contact', 'phone', 'call', 'telephone', 'email', 'reach you', 'get in touch',
        'talk to a person', 'talk to someone', 'human', 'speak to someone', 'advisor', 'representative',
        'whatsapp', 'address', 'where are you', 'office', 'location'
      ],
      answer: [
        'Here is how to reach a person directly:\n\n- **Phone:** 647 895 0939\n- **Email:** admin@northalliancegroup.ca\n- **Office:** 37 Kodiak Crescent, Unit 11, Toronto, ON M3J 3G5\n\nYou can also send us your project through the contact form and we will come back to you.'
      ],
      contactCard: true,
      nav: { label: 'Contact page', href: '/contact' }
    },

    /* ── Cómo empezar / presupuesto ───────────────────────── */
    {
      keys: [
        'quote', 'quotation', 'estimate', 'proposal', 'how do i hire', 'how do we start',
        'next step', 'how does it work', 'what do i do', 'i want to hire you', 'tender', 'bid',
        'how much', 'price', 'cost', 'rates', 'budget'
      ],
      answer: [
        'The simplest path, and you do not need to know anything technical:\n\n1. Tell us **what the project is** and **where** it is.\n2. Tell us **when** you need it.\n3. We come back to you with the next steps.\n\nYou can call **647 895 0939**, write to **admin@northalliancegroup.ca**, or send it through the form.\n\nOn price: I do not give estimates — construction pricing depends on scope, site and schedule, and a number invented by an assistant helps nobody. A person will give you a real one.'
      ],
      contactCard: true,
      nav: { label: 'Send us your project', href: '/contact' }
    },

    /* ── Proyectos — respuesta honesta mientras no haya casos ── */
    {
      keys: [
        'projects', 'portfolio', 'case studies', 'past work', 'references', 'examples of work',
        'what have you built', 'previous projects', 'experience'
      ],
      /* ⚠️ PENDIENTE: sustituir cuando el cliente entregue casos reales. */
      answer: [
        'Our project pages are being prepared with real, verified cases — and we would rather show you nothing than show you something that is not ours.\n\nIf you want examples relevant to your type of work, ask us directly and we will walk you through what we have delivered.'
      ],
      contactCard: true
    },

    /* ── Empleo y subcontratistas ─────────────────────────── */
    {
      keys: [
        'job', 'jobs', 'careers', 'work with you', 'hiring', 'vacancy', 'apply', 'employment',
        'send my resume', 'cv', 'looking for work'
      ],
      answer: [
        'We are always interested in good people — site and trades personnel, and technical and management roles.\n\nYou can apply through the Careers page. Tell us your trade and your experience.'
      ],
      nav: { label: 'Careers', href: '/careers' }
    },
    {
      keys: ['subcontractor', 'subcontract', 'supplier', 'vendor', 'register as supplier', 'work as a sub'],
      answer: [
        'We register subcontractors and suppliers. Send us your trade, your coverage area and your credentials through the Careers page and we will keep you on file for upcoming work.'
      ],
      nav: { label: 'Subcontractor registration', href: '/careers' }
    },

    /* ── Seguridad y cumplimiento ─────────────────────────── */
    {
      keys: ['safety', 'health and safety', 'accidents', 'safe', 'wsib', 'wsib coverage', 'insurance', 'insurance coverage', 'insured', 'certified', 'certification', 'licence', 'license', 'liability', 'bonded'],
      /* ⚠️ PENDIENTE: certificaciones, WSIB y seguros — el cliente aún no
         los ha facilitado. NO afirmar nada hasta que los confirme. */
      answer: [
        'Safety and quality are not negotiable for us — we deliver without compromising either.\n\nFor the specific documentation you need (insurance, coverage, certifications), I will not quote numbers I cannot verify. Ask the office and they will send you the current paperwork directly:'
      ],
      contactCard: true
    },

    /* ── Horario ──────────────────────────────────────────── */
    {
      keys: ['hours', 'opening hours', 'when are you open', 'business hours', 'what time'],
      /* ⚠️ PENDIENTE: horario oficial. */
      answer: [
        'Our published hours are not listed yet. The reliable way is to call **647 895 0939** — if nobody picks up, write to **admin@northalliancegroup.ca** and you will get an answer.'
      ],
      contactCard: true
    },

    /* ── Residencial (probable "no") ──────────────────────── */
    {
      keys: ['residential', 'my house', 'home renovation', 'basement', 'kitchen', 'small job', 'handyman'],
      /* ⚠️ PENDIENTE: confirmar con el cliente si aceptan residencial. */
      answer: [
        'Our work is focused on commercial, institutional and infrastructure projects, and on supporting general contractors and public bodies.\n\nIf your project is smaller or residential, ask us anyway — a person will tell you honestly whether it is a fit, rather than take you around in circles.'
      ],
      contactCard: true
    }

  ]
};
