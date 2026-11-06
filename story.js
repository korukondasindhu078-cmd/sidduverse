(() => {
  const $ = s => document.querySelector(s), wait = ms => new Promise(r => setTimeout(r, ms));
  const KS = 'sidduverse-story-v1';
  // Testing: open the site with ?reset on the end of the link to start fresh
  if (/[?&]reset/.test(location.search)) {
    try { ['sidduverse-progress-v1', 'sidduverse-finale-v1', KS].forEach(k => localStorage.removeItem(k)); } catch (e) {}
    location.replace(location.pathname); return;
  }
  let S = {}; try { S = JSON.parse(localStorage.getItem(KS)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(KS, JSON.stringify(S)); } catch (e) {} };
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap">');
  const flash = () => { const d = document.createElement('div'); d.className = 'flash'; document.body.append(d); setTimeout(() => d.remove(), 1700); };

  // ---- Juno, the ship companion ----
  const J = document.createElement('div'); J.id = 'juno';
  J.innerHTML = '<div class="jo"><i></i><i></i></div><div class="jb"><p></p><div class="jc"></div></div>';
  document.body.append(J);
  const jp = J.querySelector('p'), jc = J.querySelector('.jc'); let jid = 0;
  const type = async t => { const m = ++jid; J.classList.add('on'); jc.innerHTML = ''; jp.textContent = ''; for (const ch of t) { if (m !== jid) return false; jp.textContent += ch; await wait(20); } return true; };
  const say = async (t, ms) => { if (await type(t)) await wait(ms || 700 + t.length * 40); };
  const tip = t => { jid++; J.classList.add('on'); jc.innerHTML = ''; jp.textContent = t; };
  const hide = () => { jid++; J.classList.remove('on'); };
  const ask = async (t, opts) => { await type(t); return new Promise(res => {
    jc.innerHTML = opts.map((o, i) => '<button data-i="' + i + '">' + o + '</button>').join('');
    jc.onclick = e => { const b = e.target.closest('button'); if (b) { jc.innerHTML = ''; res(+b.dataset.i); } };
  }); };
  // Hints that get clearer every 6 seconds of hesitation; returns a stop function
  const nudge = lines => { const ts = lines.map((l, i) => setTimeout(() => tip(l), 6000 * (i + 1))); return () => ts.forEach(clearTimeout); };

  // ---- Entrance: hyperspace jump into the title ----
  function intro() {
    const o = document.createElement('div'); o.id = 'intro'; o.innerHTML = '<canvas></canvas><p>Incoming transmission…</p>'; document.body.append(o);
    const cv = o.querySelector('canvas'), g = cv.getContext('2d'), tx = o.querySelector('p');
    cv.width = innerWidth; cv.height = innerHeight;
    const cx = cv.width / 2, cy = cv.height / 2, st = Array.from({ length: 170 }, () => ({ a: Math.random() * 6.283, r: Math.random() * 60 + 5, s: Math.random() * 2 + 1 }));
    setTimeout(() => tx.style.opacity = 0, 1500);
    const t0 = performance.now();
    return new Promise(res => {
      const draw = now => {
        const t = now - t0, k = Math.max(0, (t - 1800) / 2200);
        g.globalAlpha = 1; g.fillStyle = 'rgba(3,7,18,.3)'; g.fillRect(0, 0, cv.width, cv.height);
        if (t > 1800) for (const s of st) {
          const x0 = cx + Math.cos(s.a) * s.r, y0 = cy + Math.sin(s.a) * s.r;
          s.r += s.s * (1 + k * k * 45);
          g.globalAlpha = Math.min(1, s.r / 160); g.strokeStyle = '#C6DFF2'; g.lineWidth = 1 + k * 1.5;
          g.beginPath(); g.moveTo(x0, y0); g.lineTo(cx + Math.cos(s.a) * s.r, cy + Math.sin(s.a) * s.r); g.stroke();
          if (s.r > cv.width) s.r = 5;
        }
        if (t > 3300) { g.globalAlpha = Math.min(1, (t - 3300) / 600); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); }
        if (t < 4000) requestAnimationFrame(draw);
        else { const h = $('.t-hero'); h.style.animation = 'none'; void h.offsetWidth; h.style.animation = ''; o.classList.add('out'); setTimeout(() => { o.remove(); res(); }, 1300); }
      };
      requestAnimationFrame(draw);
    });
  }
  if (!S.originDone) intro();

  // ---- The crash: steer through asteroids (the crash is guaranteed) ----
  function crash() {
    return new Promise(res => {
      const sec = document.createElement('section'); sec.className = 'screen'; sec.id = 'crash';
      sec.innerHTML = '<div class="bg b-welcome"></div><canvas></canvas>'; document.body.append(sec);
      SV.show('crash');
      const cv = sec.querySelector('canvas'), g = cv.getContext('2d');
      cv.width = innerWidth; cv.height = innerHeight;
      let px = cv.width / 2, tx = px, rocks = [], t0 = 0, warned = false, over = false;
      cv.onpointerdown = cv.onpointermove = e => { tx = e.clientX; };
      tip('Asteroids ahead! I’d say hold on tight, but you’re holding a phone. Slide your finger to steer.');
      const loop = ts => {
        t0 = t0 || ts; const t = (ts - t0) / 1000, y = cv.height * 0.58;
        g.clearRect(0, 0, cv.width, cv.height);
        px += (tx - px) * .12;
        if (t < 7 && Math.random() < .08) rocks.push({ x: Math.random() * cv.width, y: -30, r: 14 + Math.random() * 24, v: 3 + Math.random() * 3 });
        for (const r of rocks) { r.y += r.v; g.fillStyle = '#39415a'; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(198,223,242,.4)'; g.stroke(); }
        rocks = rocks.filter(r => r.y < cv.height + 40);
        g.fillStyle = '#EDF3FA'; g.shadowColor = '#8B79C9'; g.shadowBlur = 18;
        g.beginPath(); g.moveTo(px, y - 24); g.lineTo(px - 16, y + 14); g.lineTo(px + 16, y + 14); g.fill(); g.shadowBlur = 0;
        if (t > 7) {
          if (!warned) { warned = true; tip('Impressive dodging. Completely useless, but impressive. Brace for impact!'); }
          const k = (t - 7) * 1.5; g.fillStyle = '#242a3d'; g.beginPath(); g.arc(cv.width / 2, cv.height / 2, k * k * cv.width, 0, 6.283); g.fill();
        }
        if (t > 8.3 && !over) { over = true; document.body.classList.add('shake'); flash(); setTimeout(() => { document.body.classList.remove('shake'); hide(); sec.remove(); res(); }, 900); }
        if (!over) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }

  // ---- ORIGIN: identity check and ship repair ----
  async function origin() {
    let sec = $('#origin2');
    if (!sec) { sec = document.createElement('section'); sec.className = 'screen'; sec.id = 'origin2'; document.body.append(sec); }
    sec.innerHTML = '<div class="bg b-origin"></div><p class="kick">World 01 // Crash site</p><h2>ORIGIN</h2><div class="term"></div><div class="zone"></div>';
    SV.show('origin2');
    const zone = sec.querySelector('.zone'), term = sec.querySelector('.term');
    await wait(900);
    await say('Captain? …Captain? …Brilliant. I’m talking to myself again.');
    await say('My memory cracked in the crash. Please type your name.', 300);
    zone.innerHTML = '<input id="nm" maxlength="20" placeholder="Type your name" autocomplete="off"><button class="btn" id="nmok">Confirm</button>';
    const stop = nudge(['Just type your name, then tap Confirm. Any name. I’ll judge it.', 'The box right there. Yes. That one.']);
    await new Promise(r => { $('#nmok').onclick = () => $('#nm').value.trim() ? r() : tip('Blank? Even I have a name.'); });
    stop();
    const name = $('#nm').value.trim(); S.name = name; save();
    zone.innerHTML = '';
    await say(/^sid/i.test(name) ? 'Confirmed: Captain Sid. I knew it was you. (I didn’t.)' : '“' + name + '”? Bold. My records say Captain Sid, so that’s what I’m going with.');
    await say('Now the ship needs four restarts. Tap the blinking lights.', 300);
    const L = [['Engines', 'Engines… online.'], ['Lights', 'Lights… online.'], ['Snack dispenser', 'Snack dispenser… online. Priorities.'], ['Sense of humour', 'Sense of humour… online. Barely.']];
    zone.innerHTML = L.map((l, i) => '<button class="spark" data-i="' + i + '" aria-label="' + l[0] + '"><i></i></button>').join('');
    let n = 0;
    const stop2 = nudge(['See the pulsing orange lights? Tap them.', 'Tap each light. Four of them. I believe in you.']);
    await new Promise(r => { zone.onclick = e => {
      const b = e.target.closest('.spark'); if (!b || b.classList.contains('ok')) return;
      b.classList.add('ok'); const l = L[+b.dataset.i];
      term.insertAdjacentHTML('beforeend', '> ' + l[1].toUpperCase() + '<br>'); tip(l[1]);
      if (++n === 4) r();
    }; });
    stop2();
    await wait(1200);
    const f = document.createElement('div'); f.className = 'frag'; document.body.append(f); setTimeout(() => f.remove(), 2300);
    await say('That’s a piece of my core. Keep it safe. Something tells me we’ll need it.');
    SV.complete('origin'); S.originDone = true; save();
    SV.go('galaxy');
    await say('Right. Three more planets. Pick one. I’m not choosy.', 1800);
    hide();
  }

  // ---- Welcome: Juno wakes and the story begins ----
  const W = $('#welcome');
  async function welcome() {
    $('#welcome .btn').hidden = true;
    await wait(900);
    await say('Systems online. Pilot detected. Pilot… looks confused. Welcome aboard, Captain Sid.');
    await say('I’m Juno: your co-pilot, navigator and emotional support machine.');
    await ask('Fair warning: I’m not great at landing.', ['Take the controls']);
    hide(); await crash(); await origin();
  }
  new MutationObserver(() => {
    if (W.classList.contains('on') && !S.originDone && !W.dataset.run) { W.dataset.run = 1; welcome(); }
  }).observe(W, { attributes: true, attributeFilter: ['class'] });
})();
