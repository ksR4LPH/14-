// ── 14 petal messages ──
const messages = [
  "Я люблю тебя так сильно, что иногда просто не нахожу слов 💕",
  "Твои глаза — самое красивое, что я когда-либо видел. В них можно утонуть 🌊",
  "Твой смех — это моя любимая мелодия. Я готов слушать её вечно 🎵",
  "Ты приносишь мне радость, которую я не знал раньше ✨",
  "Твой характер — добрый, настоящий, живой. Именно за это я тебя обожаю 🌿",
  "Когда ты рядом — мир становится теплее. Просто потому что ты есть 🌤️",
  "Я думаю о тебе каждый день. Гораздо больше, чем ты думаешь 💭",
  "Ты заставляешь меня улыбаться даже тогда, когда тебя нет рядом 🌸",
  "Твоя улыбка — это маленькое солнце, которое освещает всё вокруг ☀️",
  "Я ценю каждый момент с тобой. Каждый. 💎",
  "Ты — самый особенный человек в моей жизни. Это правда 🌟",
  "Твои глаза говорят больше, чем любые слова. Я слышу их 👁️✨",
  "Рядом с тобой я чувствую, что всё возможно 🦋",
  "Я влюблён в тебя — в каждую твою черту, в каждую улыбку, в тебя целиком 💗",
];

// ── Colors for petals (gradient layers) ──
const petalColors = [
  ['#ff9fd6','#ff6eb4'],
  ['#ffb3d9','#ff4da6'],
  ['#ff80c8','#e91e8c'],
  ['#ffa0d0','#ff1a8c'],
  ['#ff6eb4','#c2185b'],
  ['#ff94cc','#f06292'],
  ['#ffb0dc','#e91e8c'],
  ['#ff70be','#ad1457'],
  ['#ffa8d8','#ff4da6'],
  ['#ff85c5','#d81b60'],
  ['#ffbde0','#ff3d9a'],
  ['#ff7cc0','#c2185b'],
  ['#ff9acc','#e91e8c'],
  ['#ffaad4','#ff1493'],
];

const TOTAL = 14;
const opened = new Set();
let celebrationShown = false;

// ── Draw petals ──
const svg = document.getElementById('petals-group');

function petalPath(innerR, outerR, angleRad, widthAngle) {
  // A petal shape using two bezier curves
  const half = widthAngle / 2;
  const a1 = angleRad - half;
  const a2 = angleRad + half;

  const x1 = Math.cos(a1) * innerR, y1 = Math.sin(a1) * innerR;
  const x2 = Math.cos(a2) * innerR, y2 = Math.sin(a2) * innerR;
  const tipX = Math.cos(angleRad) * outerR, tipY = Math.sin(angleRad) * outerR;

  const cp1x = Math.cos(a1 - 0.18) * outerR * 0.72;
  const cp1y = Math.sin(a1 - 0.18) * outerR * 0.72;
  const cp2x = Math.cos(a2 + 0.18) * outerR * 0.72;
  const cp2y = Math.sin(a2 + 0.18) * outerR * 0.72;

  return `M ${x1} ${y1}
          C ${cp1x} ${cp1y}, ${tipX - Math.cos(a1)*18} ${tipY - Math.sin(a1)*18}, ${tipX} ${tipY}
          C ${tipX - Math.cos(a2)*18} ${tipY - Math.sin(a2)*18}, ${cp2x} ${cp2y}, ${x2} ${y2}
          Z`;
}

const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
svg.parentElement.insertBefore(defs, svg.parentElement.firstChild);

for (let i = 0; i < TOTAL; i++) {
  const angle = (i / TOTAL) * Math.PI * 2 - Math.PI / 2;
  const [c1, c2] = petalColors[i];

  // gradient
  const grad = document.createElementNS('http://www.w3.org/2000/svg','radialGradient');
  grad.id = `pg${i}`;
  grad.setAttribute('cx','40%'); grad.setAttribute('cy','30%');
  grad.setAttribute('r','70%');
  const s1 = document.createElementNS('http://www.w3.org/2000/svg','stop');
  s1.setAttribute('offset','0%'); s1.setAttribute('stop-color', c1);
  const s2 = document.createElementNS('http://www.w3.org/2000/svg','stop');
  s2.setAttribute('offset','100%'); s2.setAttribute('stop-color', c2);
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad);

  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d', petalPath(42, 155, angle, 0.38));
  path.setAttribute('fill', `url(#pg${i})`);
  path.setAttribute('stroke', '#fff2');
  path.setAttribute('stroke-width', '0.5');
  path.classList.add('petal');
  path.dataset.index = i;
  path.style.setProperty('--r', `${(i/TOTAL)*360}deg`);

  // glow filter
  const filt = document.createElementNS('http://www.w3.org/2000/svg','filter');
  filt.id = `glow${i}`;
  const fe = document.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur');
  fe.setAttribute('stdDeviation','3'); fe.setAttribute('result','blur');
  filt.appendChild(fe);
  defs.appendChild(filt);

  path.addEventListener('click', () => onPetalClick(i, path));
  svg.appendChild(path);

  // petal number label
  const labelAngle = angle;
  const lx = Math.cos(labelAngle) * 105;
  const ly = Math.sin(labelAngle) * 105;
  const label = document.createElementNS('http://www.w3.org/2000/svg','text');
  label.setAttribute('x', lx); label.setAttribute('y', ly + 5);
  label.setAttribute('text-anchor','middle');
  label.setAttribute('font-size','11');
  label.setAttribute('fill','#fff8');
  label.setAttribute('font-family','Caveat, cursive');
  label.textContent = i + 1;
  label.style.pointerEvents = 'none';
  label.dataset.labelIndex = i;
  svg.appendChild(label);
}

// ── Sparkle particles on bg ──
const bgP = document.getElementById('bg-particles');
for (let i = 0; i < 60; i++) {
  const s = document.createElement('div');
  s.style.cssText = `
    position:absolute;
    border-radius:50%;
    background:white;
    width:${0.5+Math.random()*2}px;
    height:${0.5+Math.random()*2}px;
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    opacity:0;
    animation: twinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*5}s infinite;
  `;
  bgP.appendChild(s);
}
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%,100%{opacity:0;transform:scale(0.5)}
    50%{opacity:${0.4+Math.random()*0.6};transform:scale(1.3)}
  }
`;
document.head.appendChild(style);

// ── Canvas hearts ──
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
function spawnParticles(x, y) {
  const emojis = ['✨','💕','🌸','💗','⭐','🌟','💖'];
  for (let i = 0; i < 10; i++) {
    particles.push({
      x, y,
      vx: (Math.random()-0.5)*4,
      vy: -2-Math.random()*4,
      life: 1,
      decay: 0.018+Math.random()*0.01,
      emoji: emojis[Math.floor(Math.random()*emojis.length)],
      size: 14+Math.random()*10,
    });
  }
}

function animateParticles() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i];
    ctx.globalAlpha = p.life;
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.emoji, p.x, p.y);
    p.x += p.vx; p.y += p.vy; p.vy += 0.08;
    p.life -= p.decay;
    if (p.life <= 0) particles.splice(i,1);
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Petal click ──
const msgCard  = document.getElementById('msg-card');
const msgText  = document.getElementById('msg-text');
const msgNum   = document.getElementById('msg-petal-num');
const msgClose = document.getElementById('msg-close');
const counter  = document.getElementById('counter-done');

function onPetalClick(i, path) {
  if (opened.has(i)) return;

  // Get SVG petal center for particles
  const rect = canvas.getBoundingClientRect();
  const angle = (i / TOTAL) * Math.PI * 2 - Math.PI / 2;
  const svgRect = document.getElementById('flower-svg').getBoundingClientRect();
  const cx = svgRect.left + svgRect.width/2 + Math.cos(angle)*80;
  const cy = svgRect.top  + svgRect.height/2 + Math.sin(angle)*80;
  spawnParticles(cx, cy);

  // Pop animation
  path.classList.add('pop');
  path.addEventListener('animationend', () => path.classList.remove('pop'), {once:true});

  // Show message
  msgNum.textContent  = `лепесток ${i+1} из ${TOTAL}`;
  msgText.textContent = messages[i];
  msgCard.classList.remove('hidden');

  // Mark as opened
  opened.add(i);
  path.classList.add('opened');
  counter.textContent = opened.size;

  // Dim label
  const lbl = document.querySelector(`[data-label-index="${i}"]`);
  if (lbl) lbl.setAttribute('fill','#fff3');
}

msgClose.addEventListener('click', () => {
  msgCard.classList.add('hidden');
  if (opened.size === TOTAL && !celebrationShown) showCelebration();
});

msgCard.addEventListener('click', e => {
  if (e.target === msgCard) {
    msgCard.classList.add('hidden');
    if (opened.size === TOTAL && !celebrationShown) showCelebration();
  }
});

// ── All petals opened ──
function showCelebration() {
  celebrationShown = true;
  const el = document.createElement('div');
  el.id = 'celebration';
  el.innerHTML = `
    <h2>Зарин 🌸</h2>
    <p>Всё это — правда.<br>Каждое слово — о тебе.<br>Я люблю тебя. 💕</p>
  `;
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
  // Big burst
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      spawnParticles(
        window.innerWidth  * (0.2 + Math.random()*0.6),
        window.innerHeight * (0.2 + Math.random()*0.6)
      );
    }, i * 200);
  }
}