(function () {
  "use strict";

  const featured = window.PROJECTS.filter((p) =>
    ["folk-park", "mildred-pierce", "lumina", "hlabs", "laptop-deal", "arbolito"].includes(p.id)
  );
  const small = window.PROJECTS.filter((p) => !featured.includes(p));

  // ----- Header stack badges -----
  const stackEl = document.getElementById("stack-badges");
  stackEl.innerHTML = window.STACK.map((s) => `<span class="badge">${s}</span>`).join("");

  // ----- Render featured -----
  const featuredEl = document.getElementById("featured");
  featuredEl.innerHTML = featured.map((p) => `
    <article class="feature" id="${p.id}">
      <div class="info">
        <h3>${p.name}</h3>
        <p class="tagline">${p.tagline}</p>
        <p class="desc">${p.desc}</p>
        <div class="meta">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        <div class="actions">
          ${p.demoUrl ? `<span class="demo-dot" style="background:${p.accent}"></span>` : ""}
          ${p.demoUrl
            ? `<a href="${p.demoUrl}" target="_blank" rel="noopener">Live demo ↗</a>`
            : `<span style="color:var(--dim)">Live demo pending</span>`}
          <a href="${p.repo}" target="_blank" rel="noopener">Source</a>
        </div>
      </div>
      <div class="demo" data-demo="${p.demo || "text"}" data-accent="${p.accent}">
        <div class="demo-bar">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span class="title">${p.id} · demo</span>
        </div>
        <div class="demo-body"></div>
      </div>
    </article>
  `).join("");

  // ----- Render smaller grid -----
  document.getElementById("grid").innerHTML = small.map((p) => `
    <div class="card">
      <h4>${p.name}</h4>
      <p>${p.tagline}</p>
      <div class="meta">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
      <div class="actions">
        <a href="${p.repo}" target="_blank" rel="noopener">Source</a>
      </div>
    </div>
  `).join("");

  // Demo registry (populated below, booted after all demos are registered).
  const demos = {};

  // ----- Shared premium helpers (reused by every demo) -----
  const SEMI = { C:0, "C#":1, D:2, "D#":3, E:4, F:5, "F#":6, G:7, "G#":8, A:9, "A#":10, B:11 };
  function noteToFreq(n) {
    const m = String(n).match(/^([A-G]#?)(\d)$/);
    if (!m) return 440;
    const semi = SEMI[m[1]] + (parseInt(m[2], 10) + 1) * 12;
    return 440 * Math.pow(2, (semi - 69) / 12);
  }
  function ripple(btn, e) {
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.width = s.style.height = size + "px";
    s.style.left = (e.clientX - r.left - size / 2) + "px";
    s.style.top = (e.clientY - r.top - size / 2) + "px";
    btn.appendChild(s);
    setTimeout(() => s.remove(), 620);
  }
  function drawWaveShape(ctx, w, W, H, color) {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const cy = H / 2;
    const amp = H * 0.34;
    const per = W / 4;
    for (let x = 0; x <= W; x++) {
      let y = cy;
      if (w === "sine") y = cy + Math.sin((x / W) * Math.PI * 2) * amp;
      else if (w === "square") y = (x % (W / 2) < W / 4) ? cy - amp : cy + amp;
      else if (w === "triangle") {
        const t = (x / W) * 4;
        const frac = t % 1;
        y = cy + ((t % 2 < 1 ? -1 + 2 * frac : 1 - 2 * frac) * amp);
      } else y = cy + amp * (1 - 2 * ((x % per) / per));
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ============================ DEMOS ============================

  // 1. folk-park — a tiny real-time oscillator + oscilloscope (WebAudio).
  demos.synth = function (body, accent) {
    body.innerHTML = `
      <canvas width="480" height="160"></canvas>
      <div class="controls">
        <button class="btn" data-wave="sawtooth">Saw</button>
        <button class="btn" data-wave="square">Square</button>
        <button class="btn" data-wave="sine">Sine</button>
        <button class="btn" data-wave="triangle">Triangle</button>
        <button class="btn primary" data-play>Play arpeggio</button>
      </div>
      <div class="readout">Ready. Pick a waveform and press play.</div>`;

    const canvas = body.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const readout = body.querySelector(".readout");
    let audio, osc, gain, analyser, wave = "sawtooth", playing = false;

    function ensureAudio() {
      if (!audio) {
        audio = new (window.AudioContext || window.webkitAudioContext)();
        gain = audio.createGain();
        analyser = audio.createAnalyser();
        analyser.fftSize = 2048;
        gain.gain.value = 0.0;
        gain.connect(analyser).connect(audio.destination);
      }
      if (audio.state === "suspended") audio.resume();
    }

    function note(freq, t, dur) {
      if (!osc) {
        osc = audio.createOscillator();
        osc.type = wave;
        osc.frequency.value = freq;
        const g = audio.createGain();
        osc.connect(g).connect(gain);
        osc.start();
      }
      osc.type = wave;
      const now = audio.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      // simple envelope
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    }

    function arp() {
      ensureAudio();
      const freqs = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
      const step = 0.22;
      freqs.forEach((f, i) => note(f, i * step, step * 0.9));
      readout.textContent = "Playing: " + freqs.map((f) => f.toFixed(1) + " Hz").join(" · ");
      playing = true;
    }

    body.querySelectorAll("[data-wave]").forEach((b) => {
      b.addEventListener("click", () => {
        wave = b.getAttribute("data-wave");
        body.querySelectorAll("[data-wave]").forEach((x) => x.classList.remove("primary"));
        b.classList.add("primary");
        readout.textContent = "Waveform: " + wave;
      });
    });
    body.querySelector("[data-play]").addEventListener("click", arp);

    // oscilloscope loop
    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
      if (!audio || !osc) {
        // flat line ghost
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }
      const buf = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buf);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < buf.length; i++) {
        const x = (i / buf.length) * canvas.width;
        const y = (buf[i] / 255) * canvas.height;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    draw();
  };

  // 1b. folk-park (premium) — keyboard, waveform preview, melodies, spectrum, knobs.
  demos.synth = function (body, accent) {
    const WAVES = ["sine", "square", "triangle", "sawtooth"];
    const WHITE = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
    const BLACK_POS = { "C#4": 1, "D#4": 2, "F#4": 4, "G#4": 5, "A#4": 6 };
    const KEYS = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];
    const melodies = window.MOCK.synthMelodies || [];
    const KW = 100 / WHITE.length;

    body.innerHTML = `
      <div class="synth premium-demo" style="--accent:${accent}">
        <div class="waves">${WAVES.map((w, i) =>
          `<button class="pbtn wave ${i === WAVES.length - 1 ? "active" : ""}" data-wave="${w}" aria-label="${w}">
             <canvas class="mini-wave" width="42" height="24"></canvas><span>${w[0].toUpperCase() + w.slice(1)}</span>
           </button>`).join("")}
        </div>
        <div class="keys"></div>
        <div class="scopes">
          <canvas class="scope" width="460" height="106"></canvas>
          <canvas class="spectrum" width="460" height="52"></canvas>
        </div>
        <div class="melodies">
          ${melodies.map((m, i) => `<button class="pbtn mel" data-mel="${i}">${m.name}</button>`).join("")}
          <button class="pbtn primary" data-arp>Arpeggio</button>
        </div>
        <div class="knobs">
          <label>Filter <input type="range" min="300" max="6000" value="6000" step="50" data-ctl="filter"></label>
          <label>Detune <input type="range" min="-40" max="40" value="0" step="2" data-ctl="detune"></label>
        </div>
        <div class="readout">Pick a waveform, tap a key, or play a melody.</div>
      </div>`;

    body.querySelectorAll(".wave").forEach((btn) => {
      drawWaveShape(btn.querySelector("canvas").getContext("2d"), btn.getAttribute("data-wave"), 42, 24, "#1a1c22");
    });

    const keysWrap = body.querySelector(".keys");
    keysWrap.innerHTML =
      WHITE.map((n, i) => `<span class="key white" data-n="${n}" style="left:${i * KW}%;width:${KW}%"></span>`).join("") +
      Object.entries(BLACK_POS).map(([n, before]) =>
        `<span class="key black" data-n="${n}" style="left:${before * KW - KW * 0.285}%;width:${KW * 0.55}%"></span>`).join("");

    const scope = body.querySelector(".scope");
    const sctx = scope.getContext("2d");
    const spec = body.querySelector(".spectrum");
    const fctx = spec.getContext("2d");
    const readout = body.querySelector(".readout");
    let wave = "sawtooth";
    let filterVal = 6000, detuneVal = 0;
    let audio, bus, filter, analyser, freqData;
    let heldNote = null, heldVoices = [];

    function ensureAudio() {
      if (!audio) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audio = new AC();
        analyser = audio.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.8;
        filter = audio.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = filterVal;
        filter.Q.value = 0.8;
        bus = audio.createGain();
        bus.gain.value = 0.0;
        bus.connect(filter).connect(analyser).connect(audio.destination);
        freqData = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audio.state === "suspended") audio.resume();
    }

    function startNote(freq, dur, sustain) {
      ensureAudio();
      const now = audio.currentTime;
      const g = audio.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
      if (sustain) g.gain.linearRampToValueAtTime(0.22, now + dur);
      else g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      g.connect(bus);
      const o1 = audio.createOscillator();
      o1.type = wave;
      o1.frequency.value = freq;
      o1.detune.value = detuneVal;
      const o2 = audio.createOscillator();
      o2.type = wave;
      o2.frequency.value = freq;
      o2.detune.value = -detuneVal;
      o1.connect(g);
      o2.connect(g);
      o1.start(now);
      o2.start(now);
      o1.stop(now + dur + 0.05);
      o2.stop(now + dur + 0.05);
      return { g, o1, o2 };
    }

    function releaseVoices() {
      if (!audio) return;
      const now = audio.currentTime;
      heldVoices.forEach((v) => {
        try {
          v.g.gain.cancelScheduledValues(now);
          v.g.gain.setValueAtTime(0.0001, now);
          v.g.gain.linearRampToValueAtTime(0.0001, now + 0.12);
        } catch (e) {}
      });
      heldVoices = [];
    }

    function lightKey(n, on) {
      const el = keysWrap.querySelector('[data-n="' + n + '"]');
      if (el) el.classList.toggle("on", on);
    }

    body.querySelectorAll(".wave").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        ripple(btn, e);
        wave = btn.getAttribute("data-wave");
        body.querySelectorAll(".wave").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        readout.textContent = "Waveform: " + wave;
      });
    });

    keysWrap.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".key");
      if (!el) return;
      e.preventDefault();
      ensureAudio();
      heldNote = el.getAttribute("data-n");
      heldVoices.push(startNote(noteToFreq(heldNote), 1, true));
      lightKey(heldNote, true);
      readout.textContent = heldNote + " · " + noteToFreq(heldNote).toFixed(1) + " Hz";
    });
    keysWrap.addEventListener("pointermove", (e) => {
      if (e.buttons === 0) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.classList && el.classList.contains("key") && el.getAttribute("data-n") !== heldNote) {
        releaseVoices();
        lightKey(heldNote, false);
        heldNote = el.getAttribute("data-n");
        heldVoices.push(startNote(noteToFreq(heldNote), 1, true));
        lightKey(heldNote, true);
        readout.textContent = heldNote + " · " + noteToFreq(heldNote).toFixed(1) + " Hz";
      }
    });
    window.addEventListener("pointerup", () => {
      releaseVoices();
      if (heldNote) lightKey(heldNote, false);
      heldNote = null;
    });

    function playSeq(notes, tempo, name) {
      ensureAudio();
      const beat = 60 / tempo;
      let t = 0;
      notes.forEach(([n, beats]) => {
        const dur = beats * beat * 0.92;
        startNote(noteToFreq(n), dur, false);
        setTimeout(() => lightKey(n, true), t * 1000);
        setTimeout(() => lightKey(n, false), (t + dur) * 1000);
        t += beats * beat;
      });
      readout.textContent = "Playing: " + name;
    }

    body.querySelectorAll(".mel").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        ripple(btn, e);
        const m = melodies[Number(btn.getAttribute("data-mel"))];
        if (m) playSeq(m.notes, m.tempo, m.name);
      });
    });
    body.querySelector("[data-arp]").addEventListener("click", (e) => {
      ripple(e.currentTarget, e);
      playSeq([["C4", 1], ["E4", 1], ["G4", 1], ["C5", 1], ["G4", 1], ["E4", 1], ["C4", 1], ["E4", 1], ["G4", 1], ["C5", 1], ["G4", 1], ["C4", 1]], 140, "Arpeggio");
    });

    body.querySelector("[data-ctl=filter]").addEventListener("input", (e) => {
      filterVal = +e.target.value;
      if (filter && audio) filter.frequency.setTargetAtTime(filterVal, audio.currentTime, 0.02);
      readout.textContent = "Filter: " + filterVal + " Hz";
    });
    body.querySelector("[data-ctl=detune]").addEventListener("input", (e) => {
      detuneVal = +e.target.value;
      readout.textContent = "Detune: " + (detuneVal > 0 ? "+" : "") + detuneVal + " cents";
    });

    function draw() {
      requestAnimationFrame(draw);
      // scope: grid + waveform
      sctx.clearRect(0, 0, scope.width, scope.height);
      sctx.strokeStyle = "rgba(20,22,30,0.08)";
      sctx.lineWidth = 1;
      for (let yy = 0; yy < scope.height; yy += 18) {
        sctx.beginPath(); sctx.moveTo(0, yy); sctx.lineTo(scope.width, yy); sctx.stroke();
      }
      sctx.beginPath(); sctx.moveTo(scope.width / 2, 0); sctx.lineTo(scope.width / 2, scope.height); sctx.stroke();
      let buf = null;
      if (audio && analyser) {
        buf = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buf);
      }
      sctx.strokeStyle = accent;
      sctx.lineWidth = 2;
      sctx.beginPath();
      const n = buf ? buf.length : scope.width;
      for (let i = 0; i < n; i++) {
        const x = (i / n) * scope.width;
        const y = buf ? (buf[i] / 255) * scope.height : scope.height / 2;
        i === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
      }
      sctx.stroke();
      // spectrum
      fctx.clearRect(0, 0, spec.width, spec.height);
      if (audio && analyser) {
        analyser.getByteFrequencyData(freqData);
        const bars = 52;
        const barW = spec.width / bars;
        for (let k = 0; k < bars; k++) {
          const v = freqData[k] / 255;
          fctx.fillStyle = accent;
          fctx.globalAlpha = 0.3 + v * 0.7;
          fctx.fillRect(k * barW, spec.height - v * spec.height, barW - 2, v * spec.height);
        }
        fctx.globalAlpha = 1;
      }
    }
    draw();
  };

  // 1c. folk-park (v2 — minimal, fast to grasp) — keyboard + one play button.
  demos.synth = function (body, accent) {
    const WAVES = ["sawtooth", "sine", "square"];
    const WHITE = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
    const BLACK_POS = { "C#4": 1, "D#4": 2, "F#4": 4, "G#4": 5, "A#4": 6 };
    const melodies = window.MOCK.synthMelodies || [];
    const KW = 100 / WHITE.length;
    let tuneIndex = 0;

    body.innerHTML = `
      <div class="synth premium-demo v2" style="--accent:${accent}">
        <canvas class="scope" width="440" height="96"></canvas>
        <div class="keys"></div>
        <div class="row">
          <div class="waves" role="group" aria-label="Waveform">
            ${WAVES.map((w, i) => `<button class="pbtn chip ${i === 0 ? "active" : ""}" data-wave="${w}">${w[0].toUpperCase() + w.slice(1)}</button>`).join("")}
          </div>
          <button class="pbtn primary" data-tune>▶ Play a tune</button>
        </div>
        <div class="readout">Tap the keys or hit play.</div>
      </div>`;

    const keysWrap = body.querySelector(".keys");
    keysWrap.innerHTML =
      WHITE.map((n, i) => `<span class="key white" data-n="${n}" style="left:${i * KW}%;width:${KW}%"></span>`).join("") +
      Object.entries(BLACK_POS).map(([n, before]) => `<span class="key black" data-n="${n}" style="left:${before * KW - KW * 0.285}%;width:${KW * 0.55}%"></span>`).join("");

    const scope = body.querySelector(".scope");
    const sctx = scope.getContext("2d");
    const readout = body.querySelector(".readout");
    let wave = "sawtooth";
    let audio, analyser, bus, freqData;
    let heldNote = null, heldVoices = [];

    function ensureAudio() {
      if (!audio) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audio = new AC();
        analyser = audio.createAnalyser();
        analyser.fftSize = 1024;
        bus = audio.createGain();
        bus.gain.value = 0.0;
        bus.connect(analyser).connect(audio.destination);
        freqData = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audio.state === "suspended") audio.resume();
    }

    function startNote(freq, dur, sustain) {
      ensureAudio();
      const now = audio.currentTime;
      const g = audio.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
      if (sustain) g.gain.linearRampToValueAtTime(0.22, now + dur);
      else g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      g.connect(bus);
      const o = audio.createOscillator();
      o.type = wave;
      o.frequency.value = freq;
      o.connect(g);
      o.start(now);
      o.stop(now + dur + 0.05);
      return { g };
    }
    function releaseVoices() {
      if (!audio) return;
      const now = audio.currentTime;
      heldVoices.forEach((v) => {
        try {
          v.g.gain.cancelScheduledValues(now);
          v.g.gain.setValueAtTime(0.0001, now);
          v.g.gain.linearRampToValueAtTime(0.0001, now + 0.12);
        } catch (e) {}
      });
      heldVoices = [];
    }
    function lightKey(n, on) {
      const el = keysWrap.querySelector('[data-n="' + n + '"]');
      if (el) el.classList.toggle("on", on);
    }

    body.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        ripple(btn, e);
        wave = btn.getAttribute("data-wave");
        body.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    keysWrap.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".key");
      if (!el) return;
      e.preventDefault();
      ensureAudio();
      heldNote = el.getAttribute("data-n");
      heldVoices.push(startNote(noteToFreq(heldNote), 1, true));
      lightKey(heldNote, true);
      readout.textContent = heldNote + " · " + noteToFreq(heldNote).toFixed(1) + " Hz";
    });
    keysWrap.addEventListener("pointermove", (e) => {
      if (e.buttons === 0) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.classList && el.classList.contains("key") && el.getAttribute("data-n") !== heldNote) {
        releaseVoices();
        lightKey(heldNote, false);
        heldNote = el.getAttribute("data-n");
        heldVoices.push(startNote(noteToFreq(heldNote), 1, true));
        lightKey(heldNote, true);
        readout.textContent = heldNote + " · " + noteToFreq(heldNote).toFixed(1) + " Hz";
      }
    });
    window.addEventListener("pointerup", () => {
      releaseVoices();
      if (heldNote) lightKey(heldNote, false);
      heldNote = null;
    });

    function playSeq(notes, tempo, name) {
      ensureAudio();
      const beat = 60 / tempo;
      let t = 0;
      notes.forEach(([n, beats]) => {
        const dur = beats * beat * 0.92;
        startNote(noteToFreq(n), dur, false);
        setTimeout(() => lightKey(n, true), t * 1000);
        setTimeout(() => lightKey(n, false), (t + dur) * 1000);
        t += beats * beat;
      });
      readout.textContent = name;
    }
    body.querySelector("[data-tune]").addEventListener("click", (e) => {
      ripple(e.currentTarget, e);
      const m = melodies[tuneIndex % melodies.length];
      tuneIndex++;
      playSeq(m.notes, m.tempo, m.name);
    });

    function draw() {
      requestAnimationFrame(draw);
      sctx.clearRect(0, 0, scope.width, scope.height);
      sctx.strokeStyle = "rgba(255,255,255,0.06)";
      sctx.lineWidth = 1;
      for (let yy = 0; yy < scope.height; yy += 16) {
        sctx.beginPath(); sctx.moveTo(0, yy); sctx.lineTo(scope.width, yy); sctx.stroke();
      }
      let buf = null;
      if (audio && analyser) {
        buf = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buf);
      }
      sctx.strokeStyle = accent;
      sctx.lineWidth = 2;
      sctx.beginPath();
      const n = buf ? buf.length : scope.width;
      for (let i = 0; i < n; i++) {
        const x = (i / n) * scope.width;
        const y = buf ? (buf[i] / 255) * scope.height : scope.height / 2;
        i === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
      }
      sctx.stroke();
    }
    draw();
  };

  // 1d. folk-park (v3 — vertical keyboard + notes-in-time roller).
  demos.synth = function (body, accent) {
    const WAVES = ["sawtooth", "sine", "square"];
    const KEYS = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];
    const BLACK = new Set(["C#4", "D#4", "F#4", "G#4", "A#4"]);
    const melodies = window.MOCK.synthMelodies || [];
    let tuneIndex = 0;

    body.innerHTML = `
      <div class="synth premium-demo v3" style="--accent:${accent}">
        <div class="vrow">
          <div class="vkeys"></div>
          <div class="figures">
            <canvas class="wavefig" width="230" height="150"></canvas>
            <canvas class="roller" width="230" height="84"></canvas>
          </div>
        </div>
        <div class="row">
          <div class="waves" role="group" aria-label="Waveform">
            ${WAVES.map((w, i) => `<button class="pbtn chip ${i === 0 ? "active" : ""}" data-wave="${w}">${w[0].toUpperCase() + w.slice(1)}</button>`).join("")}
          </div>
          <button class="pbtn primary" data-tune>▶ Play a tune</button>
        </div>
        <div class="readout">Tap the keys or hit play.</div>
      </div>`;

    const keysWrap = body.querySelector(".vkeys");
    keysWrap.innerHTML = KEYS.slice().reverse().map((n) => `<div class="key ${BLACK.has(n) ? "black" : "white"}" data-n="${n}"></div>`).join("");

    const fig = body.querySelector(".wavefig");
    const fctx = fig.getContext("2d");
    const roller = body.querySelector(".roller");
    const rctx = roller.getContext("2d");
    const readout = body.querySelector(".readout");
    let wave = "sawtooth";
    let audio, bus, analyser;
    let notes = [];
    let heldNote = null, heldVoices = [];

    function ensureAudio() {
      if (!audio) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audio = new AC();
        analyser = audio.createAnalyser();
        analyser.fftSize = 1024;
        bus = audio.createGain();
        bus.gain.value = 0.0;
        bus.connect(analyser).connect(audio.destination);
      }
      if (audio.state === "suspended") audio.resume();
    }
    function startNote(freq, dur, sustain) {
      ensureAudio();
      const now = audio.currentTime;
      const g = audio.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
      if (sustain) g.gain.linearRampToValueAtTime(0.22, now + dur);
      else g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      g.connect(bus);
      const o = audio.createOscillator();
      o.type = wave;
      o.frequency.value = freq;
      o.connect(g);
      o.start(now);
      o.stop(now + dur + 0.05);
      return { g };
    }
    function releaseVoices() {
      if (!audio) return;
      const now = audio.currentTime;
      heldVoices.forEach((v) => {
        try {
          v.g.gain.cancelScheduledValues(now);
          v.g.gain.setValueAtTime(0.0001, now);
          v.g.gain.linearRampToValueAtTime(0.0001, now + 0.12);
        } catch (e) {}
      });
      heldVoices = [];
    }
    function noteIdx(n) { return KEYS.indexOf(n); }
    function pushNote(n) { notes.push({ note: n, born: performance.now() }); }
    function lightKey(n, on) {
      const el = keysWrap.querySelector('[data-n="' + n + '"]');
      if (el) el.classList.toggle("on", on);
    }

    body.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        ripple(btn, e);
        wave = btn.getAttribute("data-wave");
        body.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
      });
    });
    keysWrap.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".key");
      if (!el) return;
      e.preventDefault();
      ensureAudio();
      const n = el.getAttribute("data-n");
      heldNote = n;
      heldVoices.push(startNote(noteToFreq(n), 1, true));
      lightKey(n, true);
      pushNote(n);
      readout.textContent = n + " · " + noteToFreq(n).toFixed(1) + " Hz";
    });
    keysWrap.addEventListener("pointermove", (e) => {
      if (e.buttons === 0) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.classList && el.classList.contains("key") && el.getAttribute("data-n") !== heldNote) {
        releaseVoices();
        lightKey(heldNote, false);
        heldNote = el.getAttribute("data-n");
        heldVoices.push(startNote(noteToFreq(heldNote), 1, true));
        lightKey(heldNote, true);
        pushNote(heldNote);
        readout.textContent = heldNote + " · " + noteToFreq(heldNote).toFixed(1) + " Hz";
      }
    });
    window.addEventListener("pointerup", () => {
      releaseVoices();
      if (heldNote) lightKey(heldNote, false);
      heldNote = null;
    });
    function playSeq(seq, tempo, name) {
      ensureAudio();
      const beat = 60 / tempo;
      let t = 0;
      seq.forEach(([n, beats]) => {
        const dur = beats * beat * 0.92;
        startNote(noteToFreq(n), dur, false);
        setTimeout(() => pushNote(n), t * 1000);
        setTimeout(() => lightKey(n, true), t * 1000);
        setTimeout(() => lightKey(n, false), (t + dur) * 1000);
        t += beats * beat;
      });
      readout.textContent = name;
    }
    body.querySelector("[data-tune]").addEventListener("click", (e) => {
      ripple(e.currentTarget, e);
      const m = melodies[tuneIndex % melodies.length];
      tuneIndex++;
      playSeq(m.notes, m.tempo, m.name);
    });

    function drawWave(ctx, W, H) {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(20,22,30,0.08)";
      ctx.lineWidth = 1;
      for (let yy = 0; yy < H; yy += 15) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      const cy = H / 2;
      const amp = H * 0.36;
      const per = W / 4;
      const breathe = Math.sin(performance.now() / 600) * amp * 0.18;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        let y = cy + breathe;
        if (wave === "sine") y = cy + Math.sin((x / W) * Math.PI * 2) * amp;
        else if (wave === "square") y = (x % (W / 2) < W / 4) ? cy - amp : cy + amp;
        else y = cy + amp * (1 - 2 * ((x % per) / per));
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    function drawRoller() {
      const W = roller.width, H = roller.height;
      rctx.clearRect(0, 0, W, H);
      rctx.strokeStyle = "rgba(20,22,30,0.08)";
      rctx.lineWidth = 1;
      for (let yy = 0; yy < H; yy += 14) { rctx.beginPath(); rctx.moveTo(0, yy); rctx.lineTo(W, yy); rctx.stroke(); }
      const now = performance.now();
      notes = notes.filter((n) => now - n.born < 3000);
      const topIdx = KEYS.length - 1;
      notes.forEach((n) => {
        const idx = noteIdx(n.note);
        const y = (topIdx - idx) / (KEYS.length - 1) * (H - 14) + 7;
        const age = (now - n.born) / 3000;
        const x = W * (1 - age) - 18;
        rctx.globalAlpha = Math.max(0, 1 - age);
        rctx.fillStyle = accent;
        rctx.beginPath();
        rctx.roundRect(x, y, 34, 10, 5);
        rctx.fill();
      });
      rctx.globalAlpha = 1;
    }
    function draw() {
      requestAnimationFrame(draw);
      drawWave(fctx, fig.width, fig.height);
      drawRoller();
    }
    draw();
  };

  // 1e. folk-park (v4 — clean horizontal piano + oscilloscope screen).
  demos.synth = function (body, accent) {
    const WAVES = ["sawtooth", "sine", "square"];
    const WHITE = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
    const BLACKS = [["C#4", 0], ["D#4", 1], ["F#4", 3], ["G#4", 4], ["A#4", 5]];
    const melodies = window.MOCK.synthMelodies || [];
    const KW = 100 / WHITE.length;
    let tuneIndex = 0;

    body.innerHTML = `
      <div class="synth premium-demo v4" style="--accent:${accent}">
        <div class="screen"><canvas class="scope" width="440" height="104"></canvas></div>
        <div class="piano"></div>
        <div class="row">
          <div class="waves" role="group" aria-label="Waveform">
            ${WAVES.map((w, i) => `<button class="pbtn chip ${i === 0 ? "active" : ""}" data-wave="${w}">${w[0].toUpperCase() + w.slice(1)}</button>`).join("")}
          </div>
          <button class="pbtn primary" data-tune>▶ Play a tune</button>
        </div>
        <div class="readout">Tap the piano or hit play.</div>
      </div>`;

    const piano = body.querySelector(".piano");
    piano.innerHTML =
      WHITE.map((n, i) => `<span class="pkey white" data-n="${n}" style="left:${i * KW}%;width:${KW}%"></span>`).join("") +
      BLACKS.map(([n, b]) => `<span class="pkey black" data-n="${n}" style="left:${(b + 1) * KW - KW * 0.275}%;width:${KW * 0.55}%"></span>`).join("");

    const scope = body.querySelector(".scope");
    const sctx = scope.getContext("2d");
    const readout = body.querySelector(".readout");
    let wave = "sawtooth";
    let audio, bus, analyser;
    let heldNote = null, heldVoices = [];

    function ensureAudio() {
      if (!audio) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audio = new AC();
        analyser = audio.createAnalyser();
        analyser.fftSize = 1024;
        bus = audio.createGain();
        bus.gain.value = 0.0;
        bus.connect(analyser).connect(audio.destination);
      }
      if (audio.state === "suspended") audio.resume();
    }
    function startNote(freq, dur, sustain) {
      ensureAudio();
      const now = audio.currentTime;
      const g = audio.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
      if (sustain) g.gain.linearRampToValueAtTime(0.22, now + dur);
      else g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      g.connect(bus);
      const o = audio.createOscillator();
      o.type = wave;
      o.frequency.value = freq;
      o.connect(g);
      o.start(now);
      o.stop(now + dur + 0.05);
      return { g };
    }
    function releaseVoices() {
      if (!audio) return;
      const now = audio.currentTime;
      heldVoices.forEach((v) => {
        try {
          v.g.gain.cancelScheduledValues(now);
          v.g.gain.setValueAtTime(0.0001, now);
          v.g.gain.linearRampToValueAtTime(0.0001, now + 0.12);
        } catch (e) {}
      });
      heldVoices = [];
    }
    function lightKey(n, on) {
      const el = piano.querySelector('[data-n="' + n + '"]');
      if (el) el.classList.toggle("on", on);
    }

    body.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        ripple(btn, e);
        wave = btn.getAttribute("data-wave");
        body.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
      });
    });
    piano.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".pkey");
      if (!el) return;
      e.preventDefault();
      ensureAudio();
      const n = el.getAttribute("data-n");
      heldNote = n;
      heldVoices.push(startNote(noteToFreq(n), 1, true));
      lightKey(n, true);
      readout.textContent = n + " · " + noteToFreq(n).toFixed(1) + " Hz";
    });
    piano.addEventListener("pointermove", (e) => {
      if (e.buttons === 0) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.classList && el.classList.contains("pkey") && el.getAttribute("data-n") !== heldNote) {
        releaseVoices();
        lightKey(heldNote, false);
        heldNote = el.getAttribute("data-n");
        heldVoices.push(startNote(noteToFreq(heldNote), 1, true));
        lightKey(heldNote, true);
        readout.textContent = heldNote + " · " + noteToFreq(heldNote).toFixed(1) + " Hz";
      }
    });
    window.addEventListener("pointerup", () => {
      releaseVoices();
      if (heldNote) lightKey(heldNote, false);
      heldNote = null;
    });
    function playSeq(seq, tempo, name) {
      ensureAudio();
      const beat = 60 / tempo;
      let t = 0;
      seq.forEach(([n, beats]) => {
        const dur = beats * beat * 0.92;
        startNote(noteToFreq(n), dur, false);
        setTimeout(() => lightKey(n, true), t * 1000);
        setTimeout(() => lightKey(n, false), (t + dur) * 1000);
        t += beats * beat;
      });
      readout.textContent = name;
    }
    body.querySelector("[data-tune]").addEventListener("click", (e) => {
      ripple(e.currentTarget, e);
      const m = melodies[tuneIndex % melodies.length];
      tuneIndex++;
      playSeq(m.notes, m.tempo, m.name);
    });

    function draw() {
      requestAnimationFrame(draw);
      sctx.clearRect(0, 0, scope.width, scope.height);
      sctx.strokeStyle = "rgba(20,22,30,0.08)";
      sctx.lineWidth = 1;
      for (let yy = 0; yy < scope.height; yy += 16) {
        sctx.beginPath(); sctx.moveTo(0, yy); sctx.lineTo(scope.width, yy); sctx.stroke();
      }
      const cy = scope.height / 2;
      const amp = scope.height * 0.36;
      const per = scope.width / 4;
      const breathe = Math.sin(performance.now() / 600) * amp * 0.16;
      sctx.strokeStyle = accent;
      sctx.lineWidth = 3.4;
      sctx.beginPath();
      for (let x = 0; x <= scope.width; x++) {
        let y = cy + breathe;
        if (wave === "sine") y = cy + Math.sin((x / scope.width) * Math.PI * 2) * amp;
        else if (wave === "square") y = (x % (scope.width / 2) < scope.width / 4) ? cy - amp : cy + amp;
        else y = cy + amp * (1 - 2 * ((x % per) / per));
        x === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
      }
      sctx.stroke();
    }
    draw();
  };

  // 2. Mildred Pierce — channel surfer with animated scenes.
  demos.channels = function (body) {
    body.innerHTML = `
      <canvas width="480" height="220"></canvas>
      <div class="controls">
        <button class="btn" data-prev>◄ Prev</button>
        <button class="btn" data-next>Next ►</button>
      </div>
      <div class="readout">CH 01 · static</div>`;
    const canvas = body.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const readout = body.querySelector(".readout");
    const channels = window.MOCK.channels;
    let idx = 0;
    let t = 0;

    function drawStatic() {
      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          const v = Math.random();
          ctx.fillStyle = "rgba(255,255,255," + (v * 0.5) + ")";
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    function drawScene(c) {
      if (c.kind === "static") return drawStatic();
      const h = c.hue;
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "hsl(" + h + ",60%,12%)");
      g.addColorStop(1, "hsl(" + ((h + 30) % 360) + ",70%,24%)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (c.kind === "sunset") {
        ctx.fillStyle = "hsl(" + h + ",80%,62%)";
        ctx.beginPath();
        ctx.arc(canvas.width * 0.5, canvas.height * 0.7, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height);
      } else if (c.kind === "waves") {
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 3;
        for (let w = 0; w < 4; w++) {
          ctx.beginPath();
          for (let x = 0; x <= canvas.width; x++) {
            const y = canvas.height * (0.4 + w * 0.12) + Math.sin((x / 30) + t + w) * 8;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (c.kind === "orbit") {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 90, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 3; i++) {
          const a = t * 0.04 + (i * Math.PI * 2) / 3;
          ctx.fillStyle = "hsl(" + (h + i * 40) + ",80%,60%)";
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * 90, cy + Math.sin(a) * 90, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "hsl(" + h + ",80%,75%)";
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      }
    }
    function render() {
      requestAnimationFrame(render);
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawScene(channels[idx]);
    }
    function show() {
      readout.textContent = channels[idx].label + " · " + channels[idx].kind;
    }
    body.querySelector("[data-prev]").addEventListener("click", () => { idx = (idx - 1 + channels.length) % channels.length; show(); });
    body.querySelector("[data-next]").addEventListener("click", () => { idx = (idx + 1) % channels.length; show(); });
    render();
  };

  // 2b. Mildred Pierce (band site) — debut single, platform links, visual, TV easter egg.
  demos.channels = function (body, accent) {
    accent = accent || "#00c8ff";
    body.style.setProperty("--accent", accent);
    const LINKS = [
      { label: "Spotify", url: "https://open.spotify.com/intl-es/album/52QhMekZYeTTFNOx14Kkla", color: "#1DB954" },
      { label: "Apple Music", url: "https://music.apple.com/mx/album/fractal-agreement-single/1896399020", color: "#00c8ff" },
      { label: "YouTube", url: "https://youtu.be/wGk5GWPWHzo", color: "#ff4e45" },
      { label: "Instagram", url: "https://www.instagram.com/mildredpierce.__", color: "#e1306c" },
    ];
    body.innerHTML = `
      <div class="band premium-demo" style="--accent:${accent}">
        <div class="band-head">
          <span class="band-kicker">MILDRED PIERCE</span>
          <span class="band-single">FRACTAL AGREEMENT — out now</span>
        </div>
        <div class="band-mid">
          <canvas class="band-disc" width="96" height="96"></canvas>
          <canvas class="band-eq" width="160" height="96"></canvas>
        </div>
        <div class="platforms">
          ${LINKS.map((l) => `<a class="pbtn plat" href="${l.url}" target="_blank" rel="noopener">${l.label} <span>↗</span></a>`).join("")}
        </div>
        <div class="tv-row">
          <button class="pbtn chip tv" data-tv>📺 Channel surf</button>
        </div>
        <div class="tvroom" hidden>
          <canvas width="440" height="150"></canvas>
          <div class="tv-ctrl">
            <button class="pbtn chip" data-prev>◄ Prev</button>
            <button class="pbtn chip" data-next>Next ►</button>
          </div>
          <div class="readout">CH 01</div>
        </div>
        <div class="readout">Debut single. The TV is a secret.</div>
      </div>`;

    const disc = body.querySelector(".band-disc");
    const dctx = disc.getContext("2d");
    const eq = body.querySelector(".band-eq");
    const ectx = eq.getContext("2d");
    const tvBtn = body.querySelector("[data-tv]");
    const room = body.querySelector(".tvroom");
    const tvc = room.querySelector("canvas");
    const tctx = tvc.getContext("2d");
    const tRead = room.querySelector(".readout");
    const CH = window.MOCK.channels || [];
    const band = body.querySelector(".band");
    let t = 0, t2 = 0, idx = 0, tvOn = false;

    function drawDisc() {
      dctx.clearRect(0, 0, 96, 96);
      dctx.save();
      dctx.translate(48, 48);
      dctx.rotate(t * 0.6);
      dctx.fillStyle = "#0a0a0e";
      dctx.beginPath(); dctx.arc(0, 0, 44, 0, 7); dctx.fill();
      dctx.strokeStyle = "rgba(255,255,255,0.12)";
      for (let r = 12; r < 40; r += 6) { dctx.beginPath(); dctx.arc(0, 0, r, 0, 7); dctx.stroke(); }
      dctx.fillStyle = accent;
      dctx.beginPath(); dctx.arc(0, 0, 5, 0, 7); dctx.fill();
      dctx.restore();
    }
    function drawEq() {
      ectx.clearRect(0, 0, 160, 96);
      const bars = 20, bw = 160 / bars;
      for (let i = 0; i < bars; i++) {
        const v = (Math.sin(t * 3 + i * 0.5) + 1) / 2 * 0.62 + 0.18;
        const h = v * 82;
        ectx.fillStyle = accent;
        ectx.globalAlpha = 0.85;
        ectx.fillRect(i * bw + 1.5, 96 - h, bw - 3, h);
      }
      ectx.globalAlpha = 1;
    }
    function drawScene(c) {
      if (!c) return;
      if (c.kind === "static") {
        tctx.fillStyle = "#05060a";
        tctx.fillRect(0, 0, tvc.width, tvc.height);
        for (let y = 0; y < tvc.height; y += 2) for (let x = 0; x < tvc.width; x += 2) {
          const v = Math.random();
          tctx.fillStyle = "rgba(255,255,255," + (v * 0.5) + ")";
          tctx.fillRect(x, y, 2, 2);
        }
        return;
      }
      const h = c.hue;
      const g = tctx.createLinearGradient(0, 0, 0, tvc.height);
      g.addColorStop(0, "hsl(" + h + ",60%,12%)");
      g.addColorStop(1, "hsl(" + ((h + 30) % 360) + ",70%,24%)");
      tctx.fillStyle = g; tctx.fillRect(0, 0, tvc.width, tvc.height);
      if (c.kind === "sunset") {
        tctx.fillStyle = "hsl(" + h + ",80%,62%)";
        tctx.beginPath(); tctx.arc(tvc.width * 0.5, tvc.height * 0.7, 36, 0, 7); tctx.fill();
        tctx.fillStyle = "rgba(0,0,0,0.5)"; tctx.fillRect(0, tvc.height * 0.7, tvc.width, tvc.height);
      } else if (c.kind === "waves") {
        tctx.strokeStyle = "rgba(255,255,255,0.7)"; tctx.lineWidth = 3;
        for (let w = 0; w < 4; w++) { tctx.beginPath(); for (let x = 0; x <= tvc.width; x++) { const y = tvc.height * (0.4 + w * 0.12) + Math.sin((x / 30) + t2 + w) * 8; tctx.lineTo(x, y); } tctx.stroke(); }
      } else if (c.kind === "orbit") {
        tctx.strokeStyle = "rgba(255,255,255,0.6)"; tctx.lineWidth = 2;
        const cx = tvc.width / 2, cy = tvc.height / 2;
        for (let o = 0; o < 4; o++) { tctx.beginPath(); for (let a = 0; a <= 7; a += 0.05) { const r = 20 + o * 15; const x = cx + Math.cos(a + t2) * r, y = cy + Math.sin(a * 2.5 + t2) * r * 0.6; a === 0 ? tctx.moveTo(x, y) : tctx.lineTo(x, y); } tctx.stroke(); }
      }
    }
    function show() {
      const c = CH[idx % CH.length] || { kind: "static", label: "STATIC" };
      drawScene(c);
      tRead.textContent = "CH " + String((idx % CH.length) + 1).padStart(2, "0") + " · " + (c.label || "");
    }
    tvBtn.addEventListener("click", (e) => {
      ripple(tvBtn, e);
      tvOn = !tvOn;
      room.hidden = !tvOn;
      tvBtn.classList.toggle("active", tvOn);
      if (tvOn) show();
    });
    room.querySelector("[data-prev]").addEventListener("click", (e) => { ripple(e.currentTarget, e); idx = (idx - 1 + CH.length) % CH.length; show(); });
    room.querySelector("[data-next]").addEventListener("click", (e) => { ripple(e.currentTarget, e); idx = (idx + 1) % CH.length; show(); });

    function loop() {
      requestAnimationFrame(loop);
      t += 0.016; t2 += 0.016;
      drawDisc(); drawEq();
      if (tvOn) drawScene(CH[idx % CH.length] || { kind: "static" });
    }
    loop();
  };

  // 3. Lumina — a bookable seat grid (local state only).
  demos.reservations = function (body, accent) {
    const seats = window.MOCK.seats;
    body.innerHTML = `
      <div class="readout" style="margin-top:0">Seats: <span data-count>0</span> booked · <span data-free>0</span> free</div>
      <div class="seats" style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:14px"></div>`;
    const grid = body.querySelector(".seats");
    const count = body.querySelector("[data-count]");
    const free = body.querySelector("[data-free]");
    function refresh() {
      const booked = seats.filter((s) => s.booked).length;
      count.textContent = booked;
      free.textContent = seats.length - booked;
    }
    seats.forEach((s) => {
      const el = document.createElement("div");
      el.style.cssText = "aspect-ratio:1;border-radius:8px;background:#17171d;border:1px solid #2c2c34;display:flex;align-items:center;justify-content:center;font-size:11px;cursor:pointer;color:#9a9aa6;transition:0.15s";
      el.textContent = s.zones[0] + (s.id % 10);
      el.addEventListener("click", () => {
        s.booked = !s.booked;
        el.style.background = s.booked ? accent : "#17171d";
        el.style.borderColor = s.booked ? accent : "#2c2c34";
        el.style.color = s.booked ? "#0a0a0c" : "#9a9aa6";
        refresh();
      });
      if (s.booked) { el.style.background = accent; el.style.borderColor = accent; el.style.color = "#0a0a0c"; }
      grid.appendChild(el);
    });
    refresh();
  };

  // 4. 2HLABS — a "soul quiz" that returns a formula.
  demos.quiz = function (body, accent) {
    const q = window.MOCK.quiz;
    body.innerHTML = `
      <p class="desc" style="margin:0">${q.q}</p>
      <div class="controls" data-options></div>
      <div class="readout" data-result>Pick one to see your archetype.</div>`;
    const opt = body.querySelector("[data-options]");
    const res = body.querySelector("[data-result]");
    const map = [
      ["The Bull", "creatine · beta-alanine · caffeine"],
      ["The Owl", "caffeine · L-theanine · citrulline"],
      ["The Ghost", "citrulline · beta-alanine · no caffeine"],
      ["The Sage", "adaptogens · electrolytes · L-theanine"]
    ];
    q.options.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = o;
      b.addEventListener("click", () => {
        res.textContent = "Archetype: " + map[i][0] + " → " + map[i][1];
        opt.querySelectorAll(".btn").forEach((x) => x.classList.remove("primary"));
        b.classList.add("primary");
      });
      opt.appendChild(b);
    });
  };

  // 5. laptop-deal — a price trend chart with filters.
  demos.prices = function (body, accent) {
    body.innerHTML = `
      <canvas width="480" height="200"></canvas>
      <div class="controls" data-filters>
        <button class="btn primary" data-store="all">All</button>
        <button class="btn" data-store="Amazon MX">Amazon</button>
        <button class="btn" data-store="MercadoLibre">MercadoLibre</button>
        <button class="btn" data-store="Best Buy">Best Buy</button>
      </div>
      <div class="readout" data-out>Showing all retailers</div>`;
    const canvas = body.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const out = body.querySelector("[data-out]");
    const series = [
      { name: "Lenovo IdeaPad", store: "Amazon MX", data: [11999, 10999, 10499, 9999, 9499, 8999] },
      { name: "HP Pavilion", store: "MercadoLibre", data: [13499, 12999, 12499, 11999, 11499, 10999] },
      { name: "Asus VivoBook", store: "Best Buy", data: [14999, 14499, 13999, 13499, 12999, 12499] },
      { name: "Dell Inspiron", store: "Amazon MX", data: [16499, 15999, 15499, 14999, 14499, 13999] }
    ];
    let store = "all";
    const pad = { l: 46, r: 12, t: 12, b: 22 };
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rows = series.filter((s) => store === "all" || s.store === store);
      const w = canvas.width - pad.l - pad.r;
      const h = canvas.height - pad.t - pad.b;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (h / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + w, y); ctx.stroke();
      }
      const all = rows.flatMap((s) => s.data);
      const min = Math.min(...all), max = Math.max(...all);
      const yFor = (v) => pad.t + h - ((v - min) / (max - min || 1)) * h;
      rows.forEach((s) => {
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        s.data.forEach((v, i) => {
          const x = pad.l + (i / (s.data.length - 1)) * w;
          const y = yFor(v);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = accent;
        s.data.forEach((v, i) => {
          ctx.beginPath();
          ctx.arc(pad.l + (i / (s.data.length - 1)) * w, yFor(v), 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      out.textContent = "Showing " + (store === "all" ? "all retailers" : store);
    }
    body.querySelectorAll("[data-store]").forEach((b) => {
      b.addEventListener("click", () => {
        store = b.getAttribute("data-store");
        body.querySelectorAll("[data-store]").forEach((x) => x.classList.remove("primary"));
        b.classList.add("primary");
        draw();
      });
    });
    draw();
  };

  // 6. Juguetería — a product grid with a running cart.
  demos.store = function (body, accent) {
    const products = window.MOCK.products;
    let cart = [];
    body.innerHTML = `
      <div class="readout" style="margin-top:0">Cart: 0 items · $0</div>
      <div class="store-products" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px"></div>`;
    const grid = body.querySelector(".store-products");
    const out = body.querySelector(".readout");
    function total() {
      const n = cart.reduce((s, p) => s + p.price, 0);
      out.textContent = "Cart: " + cart.length + " items · $" + n.toLocaleString();
      cart = [];
    }
    products.forEach((p) => {
      const el = document.createElement("div");
      el.style.cssText = "border:1px solid #2c2c34;border-radius:10px;padding:12px;text-align:center;background:#101014";
      el.innerHTML = '<div style="width:32px;height:32px;margin:0 auto;border-radius:8px;background:' + p.swatch + '"></div><div style="font-size:13px;margin-top:8px">' + p.name + '</div><div style="font-size:12px;color:#9a9aa6">$' + p.price + '</div>';
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.style.marginTop = "8px";
      btn.textContent = "Add";
      btn.addEventListener("click", () => { cart.push(p); total(); });
      el.appendChild(btn);
      grid.appendChild(el);
    });
  };

  // Fallback for any project that has no interactive demo.
  demos.text = function (body, accent) {
    body.innerHTML = `<p class="desc" style="margin:0">Interactive demo not included for this project — open the source on GitHub.</p>`;
  };

  // ----- Boot each demo (now that the registry is full) -----
  document.querySelectorAll(".demo[data-demo]").forEach((el) => {
    const type = el.getAttribute("data-demo");
    const accent = el.getAttribute("data-accent") || "#8a8a96";
    const body = el.querySelector(".demo-body");
    const boot = demos[type];
    if (boot) boot(body, accent);
  });
})();
