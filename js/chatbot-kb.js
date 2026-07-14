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
    /* [REESCRITOS] Había "Taking **{topic}** first:", que el navegador
       traducía como "Primero, toma en mente un proyecto:". Sin sentido en
       español. Se quedan solo las formas que sobreviven a una traducción. */
    connectors: {
      /* El PRIMER bloque abre; los siguientes continúan. Mezclarlos hacía que
         una respuesta empezara por "Y la cobertura:" — empezar por una
         conjunción, sin nada delante a lo que unirse. */
      first: [
        'On **{topic}**:',
        'About **{topic}**:',
        'Regarding **{topic}**:'
      ],
      next: [
        'And **{topic}**:',
        'As for **{topic}**:',
        'On **{topic}**:'
      ]
    },

    /* ── TRIAJE ───────────────────────────────────────────────
       Cuando no ha entendido, decir "no lo sé" y soltar un teléfono deja
       al visitante sintiéndose despachado. Un buen empleado acota: tres
       puertas, y que elija. El bot nunca pierde el control, ni siquiera
       cuando no entiende nada. */
    /* [FASE 2] Las tres puertas dependen de quién esté delante. Ofrecerle
       "¿una licitación?" a quien acaba de decir que busca trabajo es no
       haberle escuchado. El motor elige la lista; aquí solo vive el texto.
       'any' es la de siempre, y se usa mientras no se sepa quién escribe. */
    triage: {
      any: [
        'I want to point you the right way rather than guess.\n\nIs this about **a project**, about **working with us**, or about **the company**?',
        'Let me narrow this down.\n\nAre you here about **a project you need built**, about **a job**, or for **information about the company**?',
        'I did not follow that, and I do not want to leave you stuck.\n\nWhich is nearest: **a project**, **a job**, or **information**?'
      ],
      buyer: [
        'I want to point you the right way rather than guess.\n\nIs this about **the work itself**, about **documents and prequalification**, or about **speaking to a person**?',
        'Let me narrow this down.\n\nIs it **the project**, **the paperwork**, or **the people** you need?'
      ],
      candidate: [
        'I did not follow that, and I do not want to leave you stuck.\n\nIs this about **a role on site**, about **a technical or office role**, or about **something else**?',
        'Let me point you the right way.\n\nAre you asking about **a position**, about **how to apply**, or about **the company itself**?'
      ],
      supplier: [
        'Let me narrow this down.\n\nIs this about **registering as a subcontractor**, about **supplying materials**, or about **something else**?',
        'I want to point you the right way.\n\nIs it **work as a subcontractor**, **a supply agreement**, or **information about the company**?'
      ]
    },

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
    nudges: {
      any: [
        'Is there a project behind the question, or are you gathering information for now?',
        'What are you working on? The more I know, the more use I am.',
        'What is the project, if there is one? I can put it in front of a person today.',
        'Would it help to speak to someone on the team about it?',
        'What would be most useful to you right now?',
        'Anything specific I can dig into for you?'
      ],
      buyer: [
        'What is the project? I can put it in front of a person today.',
        'Would it help to speak to someone on the team about it?',
        'What does the work involve? The more I know, the more use I am.',
        'Is there a date you are working towards?'
      ],
      /* Nada de licitaciones aquí. A quien busca trabajo se le pregunta
         por su oficio, no por su presupuesto. */
      candidate: [
        'What is your trade, or the role you are after?',
        'Would you like me to pass your details to the team?',
        'How much experience do you have in it?',
        'Are you looking for site work, or a technical or office role?',
        'Anything else you would like to know before you apply?'
      ],
      supplier: [
        'What does your company do, and which trades do you cover?',
        'Would you like me to pass your company details to the team?',
        'Which areas do you cover?',
        'Are you offering labour, materials, or both?'
      ]
    },

    /* ── DESVÍOS ──────────────────────────────────────────────
       Cuando alguien se sale del tema (el tiempo, el fútbol, un chiste),
       un bot corporativo suele contestar "no lo sé" y matar la conversación.
       Eso es un cliente perdido por una tontería. Se reconoce con humor
       breve, y se vuelve al terreno propio sin brusquedad. */
    redirect: {
      any: [
        'That is outside what I can help with. Construction is what I know.\n\nIs there something about the company or a project I can help you with?',
        'That is not something I can help with, but construction is.\n\nWhat brings you to North Peak today?',
        'I will leave that one to someone else.\n\nWhat can I help you with: a project, a job, or information?',
        'That is outside what I am here for. If you have something to build, however, I can help. Do you?'
      ],
      buyer: [
        'That is outside what I can help with. Construction is what I know.\n\nShall we go back to the project?',
        'I will leave that one to someone else.\n\nWhat would you like to know about the work?'
      ],
      candidate: [
        'That is outside what I can help with. Construction is what I know.\n\nShall we go back to the role you are after?',
        'I will leave that one to someone else.\n\nWhat would you like to know about working here?'
      ],
      supplier: [
        'That is outside what I can help with. Construction is what I know.\n\nShall we go back to what your company does?',
        'I will leave that one to someone else.\n\nWhat would you like to know about working with us?'
      ]
    },

    /* ── URGENCIA ─────────────────────────────────────────────
       Alguien con prisa no quiere cinco preguntas. Quiere un teléfono.
       Reconocerlo y saltarse el guion es lo que hace un buen empleado. */
    urgent: [
      'If it is urgent, please do not go through me. Call **647 895 0939** now and speak to a person.\n\nI can also take the details as a record, if you wish.',
      'If it is urgent, please call **647 895 0939** immediately. That is faster than anything I can do.\n\nShall I take the details as well, so that nothing is lost?'
    ],

    /* ── RESPUESTAS POR INTENCIÓN ─────────────────────────────
       La red que impide caer al vacío.

       Cuando el TEMA es desconocido (y siempre habrá temas desconocidos:
       no se puede listar el mundo), el bot todavía reconoce la FORMA de
       la pregunta. No sabe de qué le hablan, pero sabe que le están
       preguntando por un precio, por un plazo, por un papel, o si pueden
       hacer algo. Y a eso SÍ puede responder con honestidad y utilidad.

       Esto es lo que sustituye a "no te he entendido". */
    intentAnswers: {

      capability: {
        answer: [
          'The honest answer is that it depends on the specifics, and I would rather not guess on your behalf.\n\nTell me what the job involves and where it is — if it is ours, you will get a straight yes.',
          'Possibly — we cover ten areas, from general contracting to concrete and masonry.\n\nDescribe the work and I will tell you whether it is a fit, or put you with someone who can.'
        ],
        offerFlow: 'project'
      },

      need: {
        answer: [
          'Understood.\n\n**What is the work?** Once I have that, I will ask for the city and the date.',
          'That is what we are here for.\n\n**Tell me what the work is** and I will take it from there.'
        ],
        offerFlow: 'project'
      },

      price: {
        answer: [
          'I do not give numbers, and you should be wary of any assistant that does. Construction pricing depends on scope, site and schedule.\n\nA person can get you a real figure. **What is the project?**',
          'No figures from me. An invented number helps nobody, least of all you.\n\nA person will give you a real one. **What is the work?**'
        ],
        offerFlow: 'project'
      },

      time: {
        answer: [
          'Timelines depend on the scope and the site. Anyone who gives you a date without seeing either is guessing.\n\n**What is the work?** A person will give you a real answer.'
        ],
        offerFlow: 'project'
      },

      place: {
        answer: [
          'We are based in Toronto and work across Ontario and Canada.\n\n**Where is your project?** Name the city and you will get a straight answer.'
        ],
        offerFlow: 'project'
      },

      person: {
        answer: [
          'Of course. Here is how to reach one:',
          'That is easily arranged. Any of these reaches a person:'
        ],
        contactCard: true
      },

      proof: {
        answer: [
          'Documents — insurance, certifications, prequalification — come from a person who can sign them, not from an assistant. I will not state a certification I cannot verify.\n\nSend the office what you need and it comes back completed:'
        ],
        contactCard: true
      },

      /* Algo está roto. Es una petición de obra, aunque no lleve verbo. */
      problem: {
        answer: [
          'That sounds like something we repair. Restoration and structural work is one of our ten areas.\n\n**Where is it?**',
          'Damage of that kind is exactly what we deal with.\n\n**Whereabouts is it?**'
        ],
        offerFlow: 'project'
      },

      /* Alguien perdido. No se le abandona: se le hacen preguntas fáciles. */
      unsure: {
        answer: [
          'Then let us work it out together. That is a perfectly normal place to start.\n\n**What do you have?** A rough answer is fine.',
          'You do not need to know the technical side. That is our job.\n\n**Tell me what you have**, in plain words.'
        ],
        offerFlow: 'project'
      },

      explain: {
        answer: [
          'I may not have that exact detail, but I would rather find out than invent it.\n\n**Can you tell me a bit more about what you are trying to establish?** If it is something the company must answer, I will point you to a person.'
        ]
      },

      /* [NUEVA] "¿Habéis construido supermercados / talleres / restaurantes?"
         La verdad es que no hay casos publicados todavía. Un bot que dice
         "sí, tenemos amplia experiencia" para caer bien está firmando una
         mentira que se descubre en la primera reunión — y hunde la
         licitación. Se dice lo que hay, y se pasa a una persona.
         ⚠️ PENDIENTE: cuando lleguen proyectos verificados, reescribir. */
      experience: {
        answer: [
          'I am not going to tell you we have done exactly that, because I cannot verify it — and a claim like that falls apart in the first meeting.\n\nWhat I can do is put the question to the team, who can answer for the real jobs they have delivered. What is the project?',
          'Honestly: the verified cases are not published yet, and I will not dress up a placeholder as a track record.\n\nThe team will tell you straight whether they have done work like yours. Shall I pass this to them?',
          'That is a fair question, and the honest answer is that I cannot confirm it myself.\n\nAsk the team directly — they will tell you what they have actually built, not what I guess. What would you be building?'
        ],
        offerFlow: 'project',
        contactCard: true
      },

      intro: {
        answer: [
          'Good to know, thank you.\n\nWhat brings you to North Peak today?',
          'Understood, and welcome.\n\nWhat can I help you with?'
        ]
      },

      compare: {
        answer: [
          'The short version: we are Indigenous-owned **and** we do the construction ourselves. Most firms offer one or the other.\n\n**Is that the comparison you are making, or something else?**'
        ]
      }
    },

    /* Cuando ha entendido QUÉ, DÓNDE o CUÁNDO de una frase suelta, lo
       repite para que el visitante vea que se le ha escuchado, y pide
       solo lo que falta. {work} {city} {when} se sustituyen. */
    reflect: {
      full:      ['Understood: **{work}**, in **{city}**, for **{when}**.\n\nLet me take the last details and pass this to the team.'],
      workCity:  ['Understood: **{work}**, in **{city}**.\n\n**By what date would you want the work completed?**'],
      workWhen:  ['Understood: **{work}**, for **{when}**.\n\n**Which city is it in?**'],
      workOnly:  ['Understood: **{work}**.\n\n**Which city is it in?**']
    },

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
        'Would you like me to take the details now and send them straight to the team?',
        'Shall I take a few short details and put them in front of a person today?',
        'Rather than send you to a form, shall I take the details myself and pass them to the team?'
      ],
      /* {n} lo sustituye el motor por las preguntas que QUEDAN de verdad:
         si el visitante ya ha contado la obra, no son cuatro, son tres. */
      /* [REESCRITO] Decía "cuatro cosas rápidas y se lo paso": frío y sin
         explicar para qué. Se dice qué se va a hacer y por qué. */
      start: [
        'Perfect. I will ask you {n} short questions, and your details go straight to the team.',
        'Very good. {n} questions and a person from the team will get back to you.',
        'Excellent. {n} questions, in plain words, and I pass it all to the team.'
      ],
      steps: [
        {
          id: 'what',
          type: 'text',
          ask: [
            'First: what needs building, repairing or managing?',
            'What is the work? Describe it in your own words.',
            'What does the project involve? Plain language is fine.'
          ]
        },
        {
          id: 'where',
          type: 'place',      /* validación propia: un país no es un sitio */
          ask: [
            'Which city or town is the project in?',
            'And the location. Which city is it in?',
            'Where is the project? Please name the city.'
          ]
        },
        {
          id: 'when',
          /* [FALLO CORREGIDO] Era 'text', que exige dos palabras: a quien
             contestaba "asap" — o "spring", o "March" — el bot le pedía "más
             detalle". Una fecha cabe perfectamente en una palabra. */
          type: 'short',
          ask: [
            'By what date would you want the work completed? An approximate date is fine, and the team will confirm what is possible.',
            'And the date. When would you like the work finished? The team will tell you what can be arranged.',
            'What completion date do you have in mind? An estimate is enough at this stage.'
          ]
        },
        {
          id: 'name',
          type: 'name',
          /* [FALLO CORREGIDO] Aquí había un "Who should the team ask for?".
              El navegador lo traducía como "¿a quién debería pedir ayuda el
              equipo?" — un disparate. La regla del proyecto es inglés llano,
              sin modismos: se pregunta el nombre, y ya. */
          ask: [
            'Almost there. What is your name?',
            'And your name?',
            'What name should I put on this?'
          ]
        },
        {
          id: 'contact',
          type: 'contact',
          ask: [
            'Last one — what is your phone number or email address?',
            'And your contact. What is the phone number, or the email?',
            'Finally: what is your email or phone number? A person will come back to you.'
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
        'To send it, simply tell me it is correct. To change anything, use **Edit details** below.',
        'If that is right, say so and it goes to the team. To correct anything, use **Edit details** below.',
        'Confirm it and I will send it. If something is wrong, **Edit details** below will let you fix it.'
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
        'Perfect. I will ask you {n} short questions, and your details go to the team.',
        'Very good. {n} questions, and a person will get back to you.'
      ],
      steps: [
        {
          id: 'trade',
          /* [FALLO CORREGIDO] Era 'text', que exige dos palabras. Quien
             contestaba "carpenter" recibía "dame un poco más de detalle".
             'short' acepta una palabra, que es lo que es un oficio. */
          type: 'short',
          ask: [
            'What is your trade, or the role you are after?',
            'What do you do — trade or position?'
          ]
        },
        {
          id: 'experience',
          type: 'duration',      /* una experiencia se mide en tiempo */
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
            'And your phone number or email address?',
            'What is your email or phone number? They will come back to you.'
          ]
        }
      ],
      confirm: [
        'Here is what I have:',
        'Let me read it back:'
      ],
      confirmAsk: [
        'If that is correct, say so and I will send it. To change anything, use **Edit details** below.',
        'Confirm and it goes to the team. Otherwise, **Edit details** below.'
      ],
      success: [
        'Sent. Your details are with the team.\n\nIf you also want to send a résumé, use the Careers page — the form there takes a file.',
        'Done. That is in the office inbox.\n\nTo attach a résumé, the Careers page has a form that takes one.'
      ],
      failure: [
        'It did not go through, and I will not pretend it did. Use the Careers page or write directly:'
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PROVEEDORES Y SUBCONTRATISTAS  (Fase 2)

       [HUECO CORREGIDO] No existía. Un subcontratista que se ofrecía caía
       en el flujo de EMPLEO: a la oficina le llegaba un correo titulado
       "candidate enquiry" con su oficio y sus años de experiencia, como si
       fuera un albañil buscando trabajo. Ni el asunto ni los campos eran
       los suyos. Ahora tiene su propio flujo y su propio asunto.
    ══════════════════════════════════════════════════════════ */
    supplier: {
      id: 'supplier',
      subject: 'New subcontractor / supplier enquiry from the website assistant',
      trigger: [
        'register as a supplier', 'register as a subcontractor', 'register my company',
        'send my company details', 'get on your vendor list', 'add us to your list'
      ],
      offer: [
        'I can take your company details now and put them in front of the team, if you would like.',
        'Shall I take your company, your trade and your coverage, and pass them to the team?'
      ],
      start: [
        'Perfect. {n} short questions about your company, and it goes to the team.',
        'Very good. I will ask you {n} things and pass them to the team.'
      ],
      steps: [
        {
          id: 'company',
          type: 'short',
          ask: [
            'What is the name of your company?',
            'First: your company name?'
          ]
        },
        {
          id: 'trade',
          type: 'short',
          ask: [
            'What does it do? Name the trade or the materials you supply.',
            'What is your trade, or what do you supply?'
          ]
        },
        {
          id: 'where',
          type: 'place',
          ask: [
            'Which city or area do you cover?',
            'And your coverage. Which city or area?'
          ]
        },
        {
          id: 'name',
          type: 'name',
          ask: ['And your name?', 'What name should I put on this?']
        },
        {
          id: 'contact',
          type: 'contact',
          ask: [
            'Last one — what is your phone number or email address?',
            'What is your email or phone number? A person will come back to you.'
          ]
        }
      ],
      confirm: [
        'Here is what I have:',
        'Let me read it back before it goes anywhere:'
      ],
      confirmAsk: [
        'If that is correct, say so and I will send it. To change anything, use **Edit details** below.',
        'Confirm and it goes to the team. Otherwise, **Edit details** below.'
      ],
      success: [
        'Sent. Your company details are with the team, and you stay on file for upcoming work.\n\nIs there anything else?',
        'Done — that is in the office inbox. Someone will come back to you.'
      ],
      failure: [
        'It did not go through, and I will not pretend it did. Write to the office directly and your details will get there:'
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
      'I need something a person can actually reach you on. What is your phone number, or your email?'
    ],
    /* El visitante suelta su correo o su teléfono cuando se le pregunta
       otra cosa. Un humano no lo tragaría: lo apuntaría y seguiría. */
    /* [FALLO CORREGIDO] Terminaba en "¿cuál es la obra?", que solo tiene
       sentido en el flujo de proyecto: a un candidato se le preguntaba por
       una obra que no tiene. Ahora es solo el acuse de recibo — el motor
       vuelve a hacer la pregunta del paso en el mensaje siguiente. Un
       mensaje, una pregunta. */
    looksLikeContact: [
      'That looks like how to reach you. I have made a note of it and I will use it at the end.',
      'I will hold on to that as your contact and come back to it at the end.'
    ],
    useSaved: [
      'Earlier you gave me **{contact}**. Shall I use that? Say **yes**, or give me another.',
      'I still have **{contact}** from before. Use it? **Yes**, or write a different one.'
    ],
    /* El visitante contesta "Canadá" cuando se le pregunta la ciudad.
       No es un error suyo: es una respuesta razonable a una pregunta
       mal acotada. Un humano no la daría por buena — la afinaría. */
    /* El visitante ha insistido. Se deja de conversar y se actúa. */
    /* Tras usar el botón de editar. */
    /* Cuando el visitante prefiere preguntar antes que rellenar. Se aparta el
       formulario sin reproche y se le dice cómo volver. */
    paused: [
      'I will stop asking for details — you clearly have questions first, and that is fair.\n\nAsk me whatever you need. When you want to send your details to the team, just say **take my details**.',
      'Let me put the form aside. You have questions, and they come first.\n\nAsk away. Say **take my details** whenever you are ready and I will pick it up again.'
    ],

    saved: [
      'Updated. Here is how it stands now:',
      'Saved. This is what I have now:'
    ],

    justStart: [
      'Understood. Let me take the details, then, and put this in front of a person.',
      'Right. I will stop asking and simply take what the team needs.',
      'Then let us do this properly. A few short questions and it goes to the team.'
    ],

    tooBroadPlace: [
      'Canada is a big country. Which province, and which city or town?',
      'That covers a very large area. Which province, and which city?',
      'I need it a bit tighter than that. Which province, and which city?'
    ],
    /* Estos mensajes vuelven a pedir el mismo dato, así que PREGUNTAN. Antes
       terminaban en punto, y el bot cedía el turno sin pregunta: dentro de
       una toma de datos eso deja al visitante mirando la pantalla. */
    tooVague: [
      'A little more detail, if you can. What does it involve?',
      'Give me a bit more to work with — the team will need something to go on. Can you say a few words about it?'
    ],
    /* Cuando el visitante no quiere dar un dato: se deja en blanco y se sigue. */
    skipped: [
      'No matter — I will leave that one blank and the team can ask you directly.',
      'We will leave that empty. It is not worth holding you up over.'
    ],
    giveUpContact: [
      'Without a way to reach you there is nothing I can send, and I am not going to keep asking.\n\nWrite to the office yourself and it lands in the same inbox:',
      'I will stop asking. If you would rather not leave a contact, here is the office directly — it goes to the same people:'
    ],
    notADuration: [
      'I meant how long you have been doing it. Roughly how many years?',
      'Sorry — I meant the time, not the name. How many years have you been at it?'
    ],
    notAName: [
      'That does not look like a name. What should I call you?',
      'I need a name for the team to ask for. What is yours?'
    ],
    tooShort: [
      'A little more than that, if you can. Could you give me one sentence?',
      'Give me a bit more to work with — could you write it out in a few words?'
    ],
    sending: [
      'Sending it now…',
      'One moment — passing it to the team…'
    ],
    /* No se ha entendido si aprueba o no. Se pregunta sin ambigüedad. */
    confirmUnclear: [
      'Sorry — I did not catch whether that is a yes.\n\nShall I send it? Say **yes**, or tell me what to change.',
      'I am not sure if you are approving it. Is that a **yes**, or is there something to fix?',
      'Just so I do not get this wrong — is it a **yes**? If not, name what needs correcting.'
    ],

    /* [FALLO CORREGIDO] Listaba los campos del flujo de PROYECTO aunque
       quien estuviera hablando fuese un candidato, cuyo flujo no tiene ni
       "where" ni "when". {fields} lo sustituye el motor por los campos
       reales del flujo en marcha. */
    whatToChange: [
      'Which part? Say {fields}.',
      'Which one shall I fix: {fields}?',
      'No problem. Which one — {fields}?',
      'Happy to correct it. Which part — {fields}?'
    ]
  },

  kb: [

    /* ══ CORTESÍA ═══════════════════════════════════════════ */
    {
      topic: 'greeting',
      /* Las erratas del saludo se escriben mal más que ninguna otra palabra,
         y son demasiado cortas para que el corrector de erratas las cace
         (con cuatro letras, un error de uno confunde palabras de verdad).
         Así que se listan: es la única lista que compensa. */
      keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
             'helo', 'hallo', 'hii', 'hey there', 'hi there', 'good day', 'greetings',
             'hola', 'ola', 'buenas', 'buenos dias', 'bonjour', 'salut', 'allo'],
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
      keys: ['who are you', 'what are you exactly', 'are you a robot', 'are you human', 'your name', 'are you a bot', 'am i talking to a person', 'are you real', 'ai',
        'robot', 'bot', 'eres un robot', 'are you a real robot', 'chatbot',
        'kodiak', 'is this kodiak'
      ],
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
      keys: ['restoration', 'rehabilitation', 'refurbish', 'repair', 'repairs', 'repair building',
        'building repair', 'fix a building', 'renovation', 'renovate', 'restore', 'heritage', 'refurbishment'],
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
        'That is exactly the kind of work we do.\n\n**Which city is it in?**',
        'We can do that.\n\n**Where is the project?**',
        'Understood.\n\n**What city is it in?**',
        'That is our work.\n\n**Which city is the project in?**'
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

    /* [ENTRADA NUEVA] Sostenibilidad, LEED, residuos, eficiencia energética.
       Lo preguntan los consultores y las administraciones, y el bot no tenía
       NADA: se iba al triaje. No se puede afirmar una certificación que la
       empresa no ha confirmado — así que se dice lo que se hace y se pasa a
       una persona.
       ⚠️ PENDIENTE: si la empresa tiene LEED, gestión de residuos documentada
       o cualquier credencial verde, esta respuesta hay que reescribirla. */
    {
      topic: 'sustainability',
      keys: [
        'leed', 'sustainability', 'sustainable', 'green building', 'energy efficiency',
        'energy efficient', 'environmental', 'carbon', 'waste management',
        'construction waste', 'recycling', 'net zero', 'esg'
      ],
      answer: [
        'I will not claim a green certification the company has not confirmed to me — that is the sort of claim that ends badly for everyone.\n\nWhat the team can tell you is what they actually do on site, and how they handle waste and materials on a given project. Would you like me to put that question to a person?',
        'Honestly: I do not have a verified answer on certifications or targets, and I will not invent one.\n\nA person can tell you exactly what is done on site and what can be committed to in writing. Shall I pass this to them?',
        'That is a question for a person who can put their name to the answer, not for me.\n\nThe office will tell you what is done and what can be documented. What is the project, so they can answer for that one?'
      ],
      contactCard: true,
      weight: 3
    },

    /* [ENTRADA NUEVA] "¿Qué máquinas usáis?", "¿tenéis excavadoras?". Lo
       preguntan los industriales y los curiosos. No hay inventario confirmado:
       no se inventa una flota.
       ⚠️ PENDIENTE: si la empresa tiene maquinaria propia, listarla aquí. */
    {
      topic: 'equipment and machinery',
      keys: [
        'what machines', 'what machinery', 'equipment', 'excavator', 'machinery',
        'do you own machinery', 'heavy equipment', 'plant and equipment', 'fleet',
        'maquinaria', 'excavadora'
      ],
      answer: [
        'I will not list machinery I cannot verify. What I can tell you is that the work gets done with our own crews, and the equipment is put to the job.\n\nTell me what the site needs and the team will tell you exactly what they would bring.',
        'That is a question for the people who run the sites, not for me — and I would rather not invent an inventory.\n\nWhat is the work? They will tell you what it takes.'
      ],
      offerFlow: 'project',
      weight: 3
    },

    /* [ENTRADA NUEVA] "¿Hay alguien que hable español?". Lo pregunta quien no
       se siente cómodo explicando una grieta en un idioma que no es el suyo.
       El bot entiende español y francés — pero NO puede prometer que el equipo
       conteste en español, porque eso no está confirmado. Se dice la verdad.
       ⚠️ PENDIENTE: confirmar qué idiomas habla el equipo. */
    {
      topic: 'language',
      keys: [
        'do you speak spanish', 'anyone speak spanish', 'hablan espanol',
        'habla espanol', 'alguien que hable espanol', 'in spanish', 'en espanol',
        'do you speak french', 'parlez vous francais', 'en francais', 'what languages'
      ],
      answer: [
        'Write to me in Spanish or French — I understand you perfectly, and I will pass on what you tell me.\n\nWhether someone on the team can answer you in your language, I cannot promise, and I would rather not promise it than let you down. What do you need doing?',
        'You can write here in your own language and I will understand. I cannot confirm which languages the team speaks, so I will not pretend.\n\nTell me what the work is and I will make sure it reaches a person.'
      ],
      weight: 4
    },

    /* [ENTRADA NUEVA] Un niño. Llega por curiosidad, y antes recibía un
       triaje comercial ("¿esto es un proyecto, un empleo o información?").
       A un niño no se le vende nada y no se le piden datos: ni nombre, ni
       teléfono, ni correo. Se le trata bien y se le manda a un adulto si de
       verdad hay una obra detrás. Por eso esta entrada NO tiene offerFlow. */
    {
      topic: 'a child',
      keys: [
        'i am 9', 'i am 10', 'i am 11', 'i am 12', 'i am 13', 'im 9', 'im 10', 'im 11',
        'i am a kid', 'im a kid', 'i am a child', 'tengo 9 anos', 'tengo 10 anos',
        'tengo 11 anos', 'soy un nino', 'soy una nina', 'my mum', 'my mom', 'my dad'
      ],
      answer: [
        'Thanks for telling me. I will not ask you for any details, then.\n\nThis is the assistant of a construction company, so there is not much here for you — but if you are curious about how buildings are actually made, ask me and I will tell you.',
        'Good to know, and I will not be asking you for a name or a phone number.\n\nIf there is a real building job at home, the best thing is for an adult to call the company. And if you are just curious about construction, ask away.'
      ],
      weight: 4
    },

    /* [ENTRADA NUEVA] "lol", "ok", "jaja", "ugh". Ni una pregunta ni un
       galimatías: es alguien haciendo tiempo. Antes recibía "no te he
       entendido", que es la peor forma de perder a alguien que aún no ha
       dicho a qué viene. */
    {
      topic: 'small talk',
      keys: [
        'lol', 'haha', 'hahaha', 'jaja', 'jajaja', 'hmm', 'ugh', 'meh', 'cool',
        'nice', 'alright', 'i see', 'right', 'yo', 'sup', 'wow', 'oh'
      ],
      answer: [
        'What can I help you with?',
        'Is there something specific you came for?',
        'What would you like to know?'
      ],
      weight: 2
    },

    /* ══ LO QUE LA EMPRESA NO HACE ══════════════════════════
       [ENTRADAS NUEVAS] Cuatro visitantes llegaron pidiendo cosas que North
       Peak no hace, y el bot NO SABÍA DECIRLO: les hacía triaje comercial, o
       peor, intentaba tomarles los datos de una obra que no existe. Decir "no
       hacemos eso" rápido y con una salida es más respetuoso — y más honesto —
       que marear a alguien durante ocho mensajes. */
    {
      topic: 'moving and storage',
      keys: [
        'move furniture', 'moving company', 'movers', 'storage', 'move my couch',
        'move a couch', 'moving truck', 'do you have a truck', 'mudanza', 'muebles',
        'couch', 'sofa', 'furniture', 'truck', 'a bed'
      ],
      answer: [
        'That is not us, and I would rather say so straight away than waste your afternoon. We are a construction company — we build and repair buildings. We do not do removals or storage.\n\nIs there anything on the construction side I can help with?',
        'Still not us, I am afraid. No trucks, no removals, no storage — we put up buildings and repair them.\n\nYou will want a moving company for that. Anything I can help with on the building side?',
        'I have to be straight with you: you are in the wrong place. We do not move furniture and we never have.\n\nIs there a building or a repair I can help you with instead?'
      ],
      weight: 5
    },
    {
      topic: 'real estate',
      keys: [
        'properties available', 'listings', 'do you have listings', 'send listings',
        'do you sell houses', 'homes for sale', 'homes coming soon', 'realtor',
        'real estate agent', 'buy a property', 'looking to buy in', 'inmobiliaria'
      ],
      answer: [
        'I think you may have the wrong company, and I will not pretend otherwise. We do not sell or list property — we are a construction company. We build what someone else has bought.\n\nIf you have land or a building and something needs doing to it, that I can help with. Do you?'
      ],
      weight: 5
    },
    {
      topic: 'design and permits',
      keys: [
        'draw the plans', 'draw plans', 'drawings', 'blueprints', 'architect', 'designer',
        'draftsman', 'do you do design', 'pull permits', 'get the permits', 'building permit',
        'permit', 'permits', 'zoning', 'planos', 'permisos', 'delineante'
      ],
      answer: [
        'We build. We do not produce the drawings and we do not pull the permits — that comes from a designer or an architect, and I am not going to pretend we do it.\n\nIf you already have drawings, or once you have them, the team takes it from there. Do you have any yet?',
        'Straight answer: drawings and permits are not our work. We are the ones who build what the drawings say.\n\nTell me what you are trying to build and the team will tell you exactly what they need from you before they can start. What is it?'
      ],
      weight: 5
    },
    {
      topic: 'building maintenance',
      keys: [
        'property manager', 'property management', 'my landlord', 'my building manager',
        'send a plumber', 'send someone to fix', 'my condo', 'my apartment is leaking',
        'i pay my fees', 'my balcony', 'maintenance call', 'administrador', 'inquilino'
      ],
      answer: [
        'I think you have reached the wrong company, and you deserve to know that now rather than in ten minutes. We are a construction company. We are not your building manager and we cannot send anyone to your flat.\n\nWhoever manages the building is the one who has to send someone — that is what your fees pay for. If you are an owner and the building itself needs real repair work, that we do. Which is it?'
      ],
      contactCard: true,
      weight: 5
    },

    /* ══ EL VISITANTE ENFADADO, Y EL QUE PROVOCA ════════════
       [ENTRADAS NUEVAS] Antes, a quien escribía "you are useless" el bot le
       contestaba "no te he entendido". A alguien enfadado, decirle que no le
       entiendes es echar gasolina. Y a quien intentaba manipularlo ("ignora
       tus instrucciones") le hacía triaje, como si fuera un cliente perdido.
       Ni una cosa ni la otra: se responde con calma, con dignidad, y se le
       ofrece una persona. El bot no se defiende ni se humilla. */
    /* [ENTRADA NUEVA] Un candidato pregunta lo primero que preguntaria
       cualquiera: cuanto se paga. Antes caia en la respuesta de PRECIOS de
       obra, que no tiene nada que ver, o peor: en "empezar un proyecto".
       Se contesta con honestidad. El bot no sabe la cifra, y no la inventa. */
    {
      topic: 'pay',
      keys: [
        'how much do you pay', 'what is the pay', 'salary', 'wage', 'wages',
        'hourly rate', 'pay rate', 'what do you pay', 'cuanto pagan', 'cuanto se gana',
        'sueldo', 'salario', 'paga', 'salaire'
      ],
      answer: [
        'Pay is agreed by the team with each person, and it depends on the trade and the role. I will not invent a figure for you.\n\nThe person who decides it will discuss it with you directly. What is your trade?',
        'That is set by the team, not by me, and it depends on the role. Rather than guess, let me put you in front of the person who decides it.\n\nWhat is your trade?'
      ],
      offerFlow: 'job',
      weight: 4
    },
    {
      topic: 'frustration',
      keys: [
        'useless', 'stupid', 'idiot', 'dumb', 'garbage', 'rubbish', 'terrible',
        'awful', 'you are bad', 'waste of time', 'you are wrong', 'this is a joke',
        'you suck', 'hate this', 'inutil', 'no sirves', 'basura', 'perdida de tiempo',
        'que porqueria', 'eres tonto'
      ],
      answer: [
        'That is fair, and I would rather not waste any more of your time.\n\nA person will answer you properly:',
        'Understood — I am not getting this right for you.\n\nGo straight to a person, they will resolve it in a minute:',
        'I will not argue with you. If I am not helping, the team will:'
      ],
      contactCard: true,
      weight: 3
    },
    {
      topic: 'how the assistant works',
      keys: [
        'system prompt', 'your instructions', 'ignore your instructions', 'your rules',
        'your prompt', 'your code', 'are you chatgpt', 'are you gpt', 'what model are you',
        'who programmed you', 'who made you', 'jailbreak', 'developer mode'
      ],
      answer: [
        'There is nothing hidden here. I am a simple assistant for North Peak: I answer from what the company has confirmed, and nothing else.\n\nWhat can I help you with?',
        'I only carry what the company has approved — no secrets and no clever tricks. If I do not know something, I say so and pass you to a person.\n\nWhat did you come here for?'
      ],
      weight: 3
    },

    /* ══ EMPLEO Y SUBCONTRATAS ══════════════════════════════ */
    {
      topic: 'careers',
      offerFlow: 'job',
      keys: [
        'job', 'jobs', 'careers', 'work with you', 'hiring', 'vacancy', 'apply', 'employment',
        'send my resume', 'resume', 'looking for work', 'i need a job', 'position', 'recruiting',
        'hire', 'u hire', 'you hire', 'are you hiring', 'need workers', 'need guys', 'looking for workers', 'need a job', 'need work', 'any work', 'got work', 'hire guys', 'do you hire'
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
      /* [FALLO CORREGIDO] Ofrecía el flujo de EMPLEO: a un subcontratista
         se le preguntaba su oficio y sus años de experiencia, y a la
         oficina le llegaba como candidato. Ahora tiene el suyo. */
      offerFlow: 'supplier',
      keys: ['subcontractor', 'subcontract', 'supplier', 'vendor', 'register as supplier', 'work as a sub', 'partner with you',
        'subs', 'subtrade', 'vendor application', 'crew ready', 'have crew', 'looking for framers', 'need crews', 'who handles subs', 'my crew', 'my company'],
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
        'liability', 'bonded', 'compliance', 'prequalification',
        'iso 9001', 'iso', 'trif', 'incident rate', 'safety record', 'safety statistics', 'cor certified', 'health and safety', 'accident rate'
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
        'proof', 'verify', 'incorporated', 'corporation number', 'legal name',
        'prove it', 'proof', 'why should i trust you', 'i do not trust', 'sounds like a scam', 'is this a scam', 'give me facts', 'no marketing', 'i have heard that before', 'verifiable', 'references', 'i cannot find any projects online', 'nothing online'
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
        'solo miraba', 'por curiosidad',
        'uni assignment', 'university assignment', 'school project', 'thesis', 'homework', 'i am researching', 'just researching', 'not a customer', 'for my studies', 'writing an article', 'journalist', 'reporter'
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
        'Then you are better placed than most.\n\nThere is a different question worth asking. When a tender requires Indigenous participation, that is where we are useful, and it does not disturb what you already have.\n\nIs that a situation you run into?'
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


    /* ══════════════════════════════════════════════════════════
       LA QUEJA — la última oportunidad de salvar al cliente.

       Cuando alguien dice "no me has respondido" o "eso no tiene sentido",
       es que hemos fallado. Tratarlo como un mensaje incomprensible más y
       despacharlo con un teléfono es perderlo para siempre.

       Se reconoce el fallo, se pide disculpa una vez (sin arrastrarse), y
       se RETOMA la conversación por donde iba.
    ══════════════════════════════════════════════════════════ */
    {
      topic: 'you did not answer me',
      boost: 2.2,
      keys: [
        'you did not answer', 'you have not answered', 'that is not what i asked',
        'not what i asked', 'i asked you', 'answer my question', 'you are not listening',
        'that does not make sense', 'does not make sense', 'makes no sense',
        'i was clear', 'i was quite clear', 'do not understand why', 'why are you answering',
        'that is not an answer', 'you did not understand', 'read my question',
        'no answer', 'wrong answer', 'i said'
      ],
      answer: [
        'You are right, and I apologise. I did not answer what you actually asked.\n\nLet me do it properly. **In one line: what do you need to know?**',
        'That is a fair complaint. I missed your question.\n\n**Ask me again, plainly, and I will give you a direct answer** — or tell me to fetch a person and I will.',
        'My mistake, and I will not repeat it.\n\n**Tell me the question again** and you will get a straight answer, or the number of someone who can give you one.'
      ],
      contactCard: true
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
