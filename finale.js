(() => {
  /* ===== EDIT THESE: your words go here ===== */
  const NAME = 'Captain Sid';
  const MESSAGE = ['[First line of your message]', '[Second line]', '[Third line]'];
  const SIGN = '[Your name]';
  const PROMISE = 'Promise you’ll come back next year, Captain Sid. The universe is better with you in it.';
  const TAG = 'P.S. Bring snacks 🍿';
  const SEALED = [
    { date: '2027-11-09', text: '[Your message for 09.11.2027]' },
    { date: '2028-11-09', text: '[Your message for 09.11.2028]' },
    { date: '2029-11-09', text: '[Your message for 09.11.2029]' }
  ];
  /* ========================================== */

  const $ = s => document.querySelector(s), K = 'sidduverse-finale-v1';
  let S = {}; try { S = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) {} };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const set = (sel, html) => { const e = $(sel); if (e) e.innerHTML = html; };
  const dec = t => t.startsWith('b64:') ? decodeURIComponent(escape(atob(t.slice(4)))) : t;

  // New copy, applied over the original screens
  set('#opening .kick', 'Made just for you');
  set('#opening .tag', S.seen ? 'Welcome back, ' + NAME + '.' : 'A little world hidden in the stars.');
  if (S.seen) $('#opening .btn').textContent = 'Continue transmission';
  set('#welcome h2', 'Welcome,<br>' + NAME + '.');
  set('#welcome p:not(.kick)', 'Someone built a whole universe just for you. Four little worlds are waiting, and each one holds something that’s yours.');
  set('#galaxy .gh .sm', 'Your universe');
  set('#galaxy > p', 'Four worlds to explore. See where they take you.');
  set('#nova p:not(.kick)', 'You made it, ' + NAME + '. The last star is ready.');
  new MutationObserver(() => {
    const s = $('#worlds .lock span');
    if (s) s.textContent = 'Signal lost. Collect all four fragments to restore it.';
  }).observe($('#worlds'), { childList: true });

  // Helpers
  const isOpen = d => Date.now() >= new Date(d + 'T00:00:00').getTime();
  const fmt = d => d.split('-').reverse().join('.');
  const yr = () => { const n = new Date(); return n.getMonth() > 10 || (n.getMonth() === 10 && n.getDate() >= 9) ? n.getFullYear() : n.getFullYear() - 1; };
  function star(y) { S.stars = S.stars || []; if (S.stars.includes(y)) return false; S.stars.push(y); save(); return true; }
  const flash = () => { const d = document.createElement('div'); d.className = 'flash'; document.body.append(d); setTimeout(() => d.remove(), 1700); };
  const row = s => {
    const o = isOpen(s.date);
    return '<div class="sl' + (o ? ' op' : '') + '"><small>' + (o ? 'OPENED // ' : 'SEALED // OPENS ') + fmt(s.date) + '</small><p>' +
      (o ? dec(s.text) : 'Not yet, ' + NAME + '. Come back on ' + fmt(s.date) + '.') + '</p></div>';
  };

  const hold = b => new Promise(res => {
    let t0 = 0, raf = 0;
    const up = () => { cancelAnimationFrame(raf); b.classList.remove('go'); b.style.setProperty('--p', 0); };
    const step = ts => {
      t0 = t0 || ts;
      const p = Math.min((ts - t0) / 1800, 1);
      b.style.setProperty('--p', p);
      if (p >= 1) { navigator.vibrate && navigator.vibrate(60); res(); } else raf = requestAnimationFrame(step);
    };
    const down = e => { e.preventDefault(); t0 = 0; b.classList.add('go'); raf = requestAnimationFrame(step); };
    b.addEventListener('pointerdown', down);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(n => b.addEventListener(n, up));
    b.addEventListener('contextmenu', e => e.preventDefault());
    b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e); });
    b.addEventListener('keyup', up);
  });

  // The log: shown on every return
  function room(box, back) {
    const fresh = back && star(yr());
    const next = SEALED.find(s => !isOpen(s.date));
    const days = next && Math.ceil((new Date(next.date + 'T00:00:00') - Date.now()) / 864e5);
    box.innerHTML = '<p class="kick">Captain’s log</p><h2 class="sm">' + (back ? 'Welcome back, ' + NAME + '.' : 'Mission saved.') + '</h2>' +
      '<p class="starrow">' + (S.stars || []).slice().sort().map(y => '✦ ' + y).join('&nbsp;&nbsp;') + '</p>' +
      (fresh ? '<p class="cap">A new star just appeared in your sky.</p>' : '') +
      '<div class="sealed">' + SEALED.map(row).join('') + '</div>' +
      (next ? '<p class="starrow">Next transmission in ' + days + ' day' + (days === 1 ? '' : 's') + '</p>' : '') +
      '<button class="btn" id="rp">Replay the ending</button><button class="btn" data-go="galaxy">Galaxy map</button>';
    $('#rp').onclick = () => play(box);
  }

  // The stones, the burst of light and the name
  async function reveal(box, w, id) {
    const J = window.JUNO || { say: async () => {}, tip() {}, hide() {}, nudge: () => () => {} };
    await document.fonts.ready;
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H * 0.42;
    box.innerHTML = '<canvas class="fx"></canvas><div class="core" style="left:' + cx + 'px;top:' + cy + 'px"></div>';
    const cv = box.firstChild, g = cv.getContext('2d'), core = box.lastChild;
    cv.width = W; cv.height = H;
    const COL = ['#7fa6d6', '#d58bd0', '#4fd1c5', '#d9a84e'], POS = [[.2, .2], [.8, .27], [.22, .55], [.78, .6]];
    let P = [], alive = true, got = 0;
    const stones = COL.map((c, i) => { const s = document.createElement('i'); s.className = 'stone'; s.style.cssText = 'left:' + POS[i][0] * W + 'px;top:' + POS[i][1] * H + 'px;--c:' + c; box.append(s); return s; });
    // work out where the letters will sit
    const fs = Math.min(W * 0.2, 120), oc = document.createElement('canvas'); oc.width = W; oc.height = H;
    const o = oc.getContext('2d'); o.font = 'italic 400 ' + fs + 'px "Cormorant Garamond", Georgia, serif'; o.textBaseline = 'middle';
    const x0 = (W - o.measureText('SIDDU').width) / 2, xU = x0 + o.measureText('SIDD').width;
    o.fillStyle = '#fff'; o.fillText('SIDDU', x0, cy);
    const d = o.getImageData(0, 0, W, H).data, A = [], B = [];
    for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) if (d[(y * W + x) * 4 + 3] > 128) (x < xU ? A : B).push([x, y]);
    const ux = (B.reduce((s, p) => s + p[0], 0) / (B.length || 1)) || cx + 60, uy = cy;
    const burst = (x, y, T) => T.forEach((t, i) => { const a = Math.random() * 6.283, v = 2 + Math.random() * 9; P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, tx: t[0], ty: t[1], c: COL[i % 4], h: 45 }); });
    const loop = now => {
      if (!alive || id !== run) return;
      g.clearRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
      for (const p of P) {
        if (p.h > 0) { p.h--; p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy *= .96; }
        else { p.x += (p.tx - p.x) * .08 + Math.sin(now / 300 + p.tx) * .15; p.y += (p.ty - p.y) * .08 + Math.cos(now / 300 + p.ty) * .15; }
        g.fillStyle = p.c; g.globalAlpha = .55 + .45 * Math.sin(now / 250 + p.tx * .05); g.fillRect(p.x, p.y, 2.2, 2.2);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const el = (cls, x, y) => { const e = document.createElement('i'); e.className = cls; e.style.left = x + 'px'; e.style.top = y + 'px'; box.append(e); return e; };
    const bloom = () => { const b = document.createElement('div'); b.className = 'bloom'; document.body.append(b); setTimeout(() => b.remove(), 2500); };

    await J.say('Captain… four stones. They want to meet in the middle.', 600);
    J.tip('Tap a glowing stone, or drag it to the centre.');
    const stop = J.nudge(['Touch a stone and slide it to the glowing centre. Any stone first.', 'Or just tap a stone. I’ll carry it for you.']);
    setTimeout(() => stones.forEach(s => s.classList.add('hint')), 9000);
    await new Promise(res => stones.forEach(s => {
      let drag = false;
      s.onpointerdown = e => { drag = true; s.setPointerCapture(e.pointerId); s.classList.add('drag'); };
      s.onpointermove = e => { if (drag) { s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; } };
      s.onpointerup = () => {
        if (!drag) return; drag = false; s.classList.remove('drag', 'hint'); s.classList.add('in');
        s.style.left = cx + 'px'; s.style.top = cy + 'px';
        setTimeout(() => {
          s.remove(); core.style.setProperty('--n', ++got); el('ring', cx, cy);
          document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 400);
          if (got === 4) res();
        }, 900);
      };
    }));
    stop(); J.hide();
    await w(1000);
    bloom(); await w(500); core.classList.add('gone'); burst(cx, cy, A);
    await w(3800);
    await J.say('One piece missing…', 500);
    J.tip('Tap the little flickering star.');
    const last = el('last', ux, uy);
    const stop2 = J.nudge(['See the tiny flickering star beside the name? Tap it.']);
    await new Promise(r => { last.onclick = r; });
    stop2(); J.hide(); last.remove(); bloom(); burst(ux, uy, B);
    await w(3000);
    box.insertAdjacentHTML('beforeend', '<p class="cap2" style="top:' + (cy + fs * .9) + 'px">Every universe has one missing piece. In this one, it was always you.</p>');
    await w(6500);
    cv.style.opacity = 0; box.querySelector('.cap2').style.opacity = 0; await w(1600); alive = false;
  }

  // The ending
  const F = $('#final'); let run = 0;
  async function play(box) {
    const id = ++run, w = async ms => { await wait(ms); if (id !== run) throw 0; };
    try {
      F.classList.remove('quiet');
      await reveal(box, w, id);
      if (id !== run) return;
      F.classList.add('quiet');
      box.innerHTML = '<div class="msg2"></div>';
      const m = box.firstChild;
      for (const l of MESSAGE.concat(SIGN)) {
        const p = document.createElement('p'); p.className = 'fl' + (l === SIGN ? ' sg' : ''); p.textContent = l; m.append(p);
        await w(80); p.classList.add('on'); await w(l === SIGN ? 2200 : 2800);
      }
      const d = document.createElement('div'); d.className = 'prom';
      d.innerHTML = '<p class="fl pr">' + PROMISE + '</p><button class="btn" id="seal">I promise</button>';
      box.append(d); await w(80); d.firstChild.classList.add('on');
      $('#seal').onclick = async () => {
        S.seen = true; star(S.stars && S.stars.length ? yr() : new Date().getFullYear()); save();
        d.innerHTML = '<p class="fl pr on">Sealed. See you next year ✦</p><p class="fl tg on">' + TAG + '</p>';
        try { await w(4200); room(box, false); } catch (e) {}
      };
    } catch (e) {}
  }

  new MutationObserver(() => {
    const now = F.classList.contains('on');
    if (now && !F.dataset.on) {
      F.dataset.on = 1;
      [...F.children].forEach(c => { if (!c.matches('.bg,.back,.fin')) c.hidden = true; });
      const box = F.querySelector('.fin') || F.appendChild(Object.assign(document.createElement('div'), { className: 'fin' }));
      S.seen ? room(box, true) : play(box);
    } else if (!now && F.dataset.on) { delete F.dataset.on; run++; }
  }).observe(F, { attributes: true, attributeFilter: ['class'] });
})();
