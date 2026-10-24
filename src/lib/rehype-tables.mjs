// Makes the wiki's tables read well on a phone, at build time:
// - a table with an empty header row (the facts box at the top of a machine page) becomes a facts box without header;
// - a table of sentences with four columns or more becomes a list of cards on narrow screens (each cell keeps its
//   column name in data-label);
// - any other table keeps its columns and scrolls sideways instead of squeezing them.
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
    return;
  }
  const longest = Math.max(0, ...rows.flatMap(r => kids(r, 'td').map(td => text(td).length)));
  if (labels.length >= 4 && longest > 30) {
    addClass(node, 'me-stack');
    for (const r of rows) kids(r, 'td').forEach((td, i) => { td.properties['data-label'] = labels[i] || ''; });
  } else addClass(node, 'me-scroll');
}

export default function rehypeTables() {
  return tree => {
    const walk = n => { if (n.type === 'element' && n.tagName === 'table') table(n); (n.children || []).forEach(walk); };
    walk(tree);
  };
}
