// Industrial Fluid Pump. While it pumps, the game switches to quantum_fluid_pump_active: the LED bands light, the fan spins
// (fan_spin.png.mcmeta) and the slits of the column glow flow upward (column_glow.png.mcmeta), tinted with the colour of the
// fluid it pumps (ClientSetup.glow: water, lava, heavy water, or teal while it has none).
import { setTint } from '../mcmodel.js';

// the colours the mod gives the glow (client/ClientSetup.java, glow())
const FLUIDS = [
  ['water', 'Water', 0x3F76E4, '#3f76e4'],
  ['lava', 'Lava', 0xFF8A24, '#ff8a24'],
  ['heavy', 'Heavy water', 0x4A5CC8, '#4a5cc8'],
  ['none', 'No fluid', 0x54E2D5, '#54e2d5'],
];

export default async function setup({ stage, onObj, active, choice }) {
  const pick = id => { const f = FLUIDS.find(x => x[0] === id); setTint(onObj, 0, f[2]); if (active.on) stage.draw(); };
  choice('Pumped fluid', FLUIDS.map(([id, label, , dot]) => [id, label, dot]), 'water', pick);
  pick('water');
  // pressing "Running" is the first thing a reader tries: start it once the view has finished turning in
  active.set(true);
}
setup.active = true;
setup.tints = () => ({ 0: 0x3F76E4 });
