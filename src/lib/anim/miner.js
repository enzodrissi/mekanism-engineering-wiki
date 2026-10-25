// Quantum Digital Miner. Sources, all in the mod (src/main/java/io/github/enzodr/mekanismengineering/):
// - client/render/QuantumScreen.java: while the machine runs, its wide screen shows textures/block/quantum_digital_miner/screen_run.png with two rows
//   of game text on top (state + share, blocks left, in HIGH 0x96FFF0, or AMBER 0xFFB050 for WARNING) and a bar of full/empty cells (MID 0x64D1C7).
//   Text at scale 2, rows at y 98 and 128, padding 22 / 24, as written there. The text and bar come from common/quantum/ScreenReadout.java
//   (states SEARCHING, MINING, WARNING; RESTING = the resting picture screen.png, which is what a finished zone shows) and lang/en_us.json
//   (gui.mekanismengineering.qdm_screen.*). The server refreshes the figures twice a second (QuantumScreen javadoc). The game's own font is
//   drawn from its real bitmaps (./mcfont.js), glyph widths measured like the game does.
// - client/render/RenderQuantumDigitalMiner.java: zone() draws the Visuals tab box as one translucent white box, x/z from -radius to radius+1 around the
//   block, y from minY to maxY+1 (world Y), with a brightness per face (COLORS: up/down 0.82, north/south 0.8, east/west 0.78).
//   Defaults: TileEntityQuantumDigitalMiner.DEFAULT_RADIUS = 10, DEFAULT_HEIGHT_RANGE = 60 (zone Y 0 to 60, QuantumRegion).
// - client/render/QuantumRelocationEffects.java + RelocationDrawing.java + common/quantum/RelocationTimeline.java: what the machine shows when it moves
//   (charge 30 ticks by default, ServerConfig relocation.chargeTicks): a scan plane sweeps down inside a teal field, wireframe, core; at launch the
//   field collapses and a beacon beam goes up; at the destination the beam comes down and the field "prints" the machine from the bottom up.
//   Not reproduced: sounds, arcs (Mekanism's bolt renderer) and particles, and the field's teleporter-portal sprite (Mekanism's texture, not shipped here).
// - The Digital Miner Companion linked to the machine and its screen (./companion.js), and the "mining finished" notification its owner gets
//   when the zone is done (./qdm-toast.js): the sources are named there.
import * as THREE from 'three';
import { getTexture } from '../mcmodel.js';
import { caption } from './ui.js';
import { L, lang } from '../i18n.js';
import { loadFont, glyph, width, write as writeAt } from './mcfont.js';
import { buildCompanion, companionModel } from './companion.js';
import { qdmToast } from './qdm-toast.js';

const NS = 'mekanismengineering:block/quantum_digital_miner/';
// QuantumScreen.java
const W = 704, H = 160, SCALE = 2, LINE_Y = 98, BAR_Y = 128, PAD = 22, RIGHT_PAD = 24;
const HIGH = '#96fff0', MID = '#64d1c7', AMBER = '#ffb050';
// demo figures: the zone size is not a game fact, only the way the screen writes it
const FOUND = 12000;
const REFRESH = 500;                                // ms, "the server refreshes twice a second"
// the rest lasts long enough for the notification to come and go (0.6 s in, 5 s shown, 0.6 s out) before the next cycle
const SEARCH_MS = 2000, MINE_MS = 14000, REST_MS = 7000;
const write = (g, text, x, y, colour) => writeAt(g, text, x, y, colour, SCALE);
// demo figures of the notification: where the miner stands (drawn at Y 30, see ZONES) and what the cycle mined (all it found)
const SPOT = { x: -120, y: 30, z: 300 };
const STATUS_MS = 1000;                             // DigitalMinerCompanionItem.STATUS_PERIOD: 20 ticks

// ------------------------------------------------------------------------------------------------------------ the readout (ScreenReadout.java)
const group = n => String(n).replace(/\B(?=(\d{3})+$)/g, ' ');       // "a space every three digits"
/** Share already mined, never 100 while a block is left. */
const percentOf = (toMine, found) => (found <= 0 || toMine >= found ? 0 : Math.min(99, Math.round(100 * (found - toMine) / found)));
/** The rows of the screen for a state: 'search' | 'mine' | 'warn'. */
function rows(state, toMine) {
  // the game's own words (gui.mekanismengineering.qdm_screen.*), in the page's language; the font draws them, so plain ASCII only
  if (state === 'search') return { line: L('SEARCHING'), count: L('scanning the zone...'), percent: 0 };
  const percent = percentOf(toMine, FOUND), n = group(toMine);
  return {
    line: state === 'warn' ? L('WARNING · {p} %', { p: percent }) : L('MINING · {p} %', { p: percent }),
    count: toMine === 1 ? L('{n} block left', { n }) : L('{n} blocks left', { n }), percent,
  };
}

// ------------------------------------------------------------------------------------------------------------ the zone (RenderQuantumDigitalMiner.java)
// the miner is drawn at world Y 30 so that the default zone (Y 0 to 60) surrounds it
const ZONES = {
  def: { tall: true, radius: 10, minY: 0, maxY: 60, posY: 30, text: L("Default zone: radius 10 (21 × 21 blocks), height Y 0 to 60. This is the mod's starting setting; the miner is drawn at Y 30. The box is taller than the view: pinch or scroll to zoom out.") },
  small: { radius: 3, minY: 24, maxY: 36, posY: 30, text: L('Small zone, an example setting: radius 3 (7 × 7 blocks), height Y 24 to 36. You can set any radius up to 128.') },
};
const ZONE_SHADE = { x: 0.78, y: 0.82, z: 0.8 };      // COLORS per face pair: east/west, up/down, north/south
const ZONE_ALPHA = 0.12;                              // the game gives 0.78 to 0.82 per face; kept low here so the machine stays visible

// ------------------------------------------------------------------------------------------------------------ the relocation (RelocationTimeline.java)
const CHARGE = 30, LAUNCH = 16, GAP = 12, IMPACT = 8, FORMED = 14, PRINTED = 30, DONE = 40, BEAM_HEIGHT = 96;
const ARRIVE_AT = CHARGE + LAUNCH + GAP, END = ARRIVE_AT + DONE;
const TEAL = 0x64D1C7, LIGHT = 0xC8FFF8;
const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = x => x * x * (3 - 2 * x);

export default async function setup(ctx) {
  const { stage, base, still, active, obj, onObj, host, choice, tween, easeInOut } = ctx;
  const picture = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('missing ' + src)); i.src = src; });
  const MODELS = ['reset', 'done', ...Array.from({ length: 10 }, (_, i) => 'running_' + i)];
  const [runTex, beamTex, comp, qdmIcon] = await Promise.all([
    getTexture(base, NS + 'screen_run'), getTexture(base, 'minecraft:entity/beacon_beam'), buildCompanion(base, MODELS),
    picture(ctx.icon('quantum_digital_miner')), loadFont(base),
  ]);

  // ---------------- the wide screen: one canvas on the screen's face, in front of the model's resting picture
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d'); g.imageSmoothingEnabled = false;
  const screenTex = new THREE.CanvasTexture(canvas);
  screenTex.colorSpace = THREE.SRGBColorSpace; screenTex.magFilter = THREE.NearestFilter; screenTex.minFilter = THREE.NearestFilter; screenTex.generateMipmaps = false;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(44 / 16, 10 / 16),
    new THREE.MeshBasicMaterial({ map: screenTex, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  screen.position.set(0.5, 22 / 16, -14.02 / 16 - 0.002);   // wide_screen of the model: x -14..30, y 17..27, z -14.02 (sixteenths)
  screen.rotation.y = Math.PI;                              // the face looks north, like the model's
  screen.renderOrder = 3; screen.visible = false;
  onObj.add(screen);

  let held = false;                                          // the WARNING state
  let clock = 0, sinceRefresh = REFRESH, painted = '';
  const resting = () => clock >= SEARCH_MS + MINE_MS;
  /** Blocks left at this point of the cycle (one at least until the zone is done). */
  const toMineNow = () => Math.max(1, Math.round(FOUND * (1 - clamp01((clock - SEARCH_MS) / MINE_MS))));
  /** Draws the screen for the cycle's time; returns true when the picture changed. */
  function paint() {
    let state = 'mine', toMine;
    if (clock < SEARCH_MS) state = 'search';
    else if (resting()) { screen.visible = false; const k = 'rest'; const ch = painted !== k; painted = k; return ch; }
    toMine = toMineNow();
    if (held) state = 'warn';
    const r = rows(state, toMine);
    const key = state + r.line + r.count;
    screen.visible = true;
    if (key === painted) return false;
    painted = key;
    const tone = state === 'warn' ? AMBER : HIGH;
    g.clearRect(0, 0, W, H);
    g.drawImage(runTex.image, 0, 0, W, H, 0, 0, W, H);
    write(g, r.line, PAD, LINE_Y, tone);
    write(g, r.count, W - RIGHT_PAD - width(r.count) * SCALE, LINE_Y, tone);
    // cells that fill the bar from side to side, brackets included (QuantumScreen.cells)
    const cells = Math.max(1, Math.floor((W - 2 * PAD - 2 * glyph('[').adv * SCALE) / Math.max(1, glyph('█').adv * SCALE)));
    const filled = state === 'search' ? 0 : Math.round(cells * r.percent / 100);
    write(g, `[${'█'.repeat(filled)}${'░'.repeat(Math.max(0, cells - filled))}]`, PAD, BAR_Y, state === 'warn' ? AMBER : MID);
    screenTex.needsUpdate = true;
    return true;
  }
  function restart() { clock = 0; sinceRefresh = REFRESH; painted = ''; }
  function setHeld(v) {
    held = v;
    // a warning only exists while mining: jump there if the cycle is searching or resting
    if (v && (clock < SEARCH_MS || resting())) clock = SEARCH_MS + MINE_MS * 0.45;
    if (still) { clock = SEARCH_MS + MINE_MS * 0.55; unfinish(); }
    painted = ''; paint(); companionNow(); say();
  }
  if (still) clock = SEARCH_MS + MINE_MS * 0.55;           // reduced motion: a fixed, readable "MINING · 55 %"

  // the captions: what the view shows, what the Companion shows, then (when on) what the zone is
  const note = caption(host, '');
  const compNote = caption(host, '');
  const zoneNote = caption(host, '');

  // ---------------- the Digital Miner Companion linked to the machine (companion.js), standing on the ground in front of its screen
  // Its state as the server computes it for the item (CompanionActions.progress, MinerProgress.of): not ready while the machine has not
  // started, working while it searches (0 %) and while it mines (held up too), done once the zone is mined; mined share in whole percent.
  let compSaid = '';
  function companionNow(ms = 0) {
    // the game's own words for the states (gui.mekanismengineering.companion.status.*)
    let model, status;
    if (!active.on) { model = companionModel('not_ready'); status = L('Not ready'); }
    else if (clock < SEARCH_MS) { model = companionModel('working', 0); status = L('Searching · Running'); }
    else if (resting()) { model = companionModel('done'); status = L('Finished'); }
    else {
      const percent = Math.min(99, Math.floor((FOUND - toMineNow()) * 100 / FOUND));
      model = companionModel('working', Math.floor(percent / 10)); status = L('Ready · Running');
    }
    if (status !== compSaid) {
      compSaid = status;
      compNote.set(L('Digital Miner Companion linked to this miner: {status}. Its screen shows the share mined, by tenths, refreshed every second.', { status }));
    }
    return comp.set(model, ms);
  }
  comp.obj.scale.setScalar(1.4);
  comp.obj.position.set(1.8, 0, -2.3);
  comp.obj.rotation.y = Math.atan2(stage.dir.x, stage.dir.z);   // its screen faces the starting angle of the view
  stage.root.add(comp.obj);
  {
    // the view widens to take it in: from where the camera is to where frame() puts it
    const c = stage.cam, snap = () => ({ pos: c.position.clone(), target: stage.controls.target.clone(), zoom: c.zoom, box: [c.left, c.right, c.top, c.bottom] });
    const a = snap(); stage.frame(true, false); const b = snap();
    const at = t => {
      const k = easeInOut(t);
      c.position.lerpVectors(a.pos, b.pos, k); stage.controls.target.lerpVectors(a.target, b.target, k);
      c.zoom = a.zoom + (b.zoom - a.zoom) * k; [c.left, c.right, c.top, c.bottom] = a.box.map((v, i) => v + (b.box[i] - v) * k);
      c.updateProjectionMatrix(); c.lookAt(stage.controls.target); c.updateMatrixWorld(); stage.draw();
    };
    if (still) at(1); else tween(500, at);
  }

  // ---------------- the notification of the end of the zone (qdm-toast.js), with the game's words in the page's language
  const grouped = FOUND.toLocaleString(lang() === 'fr' ? 'fr-FR' : 'en-US').replace(/[\u202f\u00a0]/g, ' ');   // CompanionNumbers: plain spaces
  const toast = qdmToast(host, { icon: qdmIcon, lines: [
    '> ' + L('Mining finished'), L('X {x} Y {y} Z {z}', SPOT), L('Overworld'),
    FOUND === 1 ? L('{n} block mined', { n: grouped }) : L('{n} blocks mined', { n: grouped }),
  ] });
  let finished = false, endUi = null;                       // reduced motion: the fixed picture of a finished zone is on
  function unfinish() { if (finished) { finished = false; toast.fixed(false); endUi?.set(null); } }

  // ---------------- the mining zone box
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const shade = new Float32Array(24 * 3);
  // BoxGeometry faces: +x, -x, +y, -y, +z, -z, four vertices each
  [ZONE_SHADE.x, ZONE_SHADE.x, ZONE_SHADE.y, ZONE_SHADE.y, ZONE_SHADE.z, ZONE_SHADE.z].forEach((s, f) => shade.fill(s, f * 12, f * 12 + 12));
  const zoneGeo = boxGeo.clone(); zoneGeo.setAttribute('color', new THREE.BufferAttribute(shade, 3));
  const zone = new THREE.Mesh(zoneGeo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: ZONE_ALPHA, depthWrite: false, side: THREE.DoubleSide }));
  zone.renderOrder = 6; zone.visible = false; stage.scene.add(zone);
  // white on a light page would vanish: in the light theme the same box is drawn in a slate tone instead
  const zoneTone = () => {
    const light = document.documentElement.dataset.theme === 'light';
    zone.material.color.setHex(light ? 0x3b5873 : 0xffffff); zone.material.opacity = light ? 0.16 : ZONE_ALPHA; stage.draw();
  };
  new MutationObserver(zoneTone).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  zoneTone();
  const corner = new THREE.Vector3();
  function showZone(key) {
    stage.controls.minZoom = 0.6;
    if (key === 'off') { zone.visible = false; zoneNote.set(''); stage.frame(true); return; }
    const z = ZONES[key];
    // the game insets the box by 0.01 so that nothing z-fights at its edges
    const x0 = -z.radius + 0.01, x1 = z.radius + 1 - 0.01, y0 = z.minY - z.posY + 0.01, y1 = z.maxY + 1 - z.posY - 0.01;
    zone.scale.set(x1 - x0, y1 - y0, x1 - x0); zone.position.set((x0 + x1) / 2, (y0 + y1) / 2, (x0 + x1) / 2);
    zone.visible = true; zoneNote.set(z.text);
    // zoom out so that the whole box is in view (the reader can still pinch in)
    stage.frame(true, false);
    const c = stage.cam, t = stage.controls.target;
    t.copy(zone.position); c.position.copy(t).addScaledVector(stage.dir, 60); c.lookAt(t); c.updateMatrixWorld();
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (const sx of [-0.5, 0.5]) for (const sy of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) {
      corner.set(zone.position.x + sx * zone.scale.x, zone.position.y + sy * zone.scale.y, zone.position.z + sz * zone.scale.z).applyMatrix4(c.matrixWorldInverse);
      minX = Math.min(minX, corner.x); maxX = Math.max(maxX, corner.x); minY = Math.min(minY, corner.y); maxY = Math.max(maxY, corner.y);
    }
    // the whole box if it fits; the 61-block-tall default is cut by the view instead (fitted to its width), so the machine stays readable
    const byWidth = (c.right - c.left) / ((maxX - minX) * 1.1);
    const all = Math.min(byWidth, (c.top - c.bottom) / ((maxY - minY) * 1.1));
    c.zoom = Math.min(1, z.tall ? byWidth : all);
    stage.controls.minZoom = Math.min(0.6, all);
    c.updateProjectionMatrix(); stage.draw();
  }

  // ---------------- the relocation effects, from objects made once
  const solid = (color, extra) => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.DoubleSide, ...extra });
  const mkBox = (mat, order) => { const m = new THREE.Mesh(boxGeo, mat); m.renderOrder = order; m.visible = false; stage.scene.add(m); return m; };
  const fieldM = mkBox(solid(TEAL), 4), planeM = mkBox(solid(LIGHT), 5), coreM = mkBox(solid(LIGHT), 5);
  const wireM = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: TEAL, transparent: true, depthWrite: false }));
  wireM.position.set(0.5, 1.03, 0.5); wireM.scale.set(3.12, 2.06, 3.12); wireM.renderOrder = 5; wireM.visible = false; stage.scene.add(wireM);
  // the beacon beam: a solid square column and a faint wider one, with the vanilla beam texture scrolling up
  const beamTexIn = beamTex.clone(), beamTexOut = beamTex.clone();
  for (const t of [beamTexIn, beamTexOut]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.x = 4; t.needsUpdate = true; }
  const column = new THREE.CylinderGeometry(Math.SQRT2 / 2, Math.SQRT2 / 2, 1, 4, 1, true); column.rotateY(Math.PI / 4);
  const beamIn = new THREE.Mesh(column, new THREE.MeshBasicMaterial({ map: beamTexIn, color: TEAL, alphaTest: 0.1, side: THREE.DoubleSide }));
  const beamOut = new THREE.Mesh(column, new THREE.MeshBasicMaterial({ map: beamTexOut, color: TEAL, transparent: true, opacity: 0.125, depthWrite: false, side: THREE.DoubleSide }));
  for (const b of [beamIn, beamOut]) { b.renderOrder = 4; b.visible = false; stage.scene.add(b); }

  const place = (m, x0, y0, z0, x1, y1, z1) => { m.scale.set(x1 - x0, y1 - y0, z1 - z0); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); };
  function field(bottom, s, a) {
    const half = 1.53 * s, y0 = Math.max(bottom, 1 - 0.99 * s), y1 = 1 + 1.03 * s;
    fieldM.visible = a > 0.01 && y1 - y0 > 0.01 && half > 0.01;
    if (fieldM.visible) { place(fieldM, 0.5 - half, y0, 0.5 - half, 0.5 + half, y1, 0.5 + half); fieldM.material.opacity = Math.min(a, 1); }
  }
  function plane(y, a) {
    planeM.visible = a > 0.01;
    if (planeM.visible) { place(planeM, -1.15, y - 0.03, -1.15, 2.15, y + 0.03, 2.15); planeM.material.opacity = Math.min(a, 1); }
  }
  function core(size, a) {
    coreM.visible = a > 0.01 && size > 0.01;
    if (coreM.visible) { place(coreM, 0.5 - size / 2, 1 - size / 2, 0.5 - size / 2, 0.5 + size / 2, 1 + size / 2, 0.5 + size / 2); coreM.material.opacity = Math.min(a, 1); }
  }
  function wire(a) { wireM.visible = a > 0.01; wireM.material.opacity = Math.min(a, 1); }
  function beam(bottom, height, radius, t) {
    const on = height > 0 && radius > 0.01;
    beamIn.visible = beamOut.visible = on;
    if (!on) return;
    const scroll = (t * 0.2) % 1;                          // BeaconRenderer: the texture runs up a fifth of its height each tick
    beamTexIn.repeat.y = height * (0.5 / radius + 0.5); beamTexIn.offset.y = -scroll;
    beamTexOut.repeat.y = height; beamTexOut.offset.y = -scroll;
    for (const [b, r] of [[beamIn, radius * Math.SQRT2], [beamOut, radius * 2.6]]) { b.scale.set(r, height, r); b.position.set(0.5, bottom + height / 2, 0.5); }
    beamIn.rotation.y = t * 0.0125 * Math.PI - Math.PI / 4;   // the inner column turns 2.25 degrees a tick
  }
  let gone = false;
  function machine(shown) {
    gone = !shown;
    obj.visible = shown && !active.on; onObj.visible = shown && active.on;
  }
  /** One picture of the relocation at `t` game ticks (RelocationDrawing / QuantumRelocationEffects). */
  function fx(t) {
    fieldM.visible = planeM.visible = coreM.visible = wireM.visible = beamIn.visible = beamOut.visible = false;
    if (t < CHARGE) {                                                       // charging in place: the scan sweeps down
      const p = t / CHARGE, sweep = ease(clamp01(p / 0.6)), scan = 2.03 - 2.02 * sweep;
      const pulse = p >= 0.6 ? 0.08 * Math.sin(t * 0.8) : 0;
      field(scan, 1, 0.2 + 0.4 * sweep + pulse);
      if (sweep < 1) plane(scan, 0.85);
      wire(clamp01((p - 0.35) / 0.25) * 0.9);
      if (p >= 0.6) core(0.3 + 0.12 * Math.sin(t * 0.6), 0.95);
      machine(true);
    } else if (t < CHARGE + LAUNCH) {                                       // launch: the field collapses, the beam goes up
      const since = t - CHARGE, collapse = clamp01(1 - since / 6), left = clamp01(1 - since / LAUNCH);
      field(0, collapse, 0.6 * collapse); wire(0.9 * collapse);
      core(0.1 + 0.4 * left, left); beam(1, BEAM_HEIGHT, 0.45 * left, t);
      machine(false);
    } else if (t < ARRIVE_AT) machine(false);                              // the machine is somewhere else
    else {                                                                  // arrival: the beam comes down, the machine is printed
      const a = t - ARRIVE_AT;
      if (a < IMPACT + 8) {
        const bottom = a < IMPACT ? Math.floor(BEAM_HEIGHT * (1 - a / IMPACT)) : 0;
        beam(bottom, BEAM_HEIGHT - bottom, a < IMPACT ? 0.45 : 0.45 * clamp01(1 - (a - IMPACT) / 8), t);
      }
      const form = clamp01(a / 2), print = ease(clamp01((a - FORMED) / (PRINTED - FORMED)));
      if (print < 1) {
        const y = 0.01 + 2.02 * print;
        field(y, 1, (a < IMPACT ? 0.45 : 0.6) * form);
        if (print > 0) plane(y, 0.85);
        wire(0.9 * clamp01((a - IMPACT) / (FORMED - IMPACT)));
      } else {
        const glow = clamp01(1 - (a - PRINTED) / (DONE - PRINTED));
        field(0, 1, 0.3 * glow * glow); wire(0.9 * glow);
      }
      machine(true);
    }
  }
  let reloc = -1;                                                           // game ticks since the start, -1 = not playing
  let relocUi;
  function relocEnd() { reloc = -1; fx(END + 1); fieldM.visible = planeM.visible = wireM.visible = beamIn.visible = beamOut.visible = false; machine(true); relocUi.set(null); say(); stage.draw(); }

  // ---------------- illustration (not a game effect): the mined blocks flowing from the zone into the machine's top port
  // The game shows no such thing; the page says so. Sprites are the vanilla item pictures of what a miner finds.
  const ORES = ['raw_iron', 'raw_gold', 'raw_copper', 'coal', 'diamond', 'redstone', 'lapis_lazuli'];
  const oreTex = await Promise.all(ORES.map(n => getTexture(base, 'minecraft:item/' + n)));
  const FLOW_MS = 2000, PORT = new THREE.Vector3(0.5, 2.06, 0.5), HEART = new THREE.Vector3(0.5, 0, 0.69);
  const bits = oreTex.slice(0, 6).map((tex, i) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.1, depthWrite: false }));
    sp.visible = false; sp.renderOrder = 4; stage.root.add(sp);
    return { sp, from: new THREE.Vector3(), lap: -1, seed: i };
  });
  let flowOn = !still && true;
  function flow(now) {
    for (const b of bits) {
      const u = (now + b.seed * FLOW_MS / bits.length) / FLOW_MS, lap = Math.floor(u), t = u - lap;
      if (lap !== b.lap) {                                   // a new block leaves the zone: a new place on the ring, a new picture
        b.lap = lap;
        const a = ((lap * 7 + b.seed * 3) * 2.399963) % (2 * Math.PI), r = 2.1 + 0.25 * ((lap + b.seed) % 3);
        b.from.set(HEART.x + Math.cos(a) * r, 0.3, HEART.z + Math.sin(a) * r);
        b.sp.material.map = oreTex[(lap + b.seed * 2) % oreTex.length];
      }
      b.sp.position.lerpVectors(b.from, PORT, ease(t));
      b.sp.position.y += 1.4 * Math.sin(Math.PI * t);
      const size = 0.34 * Math.min(1, t * 8) * (t > 0.82 ? (1 - t) / 0.18 : 1);
      b.sp.scale.set(size, size, 1);
      b.sp.visible = size > 0.01;
    }
  }
  function flowHide() { for (const b of bits) b.sp.visible = false; }

  // ---------------- one loop for all of it
  let sinceStatus = 0;
  if (!still) {
    stage.live((now, dt) => {
      let changed = false;
      if (reloc >= 0) {
        reloc += dt / 50;                                                   // a game tick lasts 50 ms
        if (reloc >= END) relocEnd(); else { fx(reloc); changed = true; }
      }
      if (flowOn && active.on && !resting() && clock >= SEARCH_MS) { flow(now); changed = true; } else if (bits[0].sp.visible) { flowHide(); changed = true; }
      if (active.on) {
        const was = resting();
        if (!(held && !resting() && clock >= SEARCH_MS)) clock += dt;       // a held-up miner does not progress
        if (clock >= SEARCH_MS + MINE_MS + REST_MS) clock = 0;
        if (resting() !== was) { if (!was) toast.show(); say(); }          // the last block is mined: the owner is told
        sinceRefresh += dt;
        if (sinceRefresh >= REFRESH) { sinceRefresh = 0; if (paint()) changed = true; }
      }
      sinceStatus += dt;
      if (sinceStatus >= STATUS_MS) { sinceStatus = 0; if (companionNow(now)) changed = true; }
      if (comp.step(now)) changed = true;                                  // the strips of its screen and LED
      toast.step(dt);                                                      // a page element: moving it needs no new picture
      return changed;
    }, { fps: 30 });
  }

  // ---------------- controls and caption
  function say() {
    if (reloc >= 0) { note.set(still ? L('Relocation: the machine charges inside a teal field with a bright core. It then flies up as a beam and is rebuilt at its new place.') : L('Relocating: it scans, charges, flies away as a beam, then is rebuilt from the bottom up.')); return; }
    if (!active.on) { note.set(L('Idle: the wide screen is dark.')); return; }
    if (resting() && !held) {
      note.set(L('Running: the zone is mined. The screen is back on its resting picture, and the owner gets this notification at the top right of the game screen for 5 seconds. The figures are examples.'));
      return;
    }
    note.set(held ? L('Running: mining is held up, so the screen turns amber. The figures are examples.')
      : L('Running: the screen shows the state, the share mined and the blocks left. When the zone is done it goes back to its resting picture. The figures are examples.'));
  }
  if (!still) {
    const flowNote = caption(host, '');
    const sayFlow = () => flowNote.set(flowOn ? L('The ore flowing in is an illustration of the mining, not an effect of the game.') : '');
    choice(L('Mining illustration'), [['on', L('Ore flow: on')], ['off', L('Ore flow: off')]], 'on', v => { flowOn = v === 'on'; sayFlow(); if (!flowOn) { flowHide(); stage.draw(); } });
    sayFlow();
  }
  const heldUi = choice(L('Screen state'), [['ok', L('Screen: mining')], ['warn', L('Screen: warning')]], 'ok', v => setHeld(v === 'warn'));
  endUi = choice(L('End of mining'), [['end', L('Finish the zone')]], null, () => {
    if (held) { held = false; heldUi.set('ok'); }
    if (still) {                                                            // one fixed picture: the zone done, the Companion done, the notification on
      if (finished) { unfinish(); clock = SEARCH_MS + MINE_MS * 0.55; }
      else { if (!active.on) active.set(true); finished = true; clock = SEARCH_MS + MINE_MS; toast.fixed(true); endUi.set('end'); }
    } else {
      if (!active.on) active.set(true);
      clock = SEARCH_MS + MINE_MS - 300;                                    // the last blocks: the cycle then ends by itself
      endUi.set(null);
    }
    painted = ''; paint(); companionNow(); say(); stage.draw();
  });
  endUi.set(null);
  choice(L('Show mining zone'), [['off', L('Zone off')], ['def', L('Default zone')], ['small', L('Small zone')]], 'off', showZone);
  relocUi = choice(L('Relocation'), [['go', L('Relocate')]], null, () => {
    if (still) {                                                            // one fixed picture: the machine charged, field and core shown
      if (reloc < 0) { reloc = CHARGE - 1; fx(reloc); relocUi.set('go'); } else relocEnd();
      say(); stage.draw(); return;
    }
    reloc = 0; fx(0); relocUi.set('go'); say(); stage.draw();
  });
  relocUi.set(null);
  active.onChange(on => {
    if (gone) { obj.visible = false; onObj.visible = false; }
    if (on) { restart(); if (still) clock = SEARCH_MS + MINE_MS * 0.55; paint(); }
    if (still) unfinish();
    companionNow(); say(); stage.draw();
  });
  restart(); if (still) clock = SEARCH_MS + MINE_MS * 0.55;
  paint();
  active.set(true);
  companionNow(); say();
}
setup.active = true;
