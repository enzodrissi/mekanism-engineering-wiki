// Precision Logistical Distributor. It does NOT sort by item, tag or mod: it shares items among its output faces, in equal shares
// (Balanced) or in shares set per face (Weighted), and a face that cannot take items is skipped. Sources:
//  - common/distribution/DistributionPlanner.java: "smooth weighted round-robin, one unit at a time": every face in the turn adds its
//    weight to its credit, the highest credit (the first on a tie) takes the item and gives back the sum of the weights; a face out of
//    the turn (full, missing) keeps its credit and the others share each item at their own ratio. Equal weights = plain round-robin.
//  - TileEntityDistributor.java: each kind of item keeps its own credits ("Per item type" in the wiki page); changing the mode, a
//    weight or a face role clears them, so the new split starts from the very next item.
//  - client/model/DistributorFaceModel.java: an Input / Output / Input-Output face shows the matching port model (port + glowing LED
//    texture, models/block/precision_logistical_distributor_port_*.json), any other face keeps the facade.
// The LED of the game is a fixed glow (block_light 15) that never changes, so it is not made to blink here.
// Items are the vanilla item textures; the timings (how fast they move, how often one arrives) are only for readability.
import * as THREE from 'three';
import { getTexture } from '../mcmodel.js';
import { caption } from './ui.js';

const NS = 'mekanismengineering';
const KINDS = ['iron_ingot', 'gold_ingot', 'coal', 'redstone', 'copper_ingot'];
// a fixed arrival order in which every kind comes back several times, so each kind's own alternation can be followed
const ARRIVALS = [0, 1, 0, 2, 0, 1, 3, 0, 2, 1, 0, 3, 4, 1, 0, 2];

// faces of the cube in the order of the port models (templates/cube_all_led.json): 6 vertices each
const FACE_ORDER = ['down', 'up', 'north', 'south', 'west', 'east'];
// the faces used by the scene: the input on top, two outputs on the faces the starting camera looks at
const INPUT = 'up';
const OUTPUTS = [
  { face: 'north', dir: [0, 0, -1], name: 'front' },
  { face: 'west', dir: [-1, 0, 0], name: 'side' },
];

const SCENES = {
  balanced: { label: 'Balanced', w: [1, 1], open: [true, true],
    note: 'Balanced: each kind of item is shared evenly, so iron goes to the front, then the side, then the front again.' },
  weighted: { label: 'Weighted 3 : 1', w: [3, 1], open: [true, true],
    note: 'Weighted 3 : 1: the front output takes 3 items out of every 4 of each kind, the side output takes 1.' },
  full: { label: 'Output full', w: [1, 1], open: [true, false],
    note: 'The side output is full, so it is skipped and every item leaves by the front. It gets its share again once it has room.' },
};

// timings in ms and distances in blocks (readability only)
const SPAWN = 600, FALL = 600, DWELL = 300, OUT = 700, SIZE = 0.42;
const TOP = 1.55, MID = 0.5, REACH = 0.95; // start height of the fall, centre of the block, distance of an output item from the centre
const MAX = 8;

export default async function setup({ stage, host, obj, base, still, choice, buildBlock }) {
  // item sprites: shared textures, one material per sprite (its own fade)
  const textures = await Promise.all(KINDS.map(k => getTexture(base, 'minecraft:item/' + k)));

  // ports: the port models of the mod, cut into single faces and laid over the facade face they replace
  const ports = new THREE.Group(); obj.add(ports);
  const role = async (r, faces) => {
    const built = await buildBlock(base, `${NS}:block/precision_logistical_distributor_port_${r}`);
    for (const m of built.children) {
      m.geometry.computeBoundingBox();
      for (const f of faces) {
        const i = FACE_ORDER.indexOf(f), g = new THREE.BufferGeometry();
        for (const [name, a] of Object.entries(m.geometry.attributes)) {
          g.setAttribute(name, new THREE.Float32BufferAttribute(a.array.slice(i * 6 * a.itemSize, (i + 1) * 6 * a.itemSize), a.itemSize));
        }
        const part = new THREE.Mesh(g, m.material);
        part.renderOrder = m.renderOrder;
        ports.add(part);
      }
      m.geometry.dispose();
      // the facade face lies in the same plane: pull the port towards the camera (the glowing LED already is)
      if (!m.material.polygonOffset) { m.material.polygonOffset = true; m.material.polygonOffsetFactor = -1; m.material.polygonOffsetUnits = -1; }
    }
  };
  await role('input', [INPUT]);
  await role('output', OUTPUTS.map(o => o.face));

  // room for the items around the block, so that fitting the view (and "reset") never cuts them off; never drawn
  const pad = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.9, 1.7), new THREE.MeshBasicMaterial());
  pad.position.set(0.5, 0.5, 0.5); pad.visible = false; stage.root.add(pad);
  stage.frame(false, false);

  // the items
  const fx = new THREE.Group(); fx.renderOrder = 5; stage.scene.add(fx);
  const slots = [];
  for (let i = 0; i < MAX; i++) {
    const mat = new THREE.SpriteMaterial({ map: textures[0], transparent: true, depthWrite: false, alphaTest: 0.02 });
    const s = new THREE.Sprite(mat); s.scale.set(SIZE, SIZE, 1); s.renderOrder = 5; s.visible = false; fx.add(s);
    slots.push({ s, mat, on: false, kind: 0, phase: 0, t: 0, out: 0 });
  }

  // the routing: smooth weighted round-robin with its own credits per kind of item
  let scene = SCENES.balanced;
  const credits = KINDS.map(() => [0, 0]);
  const route = kind => {
    const cr = credits[kind];
    let total = 0, best = -1;
    for (let i = 0; i < 2; i++) if (scene.open[i]) { cr[i] += scene.w[i]; total += scene.w[i]; if (best < 0 || cr[i] > cr[best]) best = i; }
    cr[best] -= total;
    return best;
  };

  let clock = 0, next = 0, arrival = 0;
  const reset = () => {
    for (const c of credits) c[0] = c[1] = 0;
    for (const o of slots) { o.on = false; o.s.visible = false; }
    clock = 0; next = 0; arrival = 0;
  };

  /** Moves the scene on by dt ms. */
  const advance = dt => {
    clock += dt;
    if (clock >= next) {
      const o = slots.find(x => !x.on);
      if (o) {
        o.on = true; o.phase = 0; o.t = 0; o.kind = ARRIVALS[arrival++ % ARRIVALS.length]; o.mat.map = textures[o.kind]; o.s.visible = true;
      }
      next = clock + SPAWN;
    }
    for (const o of slots) {
      if (!o.on) continue;
      o.t += dt;
      if (o.phase === 0 && o.t >= FALL) { o.phase = 1; o.t -= FALL; }
      if (o.phase === 1 && o.t >= DWELL) { o.phase = 2; o.t -= DWELL; o.out = route(o.kind); }
      if (o.phase === 2 && o.t >= OUT) { o.on = false; o.s.visible = false; continue; }
      if (o.phase === 0) {
        const k = o.t / FALL;
        o.s.position.set(0.5, TOP + (MID - TOP) * k, 0.5);
        o.mat.opacity = Math.min(1, k * 4);
      } else if (o.phase === 1) {
        o.s.position.set(0.5, MID, 0.5); o.mat.opacity = 1;
      } else {
        const k = o.t / OUT, d = OUTPUTS[o.out].dir;
        o.s.position.set(0.5 + d[0] * REACH * k, MID, 0.5 + d[2] * REACH * k);
        o.mat.opacity = Math.min(1, (1 - k) * 2.5);
      }
    }
  };

  // the choice of scenario
  const note = caption(host, SCENES.balanced.note);
  const pick = id => {
    scene = SCENES[id]; note.set(scene.note);
    reset();
    if (still) { for (let t = 0; t < 2000; t += 50) advance(50); stage.draw(); }
  };
  choice('Distribution', Object.entries(SCENES).map(([id, s]) => [id, s.label]), 'balanced', pick);
  pick('balanced');

  if (!still) stage.live((now, dt) => { advance(dt); return true; }, { fps: 30 });
  stage.draw();
}
