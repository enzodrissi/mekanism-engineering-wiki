// Imports the player wiki of Mekanism: Engineering from its GitLab repository into this site.
// The wiki text stays in GitLab (docs/wiki); this script turns it into Starlight pages, copies the images, the mod's block
// models and textures (for the 3D views), and builds the crafting grids and the in-game texts from the mod's own data files.
//
//   node scripts/import-wiki.mjs                 downloads the public archive of WIKI_REF, or else of the mod's newest branch (below)
//   WIKI_ARCHIVE=path/to/archive.tar.gz node ... uses a local archive instead
//
// The site is in English (at the root) and in French (under /fr/). The French text of the wiki pages and release notes is
// kept in this repository (i18n/fr/), translated from the GitLab text; each file names the English text it was made from,
// and the import says when the English has changed since. The block names and in-game texts come from the mod's own
// French language file.
import fs from 'node:fs';
import path from 'node:path';
import { BASE } from '../site.config.mjs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import * as tar from 'tar';
import sharp from 'sharp';
import crypto from 'node:crypto';
import GithubSlugger from 'github-slugger';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PROJECT = '86415165';
const API = `https://gitlab.com/api/v4/projects/${PROJECT}`;
const getJson = url => JSON.parse(execFileSync('curl', ['-sSfL', '--retry', '4', url], { encoding: 'utf8', maxBuffer: 64 << 20 }));
/**
 * The site follows the mod's newest work with no setting to change at a release: the branch of the 1.21.1 line committed to
 * last (main, wip/* or release/*; the Minecraft 1.20.1 port branches are left out) that has a wiki. The workflow builds every
 * hour, so a push to the mod shows up within the hour. WIKI_REF, when set, picks a branch or tag instead.
 */
function newestRef() {
  const branches = [];
  for (let page = 1; ; page++) {
    const list = getJson(`${API}/repository/branches?per_page=100&page=${page}`);
    branches.push(...list);
    if (list.length < 100) break;
  }
  const line = branches.filter(b => /^(main$|wip\/|release\/)/.test(b.name) && !/1201|1\.20\.1|mc1\.20(?!\d)/i.test(b.name))
    .sort((a, b) => Date.parse(b.commit.committed_date) - Date.parse(a.commit.committed_date));
  for (const b of line.slice(0, 5)) {
    try { if (getJson(`${API}/repository/tree?path=docs/wiki&per_page=1&ref=${encodeURIComponent(b.name)}`).length) return b.name; }
    catch { /* no docs/wiki on that branch */ }
  }
  throw new Error('No branch of the mod has a wiki (docs/wiki)');
}
const REF = process.env.WIKI_REF || (process.env.WIKI_ARCHIVE ? 'local archive' : newestRef());
const NS = 'mekanismengineering';
const GITLAB = 'https://gitlab.com/enzodr/mekanism-engineering';
const SITE_REPO = 'https://github.com/mekanism-engineering/mekanism-engineering.github.io';
// The 1.2 also ships for Minecraft 1.20.1 with Forge, from a branch of its own whose wiki text is the same. Its requirements,
// read from that branch's gradle.properties and META-INF/mods.toml (wip/1.2/port-1201, 25 Oct 2026):
const MC_1201 = { minecraft: '1.20.1', loader: 'Forge', mekanism: '1.20.1-10.4.16.80', ranges: {
  'Minecraft Java Edition': '1.20.1 exactly', Java: '17', 'Mod loader': 'Forge 47.1.106 up to, but excluding, 47.2',
  Mekanism: '10.4.13 up to, but excluding, 10.4.17' }, rangesFr: {
  'Minecraft Java Edition': '1.20.1 exactement', Java: '17', 'Chargeur de mods': 'Forge 47.1.106 jusqu\'à 47.2 exclu',
  Mekanism: '10.4.13 jusqu\'à 10.4.17 exclu' } };
// the overview names both Minecraft versions, and its table of requirements gets a column for each
// "10.7.15 up to, but excluding, 10.7.20" is shortened so two columns of it stay readable on a phone
const short = range => range.replace(/ up to, but excluding, /, ' to below ');
const MC_TEXT = {
  en: { said: /for Minecraft ([\d.]+) with NeoForge/, also: v => `for Minecraft ${v} with NeoForge and Minecraft ${MC_1201.minecraft} with ${MC_1201.loader}`,
    table: /\| Component \| Accepted range \|\n\|---\|---\|\n((?:\|.*\|\n)+)/, head: 'Component', loader: 'Mod loader', ranges: MC_1201.ranges,
    jar: 'Each Minecraft version has its own jar: take the one made for your game.' },
  fr: { said: /pour Minecraft ([\d.]+) avec NeoForge/, also: v => `pour Minecraft ${v} avec NeoForge et Minecraft ${MC_1201.minecraft} avec ${MC_1201.loader}`,
    table: /\| Composant \| Plage acceptée \|\n\|---\|---\|\n((?:\|.*\|\n)+)/, head: 'Composant', loader: 'Chargeur de mods', ranges: MC_1201.rangesFr,
    jar: 'Chaque version de Minecraft a son propre jar : prendre celui qui correspond à son jeu.' },
};
const addMc1201 = (md, lng = 'en') => {
  if (md.includes(MC_1201.minecraft)) return md;
  const T = MC_TEXT[lng];
  const mc = (md.match(T.said) || [])[1] || '1.21.1';
  const said = md.replace(T.said, T.also(mc));
  return said.replace(T.table, (all, rows) => {
    const out = rows.trim().split('\n').map(r => {
      let [name, range] = r.split('|').slice(1, 3).map(c => c.trim());
      if (name === 'NeoForge') [name, range] = [T.loader, `NeoForge ${range}`];
      return `| ${name} | ${short(range)} | ${short(T.ranges[name] || '—')} |`;
    });
    return `| ${T.head} | Minecraft ${mc} | Minecraft ${MC_1201.minecraft} |\n|---|---|---|\n${out.join('\n')}\n\n${T.jar}\n`;
  });
};
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
const HAND_WRITTEN = ['index.mdx', 'guides', '404.md', 'fr'];
for (const dir of [OUT_DOCS, path.join(OUT_DOCS, 'fr')])
  for (const g of fs.existsSync(dir) ? fs.readdirSync(dir) : []) if (!HAND_WRITTEN.includes(g)) fs.rmSync(path.join(dir, g), { recursive: true, force: true });
const PUB = path.join(ROOT, 'public');
for (const g of ['wiki-images', 'gallery', `mc/${NS}`, 'data']) fs.rmSync(path.join(PUB, g), { recursive: true, force: true });
// "≈" around a lone symbol: the typographic quotes would turn both into closing quotes, so they are written as opening and
// closing quotes here (never inside code or an HTML tag)
const symbolQuotes = md => md.split(/(```[\s\S]*?```|`[^`\n]*`|<[^>\n]+>)/).map((part, i) => (i % 2 ? part : part.replace(/"([^\s"\w]{1,3})"/g, '\u201c$1\u201d'))).join('');
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, file.endsWith('.md') ? symbolQuotes(text) : text); };
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
// the language being written: the pages, recipes and texts below are made once in English, then once in French
let LNG = 'en';
const LANG = { en: lang, fr: JSON.parse(rd(`src/main/resources/assets/${NS}/lang/fr_fr.json`)) };
// Mekanism's and Minecraft's names, from their French language files (Mekanism 10.7.19, Minecraft 1.21.1)
const VENDOR = { en: vendorNames, fr: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/item-names.fr.json'), 'utf8')) };
const pre = () => (LNG === 'fr' ? '/fr' : '');
const props = Object.fromEntries(rd('gradle.properties').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())));

const nameOf = id => {
  const [ns, p] = id.split(':');
  const l = LANG[LNG];
  return l[`block.${ns}.${p}`] || l[`item.${ns}.${p}`] || VENDOR[LNG][id] || lang[`block.${ns}.${p}`] || lang[`item.${ns}.${p}`] || vendorNames[id] || p.replace(/_/g, ' ');
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

const RECIPES = {};
let recipes;
const RDIR = path.join(SRC, `src/main/resources/data/${NS}/recipe`);
// a slot that takes any item of a tag: "any Atomic Alloy", "Alliage atomique (au choix)"
const anyOf = name => (LNG === 'fr' ? `${name} (au choix)` : 'any ' + name);
for (LNG of ['en', 'fr']) {
recipes = RECIPES[LNG] = {};
for (const f of fs.readdirSync(RDIR)) {
  if (!f.endsWith('.json')) continue;
  const r = JSON.parse(fs.readFileSync(path.join(RDIR, f), 'utf8'));
  if (!r.pattern || !r.key) continue;
  const key = {};
  for (const [k, v] of Object.entries(r.key)) {
    const ing = Array.isArray(v) ? v[0] : v;
    key[k] = ing.tag ? { tag: ing.tag, show: TAG_ICON[ing.tag] || null, name: anyOf(TAG_ICON[ing.tag] ? nameOf(TAG_ICON[ing.tag]) : ing.tag) }
      : { item: ing.item, show: ing.item, name: nameOf(ing.item) };
  }
  recipes[f.replace('.json', '')] = { pattern: r.pattern, key, result: r.result.id, count: r.result.count || 1, name: nameOf(r.result.id) };
}
write(path.join(PUB, LNG === 'fr' ? 'data/recipes.fr.json' : 'data/recipes.json'), JSON.stringify(recipes));
}
LNG = 'en'; recipes = RECIPES.en;

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
    const l = LANG[LNG], fr = LNG === 'fr';
    const d = l[`description.${NS}.${p}`]; if (d) items.push([fr ? 'Description (maintenir Maj)' : 'Description (hold Shift)', d]);
    for (const [k, v] of Object.entries(l)) if (k.startsWith(`tooltip.${NS}.${p}.`) && !v.includes('%')) items.push([fr ? 'Infobulle' : 'Tooltip', v]);
    // the headings of the JEI page, as the game names them
    const heads = Object.fromEntries(['role', 'supply', 'result', 'know', 'craft'].map(h => [h, l[`jei.${NS}.info.heading.${h}`]]));
    for (const [k, v] of Object.entries(l)) {
      const m = k.match(new RegExp(`^jei\\.${NS}\\.info\\.${p}\\.(\\w+)\\.\\d+$`));
      if (m && !v.includes('%')) items.push([`JEI · ${heads[m[1]] || m[1]}`, v]);
    }
    if (items.length) out.push(`<details class="me-texts"><summary>${hasIcon(id) ? `<img src="${iconUrl(id)}" alt="" loading="lazy">` : ''}${esc(nameOf(id))}</summary><dl>${items.map(([h, t]) => `<dt>${esc(h)}</dt><dd>${esc(t).replace(/\n/g, '<br>')}</dd>`).join('')}</dl></details>`);
  }
  if (!out.length) return '';
  const intro = LNG === 'fr'
    ? `## Textes du jeu\n\nCe que le jeu affiche pour ${ids.length > 1 ? 'ces objets' : 'cet objet'} : la description sous Maj, les infobulles et la page d'information de JEI, mot pour mot.`
    : `## In-game texts\n\nWhat the game itself shows for ${ids.length > 1 ? 'these items' : 'this item'}: the description under Shift, the tooltips and the JEI information page, word for word.`;
  return `\n\n${intro}\n\n<div class="not-content">${out.join('')}</div>\n`;
}

// ---------- 5. pages ----------
// every page is at /wiki/<to>/; the machines are grouped by family in the sidebar (src/data/sidebar.json)
const FAMILIES = { 'ore-refining': 'Ore refining', mining: 'Mining', 'quantum-network': 'Quantum network', teleportation: 'Teleportation',
  charging: 'Charging', 'fluids-and-rocks': 'Fluids and rocks', logistics: 'Logistics' };
const FAMILIES_FR = { 'ore-refining': 'Raffinage du minerai', mining: 'Minage', 'quantum-network': 'Réseau quantique', teleportation: 'Téléportation',
  charging: 'Recharge', 'fluids-and-rocks': 'Fluides et roches', logistics: 'Logistique' };
// what the French pages say where the English ones are written by this script
const FR_PAGE = { Home: { title: 'Présentation' }, 'Getting-Started': { title: 'Premiers pas' },
  FAQ: { description: 'Les réponses aux questions que les joueurs posent le plus.' }, 'Quantum-Ore-Refinery-Structure': { title: 'Structure et pièces' } };
const FR_SRC = path.join(ROOT, 'i18n/fr');
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
let link = {};
const links = () => Object.fromEntries(Object.entries(PAGES).map(([from, p]) => [from + '.md', `${BASE}${pre()}/${p.to}/`]));

// the text of a page in the language being written: GitLab's for English, i18n/fr/wiki for French (null when it has none)
const sha1 = t => crypto.createHash('sha1').update(t).digest('hex');
const stale = [];
function pageText(from) {
  const en = path.join(SRC, 'docs/wiki', from + '.md');
  if (!fs.existsSync(en)) return null;
  if (LNG === 'en') return fs.readFileSync(en, 'utf8');
  const fr = path.join(FR_SRC, 'wiki', from + '.md');
  if (!fs.existsSync(fr)) return null;
  const text = fs.readFileSync(fr, 'utf8'), made = (text.match(/<!-- source: ([0-9a-f]{40}) -->/) || [])[1];
  if (made !== sha1(fs.readFileSync(en, 'utf8'))) stale.push(from);
  return text;
}
// French headings get French anchors: a link to "#automation" must go to "#automatisation". The two texts have the same
// headings in the same order, so the n-th anchor of the English page is the n-th anchor of the French one.
const headingSlugs = md => {
  const slugger = new GithubSlugger();
  return [...md.replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '').replace(/^# .+$/m, '').matchAll(/^#{2,6} (.+)$/gm)]
    .map(m => slugger.slug(m[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[*`]/g, '').trim()));
};
const ANCHORS = {};
for (const from of Object.keys(PAGES)) {
  const en = path.join(SRC, 'docs/wiki', from + '.md'), fr = path.join(FR_SRC, 'wiki', from + '.md');
  if (!fs.existsSync(en) || !fs.existsSync(fr)) continue;
  const a = headingSlugs(fs.readFileSync(en, 'utf8')), b = headingSlugs(fs.readFileSync(fr, 'utf8'));
  if (a.length !== b.length) console.warn(`${from}: ${a.length} headings in English, ${b.length} in French; links to its sections may miss`);
  ANCHORS[from] = Object.fromEntries(a.map((x, i) => [x, b[i] || x]));
  // the in-game texts that every machine page ends with
  ANCHORS[from]['in-game-texts'] = 'textes-du-jeu';
}
const anchorIn = (from, anchor) => (LNG === 'fr' && anchor && ANCHORS[from] && ANCHORS[from][anchor]) || anchor;
const pageOfFile = name => Object.keys(PAGES).find(f => f + '.md' === name);

// versions whose public notes are final (a draft says so in its text)
// (notes for one Minecraft version only, such as CURSEFORGE_CHANGELOG_1.2-mc1.20.1.md, are not listed yet)
const changelogs = fs.readdirSync(path.join(SRC, 'docs/publication')).filter(f => /^CURSEFORGE_CHANGELOG_\d[\d.]*\.md$/.test(f));
const ver = f => f.match(/_(\d[\d.]*)\.md$/)[1];
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); return 0; };
const isDraft = v => /BROUILLON|NON PUBLIÉ|\bTBD\b/.test(rd(`docs/publication/CURSEFORGE_CHANGELOG_${v}.md`));
const drafts = changelogs.map(ver).filter(v => cmp(v, '1.0.0') >= 0 && isDraft(v) && process.env.INCLUDE_DRAFT_CHANGELOG !== '1');
const published = changelogs.map(ver).filter(v => cmp(v, '1.0.0') >= 0 && (!isDraft(v) || process.env.INCLUDE_DRAFT_CHANGELOG === '1')).sort(cmp).reverse();

function rewrite(md, from, pageIds = null) {
  // links between pages, to anchors and to files of the GitLab repository
  md = md.replace(/\]\(([^)\s]+?)\)/g, (all, href) => {
    if (href.startsWith('#')) return `](#${anchorIn(from, href.slice(1))})`;
    if (/^(https?:|mailto:)/.test(href)) return all;
    const [file, anchor] = href.split('#');
    const name = path.basename(file);
    if (link[name]) { const a = anchorIn(pageOfFile(name), anchor); return `](${link[name]}${a ? '#' + a : ''})`; }
    if (file.startsWith('images/')) return `](${BASE}/wiki-images/${file.slice(7)})`;
    const rel = file.match(/releases\/(\d[\d.]*)\.md$/);
    if (rel) { const v = published.find(x => x === rel[1] || x === rel[1] + '.0'); return `](${BASE}${pre()}/changelog/${v ? v.replace(/\./g, '-') + '/' : ''})`; }
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
for (LNG of ['en', 'fr']) {
recipes = RECIPES[LNG]; link = links();
const fr = LNG === 'fr', OUT = fr ? path.join(OUT_DOCS, 'fr') : OUT_DOCS;
for (const [from, p0] of Object.entries(PAGES)) {
  const text = pageText(from);
  if (text === null) { console.warn('missing', LNG, from); continue; }
  const p = fr ? { ...p0, ...FR_PAGE[from] } : p0;
  let md = text.replace(/<!--[\s\S]*?-->\n?/g, '');
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
  if (from === 'Home') md = addMc1201(md, LNG);
  if (from === 'Quantum-Ore-Refinery') {
    // the speed calculator comes after the paragraph that gives the formula
    md = fr ? md.replace(/(^[^\n]*`200 × 50\^\(−n\/8\)`[^\n]*\n(?:[^\n]+\n)*)/m, `$1\n<div class="me-qor-calc not-content"></div>\n`)
      : md.replace(/(The time is `200 × 50\^\(−n\/8\)`[^\n]*\n[^\n]*\n)/, `$1\n<div class="me-qor-calc not-content"></div>\n`);
  }
  if (from === 'Quantum-Ore-Refinery-Structure') {
    md = md.replace(/(## (Reading the drawing|Lire le plan))/, `<div class="not-content" data-me3d data-kind="refinery" data-mode="layers"></div>\n\n$1`);
  }
  if (p.ids) md += gameTexts(p.ids.map(i => `${NS}:${i}`));
  const fm = ['---', `title: ${JSON.stringify(title)}`, description && `description: ${JSON.stringify(description)}`,
    `sidebar:\n  order: ${p.order}${p.isNew ? `\n  badge:\n    text: ${fr ? 'Nouveau' : 'New'}\n    variant: tip` : ''}`,
    p.ids && `machine:\n  id: ${JSON.stringify(p.ids[0])}\n  family: ${JSON.stringify((fr ? FAMILIES_FR : FAMILIES)[p.family])}\n  quantum: ${!!p.quantum}\n  structure: ${!!p.structure}${p.model ? `\n  model: ${JSON.stringify(p.model)}` : ''}${p.isNew ? '\n  isNew: true' : ''}${p.photo ? '\n  photo: true' : ''}`,
    `editUrl: ${JSON.stringify(fr ? `${SITE_REPO}/edit/main/i18n/fr/wiki/${from}.md` : `${GITLAB}/-/blob/${EDIT_REF}/docs/wiki/${from}.md`)}`,
    '---'].filter(Boolean).join('\n');
  write(path.join(OUT, p.to + '.md'), fm + '\n\n' + md.trim() + '\n');
  written++;
}

// ---------- 6. changelog: only versions whose public notes are final ----------
let order = 2;
const notes = v => {
  if (!fr) return rd(`docs/publication/CURSEFORGE_CHANGELOG_${v}.md`);
  const f = path.join(FR_SRC, 'changelog', v + '.md');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};
const listed = published.filter(v => notes(v) !== null);
write(path.join(OUT, 'changelog/index.md'), fr ? `---
title: "Notes de version"
description: "Ce qui a changé dans chaque version de Mekanism: Engineering."
sidebar:
  order: 1
  label: Toutes les versions
---

Les notes de chaque version publiée, de la plus récente à la plus ancienne, telles que publiées sur CurseForge.
${drafts.length ? `\nLes notes de ${drafts.map(v => 'v' + v).join(', ')} sont en cours d'écriture et apparaîtront ici à sa sortie.\n` : ''}
${listed.map(v => `- [v${v}](${BASE}/fr/changelog/${v.replace(/\./g, '-')}/)`).join('\n')}
` : `---
title: "Release notes"
description: "What changed in each version of Mekanism: Engineering."
sidebar:
  order: 1
  label: All versions
---

The notes of every published version, newest first, as posted on CurseForge.
${drafts.length ? `\nThe notes of ${drafts.map(v => 'v' + v).join(', ')} are being written and appear here when it is released.\n` : ''}
${listed.map(v => `- [v${v}](${BASE}/changelog/${v.replace(/\./g, '-')}/)`).join('\n')}
`);
for (const v of listed) {
  const md = notes(v).replace(/<!--[\s\S]*?-->\n?/g, '').replace(/^# .+\n+/m, '');
  write(path.join(OUT, `changelog/${v.replace(/\./g, '-')}.md`),
    `---\ntitle: ${JSON.stringify('v' + v)}\nsidebar:\n  order: ${order++}\n---\n${rewrite(md, 'changelog').trim()}\n`);
}

// ---------- 7. reference pages made from the data files: every recipe, every in-game text ----------
const pageOf = {};
for (const p of Object.values(PAGES)) for (const i of p.ids || []) pageOf[i] = p.to;
const TIER = { basic: 1, advanced: 2, elite: 3, ultimate: 4 };
const sortKey = id => nameOf(recipes[id].result).replace(/^(Basic|Advanced|Elite|Ultimate) (.*)$/, (m, t, rest) => `${rest} ${TIER[t.toLowerCase()]}`);
const byPage = Object.keys(recipes).sort((a, b) => sortKey(a).localeCompare(sortKey(b), LNG) || recipes[b].pattern.length - recipes[a].pattern.length);
const heading = id => { const r = recipes[id], same = Object.values(recipes).filter(x => x.result === r.result).length > 1;
  const one = Object.values(r.key);
  return nameOf(r.result) + (same && one.length === 1 && r.pattern.length === 1 ? (fr ? ` (à partir de ${one[0].name})` : ` (from ${one[0].name})`) : ''); };
write(path.join(OUT, 'crafting.md'), (fr ? `---
title: "Tous les crafts"
description: "Toutes les recettes d'établi du mod, lues dans ses fichiers de recettes : survoler ou toucher une case pour voir l'objet."
sidebar:
  order: 3
---

Chaque recette ci-dessous est lue dans les fichiers de recettes du mod à chaque mise à jour de ce site. Une case qui accepte
n'importe quel objet d'une sorte (n'importe quel lingot d'acier, n'importe quel circuit d'élite...) montre celui que fait
Mekanism. Survoler ou toucher une case pour voir son nom.
` : `---
title: "All crafting recipes"
description: "Every crafting table recipe of the mod, read from its recipe files: hover or tap a slot to see the item."
sidebar:
  order: 3
---

Every recipe below is read from the mod's own recipe files at each update of this site. A slot that accepts any item
of a kind (any steel ingot, any elite circuit...) shows the one Mekanism makes. Hover or tap a slot to see its name.
`) + `
${byPage.map(id => { const page = pageOf[id] || pageOf[recipes[id].result.split(':')[1]];
  return `## ${heading(id)}\n\n${recipeHtml(id)}\n${page ? `\n[${fr ? 'Lire la page' : 'Read the page'}](${BASE}${pre()}/${page}/)\n` : ''}`; }).join('\n')}`);
const allIds = [...new Set(Object.values(PAGES).flatMap(p => p.ids || []))];
const texts = gameTexts(allIds.map(i => `${NS}:${i}`));
write(path.join(OUT, 'in-game-texts.md'), (fr ? `---
title: "Textes du jeu"
description: "Les petits caractères de chaque bloc et objet : la description sous Maj, les infobulles et les pages d'information de JEI, mot pour mot."
sidebar:
  order: 4
---

Le jeu cache beaucoup de détails utiles là où on ne les voit qu'en les cherchant : la description sous **Maj** dans une
infobulle, les lignes d'infobulle en plus, et la **page d'information** que JEI montre pour un objet (chercher l'objet dans
JEI). Cette page les réunit tous, mot pour mot, depuis le fichier de langue français du mod. Les lignes que le jeu remplit
avec des valeurs en direct sont laissées de côté.
` : `---
title: "In-game texts"
description: "The small print of every block and item: the Shift description, the tooltips and the JEI information pages, word for word."
sidebar:
  order: 4
---

The game hides a lot of useful detail in places you only see by looking for it: the description under **Shift** in a
tooltip, the extra tooltip lines, and the **information page** JEI shows for an item (look the item up in JEI). This page
gathers all of them, word for word, from the mod's English language file. Lines that the game fills with live numbers
are left out.
`) + texts.replace(/^\n\n## [^\n]*\n\n[^\n]*\n/, ''));

// blocks the 3D views can name: their in-game name and Shift description
const blocks = {};
for (const f of fs.readdirSync(path.join(A, 'blockstates'))) {
  const id = f.replace('.json', '');
  blocks[id] = { name: nameOf(`${NS}:${id}`), text: LANG[LNG][`description.${NS}.${id}`] || '', page: pageOf[id] || null };
}
write(path.join(PUB, fr ? 'data/blocks.fr.json' : 'data/blocks.json'), JSON.stringify(blocks));

// the five levels of the Quantum Ore Refinery, from the table of its page (Mekanism's recipes for iron ore)
const qor = pageText('Quantum-Ore-Refinery') || '';
const levels = [...qor.matchAll(/^\| \*\*x(\d)\*\* \| ([^|]+) \| (\d+) \| ([^|]+) \|$/gm)]
  .map(m => ({ level: +m[1], chain: m[2].trim(), ingots: +m[3], takes: m[4].trim() }));
if (levels.length !== 5) { if (fr) console.warn('the level table of the French refinery page has', levels.length, 'rows: the calculator stays in English');
  else throw new Error('the level table of the Quantum Ore Refinery page changed: ' + levels.length + ' rows'); }
write(path.join(ROOT, fr ? 'src/data/qor-levels.fr.json' : 'src/data/qor-levels.json'), JSON.stringify(levels.length === 5 ? levels : [], null, 1));
}
LNG = 'en'; recipes = RECIPES.en;
if (stale.length) console.warn(`The English text changed since the French was made, for: ${[...new Set(stale)].join(', ')}. Update`
  + ' i18n/fr/wiki, then mark it as made from the current English: I18N_STAMP=<Page>,<Page> node scripts/import-wiki.mjs');
// I18N_STAMP=Home,FAQ (or "all"): the French of these pages now follows the English being imported
for (const from of (process.env.I18N_STAMP || '').split(',').filter(Boolean).flatMap(x => (x === 'all' ? Object.keys(PAGES) : [x]))) {
  const fr = path.join(FR_SRC, 'wiki', from + '.md'), en = path.join(SRC, 'docs/wiki', from + '.md');
  if (!fs.existsSync(fr) || !fs.existsSync(en)) { console.warn('cannot stamp', from); continue; }
  const line = `<!-- source: ${sha1(fs.readFileSync(en, 'utf8'))} -->`, text = fs.readFileSync(fr, 'utf8');
  fs.writeFileSync(fr, /^<!-- source: [0-9a-f]{40} -->/.test(text) ? text.replace(/^<!-- source: [0-9a-f]{40} -->/, line) : `${line}\n${text}`);
  console.log('stamped', from);
}

// the sidebar of the machines: one group per family, in the order above, named in both languages
const machinePages = Object.values(PAGES).filter(p => p.family).sort((a, b) => a.order - b.order);
write(path.join(ROOT, 'src/data/sidebar.json'), JSON.stringify(Object.entries(FAMILIES).map(([f, label]) =>
  ({ label, translations: { fr: FAMILIES_FR[f] }, items: machinePages.filter(p => p.family === f).map(p => p.to) })), null, 1));

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
// search engines are kept away until the version the site shows is out, that is once the mod's repository has its tag
// (v1.2, V1.2-1.21.1…): the pages then carry no noindex from the next build on
let released = false;
try {
  const tag = new RegExp(`^v${modVersion.replace(/\./g, '\\.')}(-|$)`, 'i');
  released = getJson(`${API}/repository/tags?per_page=100`).some(t => tag.test(t.name));
} catch (e) { console.warn('Could not read the tags of the mod, the pages stay out of search engines:', e.message); }
console.log(released ? `v${modVersion} is tagged: search engines may index the site` : `v${modVersion} is not tagged yet: noindex`);
write(path.join(ROOT, 'src/data/source.json'), JSON.stringify({ ref: REF, commit, modVersion, released,
  minecraft: props.minecraft_version, mekanism: props.mekanism_version,
  builds: [{ minecraft: props.minecraft_version, loader: 'NeoForge', mekanism: props.mekanism_version }, { minecraft: MC_1201.minecraft, loader: MC_1201.loader, mekanism: MC_1201.mekanism }],
  imported: new Date().toISOString() }, null, 2));
console.log(`Imported ${written} pages, ${Object.keys(recipes).length} recipes, ${published.length} changelog versions checked.`);
fs.rmSync(work, { recursive: true, force: true });
