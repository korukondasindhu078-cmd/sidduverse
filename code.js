(() => {
  // Captain's Code: a short code that encodes his progress, so it can be restored on any phone. No backend needed.
  const K = ['sidduverse-progress-v1', 'sidduverse-finale-v1', 'sidduverse-story-v1'];
  const W = ['origin', 'echo', 'unknown', 'signal'], Y = [2026, 2027, 2028, 2029];
  const A = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const rd = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
  const wr = (k, o) => { try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} };

  function encode() {
    const p = rd(K[0]), f = rd(K[1]), s = rd(K[2]); let v = 0, b = 0;
    const bit = x => { if (x) v |= 1 << b; b++; };
    W.forEach(w => bit(p[w])); bit(p.novaSeen); bit(f.seen); bit(s.originDone); Y.forEach(y => bit((f.stars || []).includes(y)));
    if (!v) return '';
    const n = (v << 5) | ((v * 7 + 3) % 31);
    return 'SV-' + [3, 2, 1, 0].map(i => A[(n >> (i * 5)) & 31]).join('');
  }

  function decode(t) {
    t = t.toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/^SV/, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    if (t.length !== 4) return null;
    let n = 0; for (const ch of t) { const i = A.indexOf(ch); if (i < 0) return null; n = n * 32 + i; }
    const v = n >> 5; if (!v || (v * 7 + 3) % 31 !== (n & 31)) return null;
    let b = 0; const bit = () => !!(v & (1 << b++));
    const p = rd(K[0]), f = rd(K[1]), s = rd(K[2]);
    W.forEach(w => { if (bit()) p[w] = true; }); if (bit()) p.novaSeen = true;
    if (bit()) f.seen = true; if (bit()) s.originDone = true;
    f.stars = Y.filter(y => bit()).concat((f.stars || []).filter(y => !Y.includes(y)));
    wr(K[0], p); wr(K[1], f); wr(K[2], s); return true;
  }

  document.head.insertAdjacentHTML('beforeend', '<style>' +
    '#cc-open{position:absolute;left:0;right:0;bottom:max(64px,calc(env(safe-area-inset-bottom) + 52px));margin:auto;width:max-content;background:none;border:0;color:var(--mute);font:600 .66rem var(--sans);letter-spacing:.3em;text-transform:uppercase;padding:12px;opacity:.75}' +
    '#cc{position:fixed;inset:0;z-index:100;display:none;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:28px;background:rgba(3,7,18,.95)}' +
    '#cc.on{display:flex}#cc>*{max-width:420px;width:100%}#cc .code{font:600 30px "IBM Plex Mono",monospace;letter-spacing:.2em;color:var(--ice);margin:14px 0}' +
    '#cc input{width:100%;padding:14px;margin:14px 0 10px;background:rgba(255,255,255,.06);border:1px solid rgba(198,223,242,.5);border-radius:12px;color:var(--text);font:600 18px "IBM Plex Mono",monospace;text-align:center;letter-spacing:.2em;text-transform:uppercase}' +
    '#cc .btn{display:block;margin:8px auto}#cc .err{color:#f0a0a0;min-height:20px;font-size:14px}</style>');

  const op = document.querySelector('#opening');
  const b = Object.assign(document.createElement('button'), { id: 'cc-open', textContent: 'Captain’s code' });
  op.append(b);
  const m = document.createElement('div'); m.id = 'cc'; document.body.append(m);

  b.onclick = () => {
    const c = encode();
    m.innerHTML = '<p class="kick">Captain’s code</p>' +
      (c ? '<p>Your code. Keep it somewhere safe.</p><div class="code">' + c + '</div><p>Type it on any phone or laptop to bring your universe back.</p>' : '<p>Nothing to save yet. Come back after your first journey.</p>') +
      '<input id="cc-in" maxlength="9" placeholder="SV-XXXX" autocomplete="off"><div class="err"></div>' +
      '<button class="btn" id="cc-go">Restore my universe</button><button class="btn" id="cc-x">Close</button>';
    m.classList.add('on');
    m.querySelector('#cc-x').onclick = () => m.classList.remove('on');
    m.querySelector('#cc-go').onclick = () => {
      if (decode(m.querySelector('#cc-in').value)) location.replace(location.pathname);
      else m.querySelector('.err').textContent = 'That code doesn’t match anything. Check it and try again.';
    };
  };
})();
