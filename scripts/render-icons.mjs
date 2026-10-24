// Draws the inventory icon of items (128 px PNG, transparent) from their real models and textures, in a headless browser,
// with the same model reader as the 3D views of the site (src/lib/mcmodel.js).
//
//   node scripts/render-icons.mjs
//       icons of every item of the mod, from public/mc (run after the import)
//   node scripts/render-icons.mjs --assets <jar assets folder> --vendor
//       maintainer step, needs the Mekanism and Minecraft jars unzipped: also draws the icons of the Mekanism and vanilla
//       items the recipes use, and copies into public/mc/{mekanism,minecraft} the few files the mod's models borrow
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const NS = 'mekanismengineering';
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const ASSETS = arg('--assets'), VENDOR = process.argv.includes('--vendor');
const PUB = path.join(ROOT, 'public');

// items whose inventory picture is drawn in code (builtin/entity): the block model they show
const ENTITY_MODEL = {
  'mekanism:basic_energy_cube': 'mekanism:block/energy_cube/basic', 'mekanism:advanced_energy_cube': 'mekanism:block/energy_cube/advanced',
  'mekanism:elite_energy_cube': 'mekanism:block/energy_cube/elite', 'mekanism:ultimate_energy_cube': 'mekanism:block/energy_cube/ultimate',
  'mekanism:basic_fluid_tank': 'mekanism:block/fluid_tank', 'mekanism:ultimate_fluid_tank': 'mekanism:block/fluid_tank',
};

// ---------- files: the mod from public/mc, the rest from public/mc or the jars ----------
const served = new Set();
function fileFor(urlPath) {
  const m = urlPath.match(/^\/mc\/([a-z0-9_]+)\/(.+)$/);
  if (m) {
    const local = path.join(PUB, 'mc', m[1], m[2]);
    if (m[1] === NS || !ASSETS) return local;
    const jar = path.join(ASSETS, m[1], m[2]);
    if (fs.existsSync(jar)) { served.add(m[1] + '/' + m[2]); return jar; }
    return local;
  }
  if (urlPath.startsWith('/three/')) return path.join(ROOT, 'node_modules/three/build', urlPath.slice(7));
  if (urlPath.startsWith('/lib/')) return path.join(ROOT, 'src/lib', urlPath.slice(5));
  return null;
}
const TYPES = { '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.html': 'text/html' };
const PAGE = `<!doctype html><meta charset="utf-8"><canvas id="c" width="128" height="128"></canvas>
<script type="importmap">{"imports":{"three":"/three/three.module.js"}}</script>
<script type="module">
import * as THREE from 'three';
import { loadModel, buildBlock, flatItem, guiTransform } from '/lib/mcmodel.js';
const base = '/mc', canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(128, 128, false); renderer.setClearColor(0, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
const cam = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10, 10); cam.position.z = 5;
window.renderIcon = async (id, entityModel) => {
  const [ns, p] = id.split(':');
  let model = await loadModel(base, ns + ':item/' + p);
  const item = await (await fetch(base + '/' + ns + '/models/item/' + p + '.json')).json();
  if (model.entity) {
    if (!entityModel) return null;
    const shown = await loadModel(base, entityModel);
    model = { ...shown, display: { ...shown.display, ...model.display } };
  }
  if (model.generated) return (await flatItem(base, model, 128)).toDataURL('image/png');
  const obj = await buildBlock(base, model, { id: item.parent && item.parent.includes(':') ? item.parent : null });
  if (!obj.children.length) return null;
  const scene = new THREE.Scene(), g = new THREE.Group();
  g.add(obj); g.applyMatrix4(guiTransform(model)); scene.add(g);
  renderer.render(scene, cam);
  return canvas.toDataURL('image/png');
};
// loads every model a blockstate can use, so that the files they borrow are known
window.touchBlockstates = async ids => {
  for (const id of ids) {
    const bs = await (await fetch(base + '/${NS}/blockstates/' + id + '.json')).json();
    const all = Object.values(bs.variants || {}).flat().concat((bs.multipart || []).flatMap(m => [m.apply].flat()));
    for (const v of all) await buildBlock(base, v.model);
  }
};
// the whole refinery (assembled, and each layer alone) for the cards and the layer buttons
window.renderRefinery = async (only, w, h) => {
  const { buildRefinery, arrange } = await import('/lib/refinery.js');
  const r = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  r.setSize(w, h, false); r.setClearColor(0, 0); r.outputColorSpace = THREE.SRGBColorSpace;
  const { root, blocks } = await buildRefinery(base, { accelerators: 8, module: true });
  arrange(blocks, { gap: 0 });
  if (only) for (const b of blocks) if (b.userData.dy + 1 !== only) root.remove(b);
  const scene = new THREE.Scene(); scene.add(root);
  const yaw = 35 * Math.PI / 180, pitch = 32 * Math.PI / 180;
  const box = new THREE.Box3().setFromObject(root), ctr = box.getCenter(new THREE.Vector3());
  const c = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  c.position.copy(ctr).add(new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(30));
  c.lookAt(ctr); c.updateMatrixWorld();
  const pts = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z])
    pts.push(new THREE.Vector3(x, y, z).applyMatrix4(c.matrixWorldInverse));
  const mnx = Math.min(...pts.map(p => p.x)), mxx = Math.max(...pts.map(p => p.x)), mny = Math.min(...pts.map(p => p.y)), mxy = Math.max(...pts.map(p => p.y));
  const s = Math.max((mxx - mnx) / w, (mxy - mny) / h) * 1.06, cx = (mnx + mxx) / 2, cy = (mny + mxy) / 2;
  Object.assign(c, { left: cx - w * s / 2, right: cx + w * s / 2, top: cy + h * s / 2, bottom: cy - h * s / 2 }); c.updateProjectionMatrix();
  r.render(scene, c);
  const url = r.domElement.toDataURL('image/png'); r.dispose(); return url;
};
window.READY = true;
</script>`;
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (u === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(PAGE); }
  const f = fileFor(u);
  if (!f || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise(ok => server.once('listening', ok));
const port = server.address().port;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') console.log('  page:', m.text()); });
page.on('pageerror', e => console.log('  page error:', e.message));
await page.goto(`http://127.0.0.1:${port}/`);
await page.waitForFunction(() => window.READY);

async function draw(ids) {
  let ok = 0;
  for (const id of ids) {
    const [ns, p] = id.split(':');
    let url = null;
    try { url = await page.evaluate(([i, e]) => window.renderIcon(i, e), [id, ENTITY_MODEL[id] || null]); } catch (e) { console.log('  failed', id, e.message.split('\n')[0]); }
    if (!url) { console.log('  no icon for', id); continue; }
    const out = path.join(PUB, 'icons', ns, p + '.png');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
    ok++;
  }
  return ok;
}

// 1. the mod's own items (and, for the vendor step, every model its blocks use)
const modItems = fs.readdirSync(path.join(PUB, 'mc', NS, 'models/item')).filter(f => f.endsWith('.json')).map(f => `${NS}:${f.slice(0, -5)}`);
fs.rmSync(path.join(PUB, 'icons', NS), { recursive: true, force: true });
console.log(`Mod icons: ${await draw(modItems)} / ${modItems.length}`);
for (const [only, file, w, h] of [[0, '_refinery', 720, 420], [1, '_layer1', 320, 140], [2, '_layer2', 320, 140], [3, '_layer3', 320, 140], [4, '_layer4', 320, 140]]) {
  const url = await page.evaluate(([o, w, h]) => window.renderRefinery(o, w, h), [only, w, h]);
  fs.writeFileSync(path.join(PUB, 'icons', NS, file + '.png'), Buffer.from(url.split(',')[1], 'base64'));
}
console.log('Refinery pictures: assembled and 4 layers');
if (VENDOR) {
  await page.evaluate(ids => window.touchBlockstates(ids), fs.readdirSync(path.join(PUB, 'mc', NS, 'blockstates')).map(f => f.slice(0, -5)));
  for (const rel of served) {
    const to = path.join(PUB, 'mc', rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(ASSETS, rel), to);
  }
  console.log(`Vendored ${served.size} Mekanism and Minecraft files the mod's models use`);
  // 2. the Mekanism and vanilla items the recipes show
  const recipes = JSON.parse(fs.readFileSync(path.join(PUB, 'data/recipes.json'), 'utf8'));
  const other = new Set();
  for (const r of Object.values(recipes)) for (const k of Object.values(r.key)) if (k.show && !k.show.startsWith(NS + ':')) other.add(k.show);
  console.log(`Ingredient icons: ${await draw([...other].sort())} / ${other.size}`);
}
await browser.close();
server.close();
