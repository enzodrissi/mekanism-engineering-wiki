// Draws the section of a big addition (src/lib/features.mjs) as a feature, at build time: the heading and everything under it,
// up to the next heading of the same level, go in a section.me-feature with a "New in 1.2" badge above the heading and, after
// the section's first paragraph, one small card per shortcut. The wiki text itself is kept as it is, under the cards.
import { featuresOf, FILTER_ICON } from './features.mjs';

const text = n => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
const rank = n => (n.type === 'element' && /^h[1-6]$/.test(n.tagName) ? +n.tagName[1] : 0);
// Starlight puts each heading in a div.sl-heading-wrapper with its anchor link, before or after this plugin runs
const headingOf = n => (rank(n) ? n : n.type === 'element' && n.tagName === 'div' && String(n.properties?.className || '').includes('sl-heading-wrapper')
  ? (n.children || []).find(rank) : null);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export default function rehypeFeatures() {
  return (tree, file) => {
    const m = String(file.path || file.history?.[0] || '').replace(/\\/g, '/').match(/content\/docs\/(fr\/)?(.+)\.mdx?$/);
    if (!m) return;
    for (const f of featuresOf(m[2], m[1] ? 'fr' : 'en')) {
      const kids = tree.children;
      const start = kids.findIndex(n => { const h = headingOf(n); return h && text(h).trim() === f.heading; });
      if (start < 0) continue;
      const level = rank(headingOf(kids[start]));
      let end = start + 1;
      while (end < kids.length && !(headingOf(kids[end]) && rank(headingOf(kids[end])) <= level)) end++;
      const body = kids.slice(start + 1, end);
      // the cards come after the section's first paragraph (it says what the two shortcuts are for)
      const firstP = body.findIndex(n => n.type === 'element' && n.tagName === 'p');
      const cards = {
        type: 'raw',
        value: `<div class="me-feature-cards not-content">${f.cards.map(([title, say], i) =>
          `<div class="me-feature-card"><span class="me-feature-num">${i + 1}</span><b>${esc(title)}</b><p>${say}</p></div>`).join('')}</div>`,
      };
      body.splice(firstP < 0 ? 0 : firstP + 1, 0, cards);
      const badge = { type: 'raw', value: `<div class="me-feature-badge not-content"><span class="me-pill">${FILTER_ICON}${esc(f.badge)}</span></div>` };
      kids.splice(start, end - start, {
        type: 'element', tagName: 'section', properties: { className: ['me-feature'] },
        children: [badge, kids[start], ...body],
      });
    }
  };
}
