// The small controls under a block's 3D view (Idle / Running, fluid choice...). One bar per view, made when a block needs one.
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** The bar under the view; made once. In a page header it spans the header's whole width, under the text and the view. */
export function bar(host) {
  const parent = host.closest('.me-head') || host.parentElement;
  let el = parent.querySelector(':scope > .me-anim-bar');
  if (!el) { el = document.createElement('div'); el.className = 'me-anim-bar not-content'; parent.append(el); }
  return el;
}

/**
 * A group of buttons of which one is on (a segmented control). `items` are [value, label] pairs; `onChange(value)` runs on
 * each choice. Returns `{ set(value) }` to change it from code (no callback). `label` names the group for screen readers.
 */
export function choice(host, label, items, value, onChange) {
  const g = document.createElement('div');
  g.className = 'me-seg me-anim-seg'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
  g.innerHTML = items.map(([v, text, dot]) => `<button type="button" data-v="${esc(v)}" aria-pressed="false">${dot ? `<i style="background:${dot}"></i>` : ''}${esc(text)}</button>`).join('');
  const set = v => { for (const b of g.children) b.setAttribute('aria-pressed', String(b.dataset.v === String(v))); };
  g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    set(b.dataset.v); onChange(items.find(i => String(i[0]) === b.dataset.v)[0]);
  });
  set(value);
  bar(host).append(g);
  return { set, el: g };
}

/** A line of text under the controls that says what the view shows right now (announced politely). */
export function caption(host, text = '') {
  const p = document.createElement('p');
  p.className = 'me-anim-note'; p.setAttribute('aria-live', 'polite'); p.textContent = text;
  bar(host).append(p);
  return { set: t => { p.textContent = t; } };
}
