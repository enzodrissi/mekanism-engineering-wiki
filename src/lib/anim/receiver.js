// Quantum Energy Receiver. What the game shows, and where it is written:
//  - Nothing moves and nothing changes when it receives energy: blockstates/<tier>_quantum_energy_receiver.json maps active=true and
//    active=false to the same model, the models have no animated texture (no .mcmeta) and no glow (the `qe_port_lit` LED is always the
//    same), and EngineeringBlockTypes.receiver() removes Mekanism's particles. So no energy animation is drawn here.
//  - The four tiers are four models (basic / advanced / elite / ultimate_quantum_energy_receiver) that differ only by the trim texture
//    receiver_<tier>_trim.png. Their rates are in the wiki page (Quantum-Energy-Receiver.md), as Mekanism's Energy Cube tiers.
// The only thing offered is the tier choice, which builds each tier's own model.
import { caption } from './ui.js';

const TIERS = [
  ['basic', 'Basic', '4,000'],
  ['advanced', 'Advanced', '16,000'],
  ['elite', 'Elite', '64,000'],
  ['ultimate', 'Ultimate', '256,000'],
];

export default async function setup(ctx) {
  const { stage, base } = ctx;
  const built = { ultimate: ctx.obj };    // the page shows the Ultimate; the others are built when first chosen
  let current = 'ultimate', want = 'ultimate';
  let note;
  const say = id => {
    const [, name, rate] = TIERS.find(t => t[0] === id);
    note.set(`${name} Receiver: up to ${rate} J per tick. Only the colour of the trim changes between tiers. The game shows no change while it receives energy.`);
  };
  const ui = ctx.choice('Receiver tier', TIERS.map(([id, name]) => [id, name]), current, async id => {
    want = id;
    if (id === current) return;
    if (!built[id]) {
      const o = await ctx.buildBlock(base, `mekanismengineering:block/${id}_quantum_energy_receiver`);
      if (!built[id]) { o.visible = false; stage.root.add(o); built[id] = o; }
    }
    if (want !== id) return;               // another tier was chosen while this one was loading
    built[current].visible = false; built[id].visible = true; current = id;
    ui.set(id); say(id); stage.draw();
  });
  note = caption(ctx.host, '');            // under the buttons
  say(current);
}
