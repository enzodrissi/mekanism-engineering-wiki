// Petrogenic Synthesis Plant. What the game really shows around the model:
// - client/ClientSetup.java (registerModels, wrapPlantModels) + client/model/PlantBakedModel.java: while the plant works the baked part is
//   part_x0_y1_z0_active instead of part_x0_y1_z0 (the blockstate's own model is the same file for active=true and false, so there is no
//   petrogenic_synthesis_plant_active model: only the ports differ, port_*_off vs port_*). Each tower also has a fluid box
//   (petrogenic_synthesis_plant/fluid_water | fluid_lava), joined from the first millibucket the reserve holds. They use vanilla's
//   water_still / lava_still sprites, which the game animates with their .mcmeta; the water takes 0xFF3F76E4 (ClientSetup.plantWaterColor).
// - client/render/RenderPetrogenicPlant.java: each installed module is a 4 px cube (petrogenic_module_water | _lava) on the mount of its
//   tower, 2 x 2, pitch 4.5 px, at y = 43 (water tower x = 24, lava tower x = -8, z = 22), at most TileEntityPetrogenicPlant.MAX_MODULES = 4
//   a tower. Modules are the Hydro Condenser Upgrade (water) and the Magma Synthesizer Upgrade (lava).
// The game has no entrance animation for a module (it just appears when inserted); the small drop here is only the page's way to show it.
import { buildBlock, textureAnimator } from '../mcmodel.js';
import { caption } from './ui.js';

const NS = 'mekanismengineering:block/';
const PART = NS + 'petrogenic_synthesis_plant/';
const WATER_TINT = 0x3F76E4;
const MAX_MODULES = 4;
const TOWERS = {
  water: { x: 24, model: NS + 'petrogenic_module_water', name: 'Hydro Condenser Upgrade' },
  lava: { x: -8, model: NS + 'petrogenic_module_lava', name: 'Magma Synthesizer Upgrade' },
};
const RESERVOIR_Z = 22, DOME_TOP = 43, PITCH = 4.5; // pixels, in the model facing north (RenderPetrogenicPlant)
const COUNTS = [0, 1, 2, 3, 4].map(n => [n, String(n)]);

export default async function setup({ stage, base, host, obj, still, tween, easeBack, choice }) {
  // the part is authored one block up (JOINED in mcmodel.js): the fluids and the lit part go to the same place
  const part = async (model, tints) => { const o = await buildBlock(base, model, { tints }); o.position.y = 1; stage.root.add(o); return o; };
  const lit = await part(PART + 'part_x0_y1_z0_active');
  lit.visible = false;
  const fluids = {
    water: await part(PART + 'fluid_water', { 0: WATER_TINT }),
    lava: await part(PART + 'fluid_lava'),
  };

  // modules: four slots per tower, copies of one cube that share its geometry and materials
  const slots = {}, counts = { water: 0, lava: 0 };
  for (const [key, t] of Object.entries(TOWERS)) {
    const cube = await buildBlock(base, t.model);
    slots[key] = Array.from({ length: MAX_MODULES }, (_, i) => {
      const o = cube.clone();
      o.position.set((t.x + PITCH * (i % 2 - 0.5) - 8) / 16, DOME_TOP / 16, (RESERVOIR_Z + PITCH * (Math.floor(i / 2) - 0.5) - 8) / 16);
      o.visible = false; stage.root.add(o);
      return o;
    });
  }

  // vanilla's water and lava sprites run all the time, in the game as here
  const steps = [textureAnimator(fluids.water), textureAnimator(fluids.lava)];
  const anim = ms => { let c = false; for (const s of steps) c = s(ms) || c; return c; };
  let fluidsOn = true;
  if (!still) stage.live(now => fluidsOn && anim(now), { fps: 20 });
  else anim(0);

  let running = false, fill = 'both';
  const note = caption(host);
  const text = () => {
    const mods = k => (counts[k] ? `${counts[k]} ${TOWERS[k].name}${counts[k] > 1 ? 's' : ''}` : 'no module');
    const tanks = { empty: 'Both towers are empty.', water: 'The water tower holds water.', lava: 'The lava tower holds lava.', both: 'The towers hold water and lava.' }[fill];
    return `${running ? 'Running: the ports are lit.' : 'Idle: the ports are dark.'} ${tanks} Water tower: ${mods('water')}. Lava tower: ${mods('lava')}.`;
  };
  const refresh = () => { note.set(text()); stage.draw(); };

  const setRunning = on => { running = on; obj.visible = !on; lit.visible = on; refresh(); };
  const setFill = v => {
    fill = v;
    fluids.water.visible = v === 'water' || v === 'both';
    fluids.lava.visible = v === 'lava' || v === 'both';
    fluidsOn = fluids.water.visible || fluids.lava.visible;
    refresh();
  };
  const setModules = (key, n) => {
    const before = counts[key]; counts[key] = n;
    slots[key].forEach((o, i) => {
      o.visible = i < n;
      // a new module drops onto its mount with a little overshoot (reduced motion: it is just there)
      if (i >= before && i < n && !still) {
        const y = DOME_TOP / 16;
        tween(520, t => { o.position.y = y + 0.45 * (1 - easeBack(t)); stage.draw(); });
      } else o.position.y = DOME_TOP / 16;
    });
    refresh();
  };

  choice('Machine state', [['off', 'Idle'], ['on', 'Running']], 'on', v => setRunning(v === 'on'));
  choice('Fluids in the towers', [['empty', 'Empty'], ['water', 'Water'], ['lava', 'Lava'], ['both', 'Both']], fill, setFill);
  choice('Water tower modules', COUNTS, 0, n => setModules('water', Number(n)));
  choice('Lava tower modules', COUNTS, 0, n => setModules('lava', Number(n)));
  setFill('both');
  setRunning(true);
}
