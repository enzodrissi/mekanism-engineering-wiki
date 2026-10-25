// The "technical drawing" behind every 3D view: a turntable and a block grid on the model's floor (they turn with the
// camera), corner brackets, a dimension line under the model, a slow scan line and a few monospace labels.
// Only real data is written: the name on the page, the size read from the page or measured on the 3D model, the camera angle.
// The look lives in src/styles/stage-bg.css. viewer.js announces each new Stage with a 'me-stage' event; this file only
// listens to it and to the Stage's draws, so it moves nothing in the 3D view itself.
const D = 640, RING = 280; // the floor disc is drawn in a 640 px square, its ring 280 px from the centre

// 72 ticks every 5 degrees, longer every 30, and a small index mark
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180, r2 = i % 18 === 0 ? 306 : i % 6 === 0 ? 298 : 290;
  const f = (r: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  return `M${f(284)}L${f(r2)}`;
}).join('');
const arc = (r: number, a0: number, a1: number) => {
  const p = (a: number) => `${(Math.cos((a * Math.PI) / 180) * r).toFixed(1)} ${(Math.sin((a * Math.PI) / 180) * r).toFixed(1)}`;
  return `M${p(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
};
const svg = (cls: string, body: string) => `<svg class="${cls}" viewBox="-320 -320 640 640" aria-hidden="true">${body}</svg>`;
const corner = (c: string) => `<svg class="me-bp-corner ${c}" viewBox="0 0 16 16" aria-hidden="true"><path pathLength="1" d="M0.5 16V0.5H16"/></svg>`;

const LAYER = `<div class="me-bp-floor"><div class="me-bp-grid"></div>
  ${svg('me-bp-base', `<circle class="me-bp-ring" r="${RING}" pathLength="1"/><path class="me-bp-cross" d="M-16 0H16M0 -16V16"/>`)}
  <div class="me-bp-spin">${svg('', `<path class="me-bp-ticks" pathLength="1" d="${TICKS}"/><path class="me-bp-index" d="M0 -318l-6 -11h12z"/>`)}</div>
  <div class="me-bp-spin2">${svg('', `<circle class="me-bp-dash" r="246"/><path class="me-bp-arc" pathLength="1" d="${arc(262, -150, -80)}"/><path class="me-bp-arc" pathLength="1" d="${arc(262, 30, 62)}"/>`)}</div>
</div>
${corner('tl')}${corner('tr')}${corner('bl')}${corner('br')}
<div class="me-bp-scan"></div>
<div class="me-bp-dim"><i class="me-bp-ext a"></i><i class="me-bp-ext b"></i><i class="me-bp-line"></i><i class="me-bp-end a"></i><i class="me-bp-end b"></i><span class="me-bp-size"></span></div>
<span class="me-bp-label me-bp-name"></span><span class="me-bp-label me-bp-ang"></span>`;

let THREE: any = null;
const three = () => (THREE ? Promise.resolve(THREE) : import('three').then(m => (THREE = m)));

/** What the view shows, read from the page before the 3D replaces its placeholder picture. */
function nameOf(stageEl: HTMLElement) {
  const host = stageEl.closest<HTMLElement>('[data-me3d]') ?? stageEl;
  if (host.dataset.meName) return host.dataset.meName;
  if (host.dataset.kind === 'block' || host.closest('.me-head')) return document.querySelector('h1#_top')?.textContent?.trim() ?? '';
  return 'Quantum Ore Refinery';
}
/** "10 × 4 × 3 blocks" as the page writes it (the refinery pages), else nothing. */
function sizeOnPage() {
  const text = (document.querySelector('.sl-markdown-content')?.textContent ?? '') + ' ' + (document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '');
  const m = text.match(/(\d+) × (\d+) × (\d+)( blocks)?/);
  return m ? `${m[1]} × ${m[2]} × ${m[3]}${m[4] ? ' blocks' : ''}` : '';
}
/** The size of the model itself. */
function measured(size: any, grid = false) {
  const d = [size.x, size.y, size.z];
  // a structure is counted on its block grid (a few model pixels overhang it); a block in blocks when whole, else in pixels
  if (grid || d.every(v => Math.abs(v - Math.round(v)) < 0.02)) { const b = d.map(Math.round); return `${b.join(' × ')} block${b.every(v => v === 1) ? '' : 's'}`; }
  return `${d.map(v => Math.round(v * 16)).join(' × ')} px`;
}

// pause what moves while the view is off screen or the tab is hidden
const shown = new Set<HTMLElement>();
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const e of entries) {
    const el = e.target as HTMLElement;
    if (e.isIntersecting) { shown.add(el); el.classList.add('me-bp-on'); } else shown.delete(el);
    el.classList.toggle('me-bp-pause', !e.isIntersecting || document.hidden);
  }
}) : null;
document.addEventListener('visibilitychange', () => {
  document.querySelectorAll<HTMLElement>('.me-bp').forEach(el => el.classList.toggle('me-bp-pause', document.hidden || !shown.has(el)));
});

async function attach(stage: any) {
  const host: HTMLElement = stage.host;
  if (host.querySelector(':scope > .me-bp')) return;
  const layer = document.createElement('div');
  layer.className = 'me-bp';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = LAYER;
  host.classList.add('me-bp-host');
  host.prepend(layer);
  if (io) io.observe(layer); else layer.classList.add('me-bp-on');
  const $ = (s: string) => layer.querySelector(s) as HTMLElement;
  const floor = $('.me-bp-floor'), grid = $('.me-bp-grid'), sizeEl = $('.me-bp-size'), ang = $('.me-bp-ang');
  const parts = { extA: $('.me-bp-ext.a'), extB: $('.me-bp-ext.b'), line: $('.me-bp-line'), endA: $('.me-bp-end.a'), endB: $('.me-bp-end.b') };
  $('.me-bp-name').textContent = nameOf(host);
  const isBlock = !host.closest('.me-ref');
  const assembled = (host.closest<HTMLElement>('[data-me3d]')?.dataset.mode ?? 'assembled') === 'assembled';
  const pageSize = isBlock || assembled ? '' : sizeOnPage();
  if (isBlock) layer.classList.add('me-bp-block');

  const T = await three();
  const v = new T.Vector3(), box = new T.Box3(), size = new T.Vector3();
  const angText = ang.appendChild(document.createTextNode(''));
  let w = host.clientWidth, h = host.clientHeight, last = { s: 0, gx: 0, gz: 0, ang: '' };
  new ResizeObserver(() => { w = host.clientWidth; h = host.clientHeight; }).observe(host);
  const px = (n: number) => `${n.toFixed(2)}px`;

  function draw() {
    if (!stage.root.children.length || !w || !h) return;
    box.setFromObject(stage.root);
    if (box.isEmpty()) return;
    // measured once the blocks have landed (during the intro they fall from above)
    if (!sizeEl.textContent && !host.classList.contains('me-intro')) sizeEl.textContent = isBlock || assembled ? measured(box.getSize(size), !isBlock) : pageSize;
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2, y0 = box.min.y;
    const at = (x: number, z: number) => stage.toScreen(v.set(x, y0, z));
    const p0 = at(cx, cz), pX = at(cx + 1, cz), pZ = at(cx, cz + 1);
    const ex = [pX.x - p0.x, pX.y - p0.y], ez = [pZ.x - p0.x, pZ.y - p0.y];
    // the ring goes round the footprint, and stays inside the frame
    const hx = (box.max.x - box.min.x) / 2, hz = (box.max.z - box.min.z) / 2;
    const semiX = Math.hypot(ex[0], ez[0]), semiY = Math.hypot(ex[1], ez[1]);
    const R = Math.min(Math.hypot(hx, hz) * (isBlock ? 1.45 : 1.04), (w / 2 - 6) / (semiX * 1.1), (h * 0.62) / Math.max(semiY * 1.1, 1e-6));
    const S = RING / R; // disc pixels per block
    floor.style.transform = `matrix(${(ex[0] / S).toFixed(5)},${(ex[1] / S).toFixed(5)},${(ez[0] / S).toFixed(5)},${(ez[1] / S).toFixed(5)},${p0.x.toFixed(2)},${p0.y.toFixed(2)}) translate(-${D / 2}px,-${D / 2}px)`;
    // grid lines on the block edges
    const gx = (((D / 2 - (cx - Math.floor(cx)) * S) % S) + S) % S, gz = (((D / 2 - (cz - Math.floor(cz)) * S) % S) + S) % S;
    if (Math.abs(S - last.s) > 0.01 || Math.abs(gx - last.gx) > 0.05 || Math.abs(gz - last.gz) > 0.05) {
      // lines stay about one screen pixel thin however the disc is scaled
      floor.style.setProperty('--lw', px(Math.min(4, Math.max(0.8, 1.1 / ((R * semiX) / RING)))));
      grid.style.setProperty('--s', px(S)); grid.style.setProperty('--gx', px(gx)); grid.style.setProperty('--gz', px(gz));
      last.s = S; last.gx = gx; last.gz = gz;
    }
    // dimension line: from the leftmost to the rightmost corner of the footprint, under the ring
    const cs = [at(box.min.x, box.min.z), at(box.max.x, box.min.z), at(box.min.x, box.max.z), at(box.max.x, box.max.z)];
    const a = cs.reduce((m, c) => (c.x < m.x ? c : m)), b = cs.reduce((m, c) => (c.x > m.x ? c : m));
    const y = Math.min(h - 12, p0.y + R * semiY + 14);
    const len = b.x - a.x;
    parts.line.style.transform = `translate(${px(a.x)},${px(y)}) scaleX(${len.toFixed(2)})`;
    parts.endA.style.transform = `translate(${px(a.x)},${px(y)})`;
    parts.endB.style.transform = `translate(${px(b.x)},${px(y)})`;
    parts.extA.style.transform = `translate(${px(a.x)},${px(a.y + 5)}) scaleY(${Math.max(0, y - a.y - 1).toFixed(2)})`;
    parts.extB.style.transform = `translate(${px(b.x)},${px(b.y + 5)}) scaleY(${Math.max(0, y - b.y - 1).toFixed(2)})`;
    sizeEl.style.transform = `translate(${px((a.x + b.x) / 2)},${px(y)})`;
    // the camera angle, as the drag sets it
    const o = stage.cam.position.clone().sub(stage.controls.target);
    const yaw = ((Math.atan2(-o.x, -o.z) * 180) / Math.PI + 360) % 360, el = (Math.asin(o.y / o.length()) * 180) / Math.PI;
    const t = `YAW ${String(Math.round(yaw) % 360).padStart(3, '0')}°\nELEV ${String(Math.round(el)).padStart(2, '0')}°`;
    if (t !== last.ang) { angText.data = t; last.ang = t; } // the text node only: no new nodes, so no re-style of the page
    if (!layer.classList.contains('me-bp-ready')) layer.classList.add('me-bp-ready');
  }
  stage.onDraw(draw);
  stage.draw();
}

function init() {
  // the home page's picture names the view before the 3D replaces it
  for (const host of document.querySelectorAll<HTMLElement>('[data-me3d]')) {
    const alt = host.querySelector('img[alt]')?.getAttribute('alt');
    if (alt) host.dataset.meName = alt.replace(/^The /, '');
  }
}
document.addEventListener('me-stage', e => { attach((e as CustomEvent).detail).catch(err => console.warn('3D background', err)); });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
