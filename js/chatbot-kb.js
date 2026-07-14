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
      'Hello. I am **Kodiak**, the assistant for North Peak Construction Alliance.\n\nWhat can I help you with?',
      'Welcome to North Peak Construction Alliance. I am **Kodiak**.\n\nHow can I help you today?',
      'Hello. I am **Kodiak**. I can tell you what we build, where we work, or put you in touch with a person.\n\nWhat do you need?',
      'Welcome. I am **Kodiak**, and I am here to help you find what you came for.\n\nWhat would you like to know?',
      'Hello. **Kodiak** here, the assistant for North Peak.\n\nAre you here about a project, about working with us, or for information?',
      'Good day. I am **Kodiak**, from North Peak Construction Alliance.\n\nHow may I help?',
      'Hello and welcome. I am **Kodiak**.\n\nTell me what you need, in your own words, and I will take it from there.',
      'Welcome to North Peak. I am **Kodiak**, the virtual assistant.\n\nWhat brings you here today?',
      'Hello. I am **Kodiak**.\n\nIf you have a project in mind, or a question about the company, this is the right place to start.',
      'Hello. I am **Kodiak**, the assistant for North Peak Construction Alliance.\n\nIf you are not sure where to begin, simply say so.'
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
      'I am not sure what you mean. Tell me a little more and I will help.',
      'I did not understand that. Could you say it a different way?',
      'I want to help, but I did not understand. What are you trying to do?',
      'Not sure I follow. Could you explain it in a sentence or two?'
    ],

    /* ── Segundo fallo seguido: dejar de insistir, ofrecer una persona ── */
    retry: [
      'I am still not getting it, and I do not want to waste your time.\n\nA person will understand you straight away:',
      'Twice now I have failed to understand you, and that is my fault, not yours.\n\nPlease go straight to the team:',
      'I am clearly not the right one for this question. Rather than guess again:'
    ],

    /* ── Tercer fallo: basta. WhatsApp o correo, sin rodeos. ── */
    escalate: [
      'Rather than continue in circles, write to the team. One message on WhatsApp and someone will answer you properly:',
      'This is a conversation for a human, and I am holding you up.\n\nWhatsApp or email, whichever you prefer:',
      'I will not pretend otherwise: this needs a person. They will resolve it in a minute:'
    ],

    /* ── EMPUJONES ────────────────────────────────────────────
       El fallo más silencioso del bot: contestaba… y se callaba. El
       visitante se quedaba mirando la pantalla sin saber qué hacer, y
       se iba. Ahora, cuando una respuesta no termina en pregunta, el
       bot AÑADE una — y esa pregunta lleva a su terreno.
       Nunca se cede el turno sin devolver la pelota. */
    nudges: [
      'Is there a project behind the question, or are you gathering information for now?',
      'Tell me a little about what you are working on and I can be more useful.',
      'What is the project, if there is one? I can put it in front of a person today.',
      'Would it help to speak to someone on the team about it?',
      'Where are you in the process — early thinking, or a live tender?',
      'Is this for something you are planning now, or further out?',
      'What would be most useful to you right now?',
      'Anything specific I can dig into for you?'
    ],

    /* ── DESVÍOS ──────────────────────────────────────────────
       Cuando alguien se sale del tema (el tiempo, el fútbol, un chiste),
       un bot corporativo suele contestar "no lo sé" y matar la conversación.
       Eso es un cliente perdido por una tontería. Se reconoce con humor
       breve, y se vuelve al terreno propio sin brusquedad. */
    redirect: [
      'That is outside what I can help with. Construction is what I know.\n\nIs there something about the company or a project I can help you with?',
      'That is not something I can help with, but construction is.\n\nWhat brings you to North Peak today?',
      'I will leave that one to someone else.\n\nWhat can I help you with: a project, a job, or information?',
      'That is outside what I am here for. If you have something to build, however, I can help. Do you?'
    ],

    /* ── URGENCIA ─────────────────────────────────────────────
       Alguien con prisa no quiere cinco preguntas. Quiere un teléfono.
       Reconocerlo y saltarse el guion es lo que hace un buen empleado. */
    urgent: [
      'If it is urgent, please do not go through me. Call **647 895 0939** now and speak to a person.\n\nI can also take the details as a record, if you wish.',
      'If it is urgent, please call **647 895 0939** immediately. That is faster than anything I can do.\n\nShall I take the details as well, so that nothing is lost?'
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
        'I can take the details right now and send them straight to the team, if you would like me to.',
        'If you like, I can take a few short details and put them in front of a person today.',
        'Rather than send you to a form, I can take the details myself and pass them to the team.'
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
            'What is the work? Describe it in your own words.',
            'Tell me what the project involves. Plain language is fine.'
          ]
        },
        {
          id: 'where',
          type: 'place',      /* validación propia: un país no es un sitio */
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
            'Last one — just type your phone number or your email address.',
            'And your contact: write the phone number or the email itself.',
            'Finally, write your email or your phone number, and a person will come back to you.'
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
        'It has been sent. A person will pick it up and get in touch with you.\n\nIs there anything else?'
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
        'I can pass your details to the team right now, if you would like me to.',
        'If you like, I can take your trade and your contact and put them in front of the right person.'
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
            'Now just type your phone number or your email.',
            'Write your email or phone number and they will come back to you.'
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
      'Of course. Nothing has been sent.\n\nIs there anything else I can help you with?',
      'Cancelled. Nothing has been sent.\n\nWhat else can I help you with?'
    ],
    invalidContact: [
      'That does not look like a phone number or an email. Could you write it again?',
      'I need something a person can actually reach you on — a phone number or an email address.'
    ],
    /* El visitante suelta su correo o su teléfono cuando se le pregunta
       otra cosa. Un humano no lo tragaría: lo apuntaría y seguiría. */
    looksLikeContact: [
      'That looks like how to reach you — I have made a note of it, and I will use it at the end.\n\nFor now: what is the work?',
      'I will hold on to that as your contact, and come back to it.\n\nFirst, tell me what needs doing.'
    ],
    useSaved: [
      'Earlier you gave me **{contact}**. Shall I use that? Say **yes**, or give me another.',
      'I still have **{contact}** from before. Use it? **Yes**, or write a different one.'
    ],
    /* El visitante contesta "Canadá" cuando se le pregunta la ciudad.
       No es un error suyo: es una respuesta razonable a una pregunta
       mal acotada. Un humano no la daría por buena — la afinaría. */
    /* El visitante ha insistido. Se deja de conversar y se actúa. */
    justStart: [
      'Understood. Let me take the details, then, and put this in front of a person.',
      'Right. I will stop asking and simply take what the team needs.',
      'Then let us do this properly. A few short questions and it goes to the team.'
    ],

    tooBroadPlace: [
      'Canada is a big country. Which province, and which city or town?',
      'That covers a very large area. Which province, and which city?',
      'I need it a bit tighter than that — the province, and the city if you have it.'
    ],
    tooVague: [
      'A little more detail, if you can. Even a few words about what it involves.',
      'Give me a bit more to work with — the team will need something to go on.'
    ],
    tooShort: [
      'A little more than that, if you can. Even one sentence helps.',
      'Give me a bit more to work with — a few words.'
    ],
    sending: [
      'Sending it now…',
      'One moment — passing it to the team…'
    ],
    /* No se ha entendido si aprueba o no. Se pregunta sin ambigüedad. */
    confirmUnclear: [
      'Sorry — I did not catch whether that is a yes.\n\nSay **yes** to send it, or tell me what to change.',
      'I am not sure if you are approving it. **Yes** sends it; otherwise tell me what to fix.',
      'Just so I do not get this wrong: **yes** and it goes to the team. Or name what needs correcting.'
    ],

    whatToChange: [
      'Which part? Say **what**, **where**, **when**, **name** or **contact**.',
      'Tell me which one to fix: **what**, **where**, **when**, **name** or **contact**.',
      'No problem. Which one — the work, the city, the date, your name, or your contact?',
      'Happy to correct it. Name the part: **what**, **where**, **when**, **name** or **contact**.'
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
        'Thank you. You can reach us on **647 895 0939** whenever you need us.',
        'It was good to speak with you. The door is open.',
        'All the best. You are welcome back at any time.',
        'Thanks for stopping by. We are here when you need us.'
      ]
    },
    {
      topic: 'the assistant',
      keys: ['who are you', 'what are you exactly', 'are you a robot', 'are you human', 'your name', 'are you a bot', 'am i talking to a person', 'are you real', 'ai'],
      answer: [
        'I am **Kodiak**, an assistant — not a person. I only tell you what the company has confirmed, and I never make things up.\n\nIf you would rather talk to someone real, say the word.',
        'I am Kodiak, an automated assistant. I am software, and I will not pretend otherwise.\n\nIf you would prefer a person, simply ask.',
        'I am the assistant for North Peak. Automated, with clear limits: if I do not know something, I say so and pass you to a person.'
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
        'Yes, that is our work. What does the project involve?'
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
        'Yes, brick and block work. What does the job involve?'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'concrete',
      offerFlow: 'project',
      keys: ['concrete', 'concrete repair', 'formwork', 'slab', 'foundation', 'rebar', 'pour', 'cement'],
      answer: [
        'Yes — concrete work and concrete repair.\n\nWhat is the job?',
        'Concrete is one of our ten areas, repair as much as new work. Tell me what you have.'
      ],
      nav: { label: 'Services', href: '/services' }
    },
    {
      topic: 'specialized work',
      offerFlow: 'project',
      keys: ['specialized', 'special services', 'something specific', 'custom work', 'unusual', 'complicated'],
      answer: [
        'If it does not fit a standard box, tell me what it involves. You will get an honest yes or no.',
        'That is one of our categories: the work that does not fit the other nine. What is it?'
      ],
      contactCard: true
    },


    /* ══════════════════════════════════════════════════════════
       INTENCIÓN DE OBRA — la entrada que no depende del sustantivo.

       No se puede listar todo lo que existe: almacén, nave, tejado,
       muro, planta, cimentación, aparcamiento… Lo que SÍ se puede
       reconocer es la FORMA de la petición: "quiero construir…",
       "necesito que alguien haga…", "estamos planeando…".
       Da igual qué venga después. Eso es lo que la hace general.
    ══════════════════════════════════════════════════════════ */
    {
      topic: 'a project you have in mind',
      boost: 1.6,
      offerFlow: 'project',
      keys: [
        'i want to build', 'i need to build', 'we want to build', 'we need to build',
        'i want to construct', 'we are building', 'i am building', 'looking to build',
        'planning to build', 'need someone to build', 'can you build', 'could you build',
        'i want to renovate', 'i need to renovate', 'i want to repair', 'i need to repair',
        'need someone to repair', 'we need to replace', 'i need to replace',
        'i have a project', 'we have a project', 'i have a job', 'we have a job',
        'i need a contractor', 'we need a contractor', 'looking for a contractor',
        'need help with a project', 'we are planning', 'i am planning',
        'quiero construir', 'necesito construir', 'quiero levantar', 'necesito reparar',
        'tengo un proyecto', 'busco un contratista'
      ],
      answer: [
        'That is exactly the kind of work we do.\n\n**Where is it, and when do you need it?**',
        'We can do that. So the team can answer you properly: **where is the project, and what is your timeframe?**',
        'Understood. **What city is it in, and when would the work need to start?**',
        'That is our work. Two things and I can put it in front of a person: **the city, and the timing.**'
      ]
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
        'That is the heart of it. An Indigenous-owned company with real construction capability — so a requirement stops being an obligation and becomes an advantage in your bid.\n\nWant me to explain how that works on a tender?'
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
        'Yes. Two broad groups: site and trades, and technical and management.\n\nWhich applies to you?'
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
        'The one that surprises people: if you are bidding on public or corporate work, having a genuine Indigenous-owned partner is not a formality — it can be the difference between winning and coming second. And unlike a paper arrangement, we actually do the construction.'
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


    /* ══════════════════════════════════════════════════════════
       OBJECIONES Y CONVERSACIÓN HUMANA

       Aquí es donde se ganan y se pierden los clientes. "Solo estoy
       mirando", "ya tengo contratista", "me lo pienso" — un bot normal
       contesta "de acuerdo" y pierde a la persona para siempre.

       No se insiste (eso ahuyenta). Se reconoce la objeción, se da UNA
       razón sólida, y se deja una puerta abierta que no compromete a nada.
       Esa es la diferencia entre vender y atender bien.
    ══════════════════════════════════════════════════════════ */

    {
      topic: 'just looking',
      boost: 1.4,
      keys: [
        'just looking', 'just browsing', 'having a look', 'just curious', 'no reason',
        'nothing specific', 'just checking', 'window shopping', 'solo estoy mirando',
        'solo miraba', 'por curiosidad'
      ],
      answer: [
        'That is perfectly fine. Most people are, the first time.\n\nIf it helps: the thing worth knowing about us is that we are Indigenous-owned **and** we do the construction ourselves. Most clients need one or the other. Some need both.\n\nAnything you want me to explain while you are here?',
        'No obligation at all. Look around.\n\nIf a project ever does come up — or a tender with an Indigenous participation requirement — that is exactly when to come back. Shall I tell you how that part works?'
      ]
    },
    {
      topic: 'already have a contractor',
      boost: 1.4,
      keys: [
        'already have a contractor', 'we have a contractor', 'we work with someone',
        'we already work with', 'have a supplier', 'we are covered', 'not looking',
        'happy with our', 'ya tengo contratista'
      ],
      answer: [
        'A contractor you trust is worth keeping.\n\nWhere we usually come in is different: as an **Indigenous-owned partner** on bids that carry a procurement or participation requirement. That is not a replacement for your contractor; it sits alongside them.\n\nDoes that come up in your work?',
        'Then you are better placed than most.\n\nThe question worth asking is a different one: when a tender requires Indigenous participation, who do you call? That is where we are useful — and it does not disturb what you already have.\n\nIs that a situation you run into?'
      ],
      nav: { label: 'How that works', href: '/indigenous-procurement' }
    },
    {
      topic: 'need to think about it',
      keys: [
        'i need to think', 'let me think', 'i will think about it', 'not sure yet',
        'have to discuss', 'talk to my partner', 'talk to my team', 'get back to you',
        'me lo pienso', 'lo tengo que consultar'
      ],
      answer: [
        'Of course. Nobody should decide a construction contract in a chat window.\n\nOne suggestion: take the phone number with you — **647 895 0939**. When you have thought it through, one call gets you a real answer, with no obligation.\n\nAnything I can clarify before you go?',
        'That is sensible. Take your time.\n\nIf it would help your thinking, I can put a person on it now — no commitment, just a straight answer to whatever is making you hesitate. Want me to?'
      ],
      contactCard: true
    },
    {
      topic: 'send me information',
      keys: [
        'send me information', 'send me a brochure', 'email me details', 'send me your',
        'do you have a brochure', 'company profile', 'capability statement', 'more info'
      ],
      answer: [
        'Better than a brochure: tell me what you need it for, and the team will send you something that actually answers it — capability, coverage, or the Indigenous participation side.\n\nWhat is the context?',
        'A generic document rarely answers the real question. If you tell me what you are evaluating, a person will send you exactly that.\n\nWhat should it cover?'
      ],
      offerFlow: 'project'
    },
    {
      topic: 'a decision maker',
      keys: [
        'i am not the decision maker', 'my boss', 'i need approval', 'the board',
        'procurement department', 'i just do the research', 'on behalf of'
      ],
      answer: [
        'Then let me make your job easier, not harder.\n\nTell me what your side needs in order to say yes — capability, participation, coverage, references — and the team will put it in a form you can forward. What matters most to them?'
      ],
      offerFlow: 'project'
    },
    {
      topic: 'how are you',
      keys: ['how are you', 'how is it going', 'how do you do', 'how are things', 'que tal', 'como estas'],
      answer: [
        'Very well, thank you. What can I do for you?',
        'Well, thank you. What brings you here today?'
      ]
    },
    {
      topic: 'a compliment or a joke',
      keys: [
        'you are funny', 'good bot', 'nice bot', 'you are smart', 'clever', 'tell me a joke',
        'are you smart', 'i like you', 'well done'
      ],
      answer: [
        'Thank you. Now, what can I help you with?',
        'That is kind of you. I am more useful on construction questions, though. Try me.'
      ]
    },

    /* ══ RESIDENCIAL ════════════════════════════════════════ */
    {
      topic: 'residential work',
      offerFlow: 'project',
      keys: ['residential', 'my house', 'home renovation', 'basement', 'kitchen', 'small job', 'handyman', 'my home'],
      /* ⚠️ PENDIENTE: confirmar si aceptan residencial. */
      answer: [
        'Our work is mostly commercial, institutional and infrastructure, and supporting general contractors.\n\nIf yours is smaller, ask anyway — you will get a straight yes or no.',
        'That is not our usual ground, I will be honest. But rather than send you away, ask the team: they will tell you plainly whether it is a fit.'
      ],
      contactCard: true
    }

  ]
};
