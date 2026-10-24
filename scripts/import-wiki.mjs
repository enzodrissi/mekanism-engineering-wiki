// Imports the player wiki of Mekanism: Engineering from its GitLab repository into this site.
// The wiki text stays in GitLab (docs/wiki); this script turns it into Starlight pages, copies the images, the mod's block
// models and textures (for the 3D views), and builds the crafting grids and the in-game texts from the mod's own data files.
//
//   node scripts/import-wiki.mjs                 downloads the public archive of WIKI_REF (default below)
//   WIKI_ARCHIVE=path/to/archive.tar.gz node ... uses a local archive instead
import fs from 'node:fs';
import path from 'node:path';
import { BASE } from '../site.config.mjs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import * as tar from 'tar';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PROJECT = '86415165';
const REF = process.env.WIKI_REF || 'wip/1.2/rqe-ecran';
const NS = 'mekanismengineering';
const GITLAB = 'https://gitlab.com/enzodr/mekanism-engineering';
// edit and source links point to a lasting branch, not to the work branch being imported
const EDIT_REF = process.env.WIKI_EDIT_REF || 'main';

// ---------- 1. archive ----------
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'me-wiki-'));
let archive = process.env.WIKI_ARCHIVE;
if (!archive) {
  archive = path.join(work, 'repo.tar.gz');
  const url = `https://gitlab.com/api/v4/projects/${PROJECT}/repository/archive.tar.gz?sha=${encodeURIComponent(REF)}`;
  console.log('Downloading', url);
  execFileSync('curl', ['-sSfL', '--retry', '4', '-o', archive, url], { stdio: 'inherit' });
}
const KEEP = ['docs/wiki/', 'docs/publication/CURSEFORGE_CHANGELOG_', 'docs/publication/assets/gallery/', 'docs/publication/assets/engineering-avatar.png',
  `src/main/resources/assets/${NS}/`, `src/main/resources/data/${NS}/recipe/`, 'gradle.properties', 'LICENSE'];
await tar.x({ file: archive, cwd: work, filter: p => KEEP.some(k => p.split('/').slice(1).join('/').startsWith(k)) });
const top = fs.readdirSync(work).find(d => fs.statSync(path.join(work, d)).isDirectory());
const SRC = path.join(work, top);
const rd = p => fs.readFileSync(path.join(SRC, p), 'utf8');
const commit = top.split('-').pop();
console.log('Source', REF, commit.slice(0, 8));

// ---------- 2. clean generated folders ----------
const OUT_DOCS = path.join(ROOT, 'src/content/docs');
// every page is made here except the home page and the guides, which are written by hand in this repository
const HAND_WRITTEN = ['index.mdx', 'guides'];
for (const g of fs.existsSync(OUT_DOCS) ? fs.readdirSync(OUT_DOCS) : []) if (!HAND_WRITTEN.includes(g)) fs.rmSync(path.join(OUT_DOCS, g), { recursive: true, force: true });
const PUB = path.join(ROOT, 'public');
for (const g of ['wiki-images', 'gallery', `mc/${NS}`, 'data']) fs.rmSync(path.join(PUB, g), { recursive: true, force: true });
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };
const copyDir = (from, to) => fs.existsSync(from) && fs.cpSync(from, to, { recursive: true });

// ---------- 3. data the pages and the 3D views use ----------
copyDir(path.join(SRC, 'docs/wiki/images'), path.join(PUB, 'wiki-images'));
copyDir(path.join(SRC, 'docs/publication/assets/gallery'), path.join(PUB, 'gallery'));
// the mod's avatar (its CurseForge picture) is the site's logo and icon
const avatar = path.join(SRC, 'docs/publication/assets/engineering-avatar.png');
fs.mkdirSync(path.join(ROOT, 'src/assets'), { recursive: true });
await sharp(avatar).resize(160, 160, { kernel: 'nearest' }).png().toFile(path.join(ROOT, 'src/assets/logo.png'));
await sharp(avatar).resize(64, 64, { kernel: 'nearest' }).png().toFile(path.join(PUB, 'favicon.png'));
const A = path.join(SRC, `src/main/resources/assets/${NS}`);
for (const d of ['models', 'blockstates', 'textures']) copyDir(path.join(A, d), path.join(PUB, `mc/${NS}`, d));
const lang = JSON.parse(rd(`src/main/resources/assets/${NS}/lang/en_us.json`));
const vendorNames = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/item-names.json'), 'utf8'));
const props = Object.fromEntries(rd('gradle.properties').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())));

const nameOf = id => {
  const [ns, p] = id.split(':');
  return lang[`block.${ns}.${p}`] || lang[`item.${ns}.${p}`] || vendorNames[id] || p.replace(/_/g, ' ');
};
// a tag shows as one of its items (the one Mekanism makes), named "any ..."
const TAG_ICON = {
  'c:circuits/basic': 'mekanism:basic_control_circuit', 'c:circuits/advanced': 'mekanism:advanced_control_circuit',
  'c:circuits/elite': 'mekanism:elite_control_circuit', 'c:circuits/ultimate': 'mekanism:ultimate_control_circuit',
  'c:ingots/steel': 'mekanism:ingot_steel', 'c:glass_panes': 'minecraft:glass_pane', 'c:dusts/redstone': 'minecraft:redstone',
  'c:pellets/antimatter': 'mekanism:pellet_antimatter', 'mekanism:alloys/atomic': 'mekanism:alloy_atomic',
  'mekanism:alloys/infused': 'mekanism:alloy_infused', 'mekanism:alloys/reinforced': 'mekanism:alloy_reinforced',
  'c:gems/diamond': 'minecraft:diamond', 'c:ingots/gold': 'minecraft:gold_ingot', 'c:ingots/iron': 'minecraft:iron_ingot',
  'c:ingots/osmium': 'mekanism:ingot_osmium',
};
const iconUrl = id => { const [ns, p] = id.split(':'); return `${BASE}/icons/${ns}/${p}.png`; };
// the mod's icons are drawn after the import from its item models (scripts/render-icons.mjs); the others are in the repository
const hasIcon = id => { const [ns, p] = id.split(':');
  return ns === NS ? fs.existsSync(path.join(PUB, `mc/${NS}/models/item`, p + '.json')) : fs.existsSync(path.join(PUB, 'icons', ns, p + '.png')); };

const recipes = {};
const RDIR = path.join(SRC, `src/main/resources/data/${NS}/recipe`);
for (const f of fs.readdirSync(RDIR)) {
  if (!f.endsWith('.json')) continue;
  const r = JSON.parse(fs.readFileSync(path.join(RDIR, f), 'utf8'));
  if (!r.pattern || !r.key) continue;
  const key = {};
  for (const [k, v] of Object.entries(r.key)) {
    const ing = Array.isArray(v) ? v[0] : v;
    key[k] = ing.tag ? { tag: ing.tag, show: TAG_ICON[ing.tag] || null, name: 'any ' + (TAG_ICON[ing.tag] ? nameOf(TAG_ICON[ing.tag]) : ing.tag) }
      : { item: ing.item, show: ing.item, name: nameOf(ing.item) };
  }
  recipes[f.replace('.json', '')] = { pattern: r.pattern, key, result: r.result.id, count: r.result.count || 1, name: nameOf(r.result.id) };
}
write(path.join(PUB, 'data/recipes.json'), JSON.stringify(recipes));

// ---------- 4. HTML blocks generated from the data files ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function slot(ing) {
  if (!ing) return '<span class="me-slot"></span>';
  const img = ing.show && hasIcon(ing.show) ? `<img src="${iconUrl(ing.show)}" alt="" loading="lazy" decoding="async">` : `<b>${esc(ing.name.replace(/^any /, '').slice(0, 2))}</b>`;
  return `<span class="me-slot" tabindex="0" data-name="${esc(ing.name)}">${img}</span>`;
}
function recipeHtml(id) {
  const r = recipes[id]; if (!r) return '';
  const rows = r.pattern.length === 1 && r.pattern[0].length === 1 ? ['   ', ` ${r.pattern[0]} `, '   '] : r.pattern.map(p => p.padEnd(3));
  while (rows.length < 3) rows.push('   ');
  const cells = rows.flatMap(row => [...row].map(c => (c === ' ' ? null : r.key[c])));
  const counts = {};
  for (const c of cells) if (c) counts[c.name] = (counts[c.name] || 0) + 1;
  const legend = Object.entries(counts).map(([n, k]) => `<li><span>${k} ×</span> ${esc(n)}</li>`).join('');
  return `<div class="me-recipe not-content"><div class="me-grid">${cells.map(slot).join('')}</div><span class="me-arrow">→</span>`
    + `<span class="me-slot me-out" tabindex="0" data-name="${esc(r.name)}">${hasIcon(r.result) ? `<img src="${iconUrl(r.result)}" alt="">` : ''}${r.count > 1 ? `<i>${r.count}</i>` : ''}</span>`
    + `<ul class="me-legend">${legend}</ul></div>`;
}
// what the game itself says about an item: its description, its tooltips and its JEI information page
function gameTexts(ids) {
  const out = [];
  for (const id of ids) {
    const [, p] = id.split(':');
    const items = [];
    const d = lang[`description.${NS}.${p}`]; if (d) items.push(['Description (hold Shift)', d]);
    for (const [k, v] of Object.entries(lang)) if (k.startsWith(`tooltip.${NS}.${p}.`) && !v.includes('%')) items.push(['Tooltip', v]);
    const heads = { role: 'Role', supply: 'Supply', result: 'Result', know: 'Good to know', craft: 'Before crafting' };
    for (const [k, v] of Object.entries(lang)) {
      const m = k.match(new RegExp(`^jei\\.${NS}\\.info\\.${p}\\.(\\w+)\\.\\d+$`));
      if (m && !v.includes('%')) items.push([`JEI · ${heads[m[1]] || m[1]}`, v]);
    }
    if (items.length) out.push(`<details class="me-texts"><summary>${hasIcon(id) ? `<img src="${iconUrl(id)}" alt="" loading="lazy">` : ''}${esc(nameOf(id))}</summary><dl>${items.map(([h, t]) => `<dt>${esc(h)}</dt><dd>${esc(t).replace(/\n/g, '<br>')}</dd>`).join('')}</dl></details>`);
  }
  return out.length ? `\n\n## In-game texts\n\nWhat the game itself shows for ${ids.length > 1 ? 'these items' : 'this item'}: the description under Shift, the tooltips and the JEI information page, word for word.\n\n<div class="not-content">${out.join('')}</div>\n` : '';
}

// ---------- 5. pages ----------
// every page is at /wiki/<to>/; the machines are grouped by family in the sidebar (src/data/sidebar.json)
const FAMILIES = { 'ore-refining': 'Ore refining', mining: 'Mining', 'quantum-network': 'Quantum network', teleportation: 'Teleportation',
  charging: 'Charging', 'fluids-and-rocks': 'Fluids and rocks', logistics: 'Logistics' };
const PAGES = {
  'Home': { to: 'overview', order: 1, title: 'Overview' },
  'Getting-Started': { to: 'getting-started', order: 2, title: 'Getting started' },
  'FAQ': { to: 'faq', order: 9, description: 'Answers to the questions players ask most.' },
  'Configuration': { to: 'configuration', order: 1 },
  'JEI-Jade-WTHIT': { to: 'jei-jade-wthit', order: 2 },
  'Quantum-Ore-Refinery': { to: 'quantum-ore-refinery', family: 'ore-refining', order: 1, ids: ['ore_refinery_controller'], structure: true, quantum: true, isNew: true },
  'Quantum-Ore-Refinery-Structure': { to: 'quantum-ore-refinery/structure', family: 'ore-refining', order: 2, title: 'Structure and parts', structure: true,
    ids: ['ore_refinery_casing', 'ore_refinery_pillar', 'ore_refinery_girder', 'ore_refinery_conveyor', 'ore_refinery_glass', 'ore_refinery_input_port',
      'ore_refinery_output_port', 'ore_refinery_energy_port', 'ore_refinery_accelerator', 'ore_refinery_tank_sulfuric_acid', 'ore_refinery_tank_water',
      'ore_refinery_tank_hydrogen_chloride', 'ore_refinery_tank_oxygen', 'ore_refinery_module_dissolution', 'ore_refinery_module_washing',
      'ore_refinery_module_crystallization', 'ore_refinery_module_injection', 'ore_refinery_module_purification', 'ore_refinery_module_enrichment',
      'ore_refinery_module_smelting', 'ore_refinery_module_quantum'] },
  'Quantum-Digital-Miner': { to: 'quantum-digital-miner', family: 'mining', order: 1, ids: ['quantum_digital_miner'], quantum: true, model: 'quantum_digital_miner' },
  'Digital-Miner-Companion': { to: 'digital-miner-companion', family: 'mining', order: 2, ids: ['digital_miner_surveyor'] },
  'Quantum-Energy-Receiver': { to: 'quantum-energy-receiver', family: 'quantum-network', order: 1, quantum: true, model: 'ultimate_quantum_energy_receiver',
    ids: ['basic_quantum_energy_receiver', 'advanced_quantum_energy_receiver', 'elite_quantum_energy_receiver', 'ultimate_quantum_energy_receiver'] },
  'Radioactive-Quantum-Entangloporter': { to: 'radioactive-quantum-entangloporter', family: 'quantum-network', order: 2, quantum: true, ids: ['radioactive_quantum_entangloporter'], photo: true },
  'Quantum-Network-Controller': { to: 'quantum-network-controller', family: 'quantum-network', order: 3, quantum: true, ids: ['quantum_network_controller'], photo: true },
  'Quantum-Network-Tablet': { to: 'quantum-network-tablet', family: 'quantum-network', order: 4, quantum: true, isNew: true, ids: ['quantum_network_tablet'] },
  'Quantum-Portable-Teleporter': { to: 'quantum-portable-teleporter', family: 'teleportation', order: 1, quantum: true, ids: ['quantum_portable_teleporter'] },
  'Quantum-Chargepad': { to: 'quantum-chargepad', family: 'charging', order: 1, quantum: true, ids: ['quantum_chargepad'], model: 'quantum_chargepad' },
  'Quantum-Fluid-Pump': { to: 'industrial-fluid-pump', family: 'fluids-and-rocks', order: 1, ids: ['quantum_fluid_pump', 'source_stabilizer_upgrade'], model: 'quantum_fluid_pump' },
  'Petrogenic-Synthesizer': { to: 'petrogenic-synthesizer', family: 'fluids-and-rocks', order: 2, ids: ['petrogenic_synthesizer'], model: 'petrogenic_synthesizer' },
  'Petrogenic-Synthesis-Plant': { to: 'petrogenic-synthesis-plant', family: 'fluids-and-rocks', order: 3, ids: ['petrogenic_synthesis_plant', 'hydro_condenser_upgrade', 'magma_synthesizer_upgrade'], model: 'petrogenic_synthesis_plant' },
  'Precision-Logistical-Distributor': { to: 'precision-logistical-distributor', family: 'logistics', order: 1, ids: ['precision_logistical_distributor'], model: 'precision_logistical_distributor' },
  'Precision-Upgrade-Controller': { to: 'precision-upgrade-controller', family: 'logistics', order: 2, ids: ['precision_upgrade_controller'], model: 'precision_upgrade_controller' },
};
// the recipe of each item, by the id the wiki uses for its recipe image (images/<id>-recipe.png)
const RECIPE_FOR_IMAGE = { digital_miner_companion: 'digital_miner_companion', quantum_energy_receiver: 'basic_quantum_energy_receiver' };
const link = {};
for (const [from, p] of Object.entries(PAGES)) link[from + '.md'] = `${BASE}/${p.to}/`;

// versions whose public notes are final (a draft says so in its text)
const changelogs = fs.readdirSync(path.join(SRC, 'docs/publication')).filter(f => /^CURSEFORGE_CHANGELOG_\d/.test(f));
const ver = f => f.match(/_(\d[\d.]*)\.md$/)[1];
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); return 0; };
const isDraft = v => /BROUILLON|NON PUBLIÉ|\bTBD\b/.test(rd(`docs/publication/CURSEFORGE_CHANGELOG_${v}.md`));
const drafts = changelogs.map(ver).filter(v => cmp(v, '1.0.0') >= 0 && isDraft(v) && process.env.INCLUDE_DRAFT_CHANGELOG !== '1');
const published = changelogs.map(ver).filter(v => cmp(v, '1.0.0') >= 0 && (!isDraft(v) || process.env.INCLUDE_DRAFT_CHANGELOG === '1')).sort(cmp).reverse();

function rewrite(md, from, pageIds = null) {
  // links between pages, to anchors and to files of the GitLab repository
  md = md.replace(/\]\(([^)\s]+?)\)/g, (all, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all;
    const [file, anchor] = href.split('#');
    const name = path.basename(file);
    if (link[name]) return `](${link[name]}${anchor ? '#' + anchor : ''})`;
    if (file.startsWith('images/')) return `](${BASE}/wiki-images/${file.slice(7)})`;
    const rel = file.match(/releases\/(\d[\d.]*)\.md$/);
    if (rel) { const v = published.find(x => x === rel[1] || x === rel[1] + '.0'); return `](${BASE}/changelog/${v ? v.replace(/\./g, '-') + '/' : ''})`; }
    return `](${GITLAB}/-/blob/${EDIT_REF}/docs/wiki/${href})`;
  });
  // a recipe image followed by its pattern block becomes a crafting grid made from the mod's recipe file
  md = md.replace(/!\[[^\]]*\]\([^)]*\/wiki-images\/([a-z_]+)-recipe\.png\)\s*\n+```\n[\s\S]*?```\n((?:\n?- `.`: .*\n)*)/g, (all, id) => {
    const rid = recipes[id] ? id : RECIPE_FOR_IMAGE[id];
    return recipes[rid] ? recipeHtml(rid) + '\n' : all;
  });
  // a pattern block alone: the page's recipes with exactly that pattern (several tiers share one)
  md = md.replace(/```\n((?:[A-Z ]{1,3}\n){1,3})```\n((?:\n?- `.`: .*\n)*)/g, (all, block, legend) => {
    const pattern = block.trim().split('\n').join('|');
    const ids = (pageIds || []).filter(i => recipes[i] && recipes[i].pattern.join('|') === pattern);
    if (!ids.length) return all;
    if (ids.length === 1) return recipeHtml(ids[0]) + '\n';
    return ids.map(i => `**${nameOf(recipes[i].result)}**\n\n${recipeHtml(i)}\n`).join('\n') + legend;
  });
  return md;
}

let written = 0;
for (const [from, p] of Object.entries(PAGES)) {
  const file = path.join(SRC, 'docs/wiki', from + '.md');
  if (!fs.existsSync(file)) { console.warn('missing', from); continue; }
  let md = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->\n?/g, '');
  const h1 = md.match(/^# (.+)$/m); const title = p.title || (h1 ? h1[1].replace(/:.*/, '').trim() : from);
  md = md.replace(/^# .+\n+/m, '');
  md = md.replace(/(\n\d+\. [^\n]*(?:\n {3}[^\n]*)*\n) {3}(\d+\. )/g, '$1$2');
  const lead = md.match(/^> (.+(?:\n> .+)*)/m);
  const plain = t => t.replace(/\n> /g, ' ').replace(/\n/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*`]/g, '').trim();
  const para = md.match(/^(?!#|>|\||-|!|\d|```|<)([^\n]+(?:\n(?!\n)[^\n]+)*)/m);
  const description = p.description || (lead ? plain(lead[1]) : para ? plain(para[1]).replace(/^(.{40,}?\.)\s.*$/, '$1') : '');
  if (lead && p.ids) md = md.replace(lead[0], '');
  // the main render of a machine page moves into the page header (3D view or render)
  if (p.ids) md = md.replace(/^!\[[^\]]*\]\(images\/[a-z_]+\.png\)\n+/m, '');
  md = rewrite(md, from, p.ids);
  if (from === 'Quantum-Ore-Refinery') {
    md = md.replace(/(The time is `200 × 50\^\(−n\/8\)`[^\n]*\n[^\n]*\n)/, `$1\n<div class="me-qor-calc not-content"></div>\n`);
  }
  if (from === 'Quantum-Ore-Refinery-Structure') {
    md = md.replace(/(## Reading the drawing)/, `<div class="not-content" data-me3d data-kind="refinery" data-mode="layers"></div>\n\n$1`);
  }
  if (p.ids) md += gameTexts(p.ids.map(i => `${NS}:${i}`));
  const fm = ['---', `title: ${JSON.stringify(title)}`, description && `description: ${JSON.stringify(description)}`,
    `sidebar:\n  order: ${p.order}${p.isNew ? "\n  badge:\n    text: New\n    variant: tip" : ''}`,
    p.ids && `machine:\n  id: ${JSON.stringify(p.ids[0])}\n  family: ${JSON.stringify(FAMILIES[p.family])}\n  quantum: ${!!p.quantum}\n  structure: ${!!p.structure}${p.model ? `\n  model: ${JSON.stringify(p.model)}` : ''}${p.isNew ? '\n  isNew: true' : ''}${p.photo ? '\n  photo: true' : ''}`,
    `editUrl: ${JSON.stringify(`${GITLAB}/-/blob/${EDIT_REF}/docs/wiki/${from}.md`)}`,
    '---'].filter(Boolean).join('\n');
  write(path.join(OUT_DOCS, p.to + '.md'), fm + '\n\n' + md.trim() + '\n');
  written++;
}

// the sidebar of the machines: one group per family, in the order above
const machinePages = Object.values(PAGES).filter(p => p.family).sort((a, b) => a.order - b.order);
write(path.join(ROOT, 'src/data/sidebar.json'), JSON.stringify(Object.entries(FAMILIES).map(([f, label]) =>
  ({ label, items: machinePages.filter(p => p.family === f).map(p => p.to) })), null, 1));

// ---------- 6. changelog: only versions whose public notes are final ----------
const sorted = published;
let order = 2;
write(path.join(OUT_DOCS, 'changelog/index.md'), `---
title: "Release notes"
description: "What changed in each version of Mekanism: Engineering."
sidebar:
  order: 1
  label: All versions
---

The notes of every published version, newest first, as posted on CurseForge.
${drafts.length ? `\nThe notes of ${drafts.map(v => 'v' + v).join(', ')} are being written and appear here when it is released.\n` : ''}
${published.map(v => `- [v${v}](${BASE}/changelog/${v.replace(/\./g, '-')}/)`).join('\n')}
`);
for (const v of sorted) {
  let md = rd(`docs/publication/CURSEFORGE_CHANGELOG_${v}.md`);
  md = md.replace(/<!--[\s\S]*?-->\n?/g, '').replace(/^# .+\n+/m, '');
  write(path.join(OUT_DOCS, `changelog/${v.replace(/\./g, '-')}.md`),
    `---\ntitle: ${JSON.stringify('v' + v)}\nsidebar:\n  order: ${order++}\n---\n${rewrite(md, 'changelog').trim()}\n`);
}

// ---------- 7. reference pages made from the data files: every recipe, every in-game text ----------
const pageOf = {};
for (const p of Object.values(PAGES)) for (const i of p.ids || []) pageOf[i] = p.to;
const TIER = { basic: 1, advanced: 2, elite: 3, ultimate: 4 };
const sortKey = id => nameOf(recipes[id].result).replace(/^(Basic|Advanced|Elite|Ultimate) (.*)$/, (m, t, rest) => `${rest} ${TIER[t.toLowerCase()]}`);
const byPage = Object.keys(recipes).sort((a, b) => sortKey(a).localeCompare(sortKey(b)) || recipes[b].pattern.length - recipes[a].pattern.length);
const heading = id => { const r = recipes[id], same = Object.values(recipes).filter(x => x.result === r.result).length > 1;
  const one = Object.values(r.key);
  return nameOf(r.result) + (same && one.length === 1 && r.pattern.length === 1 ? ` (from ${one[0].name})` : ''); };
write(path.join(OUT_DOCS, 'crafting.md'), `---
title: "All crafting recipes"
description: "Every crafting table recipe of the mod, read from its recipe files: hover or tap a slot to see the item."
sidebar:
  order: 3
---

Every recipe below is read from the mod's own recipe files at each update of this site. A slot that accepts any item
of a kind (any steel ingot, any elite circuit...) shows the one Mekanism makes. Hover or tap a slot to see its name.

${byPage.map(id => { const page = pageOf[id] || pageOf[recipes[id].result.split(':')[1]];
  return `## ${heading(id)}\n\n${recipeHtml(id)}\n${page ? `\n[Read the page](${BASE}/${page}/)\n` : ''}`; }).join('\n')}`);
const allIds = [...new Set(Object.values(PAGES).flatMap(p => p.ids || []))];
const texts = gameTexts(allIds.map(i => `${NS}:${i}`));
write(path.join(OUT_DOCS, 'in-game-texts.md'), `---
title: "In-game texts"
description: "The small print of every block and item: the Shift description, the tooltips and the JEI information pages, word for word."
sidebar:
  order: 4
---

The game hides a lot of useful detail in places you only see by looking for it: the description under **Shift** in a
tooltip, the extra tooltip lines, and the **information page** JEI shows for an item (look the item up in JEI). This page
gathers all of them, word for word, from the mod's English language file. Lines that the game fills with live numbers
are left out.
${texts.replace(/^\n\n## In-game texts\n\n[^\n]*\n/, '')}`);

// blocks the 3D views can name: their in-game name and Shift description
const blocks = {};
for (const f of fs.readdirSync(path.join(A, 'blockstates'))) {
  const id = f.replace('.json', '');
  blocks[id] = { name: nameOf(`${NS}:${id}`), text: lang[`description.${NS}.${id}`] || '', page: pageOf[id] || null };
}
write(path.join(PUB, 'data/blocks.json'), JSON.stringify(blocks));

// the five levels of the Quantum Ore Refinery, from the table of its page (Mekanism's recipes for iron ore)
const qor = rd('docs/wiki/Quantum-Ore-Refinery.md');
const levels = [...qor.matchAll(/^\| \*\*x(\d)\*\* \| ([^|]+) \| (\d+) \| ([^|]+) \|$/gm)]
  .map(m => ({ level: +m[1], chain: m[2].trim(), ingots: +m[3], takes: m[4].trim() }));
if (levels.length !== 5) throw new Error('the level table of the Quantum Ore Refinery page changed: ' + levels.length + ' rows');
write(path.join(ROOT, 'src/data/qor-levels.json'), JSON.stringify(levels, null, 1));

// every model, blockstate and texture the 3D views can use, in one file: online, a hundred small files fetched one after
// the other take far too long (src/lib/mcmodel.js reads this file first)
const bundle = {};
const walkMc = dir => {
  for (const f of fs.readdirSync(dir)) {
    const file = path.join(dir, f), rel = path.relative(path.join(PUB, 'mc'), file).split(path.sep).join('/');
    if (fs.statSync(file).isDirectory()) { if (!rel.endsWith('textures/gui')) walkMc(file); continue; }
    bundle[rel] = f.endsWith('.png') ? 'data:image/png;base64,' + fs.readFileSync(file).toString('base64')
      : /\.(json|mcmeta)$/.test(f) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fs.readFileSync(file, 'utf8');
  }
};
walkMc(path.join(PUB, 'mc'));
write(path.join(PUB, 'data/mc.json'), JSON.stringify(bundle));

// the version as the mod's release is named (CurseForge notes "1.2" for a jar numbered 1.2.0)
const shortVersion = props.mod_version.replace(/\.0$/, '');
const modVersion = changelogs.some(f => ver(f) === shortVersion) ? shortVersion : props.mod_version;
write(path.join(ROOT, 'src/data/source.json'), JSON.stringify({ ref: REF, commit, modVersion,
  minecraft: props.minecraft_version, mekanism: props.mekanism_version, imported: new Date().toISOString() }, null, 2));
console.log(`Imported ${written} pages, ${Object.keys(recipes).length} recipes, ${sorted.length} changelog versions checked.`);
fs.rmSync(work, { recursive: true, force: true });
