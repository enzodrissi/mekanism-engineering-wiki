// Block animations of the 3D views: what the game shows when a machine works, drawn from its own models and textures.
// A block with an `_active` model (the model the game switches to while it works) gets the Idle / Running switch for free;
// a module in this folder adds the rest (what the block does around its model). Every module is loaded only for its page.
//   export default async function setup(ctx) { ... }   ctx: { stage, host, obj, focus, base, still, tween, easeOut, easeInOut, easeBack, icon, BASE, active }
//   `ctx.focus` names what the view is about when the block's animation is shown on another page (data-focus of the view).
//   `ctx.active` is the switch of the Idle / Running pair: { on, set(bool), onChange(fn) }, `ctx.state()` reads it.
import { buildBlock, textureAnimator } from '../mcmodel.js';
import { choice } from './ui.js';
import { L } from '../i18n.js';

const MODULES = {
  // block id (the item's name) -> () => import('./<module>.js'), one line per block
  quantum_fluid_pump: () => import('./pump.js'),
  quantum_digital_miner: () => import('./miner.js'),
  precision_logistical_distributor: () => import('./distributor.js'),
  petrogenic_synthesizer: () => import('./synthesizer.js'),
  petrogenic_synthesis_plant: () => import('./plant.js'),
  quantum_chargepad: () => import('./chargepad.js'),
  precision_upgrade_controller: () => import('./upgrade-controller.js'),
  ultimate_quantum_energy_receiver: () => import('./receiver.js'),
};

const NS = 'mekanismengineering';

/** Whether the game has an `_active` model for the block (the machine looks different while it works). */
async function activeModel(base, id) {
  const r = await fetch(`${base}/${NS}/models/block/${id}_active.json`, { method: 'HEAD' }).catch(() => null);
  return !!(r && r.ok);
}

export async function animate(id, ctx) {
  const { stage, base } = ctx;
  const mod = MODULES[id] ? (await MODULES[id]()).default : null;
  const hasActive = !!(mod && mod.active);
  const listeners = [];
  const active = { on: false, onChange: fn => listeners.push(fn), set() {} };
  let onObj = null;
  if (hasActive) {
    onObj = await buildBlock(base, `${NS}:block/${id}_active`, { id: `${NS}:block/${id}`, tints: mod.tints ? mod.tints() : {} });
    onObj.visible = false; stage.root.add(onObj);
    const ui = choice(ctx.host, L('Machine state'), [['off', L('Idle')], ['on', L('Running')]], ctx.still ? 'on' : 'off', v => active.set(v === 'on'));
    active.set = on => {
      active.on = on; ctx.obj.visible = !on; onObj.visible = on; ui.set(on ? 'on' : 'off');
      for (const fn of listeners) fn(on);
      stage.draw();
    };
    // the strips of the active model (a fan, a glow) run while it is shown; with reduced motion they stay on their first picture
    const anim = textureAnimator(onObj);
    if (anim.count) stage.live(now => (active.on ? anim(now) : false), { fps: 30 });
    if (ctx.still) active.set(true);
  }
  const full = { ...ctx, active, onObj, state: () => active.on, choice: (label, items, value, fn) => choice(ctx.host, label, items, value, fn), buildBlock };
  if (mod) await mod(full);
}
