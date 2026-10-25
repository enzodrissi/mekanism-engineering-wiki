// Quantum Chargepad. What the game shows, and where it is written:
//  - Idle / Running: blockstates/quantum_chargepad.json switches to models/block/quantum_chargepad_active.json while the pad charges
//    (TileEntityQuantumChargepad.onUpdateServer: active = a player stands on it with an item that takes energy). The idle model uses
//    core_off / elements_off; the active one uses the lit core / elements and adds the glowing base_led, stand_led and core_led.
//  - Sparks: EngineeringBlockTypes.QUANTUM_CHARGEPAD has an AttributeParticleFX with a vanilla dust particle, colour
//    (0.24, 1.0, 0.84), size 1, spawned at (random - 0.5, -0.35, random - 0.5) from the block centre, i.e. on the plate. They are drawn
//    here with the vanilla dust sprites (particles/dust.json: generic_7 down to generic_0 over the life of the particle).
//  - Not simulated: the player. The game gives no model for the player on the pad, so none is drawn.
// The item model of the pad is the active one, so the idle model is built here from block/quantum_chargepad.
import * as THREE from 'three';
import { getTexture } from '../mcmodel.js';
import { caption } from './ui.js';

const COUNT = 28;            // particles at most
const RATE = 6;              // sparks a second; the game's own rate is not in the mod's code (it is Mekanism's), this one is a look
const COLOR = [0.24, 1.0, 0.84];
const SPRITES = 8;           // particles/dust.json lists generic_7 first and generic_0 last

const VERT = `
attribute float aSize; attribute float aFrame; attribute vec3 aColor;
uniform float uPx; varying vec3 vColor; varying float vFrame; varying float vSize;
void main() {
  vColor = aColor; vFrame = aFrame; vSize = aSize;
  gl_PointSize = aSize * uPx;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// colours are the game's own numbers, written to the screen as they are (no conversion), as the game does
const FRAG = `
uniform sampler2D uAtlas; varying vec3 vColor; varying float vFrame; varying float vSize;
void main() {
  if (vSize <= 0.0) discard;
  vec4 t = texture2D(uAtlas, vec2((vFrame + gl_PointCoord.x) / ${SPRITES}.0, 1.0 - gl_PointCoord.y));
  if (t.a < 0.02) discard;
  gl_FragColor = vec4(t.rgb * vColor, t.a);
}`;

export default async function setup(ctx) {
  const { stage, base, active } = ctx;
  const idle = await ctx.buildBlock(base, 'mekanismengineering:block/quantum_chargepad');
  stage.root.add(idle);

  // the 8 vanilla dust sprites side by side in one texture, so that all the sparks are one draw call
  const atlas = document.createElement('canvas'); atlas.width = 8 * SPRITES; atlas.height = 8;
  const g = atlas.getContext('2d');
  for (let k = 0; k < SPRITES; k++) {
    const t = await getTexture(base, `minecraft:particle/generic_${SPRITES - 1 - k}`);
    g.drawImage(t.image, k * 8, 0, 8, 8);
  }
  const tex = new THREE.CanvasTexture(atlas);
  tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false;

  const pos = new Float32Array(COUNT * 3), col = new Float32Array(COUNT * 3), size = new Float32Array(COUNT), frame = new Float32Array(COUNT);
  const age = new Float32Array(COUNT), life = new Float32Array(COUNT), vel = new Float32Array(COUNT * 3), quad = new Float32Array(COUNT), alive = new Uint8Array(COUNT);
  for (let i = 0; i < COUNT; i++) pos.set([0.5, 0.15, 0.5], i * 3); // all inside the block, so the camera framing is not changed
  const geo = new THREE.BufferGeometry();
  const attrs = {
    position: new THREE.BufferAttribute(pos, 3), aColor: new THREE.BufferAttribute(col, 3),
    aSize: new THREE.BufferAttribute(size, 1), aFrame: new THREE.BufferAttribute(frame, 1),
  };
  for (const [k, a] of Object.entries(attrs)) { a.setUsage(THREE.DynamicDrawUsage); geo.setAttribute(k, a); }
  geo.computeBoundingBox(); geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0.5, 0.5, 0.5), 2);
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, uniforms: { uAtlas: { value: tex }, uPx: { value: 100 } } });
  const sparks = new THREE.Points(geo, mat);
  sparks.frustumCulled = false; sparks.renderOrder = 3;
  stage.root.add(sparks);

  /** Starts spark `i`, `done` (0 to 1) of the way through its life. */
  function spawn(i, done = 0) {
    alive[i] = 1;
    life[i] = 8 / (Math.random() * 0.8 + 0.2) * 50;          // vanilla dust: 8 / (random * 0.8 + 0.2) ticks
    age[i] = life[i] * done;
    quad[i] = 0.1 * (Math.random() * 0.5 + 0.5) * 2 * 0.75;   // vanilla dust: half the width of the sprite, in blocks
    const f = Math.random() * 0.4 + 0.6;                      // the shade of each particle
    col.set([COLOR[0] * f, COLOR[1] * f, COLOR[2] * f], i * 3);
    pos.set([Math.random(), 0.15, Math.random()], i * 3);     // (random - 0.5, -0.35, random - 0.5) from the centre of the block
    // a small random drift, which the air slows down (vanilla dust: about 0.006 to 0.018 blocks a tick, times 0.96 each tick)
    let x = Math.random() * 2 - 1, y = Math.random() * 2 - 1, z = Math.random() * 2 - 1;
    const n = Math.hypot(x, y, z) || 1, v = (Math.random() + Math.random() + 1) * 0.15 * 0.4 * 0.1 / n;
    vel.set([x * v, y * v, z * v], i * 3);
    if (done) advance(i, 0);
  }
  /** Moves spark `i` by `dt` ms and sets its size and picture; false when it is over. */
  function advance(i, dt) {
    age[i] += dt;
    if (age[i] >= life[i]) { alive[i] = 0; size[i] = 0; return false; }
    const ticks = dt / 50, slow = Math.pow(0.96, ticks);
    for (let k = 0; k < 3; k++) { pos[i * 3 + k] += vel[i * 3 + k] * ticks; vel[i * 3 + k] *= slow; }
    const t = age[i] / life[i];
    size[i] = quad[i] * 2 * Math.min(1, t * 32);              // it grows over the first 1/32 of its life
    frame[i] = Math.min(SPRITES - 1, Math.floor(t * SPRITES)); // generic_7 first, generic_0 last
    return true;
  }
  const upload = () => { for (const a of Object.values(attrs)) a.needsUpdate = true; };
  const pxPerBlock = () => { const c = stage.cam; return stage.renderer.domElement.height / ((c.top - c.bottom) / c.zoom); };

  // one loop for the sparks, only while the pad runs or sparks are left in the air
  let acc = 0, flying = 0;
  stage.live((now, dt) => {
    if (!active.on && !flying) return false;
    if (active.on) {
      acc += dt / 1000 * RATE;
      while (acc >= 1) { acc -= 1; const i = alive.indexOf(0); if (i >= 0) spawn(i); }
    }
    flying = 0;
    for (let i = 0; i < COUNT; i++) if (alive[i] && advance(i, dt)) flying++;
    upload();
    return true;
  }, { fps: 30 });
  // the pixel size of a spark follows the zoom, also when only the camera moves
  sparks.onBeforeRender = () => { mat.uniforms.uPx.value = pxPerBlock(); };

  const note = caption(ctx.host, '');
  active.onChange(on => {
    ctx.obj.visible = false;               // the page's own model is the lit one
    idle.visible = !on;
    note.set(on
      ? 'Running: a player with items that can charge is standing on the pad. It glows and gives off teal sparks.'
      : 'Idle: nobody is charging. The core and the strips on the pad are dark.');
    if (ctx.still) {                       // reduced motion: a still picture of the sparks, or none
      for (let i = 0; i < COUNT; i++) { alive[i] = 0; size[i] = 0; }
      if (on) for (let i = 0; i < 7; i++) spawn(i, 0.05 + Math.random() * 0.6);
      upload();
    }
  });
  active.set(true);                        // the pad opens running, as its item picture shows it
}
setup.active = true;
