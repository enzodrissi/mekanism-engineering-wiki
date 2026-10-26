// Interactive parts of the pages: 3D views (loaded only when they come into sight) and the refinery speed calculator.
import levelsEn from '../data/qor-levels.json';
import levelsFr from '../data/qor-levels.fr.json';
import { countTo, pop, swapIn } from './motion';
import { L, lang, num, dataUrl } from '../lib/i18n.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
let names: Promise<Record<string, { name: string; text: string; page: string | null }>> | null = null;
const blockNames = () => (names ??= fetch(dataUrl('blocks.json')).then(r => r.json()).catch(() => ({})));

async function mount3d(el: HTMLElement) {
  const viewer = await import('../lib/viewer.js');
  try {
    if (el.dataset.kind === 'block') await viewer.mountBlock(el);
    else {
      const tags = el.dataset.tags === 'hero' ? [
        [(d: any) => /controller/.test(d.id), L('Controller')],
        [(d: any) => /accelerator/.test(d.id) && d.dx === -4, L('8 Accelerators')],
        [(d: any) => /module_quantum/.test(d.id), L('Quantum Module')],
      ] : null;
      await viewer.mountRefinery(el, { blocks: await blockNames(), mode: el.dataset.mode || 'exploded', markers: !tags, tags });
    }
  } catch (e) {
    console.warn('3D view', e);
    el.querySelector('.me-loading')?.replaceChildren(L('The 3D view could not load on this device.'));
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

// the column count (at most max) that leaves the last row fullest: the whole grid is regular, never a card alone on a row
function fit(el: HTMLElement, n: number, max: number) {
  let cols = Math.min(n, max);
  if (n > max) { cols = 2; for (let c = max, best = -1; c >= 2; c--) { const r = n % c === 0 ? c : n % c; if (r > best) { best = r; cols = c; } } }
  el.dataset.cols = String(cols); el.style.setProperty('--cols', String(cols));
}

function calc(el: HTMLElement) {
  const st = { level: 5, acc: 8 };
  // the levels as the page's own table writes them (the French table is read from the French page)
  const levels = lang() === 'fr' && levelsFr.length === 5 ? levelsFr : levelsEn;
  const accIcon = `${BASE}/icons/mekanismengineering/ore_refinery_accelerator.png`;
  el.classList.add('me-calc');
  el.innerHTML = `<section class="me-glass"><h3>${L('Speed')}</h3>
    <div class="me-gauge"><svg viewBox="0 0 220 130" aria-hidden="true"><defs><linearGradient id="me-g"><stop offset="0" stop-color="#4a84ec"/><stop offset="1" stop-color="#64d1c7"/></linearGradient></defs>
      <path d="M20 120 A90 90 0 0 1 200 120" fill="none" stroke="rgba(120,150,200,.18)" stroke-width="14" stroke-linecap="round"/>
      <path class="me-arc" d="M20 120 A90 90 0 0 1 200 120" fill="none" stroke="url(#me-g)" stroke-width="14" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="0"/></svg>
      <b></b><small></small></div>
    <div class="me-lv" role="group" aria-label="${L('Level')}">${[1, 2, 3, 4, 5].map(l => `<button type="button" data-l="${l}">x${l}</button>`).join('')}</div>
    <div class="me-acc" role="group" aria-label="${L('Accelerators')}">${Array.from({ length: 8 }, (_, i) => `<button type="button" data-a="${i + 1}" title="${L('Accelerator {n}', { n: i + 1 })}"><img src="${accIcon}" alt="${L('Accelerator {n}', { n: i + 1 })}"></button>`).join('')}</div>
    <p class="me-note"></p></section>
    <section class="me-glass"><h3></h3><div class="me-flow"></div><div class="me-kpis"></div>
    <p class="me-note" style="text-align:left">${L('Iron ore, Mekanism\'s default recipes, from the table above. A job takes a stack of up to 64 ore.')}</p></section>`;
  const $ = (s: string) => el.querySelector(s) as HTMLElement;
  let first = true;
  function show() {
    const t = ticks(st.level, st.acc), row = levels.find(x => x.level === st.level)!;
    countTo($('.me-gauge b'), t, n => L(n > 1 ? '{n} ticks' : '{n} tick', { n }));
    $('.me-gauge small').textContent = L('per x{level} job · {s} s', { level: st.level, s: num(t / 20, { maximumFractionDigits: 2 }) });
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
    $('.me-note').textContent = st.level === 1 ? L('The x1 works a whole stack in one tick, whatever the accelerators.')
      : L('{acc} of 8 Ore Refinery Accelerators · tap one to add or remove', { acc: st.acc });
    $('section:last-child h3').textContent = L('One iron ore at x{level}', { level: st.level });
    const flow = $('.me-flow').innerHTML, kpis = [...el.querySelectorAll('.me-kpis div')].map(d => d.textContent);
    const steps = row.chain.split(/, (?![^(]*\))/).map(c => c.replace(/^(then|puis) /, ''));
    $('.me-flow').innerHTML = steps.map(c => `<span>${c[0].toUpperCase() + c.slice(1)}</span>`).join('');
    fit($('.me-flow'), steps.length, 4);
    const takes = /^(nothing|rien)$/.test(row.takes) ? [] : row.takes.split(/, (?=\d)/);
    $('.me-kpis').innerHTML = `<div><b>${row.ingots}</b><span>${L(row.ingots > 1 ? 'ingots from one ore' : 'ingot from one ore')}</span></div>`
      + (takes.length ? takes.map(x => { const m = x.match(/^([\d,  ]+ mB) (.+)$/); return m ? `<div><b>${m[1]}</b><span>${m[2].replace(/^(de |d['’])/, '')}</span></div>` : `<div><span>${x}</span></div>`; }).join('')
        : `<div><b>0 mB</b><span>${L('nothing from the tanks')}</span></div>`);
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

// ---------- grids of cards and chips: regular, never a card alone on the last row ----------
// These grids fill the width by themselves (auto-fill / auto-fit). The column count that leaves the last row fullest is
// chosen among the ones that fit (at most 40 % fewer), and a last card with no partner takes the rest of its row. An icon
// strip keeps its small cells and only changes its column count.
const CARDS = '.me-bom ul:not(.me-bom-notes), .me-tiles, .me-stats, .cl-jump, .cl-facts, .cl-more-p', STRIPS = '.cl-parts ul';
function balance(grid: HTMLElement, strip: boolean) {
  const kids = [...grid.children].filter((k): k is HTMLElement => k instanceof HTMLElement && !k.classList.contains('me-eyebrow') && getComputedStyle(k).display !== 'none');
  grid.style.gridTemplateColumns = ''; kids.forEach(k => (k.style.gridColumn = ''));
  const widths = getComputedStyle(grid).gridTemplateColumns.split(' ').map(parseFloat).filter(w => w > 0);
  const tracks = widths.length, n = kids.length;
  if (tracks < 2 || n <= tracks) return;
  let cols = tracks, best = n % tracks || tracks;
  for (let c = tracks - 1; c >= Math.max(2, Math.ceil(tracks * 0.6)); c--) { const r = n % c || c; if (r > best) { best = r; cols = c; } }
  if (cols !== tracks) grid.style.gridTemplateColumns = `repeat(${cols}, ${strip ? widths[0] + 'px' : 'minmax(0, 1fr)'})`;
  const rem = n % cols;
  if (rem && !strip) kids[n - 1].style.gridColumn = `span ${cols - rem + 1}`;
}
// some grids are made by scripts after the page loads (the bill of materials), so new ones are picked up as they appear
const watched = new WeakSet<Element>();
function balanceAll() {
  const scan = () => {
    for (const [sel, strip] of [[CARDS, false], [STRIPS, true]] as const)
      document.querySelectorAll<HTMLElement>(sel).forEach(grid => {
        if (watched.has(grid)) return;
        watched.add(grid);
        let width = -1;
        new ResizeObserver(() => { const w = Math.round(grid.clientWidth); if (w !== width) { width = w; balance(grid, strip); } }).observe(grid);
      });
  };
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}

function init() {
  lazy3d();
  balanceAll();
  document.querySelectorAll<HTMLElement>('.me-qor-calc').forEach(calc);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
