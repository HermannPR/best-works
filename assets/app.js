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
