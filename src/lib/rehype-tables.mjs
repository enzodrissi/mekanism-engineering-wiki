// Makes the wiki's tables read well on a phone, at build time:
// - a table with an empty header row (the facts box at the top of a machine page) becomes a facts box without header;
// - a table of sentences with four columns or more, or with three columns of long sentences, becomes a list of cards on
//   narrow screens (each cell keeps its column name in data-label);
// - any other table keeps its columns and scrolls sideways instead of squeezing them; a table of short values only
//   (a row of numbers) keeps narrow columns;
// - every table is put in a card (div.me-tbl, plus me-tbl-facts, me-tbl-stack or me-tbl-scroll) that scrolls sideways when the
//   table is wider than the column, so that the table itself can fill the width and keep its borders.
const text = n => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
const kids = (n, tag) => (n.children || []).filter(c => c.type === 'element' && c.tagName === tag);
const addClass = (n, c) => { n.properties.className = [...(n.properties.className || []), c]; };

function table(node) {
  const head = kids(node, 'thead')[0], body = kids(node, 'tbody')[0];
  const ths = head ? kids(kids(head, 'tr')[0] || {}, 'th') : [];
  const labels = ths.map(th => text(th).trim());
  const rows = body ? kids(body, 'tr') : [];
  if (labels.length && labels.every(l => !l)) {
    node.children = node.children.filter(c => c !== head);
    addClass(node, 'me-facts');
    return 'facts';
  }
  const longest = Math.max(0, ...rows.flatMap(r => kids(r, 'td').map(td => text(td).length)));
  if ((labels.length >= 4 && longest > 30) || (labels.length === 3 && longest > 60)) {
    addClass(node, 'me-stack');
    for (const r of rows) kids(r, 'td').forEach((td, i) => { td.properties['data-label'] = labels[i] || ''; });
    return 'stack';
  }
  addClass(node, 'me-scroll');
  const values = [...labels.slice(1), ...rows.flatMap(r => kids(r, 'td').slice(1).map(text))];
  if (values.length && values.every(v => v.trim().length <= 8)) addClass(node, 'me-narrow');
  return 'scroll';
}

export default function rehypeTables() {
  return tree => {
    const walk = n => (n.children || []).forEach((c, i) => {
      if (c.type === 'element' && c.tagName === 'table') {
        const kind = table(c);
        n.children[i] = { type: 'element', tagName: 'div', properties: { className: ['me-tbl', `me-tbl-${kind}`] }, children: [c] };
      } else walk(c);
    });
    walk(tree);
  };
}
