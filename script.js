(() => {
  const KEY = 'sidduverse-progress-v1';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const W = [
    { id: 'origin', n: 1, name: 'ORIGIN', tag: 'Where it all begins', kick: 'World 01 // Personality archive', fr: 'Identity',
      txt: 'Every universe begins somewhere. This one begins with its most interesting explorer. Discover the little details, familiar habits and unexpected facts that make this world unique.', pos: '50% 55%' },
    { id: 'echo', n: 2, name: 'ECHO', tag: 'Traces of another time', kick: 'World 02 // Memory archive', fr: 'Memory',
      txt: 'Some moments leave traces long after they pass. This world holds fragments of memories, little stories and moments worth revisiting.', pos: '50% 40%' },
    { id: 'unknown', n: 3, name: 'UNKNOWN', tag: 'Not everything is visible', kick: 'World 03 // Uncharted territory', fr: 'Discovery',
      txt: 'Not every secret reveals itself immediately. Look closer, solve the clues and see what you can uncover in this unexplored world.', pos: '50% 50%' },
    { id: 'signal', n: 4, name: 'SIGNAL', tag: 'A message from the stars', kick: 'World 04 // Incoming transmission', fr: 'Transmission',
      txt: 'A message is travelling across the universe. Hidden somewhere in this world are signals meant for one particular explorer.', pos: '50% 50%' }
  ];

  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} };
  const count = () => W.filter(w => done[w.id]).length;

  let cur = 'opening', active = null, novaSeen = !!done.novaSeen;

  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    cur = id;
    $('#' + id).scrollTop = 0;
  }

  function go(id) {
    if ((id === 'nova' || id === 'final') && count() < 4) id = 'galaxy';
    if (id === 'galaxy') drawMap();
    show(id);
  }

  function drawMap() {
    const n = count(), unlocked = n === 4;
    $('#count').textContent = '0' + n + ' / 04';
    const cards = W.map(w => `<button class="card${done[w.id] ? ' done' : ''}" data-world="${w.id}"><i class="orb o-${w.id}"></i><div><small>WORLD 0${w.n}${done[w.id] ? ' // FRAGMENT COLLECTED' : ''}</small><strong>${w.name}</strong><span>${w.tag}</span></div></button>`);
    const fresh = unlocked && !novaSeen;
    cards.push(`<button class="card ${unlocked ? 'open' : 'lock'}" data-world="nova" ${unlocked ? '' : 'aria-disabled="true"'}><i class="orb o-nova"></i><div><small>WORLD 05 // ${unlocked ? 'UNLOCKED' : 'RESTRICTED'}</small><strong>NOVA</strong><span>${unlocked ? 'All fragments collected. Enter.' : 'Complete all fragments to unlock'}</span></div></button>`);
    $('#worlds').innerHTML = cards.join('');
    if (fresh) { novaSeen = done.novaSeen = true; save(); }
    else if (unlocked) $('#worlds .open').style.animation = 'none';
  }

  function paintWorld() {
    const w = active, got = !!done[w.id];
    $('#wbtn').hidden = got;
    $('#wdone').hidden = !got;
    $('#wgot').textContent = 'Fragment 0' + w.n + ' collected: ' + w.fr + '.';
  }

  function openWorld(id) {
    active = W.find(w => w.id === id);
    $('#world .bg').className = 'bg b-' + id;
    $('#world .bg').style.setProperty('--pos', active.pos);
    $('#wkick').textContent = active.kick;
    $('#wtitle').textContent = active.name;
    $('#wtxt').textContent = active.txt;
    paintWorld();
    show('world');
  }

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) return go(g.dataset.go);
    const c = e.target.closest('.card');
    if (!c) return;
    const id = c.dataset.world;
    if (id === 'nova') {
      if (count() === 4) go('nova');
      else { c.classList.remove('nope'); void c.offsetWidth; c.classList.add('nope'); }
    } else openWorld(id);
  });

  // TEMP: tapping the button awards the fragment. Replace with the real quiz, memories, puzzles and signals.
  $('#wbtn').addEventListener('click', () => { done[active.id] = true; save(); paintWorld(); });
  $('#open').addEventListener('click', () => { $('#msg').classList.add('show'); $('#open').hidden = true; });

  // Twinkling stars layered over the photographs
  const cv = $('#stars'), g2 = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let S = [];
  function fit() {
    const d = Math.min(devicePixelRatio || 1, 2), w = innerWidth, h = innerHeight;
    cv.width = w * d; cv.height = h * d; g2.setTransform(d, 0, 0, d, 0, 0);
    S = Array.from({ length: Math.round(w * h / 7000) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + .3, p: Math.random() * 6.28, s: Math.random() * .0015 + .0004 }));
    if (still) tick(0);
  }
  function tick(t) {
    g2.clearRect(0, 0, innerWidth, innerHeight);
    g2.fillStyle = '#EDF3FA';
    for (const s of S) {
      g2.globalAlpha = .25 + .55 * Math.abs(Math.sin(t * s.s + s.p));
      g2.beginPath(); g2.arc(s.x, s.y, s.r, 0, 6.283); g2.fill();
    }
    if (!still) requestAnimationFrame(tick);
  }
  addEventListener('resize', fit);
  fit();
  if (!still) requestAnimationFrame(tick);

  // Occasional shooting star on the opening screen only
  const sh = $('.shoot');
  if (!still) setInterval(() => {
    if (cur !== 'opening' || document.hidden) return;
    sh.classList.remove('go'); void sh.offsetWidth; sh.classList.add('go');
  }, 9000);
})();
