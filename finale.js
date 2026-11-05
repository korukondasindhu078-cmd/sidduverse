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

  // The ending
  const F = $('#final'); let run = 0;
  async function play(box) {
    const id = ++run, w = async ms => { await wait(ms); if (id !== run) throw 0; };
    try {
      F.classList.remove('quiet');
      box.innerHTML = '<p class="kick">Four fragments collected</p><div class="name"><span>S</span><span>I</span><span>D</span><span>D</span><span class="u">U</span></div><p class="cap"></p><div class="act"></div>';
      const sp = box.querySelectorAll('.name span'), cap = box.querySelector('.cap'), act = box.querySelector('.act');
      for (let i = 0; i < 4; i++) { await w(700); sp[i].classList.add('on'); }
      await w(1000);
      cap.textContent = 'Something’s missing. Press and hold to light the last star.';
      act.innerHTML = '<button class="hold" aria-label="Press and hold to light the last star"><i></i></button>';
      await hold(act.firstChild);
      if (id !== run) return;
      flash(); act.innerHTML = ''; sp[4].classList.add('on');
      cap.textContent = 'Every universe has one missing piece. In this one, it was always you.';
      await w(6000);
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
