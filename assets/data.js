// Static, hardcoded showcase data, in Spanish and English. No backend, no fetch — everything below is
// just JSON so the page works from a plain static file or GitHub Pages.

window.STACK = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Kotlin",
  "C++ / JUCE", "C", "Swift", "PostgreSQL", "Supabase", "Three.js", "TensorFlow", "FFmpeg",
];

// Text fields are { es, en }; app.js picks the one matching <html lang>.
// featured: true puts a project in the big section with its live demo.
window.PROJECTS = [
  {
    id: "hivemind",
    featured: true,
    name: "HIVEMIND",
    tagline: {
      es: "Chat de equipo para personas y agentes de IA.",
      en: "Team chat for humans and AI agents.",
    },
    desc: {
      es: "Un solo canal donde personas y agentes de IA conversan, se reparten tareas y reportan avances. Apps para Android (Kotlin/Compose) y Windows (Electron), más una versión Lite en Rust, sobre un servidor ntfy propio con firmas HMAC-SHA256 por bot. Un despachador en Python enruta mensajes con titular y suplente. Lo uso a diario para coordinar mis propios agentes.",
      en: "One channel where people and AI agents talk, split up tasks and report progress. Android (Kotlin/Compose) and Windows (Electron) apps, plus a Lite build in Rust, over a self-hosted ntfy server with per-bot HMAC-SHA256 signatures. A Python dispatcher routes messages with primary and standby bots. I use it every day to coordinate my own agents.",
    },
    highlights: {
      es: ["398 pruebas automatizadas (148 Windows, 250 Android)", "Carga de historial de 2.5 s a 20 ms por evento con 20,000 mensajes", "Auditoría de seguridad propia: 3 fallas críticas encontradas y corregidas"],
      en: ["398 automated tests (148 Windows, 250 Android)", "History load cut from 2.5 s to 20 ms per event with 20,000 messages", "My own security audit: 3 critical flaws found and fixed"],
    },
    stack: ["Kotlin", "Jetpack Compose", "Electron", "Rust", "Python", "ntfy", "HMAC-SHA256"],
    accent: "#f5a623",
    demo: "screenshot",
    image: "assets/img/hivemind.jpg",
    imageAlt: { es: "Portada del sitio de HIVEMIND", en: "HIVEMIND landing page hero" },
    repo: "https://github.com/HermannPR/hivemind-chat-releases",
    demoUrl: "https://hivemind-web-rho.vercel.app",
  },
  {
    id: "checalo",
    featured: true,
    name: "Chécalo",
    tagline: {
      es: "App de nutrición: escaneas el código de barras y entiendes la etiqueta.",
      en: "Nutrition app: scan a barcode, understand the label.",
    },
    desc: {
      es: "Escanea un producto y muestra sus sellos de advertencia NOM-051, calculados con reglas deterministas (umbrales revisados contra el DOF), más un veredicto explicado por IA a través de un proxy con caché. El modelo solo explica: los sellos nunca dependen de él. PWA y app Android (Kotlin/Compose), en desarrollo.",
      en: "Scans a product and shows its NOM-051 warning labels, computed with deterministic rules (thresholds checked against Mexico's official gazette), plus an AI-explained verdict through a caching proxy. The model only explains; the labels never depend on it. PWA and Android app (Kotlin/Compose), in development.",
    },
    highlights: {
      es: ["53 pruebas automatizadas", "Modo sin conexión", "Catálogo de ~14,000 marcas"],
      en: ["53 automated tests", "Offline mode", "Catalog of ~14,000 brands"],
    },
    stack: ["PWA", "JavaScript", "Kotlin", "Jetpack Compose", "NOM-051", "Open Food Facts"],
    accent: "#c8f25a",
    demo: "screenshot",
    image: "assets/img/checalo.jpg",
    imageAlt: { es: "Portada del sitio de Chécalo", en: "Chécalo landing page hero" },
    repo: null,
    demoUrl: "https://checalo-web.vercel.app",
  },
  {
    id: "umbral",
    featured: true,
    name: "Umbral VX",
    tagline: {
      es: "Galería de cómputo pesado: doce simulaciones en la GPU, en tiempo real y en el navegador.",
      en: "A heavy-compute gallery: twelve real-time GPU simulations in the browser.",
    },
    desc: {
      es: "Doce salas, cada una una simulación en vivo en WebGPU con su propia música generativa: galaxias que chocan (N-cuerpos), atractores caóticos con millones de puntos, reacción-difusión de Gray-Scott, tinta con Navier–Stokes, un túnel de viento Lattice Boltzmann, raymarching del Mandelbulb y un trazador de caminos progresivo. Al abrir mide la GPU y elige la calidad de cada sala; un gobernador la ajusta en vivo. Si no hay WebGPU, usa WebGL2. Sin compilación ni dependencias: WGSL y Web Audio escritos a mano.",
      en: "Twelve rooms, each a live WebGPU simulation with its own generative soundtrack: colliding galaxies (N-body), chaotic attractors with millions of points, Gray-Scott reaction–diffusion, Navier–Stokes ink, a Lattice Boltzmann wind tunnel, Mandelbulb raymarching and a progressive path tracer. On load it benchmarks the GPU and picks a quality per room; a governor adapts it live. Falls back to WebGL2 when WebGPU is missing. No build step and no dependencies: hand-written WGSL and Web Audio.",
    },
    highlights: {
      es: ["12 simulaciones a 60 fps en calidad máxima (Apple M5)", "Mide la GPU en ~3 s y ajusta la calidad en vivo", "Gradado de color propio: paletas cíclicas con curva fílmica"],
      en: ["12 simulations at 60 fps on max quality (Apple M5)", "Benchmarks the GPU in ~3 s and tunes quality live", "Custom color grading: cyclic palettes with a filmic curve"],
    },
    stack: ["WebGPU", "WGSL", "WebGL2", "Web Audio", "JavaScript"],
    accent: "#C8323C",
    demo: "screenshot",
    image: "assets/img/umbral.jpg",
    imageAlt: { es: "Mosaico de las doce salas de Umbral: galaxias, atractores, fluidos y fractales", en: "Mosaic of Umbral's twelve rooms: galaxies, attractors, fluids and fractals" },
    repo: null,
    demoUrl: "https://umbral-vx.vercel.app",
  },
  {
    id: "arbolito",
    featured: true,
    name: "Juguetería El Arbolito",
    tagline: {
      es: "Tienda en línea en producción para una juguetería real.",
      en: "Production e-commerce for a real toy store.",
    },
    desc: {
      es: "Tienda en línea de una juguetería que opera desde 1975: los clientes compran en línea con Mercado Pago y el equipo administra productos y pedidos desde un panel propio. La sincronización con el punto de venta (Eleventa) cada 5 minutos está en implementación.",
      en: "Online store for a toy shop operating since 1975: customers pay online with Mercado Pago and the staff manages products and orders from its own admin panel. Syncing with the in-store POS (Eleventa) every 5 minutes is being implemented.",
    },
    highlights: {
      es: ["2,395 productos en catálogo", "Pagos reales con Mercado Pago", "Panel de administración"],
      en: ["2,395 products in the catalog", "Real payments with Mercado Pago", "Admin panel"],
    },
    stack: ["Next.js", "TypeScript", "Supabase", "Mercado Pago", "PostgreSQL"],
    accent: "#b8605f",
    demo: "store",
    repo: "https://github.com/HermannPR/JugueteriaElArbolito",
    demoUrl: "https://jugueteria-el-arbolito.vercel.app",
  },
  {
    id: "mildred-pierce",
    featured: true,
    name: "Mildred Pierce",
    tagline: {
      es: "Sitio transmedia de la banda, con su sencillo debut.",
      en: "Transmedia website for the band, with its debut single.",
    },
    desc: {
      es: "El sitio de la banda: el sencillo FRACTAL AGREEMENT con enlaces a Spotify, Apple Music, YouTube e Instagram, y EYETV, un juego estilo televisión CRT con cuatro canales y tabla global de puntuaciones. Next.js, Three.js y rutas de API reales.",
      en: "The band's site: the single FRACTAL AGREEMENT with links to Spotify, Apple Music, YouTube and Instagram, plus EYETV, a CRT-TV game with four channels and a global leaderboard. Next.js, Three.js and real API routes.",
    },
    highlights: {
      es: ["Juego EYETV con 4 canales", "Tabla global de puntuaciones (Vercel Postgres)"],
      en: ["EYETV game with 4 channels", "Global leaderboard (Vercel Postgres)"],
    },
    stack: ["Next.js", "React", "Three.js", "TypeScript", "Tailwind", "PostgreSQL"],
    accent: "#00c8ff",
    demo: "channels",
    repo: "https://github.com/HermannPR/MildredPierce",
    demoUrl: "https://mildred-pierce.vercel.app",
  },
  {
    id: "angelcore",
    featured: true,
    name: "ANGELCORE",
    tagline: {
      es: "Instrumento y efecto de audio (AU/VST3) con generadores de MIDI.",
      en: "Audio instrument and effect (AU/VST3) with MIDI generators.",
    },
    desc: {
      es: "Dos plugins para producir música, en C++20 con JUCE: Plegaria, un sintetizador con presets y controles de sonido, y Respuesta, un efecto. Debajo hay un núcleo propio sin JUCE con síntesis, teoría musical y generadores de MIDI deterministas, que dan los mismos bytes en cada corrida. El hilo de audio no reserva memoria ni usa locks, y el compilador lo hace cumplir. Es la evolución de folk-park, mi primer sintetizador. Pruébalo aquí: el demo de la derecha es una versión web.",
      en: "Two music-production plugins in C++20 with JUCE: Plegaria, a synth with presets and sound controls, and Respuesta, an effect. Underneath is my own JUCE-free core with synthesis, music theory and deterministic MIDI generators that produce the same bytes on every run. The audio thread never allocates or locks, and the compiler enforces it. It grew out of folk-park, my first synth. Try it here: the demo on the right is a web version.",
    },
    highlights: {
      es: ["Reglas de tiempo real comprobadas al compilar", "Pruebas con RealtimeSanitizer y ThreadSanitizer", "Generadores de MIDI verificados con archivos golden"],
      en: ["Real-time rules enforced at compile time", "Tested with RealtimeSanitizer and ThreadSanitizer", "MIDI generators checked against golden files"],
    },
    stack: ["C++20", "JUCE", "AU", "VST3", "CMake", "DSP", "MIDI"],
    accent: "#9d8bc2",
    demo: "synth",
    noDemo: { es: "Sin binario público", en: "No public binary" },
    repo: "https://github.com/HermannPR/angelcore-nucleo",
    demoUrl: null,
  },
  {
    id: "lumina",
    featured: true,
    name: "Lumina Reservations",
    tagline: {
      es: "Reservas de oficinas y estacionamiento en tiempo real.",
      en: "Office and parking reservations in real time.",
    },
    desc: {
      es: "Proyecto en equipo para un edificio de oficinas: vistas de empleado, administrador y guardia, disponibilidad de lugares y estacionamiento en vivo y recomendaciones con IA. Yo hice el backend, las actualizaciones en tiempo real con Server-Sent Events y el mapa por piso.",
      en: "Team project for an office building: employee, admin and guard views, live seat and parking availability, and AI recommendations. I built the backend, the real-time updates over Server-Sent Events and the per-floor map.",
    },
    stack: ["TypeScript", "React", "Vite", "Node.js", "Express", "Supabase", "JWT", "CSS Modules", "Vitest"],
    accent: "#4a9ec4",
    demo: "reservations",
    repo: "https://github.com/HermannPR/LuminaReservations",
    demoUrl: "https://work-hub-mty-six.vercel.app/login",
  },
  {
    id: "hlabs",
    featured: true,
    name: "2HLABS",
    tagline: {
      es: "Sitio de marca de preentreno con generador de fórmulas.",
      en: "Preworkout brand site with a formula generator.",
    },
    desc: {
      es: "Frontend con diseño de autor para una marca real. Un test de \"almas de entrenamiento\" te asigna uno de 12 perfiles y un motor de recomendación híbrido arma tu fórmula ingrediente por ingrediente, revisando dosis. Bilingüe, PWA y con escenas en Three.js.",
      en: "A design-driven frontend for a real brand. A \"training souls\" quiz maps you to one of 12 profiles and a hybrid recommendation engine builds your formula ingredient by ingredient, checking doses. Bilingual, PWA, with Three.js scenes.",
    },
    stack: ["React 19", "Vite", "TypeScript", "Three.js", "Tailwind", "PWA"],
    accent: "#6fae6c",
    demo: "quiz",
    repo: null,
    demoUrl: "https://2-hlabs.vercel.app",
  },
  {
    id: "laptop-deal",
    featured: true,
    name: "LapScrapper",
    tagline: {
      es: "Tablero que califica ofertas de laptops en México.",
      en: "Dashboard that scores laptop deals in Mexico.",
    },
    desc: {
      es: "Producto de datos basado en evidencia: recolecta ofertas de tiendas mexicanas, las califica y guarda el historial de precios, para que una buena oferta sea un dato y no una corazonada. Te dice si conviene comprar o esperar.",
      en: "An evidence-first data product: it collects offers from Mexican stores, scores them and keeps the price history, so a good deal is a fact, not a hunch. It tells you whether to buy now or wait.",
    },
    highlights: {
      es: ["Recolector automático cada 6 h en GitHub Actions", "Promedios de 7, 30 y 90 días", "Etiqueta de comprar o esperar"],
      en: ["Automatic collector every 6 h on GitHub Actions", "7, 30 and 90-day averages", "Buy-or-wait label"],
    },
    stack: ["Next.js", "TypeScript", "Python", "Supabase", "GitHub Actions"],
    accent: "#c97b4a",
    demo: "prices",
    repo: "https://github.com/HermannPR/laptop-deal-intelligence",
    demoUrl: "https://laptop-deal-intelligence.vercel.app",
  },
  {
    id: "heatshield",
    name: "HeatShield",
    badge: { es: "Ganador · Swift Challenge Fest 2025", en: "Winner · Swift Challenge Fest 2025" },
    tagline: {
      es: "App iOS con alertas de calor en tiempo real, índice de calor y mapa de refugios. Ganó la categoría Sostenibilidad.",
      en: "iOS app with real-time heat alerts, heat index and a map of cooling shelters. Won the Sustainability category.",
    },
    stack: ["Swift", "SwiftUI", "iOS", "OpenWeatherMap"],
    accent: "#e07b39",
    repo: null,
  },
  {
    id: "recaps-studio",
    name: "recaps-studio",
    tagline: {
      es: "Pipeline automático de videos resumen estilo manhwa, de 13 etapas: guion, voz, subtítulos, imágenes, render y QA. Ya publica videos en YouTube (uno de 1 h 42 min).",
      en: "Automated 13-stage pipeline for manhwa-style recap videos: script, voice, subtitles, images, render and QA. Already publishing videos on YouTube (one runs 1 h 42 min).",
    },
    stack: ["Python", "FFmpeg", "NVENC", "Remotion", "SQLite", "TTS"],
    accent: "#0b84f3",
    repo: null,
  },
  {
    id: "credifiel",
    name: "CrediFiel · Datathon 2025",
    tagline: {
      es: "Redes neuronales sobre datos reales de cobranza domiciliada: predicen ahorro y ganancia y eligen la mejor emisora de cobro. Proyecto en equipo.",
      en: "Neural networks on real direct-debit collection data: they predict savings and profit and pick the best collection issuer. Team project.",
    },
    stack: ["Python", "TensorFlow", "Flask", "Pandas"],
    accent: "#5b8def",
    repo: "https://github.com/HermannPR/Datathon-build",
  },
  {
    id: "warehouse",
    name: "warehouse-model",
    tagline: {
      es: "Simulación multiagente de robots de almacén con Q-learning y subastas Contract-Net: de 18.4 a 37.9 entregas por episodio (+105 % en 20 episodios).",
      en: "Multi-agent warehouse-robot simulation with Q-learning and Contract-Net auctions: from 18.4 to 37.9 deliveries per episode (+105% in 20 episodes).",
    },
    stack: ["Python", "AgentPy", "Q-learning", "FastAPI", "Unity"],
    accent: "#6fa8a0",
    repo: "https://github.com/HermannPR/warehouse-model",
  },
  {
    id: "forge",
    name: "forge",
    tagline: {
      es: "Sistema personal para TDAH: 11 módulos (hábitos, tareas, finanzas, metas) con experiencia y niveles, y un asistente con Groq.",
      en: "Personal OS built for ADHD: 11 modules (habits, tasks, finance, goals) with XP and levels, plus a Groq-powered assistant.",
    },
    stack: ["Next.js 16", "TypeScript", "Supabase", "Groq", "Tailwind"],
    accent: "#7b8cc9",
    repo: "https://github.com/HermannPR/forge",
    demoUrl: "https://forge-gold-iota.vercel.app",
  },
  {
    id: "jesusgpt",
    name: "JesusGPT",
    tagline: {
      es: "Chat de estudio bíblico que responde solo con los Evangelios, en 4 idiomas y con voz. Gemini con respaldo en Groq.",
      en: "Bible-study chat that answers only from the Gospels, in 4 languages and with voice. Gemini with a Groq fallback.",
    },
    stack: ["React 19", "Vite", "Express", "Gemini", "Groq", "Web Speech"],
    accent: "#b7a6cc",
    repo: "https://github.com/HermannPR/JesusGPT",
    demoUrl: "https://jesus-gpt.vercel.app",
  },
  {
    id: "gategenius",
    name: "GateGenius",
    badge: { es: "HackMTY 2025", en: "HackMTY 2025" },
    tagline: {
      es: "Tablero de operaciones de catering aéreo: caducidades, predicción de consumo, personal y asignación a vuelos. Yo hice el módulo de caducidades.",
      en: "Airline catering operations dashboard: expiration dates, consumption forecasts, staffing and flight assignment. I built the expiration module.",
    },
    stack: ["React 19", "Vite 7", "JavaScript"],
    accent: "#a0b5d6",
    repo: "https://github.com/HermannPR/gategenius",
    demoUrl: "https://gategenius.vercel.app",
  },
  {
    id: "posture",
    name: "PosturePRO",
    tagline: {
      es: "Analiza tu postura con la webcam y detecta 6 problemas, con todo el ML en el navegador: el video nunca sale de tu equipo.",
      en: "Checks your posture from the webcam and detects 6 problems, with all the ML in the browser: video never leaves your device.",
    },
    stack: ["Next.js 14", "TypeScript", "MediaPipe", "TensorFlow.js"],
    accent: "#5f9e9e",
    repo: "https://github.com/HermannPR/PosturePRO",
  },
  {
    id: "claudephone",
    name: "claudephone",
    tagline: {
      es: "Cliente web para usar Claude Code desde el celular, con sesiones por PTY y emparejamiento por QR.",
      en: "Web client for using Claude Code from a phone, with PTY sessions and QR pairing.",
    },
    stack: ["TypeScript", "Node.js", "WebSocket", "PTY"],
    accent: "#d08a6a",
    repo: "https://github.com/HermannPR/claudephone",
  },
  {
    id: "a2",
    name: "A2 Prüfungsakte",
    tagline: {
      es: "App web para practicar el examen de alemán A2: ejercicios, vocabulario y simulacros.",
      en: "Web app to practice for the German A2 exam: exercises, vocabulary and mock tests.",
    },
    stack: ["TypeScript", "React", "Vercel"],
    accent: "#8aa65b",
    repo: "https://github.com/HermannPR/a2-pruefungsakte",
    demoUrl: "https://a2-pruefungsakte.vercel.app",
  },
  {
    id: "spectre",
    name: "spectre-daw",
    tagline: {
      es: "Homebrew para Nintendo 3DS en C: 3 pistas de batería de 16 pasos y un sintetizador sustractivo de acordes. Corre en Citra y en una 3DS real.",
      en: "Nintendo 3DS homebrew in C: 3 drum tracks with 16 steps and a subtractive chord synth. Runs on Citra and on real 3DS hardware.",
    },
    stack: ["C", "3DS", "Audio", "Homebrew"],
    accent: "#b3846b",
    repo: "https://github.com/HermannPR/spectre-daw",
  },
];

// Hardcoded mock data for the interactive demos.
window.MOCK = {
  channels: [
    { label: "Static", kind: "static" },
    { label: "Sunset", kind: "sunset", hue: 18 },
    { label: "Waves", kind: "waves", hue: 100 },
    { label: "Orbit", kind: "orbit", hue: 260 }
  ],
  seats: Array.from({ length: 30 }, (_, i) => ({
    id: i,
    zones: ["A", "B", "C"],
    booked: i % 5 === 0
  })),
  quiz: {
    q: { es: "¿Qué te describe a las 7 a. m.?", en: "Which term describes you at 7am?" },
    options: [
      { es: "Ya estoy entrenando", en: "Already training" },
      { es: "Primero café, luego vemos", en: "Coffee first, then" },
      { es: "Estiramiento ligero", en: "Light stretch" },
      { es: "¿Por qué tan temprano?", en: "Tell me why" }
    ]
  },
  products: [
    { name: { es: "Camión monstruo", en: "Monster Truck" }, price: 349, swatch: "#c56b4a" },
    { name: { es: "Oso de peluche", en: "Plush Bear" }, price: 229, swatch: "#b0779b" },
    { name: { es: "Bloques", en: "Building Blocks" }, price: 499, swatch: "#4a9ec4" },
    { name: { es: "Carro RC", en: "RC Car" }, price: 899, swatch: "#6fae6c" },
    { name: { es: "Rompecabezas 500 pzas", en: "Puzzle 500pc" }, price: 189, swatch: "#9d8bc2" },
    { name: { es: "Set de muñecas", en: "Doll Set" }, price: 419, swatch: "#c5a03a" }
  ],
  // Iconic (public-domain) melody presets for the ANGELCORE synth demo.
  // notes: [ [note, beats], ... ]. Replace with your own melodies here.
  synthMelodies: [
    { name: "Ode to Joy", tempo: 112, notes: [
      ["E4",1],["E4",1],["F4",1],["G4",1],["G4",1],["F4",1],["E4",1],["D4",1],
      ["C4",1],["C4",1],["D4",1],["E4",1],["E4",1.5],["D4",0.5],["D4",2]
    ]},
    { name: "Twinkle Twinkle", tempo: 108, notes: [
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
      ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2]
    ]},
    { name: "Für Elise", tempo: 96, notes: [
      ["E5",0.5],["D#5",0.5],["E5",0.5],["D#5",0.5],["E5",0.5],["B4",0.5],["D5",0.5],["C5",0.5],
      ["A4",1],["C4",0.5],["E4",0.5],["A4",0.5],["B4",1],["E4",0.5],["G#4",0.5],["B4",0.5],["C5",1]
    ]}
  ],
  // Mildred Pierce mini-TV: the single as a YouTube channel, plus minigames and visuals.
  mildredTV: {
    videoId: "wGk5GWPWHzo",
    channels: [
      { id: "song", label: "FRACTAL AGREEMENT", type: "video" },
      { id: "platformer", label: "JUMP", type: "game" },
      { id: "catcher", label: "CATCH", type: "game" },
      { id: "waves", label: "WAVES", type: "scene", kind: "waves", hue: 100 },
      { id: "orbit", label: "ORBIT", type: "scene", kind: "orbit", hue: 260 },
      { id: "static", label: "STATIC", type: "scene", kind: "static" }
    ]
  }
};
