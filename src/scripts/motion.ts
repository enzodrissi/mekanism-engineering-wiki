// Motion: scroll reveals, the tilt of the machine cards, page transition naming and small helpers for the calculator.
// The look lives in src/styles/motion.css. Nothing moves with reduced motion, and nothing is hidden if this file fails.
const motion = matchMedia('(prefers-reduced-motion: no-preference)');
export const moving = () => motion.matches;
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

// ---------- page transitions: the page we leave gets its own name, so it fades out where it is ----------
addEventListener('pageswap', (e: any) => { if (e.viewTransition) document.documentElement.classList.add('me-vt-old'); });
addEventListener('pagereveal', () => document.documentElement.classList.remove('me-vt-old'));
addEventListener('pageshow', () => document.documentElement.classList.remove('me-vt-old'));

// ---------- scroll reveal ----------
function reveal() {
  // a jump to an anchor, a reload or back/forward lands mid-page: show it as it is
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (location.hash || (nav && nav.type !== 'navigate') || !('IntersectionObserver' in window)) return;
  const own = [...document.querySelectorAll<HTMLElement>('.sl-markdown-content :is(table, .me-recipe, .me-texts), .me-home :is(h2, .me-sub, .me-card, .me-tile)')];
  const blocks = [...document.querySelectorAll<HTMLElement>('.sl-markdown-content > *')].filter(el => !own.some(o => el.contains(o)));
  const els = [...blocks, ...own].filter((el, _, all) =>
    !el.closest('[data-me3d]') && !el.querySelector('[data-me3d]') && !all.some(o => o !== el && o.contains(el)));
  // only what is below the fold now; what is in view at load is never touched
  const h = innerHeight;
  const below = els.filter(el => el.getBoundingClientRect().top > h);
  if (!below.length) return;
  below.forEach(el => el.classList.add('me-rv'));
  const io = new IntersectionObserver(entries => {
    // blocks that come in together follow each other, top to bottom, left to right
    entries.filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach((e, i) => {
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
          { duration: 700, delay: Math.min(i, 6) * 70, easing: EASE, fill: 'backwards' });
        el.classList.remove('me-rv');
      });
  }, { rootMargin: '0px 0px -8% 0px' });
  below.forEach(el => io.observe(el));
}

// ---------- machine cards lean toward the pointer ----------
function tilt() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const card of document.querySelectorAll<HTMLElement>('.me-card')) {
    let r = card.getBoundingClientRect(), x = 0.5, y = 0.5, raf = 0;
    const paint = () => {
      raf = 0;
      card.style.setProperty('--me-rx', `${((0.5 - y) * 10).toFixed(2)}deg`);
      card.style.setProperty('--me-ry', `${((x - 0.5) * 10).toFixed(2)}deg`);
      card.style.setProperty('--me-mx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--me-my', `${(y * 100).toFixed(1)}%`);
    };
    card.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch') return;
      r = card.getBoundingClientRect();
      card.classList.add('me-tilt');
    });
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      raf ||= requestAnimationFrame(paint);
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf); raf = 0;
      card.classList.remove('me-tilt');
    });
  }
}

// ---------- helpers for the calculator ----------
const counts = new WeakMap<Element, { v: number; raf: number }>();
/** Counts the number shown in el from its last value to `to`. */
export function countTo(el: HTMLElement, to: number, fmt: (n: number) => string, ms = 500) {
  const s = counts.get(el) ?? { v: to, raf: 0 };
  counts.set(el, s);
  cancelAnimationFrame(s.raf);
  const from = s.v;
  if (!moving() || Math.round(from) === to) { s.v = to; el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / ms);
    s.v = k < 1 ? from + (to - from) * (1 - Math.pow(1 - k, 3)) : to;
    el.textContent = fmt(Math.round(s.v));
    if (k < 1) s.raf = requestAnimationFrame(step);
  };
  s.raf = requestAnimationFrame(step);
}
/** A small pop, for a button that was just switched. */
export function pop(el: Element, delay = 0) {
  if (moving()) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }], { duration: 320, delay, easing: EASE });
}
/** A new value fades in where the old one was. */
export function swapIn(el: Element) {
  if (moving()) el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: EASE });
}

function init() {
  if (!moving()) return;
  reveal();
  tilt();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
