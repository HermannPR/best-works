// Static, hardcoded showcase data. No backend, no fetch — everything below is
// just JSON so the page works from a plain static file or GitHub Pages.

window.STACK = [
  "TypeScript", "React", "Next.js", "Node.js", "Python",
  "Three.js", "Tailwind CSS", "C++", "C", "DSP / Audio", "PostgreSQL", "Supabase",
];

window.PROJECTS = [
  {
    id: "folk-park",
    name: "folk-park",
    tagline: "Original wavetable synth + composition assistant.",
    desc: "A real-time synthesizer built in C++20 with JUCE, shipping as standalone and VST3 for Intel macOS. Two oscillators with wavetable modulation, effects, presets, and a deterministic composition assistant that generates musical ideas without losing control. Verified at pluginval strictness 5 and built through a disciplined milestone process.",
    stack: ["C++20", "JUCE", "VST3", "CMake", "SQLite", "DSP"],
    accent: "#9d8bc2",
    demo: "synth",
    repo: "https://github.com/HermannPR/folk-park",
    demoUrl: null
  },
  {
    id: "mildred-pierce",
    name: "Mildred Pierce",
    tagline: "Transmedia website for the band — debut single out now.",
    desc: "The band's site: the debut single FRACTAL AGREEMENT with links to Spotify, Apple Music, YouTube and Instagram, plus a channel-surfing platformer, a virtual companion, leaderboards and recording uploads. Next.js, Three.js and real API routes.",
    stack: ["Next.js", "React", "Three.js", "TypeScript", "Tailwind", "PostgreSQL"],
    accent: "#00c8ff",
    demo: "channels",
    repo: "https://github.com/HermannPR/MildredPierce",
    demoUrl: "https://mildred-pierce.vercel.app"
  },
  {
    id: "lumina",
    name: "Lumina Reservations",
    tagline: "Office & parking reservations with real-time updates.",
    desc: "A production-style team project for a coworking space: employee, admin, and guard views, live seat and parking availability streamed over Server-Sent Events, plus AI recommendations. TypeScript across a React/Vite frontend and a Node/Express + Supabase backend, with tests and CI.",
    stack: ["TypeScript", "React", "Vite", "Node.js", "Express", "Supabase", "PostgreSQL", "Vitest"],
    accent: "#4a9ec4",
    demo: "reservations",
    repo: "https://github.com/HermannPR/LuminaReservations",
    demoUrl: "https://lumina-front-oxfi.vercel.app"
  },
  {
    id: "hlabs",
    name: "2HLABS",
    tagline: "Preworkout brand site with a custom formula generator.",
    desc: "A design-driven frontend for a real brand. A 'training souls' assessment maps you to one of twelve archetypes, then generates a tailored supplement formula ingredient by ingredient. Bilingual, PWA, deployed.",
    stack: ["React", "Vite", "TypeScript", "Tailwind", "PWA"],
    accent: "#6fae6c",
    demo: "quiz",
    repo: "https://github.com/HermannPR/2HLABS",
    demoUrl: "https://2-hlabs.vercel.app"
  },
  {
    id: "laptop-deal",
    name: "laptop-deal-intelligence",
    tagline: "Dashboard that scores laptop deals in Mexico.",
    desc: "An evidence-first data product. It collects laptop offers from Mexican stores, scores them, and preserves observed prices over time so a better deal is a fact, not a vibe. Next.js + a Python data layer + Supabase.",
    stack: ["Next.js", "TypeScript", "Python", "Supabase"],
    accent: "#c97b4a",
    demo: "prices",
    repo: "https://github.com/HermannPR/laptop-deal-intelligence",
    demoUrl: "https://laptop-deal-intelligence.vercel.app"
  },
  {
    id: "arbolito",
    name: "Juguetería El Arbolito",
    tagline: "A real store's e-commerce + POS sync.",
    desc: "Production e-commerce for a toy store operating since 1975. Customers buy online, the staff sells at the counter, and inventory stays consistent across both. Next.js + Supabase + Mercado Pago payments.",
    stack: ["Next.js", "TypeScript", "Supabase", "Mercado Pago", "PostgreSQL"],
    accent: "#b8605f",
    demo: "store",
    repo: "https://github.com/HermannPR/JugueteriaElArbolito",
    demoUrl: "https://jugueteria-el-arbolito.vercel.app"
  },
  {
    id: "forge",
    name: "forge",
    tagline: "Personal OS — 11-module life dashboard with an XP system.",
    desc: "A personal operating system: habits, tasks, finance, and goals, tied together by an XP and leveling system so the dashboard feels alive rather than like a spreadsheet.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    accent: "#7b8cc9",
    demo: null,
    repo: "https://github.com/HermannPR/forge"
  },
  {
    id: "jesusgpt",
    name: "JesusGPT",
    tagline: "AI Bible study chat with retrieval (RAG).",
    desc: "A chat app that answers questions about the Bible and cites the passages it's drawing from, instead of hallucinating. Retrieval-augmented generation over a curated corpus.",
    stack: ["Next.js", "TypeScript", "OpenAI", "RAG"],
    accent: "#b7a6cc",
    demo: null,
    repo: "https://github.com/HermannPR/JesusGPT"
  },
  {
    id: "warehouse",
    name: "warehouse-model",
    tagline: "Warehouse-robot reinforcement learning simulation.",
    desc: "A reinforcement learning environment where robots learn to move goods in a warehouse without colliding. Python simulator with a reward function and Q-learning baseline.",
    stack: ["Python", "Reinforcement Learning", "Simulation"],
    accent: "#6fa8a0",
    demo: null,
    repo: "https://github.com/HermannPR/warehouse-model"
  },
  {
    id: "spectre",
    name: "spectre-daw",
    tagline: "3DS homebrew step-sequencer synthesizer.",
    desc: "A step-sequencer synth running on real Nintendo 3DS hardware, written in C. Hardware-timing-sensitive audio and input on a platform with very few resources.",
    stack: ["C", "3DS", "Audio", "Homebrew"],
    accent: "#b3846b",
    demo: null,
    repo: "https://github.com/HermannPR/spectre-daw"
  },
  {
    id: "posture",
    name: "PosturePRO",
    tagline: "Privacy-first posture analysis, all ML in-browser.",
    desc: "Uses pose estimation entirely in the browser so no video ever leaves the device. Grade your sitting posture in real time from a webcam or an uploaded video.",
    stack: ["TypeScript", "Next.js", "MediaPipe", "TensorFlow"],
    accent: "#5f9e9e",
    demo: null,
    repo: "https://github.com/HermannPR/PosturePRO"
  },
  {
    id: "gategenius",
    name: "GateGenius",
    tagline: "AI airline catering platform (HackMTY 2025).",
    desc: "Built in 24 hours for HackMTY 2025. Plan meals across a flight's cabins with AI-generated menus, cost windows, and dietary constraints. React + Vite + Tailwind.",
    stack: ["React", "Vite", "TypeScript", "Tailwind", "AI"],
    accent: "#a0b5d6",
    demo: null,
    repo: "https://github.com/HermannPR/gategenius"
  }
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
    q: "Which term describes you at 7am?",
    options: ["Already training", "Coffee first, then", "Light stretch", "Tell me why"]
  },
  products: [
    { name: "Monster Truck", price: 349, swatch: "#c56b4a" },
    { name: "Plush Bear", price: 229, swatch: "#b0779b" },
    { name: "Building Blocks", price: 499, swatch: "#4a9ec4" },
    { name: "RC Car", price: 899, swatch: "#6fae6c" },
    { name: "Puzzle 500pc", price: 189, swatch: "#9d8bc2" },
    { name: "Doll Set", price: 419, swatch: "#c5a03a" }
  ],
  // Iconic (public-domain) melody presets for the folk-park synth demo.
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
  ]
};
