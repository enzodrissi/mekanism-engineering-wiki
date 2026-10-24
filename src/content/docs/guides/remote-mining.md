---
title: Mine far away with the Quantum Digital Miner
description: "Set up a Quantum Digital Miner, prepare its filters from anywhere with the Digital Miner Companion, and move it to a fresh zone when it is done."
sidebar:
  order: 2
---

The [Quantum Digital Miner](/wiki/machines/mining/quantum-digital-miner/) is the Digital Miner's endgame successor:
the same filters and settings, a radius up to 128 blocks and four times the mining speed (both server settings). The
[Digital Miner Companion](/wiki/machines/mining/digital-miner-companion/) is the remote that goes with it.

## 1. Craft and place the miner

1. Gather the ingredients ([recipe](/wiki/machines/mining/quantum-digital-miner/#crafting)). A Digital Miner goes into
   it: its upgrades and stored items travel into the new machine, its filters and settings do not.
2. Place it and give it power: its own ports, or a quantum frequency (step 3).
3. Right-click it, then click **Config** (or shift + right-click the machine): set the radius, the Y range, the
   filters, Silk touch, Auto-eject and Auto-pull, and inverse mode, with the same screen and rules as the Digital Miner.

## 2. Collect what it mines

The ports have the Digital Miner's fixed layout: items in on top, items out through the centre of the upper rear
face, energy on the bottom (also left and right). For the simplest setup, put a chest directly against the rear
port and set **Export** to **Local** and **Auto-eject** to ON.

## 3. Or go quantum

In the **Quantum link** column, choose the source for **Energy**, **Import** and **Export** independently: Local, a
Quantum frequency (shared with your Quantum Entangloporters) or QIO. A Quantum frequency holds one item type and one
energy pool at a time. Then click **Start**.

:::caution[Chunk loading]
The miner never loads chunks on its own. With an **Anchor Upgrade** it keeps its own chunk and the chunk it is mining
loaded, like the Digital Miner. Without one, an unloaded chunk in range counts as empty.
:::

## 4. Control it from anywhere

1. Shift + right-click the miner with the Companion to link it.
2. Right-click anywhere to open the Companion. On the **Mining** tab, add filters (shift + right-click blocks in the
   world) or **Pull** the machine's own, then **Scan** to count what they would currently mine. A scan never loads a
   chunk and never starts the machine.
3. **Push** the draft to the machine (only while it is stopped and reset), or use **Start / Stop / Reset** on the
   **Digital Miner** tab.

The Companion works at any distance and in any dimension, as long as the miner's chunk is already loaded and
Mekanism's security lets you in. Its LED tells you the state at a glance: grey offline or unlinked, red not ready,
blinking amber working, dim amber paused, green finished.

## 5. Move to a fresh zone

Once its zone is fully mined, a Quantum Digital Miner can move to a neighbouring zone it has never mined:

- **Automatic**: drawn at random among up to 8 free neighbouring zones.
- **Manual**: placed in front of you, past a safety margin of 1 to 8 blocks (3 by default).

The move costs 80 MJ by default, taken from the **Companion's own battery**: charge it in any Mekanism charger or
energy cube first. The miner lands on a free 5 × 5 stone platform.

## Next

- [Your first Quantum Ore Refinery](/wiki/guides/first-ore-refinery/): turn the ore into up to five ingots each.
- [Notifications](/wiki/machines/mining/quantum-digital-miner/#notifications) and
  [quick filters](/wiki/machines/mining/quantum-digital-miner/#quick-filters-and-saved-filter-lists) of the miner.
