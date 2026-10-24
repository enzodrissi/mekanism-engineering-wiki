// Interactive parts of the pages: 3D views (loaded only when they come into sight) and the refinery speed calculator.
import levels from '../data/qor-levels.json';
import { countTo, pop, swapIn } from './motion';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
let names: Promise<Record<string, { name: string; text: string; page: string | null }>> | null = null;
const blockNames = () => (names ??= fetch(`${BASE}/data/blocks.json`).then(r => r.json()).catch(() => ({})));

async function mount3d(el: HTMLElement) {
  const viewer = await import('../lib/viewer.js');
  try {
    if (el.dataset.kind === 'block') await viewer.mountBlock(el);
    else {
      const tags = el.dataset.tags === 'hero' ? [
        [(d: any) => /controller/.test(d.id), 'Controller'],
        [(d: any) => /accelerator/.test(d.id) && d.dx === -4, '8 Accelerators'],
        [(d: any) => /module_quantum/.test(d.id), 'Quantum Module'],
      ] : null;
      await viewer.mountRefinery(el, { blocks: await blockNames(), mode: el.dataset.mode || 'exploded', markers: !tags, tags });
    }
  } catch (e) {
    console.warn('3D view', e);
    el.querySelector('.me-loading')?.replaceChildren('The 3D view could not load on this device.');
  }
}

function lazy3d() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-me3d]')];
  if (!els.length) return;
  import('../lib/viewer.js').then(v => v.preload());
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); mount3d(e.target as HTMLElement); }
  }, { rootMargin: '300px' });
  els.forEach(el => io.observe(el));
}

// ---------- Quantum Ore Refinery: how long a job lasts (RefinerySpeed.ticks in the mod) ----------
const ticks = (level: number, n: number) => level <= 1 ? 1 : Math.max(1, Math.round(200 * Math.pow(50, -n / 8) * (level - 1) / 4));

function calc(el: HTMLElement) {
  const st = { level: 5, acc: 8 };
  const accIcon = `${BASE}/icons/mekanismengineering/ore_refinery_accelerator.png`;
  el.classList.add('me-calc');
  el.innerHTML = `<section class="me-glass"><h3>Speed</h3>
    <div class="me-gauge"><svg viewBox="0 0 220 130" aria-hidden="true"><defs><linearGradient id="me-g"><stop offset="0" stop-color="#4a84ec"/><stop offset="1" stop-color="#64d1c7"/></linearGradient></defs>
      <path d="M20 120 A90 90 0 0 1 200 120" fill="none" stroke="rgba(120,150,200,.18)" stroke-width="14" stroke-linecap="round"/>
      <path class="me-arc" d="M20 120 A90 90 0 0 1 200 120" fill="none" stroke="url(#me-g)" stroke-width="14" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="0"/></svg>
      <b></b><small></small></div>
    <div class="me-lv" role="group" aria-label="Level">${[1, 2, 3, 4, 5].map(l => `<button type="button" data-l="${l}">x${l}</button>`).join('')}</div>
    <div class="me-acc" role="group" aria-label="Accelerators">${Array.from({ length: 8 }, (_, i) => `<button type="button" data-a="${i + 1}" title="Accelerator ${i + 1}"><img src="${accIcon}" alt="Ore Refinery Accelerator"></button>`).join('')}</div>
    <p class="me-note"></p></section>
    <section class="me-glass"><h3></h3><div class="me-flow"></div><div class="me-kpis"></div>
    <p class="me-note" style="text-align:left">Iron ore, Mekanism's default recipes, from the table above. A job takes a stack of up to 64 ore.</p></section>`;
  const $ = (s: string) => el.querySelector(s) as HTMLElement;
  let first = true;
  function show() {
    const t = ticks(st.level, st.acc), L = levels.find(x => x.level === st.level)!;
    countTo($('.me-gauge b'), t, n => `${n} tick${n > 1 ? 's' : ''}`);
    $('.me-gauge small').textContent = `per x${st.level} job · ${(t / 20).toLocaleString('en', { maximumFractionDigits: 2 })} s`;
    // full arc = 1 tick, empty = 200 ticks (logarithmic, as the accelerators work)
    // set as a style so the arc can glide (motion.css)
    $('.me-arc').style.strokeDashoffset = String(283 * Math.log(t) / Math.log(200));
    el.querySelectorAll<HTMLButtonElement>('.me-lv button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.l! === st.level)));
    // the accelerators that were switched pop, one after the other
    let n = 0;
    el.querySelectorAll<HTMLButtonElement>('.me-acc button').forEach(b => {
      const on = String(+b.dataset.a! <= st.acc);
      if (!first && b.getAttribute('aria-pressed') !== on) pop(b, 30 * n++);
      b.setAttribute('aria-pressed', on);
    });
    $('.me-note').textContent = st.level === 1 ? 'The x1 works a whole stack in one tick, whatever the accelerators.'
      : `${st.acc} of 8 Ore Refinery Accelerators · tap one to add or remove`;
    $('section:last-child h3').textContent = `One iron ore at x${st.level}`;
    const flow = $('.me-flow').innerHTML, kpis = [...el.querySelectorAll('.me-kpis div')].map(d => d.textContent);
    $('.me-flow').innerHTML = L.chain.split(/, (?![^(]*\))/).map(c => c.replace(/^then /, '')).map(c => `<span>${c[0].toUpperCase() + c.slice(1)}</span>`).join('');
    const takes = L.takes === 'nothing' ? [] : L.takes.split(/, (?=\d)/);
    $('.me-kpis').innerHTML = `<div><b>${L.ingots}</b><span>ingot${L.ingots > 1 ? 's' : ''} from one ore</span></div>`
      + (takes.length ? takes.map(x => { const m = x.match(/^([\d,]+ mB) (.+)$/); return m ? `<div><b>${m[1]}</b><span>${m[2]}</span></div>` : `<div><span>${x}</span></div>`; }).join('')
        : '<div><b>0 mB</b><span>nothing from the tanks</span></div>');
    // the values that changed fade in
    if (!first) {
      if ($('.me-flow').innerHTML !== flow) swapIn($('.me-flow'));
      el.querySelectorAll('.me-kpis div').forEach((d, i) => { if (d.textContent !== kpis[i]) (kpis[i] == null ? [d] : [...d.children]).forEach(swapIn); });
    }
    first = false;
  }
  el.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest('button'); if (!b) return;
    if (b.dataset.l) { if (+b.dataset.l !== st.level) pop(b); st.level = +b.dataset.l; }
    if (b.dataset.a) { const a = +b.dataset.a; st.acc = st.acc === a ? a - 1 : a; }
    show();
  });
  show();
}

function init() {
  lazy3d();
  document.querySelectorAll<HTMLElement>('.me-qor-calc').forEach(calc);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
