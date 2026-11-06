(() => {
  /* ===== EDIT THESE: your real memories, jokes and words go here ===== */
  const ECHO = [            // 4 memories. Tap a ripple, the memory appears and its last words echo.
    '[Memory 1: a real moment, one or two lines]',
    '[Memory 2]',
    '[Memory 3]',
    '[Memory 4]'
  ];
  const UNKNOWN = [         // 3 hidden lines, found by moving a light over the dark.
    '[Hidden line 1: something only he would notice]',
    '[Hidden line 2]',
    '[Hidden line 3]'
  ];
  const SIGNAL = [          // 3 stations. Optional audio: upload a voice note and write its filename, e.g. 'note1.m4a'
    { text: '[Signal 1: a message from you]', audio: '' },
    { text: '[Signal 2]', audio: '' },
    { text: '[Signal 3]', audio: '' }
  ];
  /* =================================================================== */

  const $ = s => document.querySelector(s), wait = ms => new Promise(r => setTimeout(r, ms));
  const J = () => window.JUNO || { say: async () => {}, tip() {}, hide() {}, nudge: () => () => {} };
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };

  document.head.insertAdjacentHTML('beforeend', '<style>' +
    '.wz{position:relative;height:56vh;margin-top:10px;touch-action:none;user-select:none;-webkit-user-select:none}' +
    '.w-orb{position:absolute;width:54px;height:54px;margin:-27px;border-radius:50%;border:1px solid rgba(198,223,242,.7);background:radial-gradient(circle,rgba(198,223,242,.5),rgba(139,121,201,.1) 70%);animation:wp 2.4s ease-out infinite}' +
    '.w-orb.seen{animation:none;opacity:.35}' +
    '@keyframes wp{0%{box-shadow:0 0 0 0 rgba(198,223,242,.5)}100%{box-shadow:0 0 0 34px rgba(198,223,242,0)}}' +
    '.w-card{position:absolute;left:0;right:0;bottom:0;text-align:center;font:italic 500 21px/1.4 var(--serif)}' +
    '.w-ec{opacity:0;animation:wf 1.2s forwards}.w-ec.e1{animation-delay:1.3s;--o:.5}.w-ec.e2{animation-delay:2.5s;--o:.25;font-size:.9em}' +
    '@keyframes wf{to{opacity:var(--o,1)}}' +
    '.w-dark{position:absolute;inset:-40px -40px -40px -40px;z-index:2;pointer-events:none;background:radial-gradient(circle 85px at var(--x,-300px) var(--y,-300px),rgba(3,7,18,0) 0,rgba(3,7,18,0) 38%,rgba(3,7,18,.97) 100%)}' +
    '.w-clue{position:absolute;width:70%;transform:translate(-50%,-50%);text-align:center;z-index:1}' +
    '.w-clue i{display:block;width:8px;height:8px;margin:0 auto;border-radius:50%;background:#EDF3FA;box-shadow:0 0 12px #C6DFF2}' +
    '.w-clue span{display:block;margin-top:8px;opacity:0;font:italic 500 19px/1.35 var(--serif);transition:opacity 1s}' +
    '.w-clue.found{z-index:3}.w-clue.found span{opacity:1}' +
    '.w-scr{min-height:150px;text-align:center}.w-f{font:600 13px "IBM Plex Mono",monospace;letter-spacing:.2em;color:var(--ice)}' +
    '.w-txt{margin-top:12px;font:400 15px/1.5 "IBM Plex Mono",monospace;color:var(--mute);word-break:break-word}' +
    '.w-meter{height:3px;margin:14px 0;background:rgba(198,223,242,.2)}.w-meter i{display:block;height:100%;width:0;background:var(--ice);box-shadow:0 0 8px var(--ice)}' +
    '.w-dial{-webkit-appearance:none;appearance:none;width:100%;height:4px;background:rgba(198,223,242,.35);border-radius:4px;outline:none;margin:26px 0 10px}' +
    '.w-dial::-webkit-slider-thumb{-webkit-appearance:none;width:34px;height:34px;border-radius:50%;background:#EDF3FA;box-shadow:0 0 16px #8B79C9}' +
    '.w-dial::-moz-range-thumb{width:34px;height:34px;border:0;border-radius:50%;background:#EDF3FA;box-shadow:0 0 16px #8B79C9}' +
    '.w-log p{margin-top:12px;text-align:center;font:italic 500 19px/1.4 var(--serif)}' +
    '.w-log button{margin:6px auto 0;display:block;background:none;border:1px solid var(--ice);color:var(--ice);border-radius:20px;padding:6px 14px;font:600 12px var(--sans)}' +
    '</style>');

  function make(id, kick, title) {
    const old = document.getElementById('w-' + id); if (old) old.remove();
    const s = el('section', 'screen'); s.id = 'w-' + id;
    s.innerHTML = '<div class="bg b-' + id + '"></div><button class="back" data-go="galaxy">&larr; Galaxy map</button><p class="kick">' + kick + '</p><h2>' + title + '</h2><div class="wz"></div>';
    document.body.append(s); SV.show('w-' + id);
    new MutationObserver(() => { if (!s.classList.contains('on')) J().hide(); }).observe(s, { attributes: true, attributeFilter: ['class'] });
    return { s, z: s.querySelector('.wz'), alive: () => s.classList.contains('on') && document.body.contains(s) };
  }
  async function finish(id, line, alive) {
    await J().say(line, 900); if (!alive()) return;
    SV.complete(id); J().hide(); SV.go('galaxy');
  }

  // ECHO: tap ripples, each memory returns with its last words echoing
  async function echo() {
    const { z, alive } = make('echo', 'World 2', 'ECHO');
    const card = el('div', 'w-card'); z.append(card);
    const spots = [[24, 16], [76, 30], [28, 54], [72, 70]], seen = new Set();
    ECHO.forEach((m, i) => {
      const b = el('button', 'w-orb'); b.style.left = spots[i % 4][0] + '%'; b.style.top = spots[i % 4][1] + '%'; z.append(b);
      b.onclick = async () => {
        b.classList.add('seen'); seen.add(i);
        const tail = m.split(' ').slice(-3).join(' ') + '…';
        card.innerHTML = ''; card.append(el('p', '', m), el('p', 'w-ec e1', tail), el('p', 'w-ec e2', tail));
        if (seen.size === ECHO.length) { await wait(5200); if (alive()) finish('echo', 'Every one of those is still ringing. Fragment secured.', alive); }
      };
    });
    await J().say('Echo… echo… echo. Sorry, it does that.', 400); if (!alive()) return;
    J().tip('Tap the glowing ripples. Each one remembers something.');
    const stop = J().nudge(['Tap a ripple. They are not shy.', 'Four ripples. Tap them all, take your time.']);
    const t = setInterval(() => { if (!alive() || seen.size === ECHO.length) { stop(); clearInterval(t); } }, 500);
  }

  // UNKNOWN: move a light through the dark and linger on what glints
  async function unknown() {
    const { z, alive } = make('unknown', 'World 3', 'UNKNOWN');
    const pos = [[50, 16], [40, 48], [60, 80]], clues = [];
    UNKNOWN.forEach((t, i) => {
      const c = el('div', 'w-clue'); c.style.left = pos[i % 3][0] + '%'; c.style.top = pos[i % 3][1] + '%';
      c.append(el('i'), el('span', '', t)); z.append(c); clues.push({ c, t: 0, done: false, x: pos[i % 3][0], y: pos[i % 3][1] });
    });
    const dark = el('div', 'w-dark'); z.append(dark);
    let last = 0, found = 0;
    z.onpointermove = z.onpointerdown = e => {
      const r = z.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now(), dt = Math.min(now - last, 100); last = now;
      dark.style.setProperty('--x', (x + 40) + 'px'); dark.style.setProperty('--y', (y + 40) + 'px');
      clues.forEach(k => {
        if (k.done) return;
        if (Math.hypot(x - k.x / 100 * r.width, y - k.y / 100 * r.height) < 55) k.t += dt; 
        if (k.t > 700) { k.done = true; k.c.classList.add('found'); navigator.vibrate && navigator.vibrate(40); if (++found === clues.length) setTimeout(() => alive() && finish('unknown', 'You found everything hiding in the dark. Fragment secured.', alive), 4500); }
      });
    };
    await J().say('Power is out here. It is very dark. And I am very small.', 400); if (!alive()) return;
    J().tip('Drag your finger around. Light follows it. Linger where something glints.');
    const stop = J().nudge(['Move slowly. Things hide from fast fingers.', 'Three secrets. One near the top, one in the middle, one low.']);
    const t = setInterval(() => { if (!alive() || found === clues.length) { stop(); clearInterval(t); } }, 500);
  }

  // SIGNAL: tune the dial until static turns into a message
  async function signal() {
    const { z, alive } = make('signal', 'World 4', 'SIGNAL');
    z.innerHTML = '<div class="w-scr"><div class="w-f"></div><p class="w-txt"></p></div><div class="w-meter"><i></i></div><input class="w-dial" type="range" min="880" max="1080" value="880" aria-label="Tune"><div class="w-log"></div>';
    const fr = z.querySelector('.w-f'), tx = z.querySelector('.w-txt'), mt = z.querySelector('.w-meter i'), dial = z.querySelector('.w-dial'), log = z.querySelector('.w-log');
    const F = [918, 968, 1042], got = new Set(), G = '▒░▓#%&*+=';
    let hold = 0;
    const tick = () => {
      if (!alive()) return clearInterval(t);
      const v = +dial.value; let bi = -1, bd = 999;
      F.forEach((f, i) => { if (!got.has(i) && Math.abs(f - v) < bd) { bd = Math.abs(f - v); bi = i; } });
      fr.textContent = (v / 10).toFixed(1) + ' MHz  //  ' + got.size + '/' + F.length;
      if (bi < 0) return;
      const c = Math.max(0, 1 - bd / 40); mt.style.width = c * 100 + '%';
      tx.textContent = [...SIGNAL[bi].text].map(ch => ch === ' ' || Math.random() < c * c ? ch : G[Math.floor(Math.random() * G.length)]).join('');
      hold = bd <= 3 ? hold + 110 : 0;
      if (hold >= 900) {
        hold = 0; got.add(bi); navigator.vibrate && navigator.vibrate(60);
        const p = el('p', '', SIGNAL[bi].text); log.append(p);
        if (SIGNAL[bi].audio) { const b = el('button', '', '▶ Voice note'); b.onclick = () => new Audio(SIGNAL[bi].audio).play(); log.append(b); }
        tx.textContent = '';
        if (got.size === F.length) { clearInterval(t); setTimeout(() => alive() && finish('signal', 'Three signals, loud and clear. Fragment secured.', alive), 4500); }
      }
    };
    const t = setInterval(tick, 110);
    await J().say('I am picking up something. Mostly static. Okay, entirely static.', 400); if (!alive()) return;
    J().tip('Slide the dial slowly. When the static starts to make sense, hold still.');
    const stop = J().nudge(['Slower. Signals do not like being chased.', 'Watch the bar. When it fills, stop moving.']);
    const t2 = setInterval(() => { if (!alive() || got.size === F.length) { stop(); clearInterval(t2); } }, 500);
  }

  document.addEventListener('click', e => {
    const c = e.target.closest('.card'); if (!c) return;
    const f = { echo, unknown, signal }[c.dataset.world]; if (!f) return;
    e.stopPropagation(); f();
  }, true);
})();
