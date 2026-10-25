---
title: Your first Quantum Ore Refinery
description: "From an empty floor to five ingots per ore: build the structure, power it, feed it and pick the level."
sidebar:
  order: 1
---

The Quantum Ore Refinery runs Mekanism's five ore-processing chains inside one 10 × 4 × 3 structure. This guide
takes you through your first one, in the order you will need things. Every detail links to the full page.

## 1. Build the structure

<div class="not-content" data-me3d data-kind="refinery" data-mode="layers"></div>

The structure is a fixed drawing that you build layer by layer: tap **Layer by layer** above to see each one, and tap
any block to see its name. The full drawing, the block counts and every recipe are on
[Structure and parts](../../quantum-ore-refinery/structure/).

1. Place the **Quantum Ore Refinery Controller** first. It sits on the bottom front row, second block from the left as
   you face it, and turns to face you when you place it: the structure stands **behind** it and to its right.
2. Build the rest: casing, pillars, girders, conveyors, the ports (at least five Input Ports, at least one Energy Port
   and, if you want one, an Output Port), seven process modules, four tank cells of two blocks each, and as many accelerators as you like (up to eight). An accelerator place may also hold a plain casing.
3. While something is wrong, the controller's screen says which block is wrong or missing and where. When the last
   block goes in, the screen says "Multiblock formed" (and redstone dust runs along the edges, if Mekanism's effect is
   on).

:::tip
The drawing turns with the controller in quarter turns and is never mirrored. The machine checks the structure about
once a second and never loads a chunk to do it.
:::

## 2. Give it energy and ore

1. Bring **energy** to an Energy Port (Joules or Forge Energy, from a cable or an energy block).
2. Feed **ore** to an Input Port in its default **Items** mode, or put ore in the nine ore slots by hand.
3. Take the ingots from the Output Port with a pipe, hopper or chest placed against it.

Levels **x1** and **x2** need no chemical at all, so this is already a working refinery.

## 3. Choose how it works

The Home screen has two controls ([details](../../quantum-ore-refinery/#choosing-the-level)):

- **Level cap** (x1 to x5, x5 until you click): the most the machine may work at.
- **Always run**, OFF by default. **OFF**: it waits until the tanks hold everything the capped level needs. **ON**: it
  works at the best level up to the cap that its tanks cover, and never below x2 unless you capped it at x1.

:::note[Just starting?]
Turn **Always run** ON: the refinery works at x2 straight away (two ingots per iron ore) while you set up the chemicals.
:::

## 4. Add the chemicals for x3 to x5

Switch other Input Ports with a **Configurator** (sneak + right click): one to **Fluids** for water, and one to
**Gases** for oxygen, hydrogen chloride and sulfuric acid (a single Gases port takes all three; any other chemical is
refused). Per iron ore, with Mekanism's default recipes:

| Level | Ingots from one iron ore | Taken from the tanks |
|---|---|---|
| x3 | 3 | 200 mB oxygen |
| x4 | 4 | 200 mB hydrogen chloride, 800 mB oxygen |
| x5 | 5 | 200 mB sulfuric acid, 5,000 mB water, 1,000 mB hydrogen chloride, 1,000 mB oxygen |

Resources are taken only when a job ends. The four stocks hold 3,000,000 mB of water, 600,000 mB of hydrogen chloride,
600,000 mB of oxygen and 120,000 mB of sulfuric acid.

## 5. Make it fast

Each accelerator place that holds an **Ore Refinery Accelerator** makes a job shorter. At x5 a job takes 200 ticks
(10 seconds) with none and 4 ticks with all eight; lower levels are quicker. Try it:

<div class="me-qor-calc not-content"></div>

## 6. Send the ingots to your network (optional)

Add the **Ore Refinery Quantum Module** at the output end of the structure, in the place of the Output Port or in the
cell right above it (see [Structure and parts](../../quantum-ore-refinery/structure/#ports)), and choose a frequency on its
screen: the ingots then go to a Quantum (Inventory) frequency or into a QIO network, every half second, through a
buffer of 64 stacks. Nothing is lost when the destination is full. See
[The Quantum Module](../../quantum-ore-refinery/#the-quantum-module).

## Next

- [Quantum Ore Refinery](../../quantum-ore-refinery/): the interface, automation and troubleshooting.
- [Mine far away with the Quantum Digital Miner](../../guides/remote-mining/): feed the refinery from a miner.
