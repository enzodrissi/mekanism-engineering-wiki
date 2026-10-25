---
title: Alimenter des machines par une fréquence quantique
description: "Envoyer de l'énergie n'importe où avec les fréquences quantiques déjà utilisées : des récepteurs d'énergie sur les machines, un Chargepad pour l'équipement, et un écran pour tout surveiller."
sidebar:
  order: 3
---

Les Entangloporteurs quantiques de Mekanism partagent des **fréquences d'inventaire**. Les blocs quantiques du mod se
branchent sur ces mêmes fréquences, avec les mêmes règles Publique, Confiance et Privé : une seule fréquence peut donc
alimenter toute une base.

## 1. Remplir une fréquence d'énergie

Installer un **Entangloporteur quantique** de Mekanism sur une fréquence, comme dans Mekanism, et envoyer de l'énergie
dans cette fréquence. Le récepteur, le Chargepad et le mineur ci-dessous puisent dans la réserve d'énergie de cette fréquence.

## 2. Fixer un récepteur d'énergie quantique sur une machine

1. Avec un [Récepteur d'énergie quantique](../../quantum-energy-receiver/) en main, faire un clic droit sur n'importe
   quelle face de la machine à alimenter : il se fixe sur cette face comme une plaque.
2. Faire un clic droit sur le récepteur, ouvrir l'onglet **Fréquence** et lier la fréquence.
3. Il fournit l'énergie automatiquement, jusqu'au débit de son niveau. Il ne fait que transférer l'énergie et n'en
   renvoie jamais.

| Niveau | Débit (valeur par défaut de Mekanism) |
|---|---|
| Basic | 4 000 J/t |
| Advanced | 16 000 J/t |
| Elite | 64 000 J/t |
| Ultimate | 256 000 J/t |

## 3. Recharger son équipement sur la même fréquence

Placer un [Quantum Chargepad](../../quantum-chargepad/), faire un clic droit dessus, appuyer sur **Quantum** et choisir
la fréquence. Se tenir dessus : chaque objet porté qui stocke de l'énergie et n'est pas plein se recharge dans le même tick (quand l'énergie manque, l'armure portée passe en premier).

## 4. Alimenter un mineur et envoyer les lingots d'une raffinerie

- Le [Quantum Digital Miner](../../quantum-digital-miner/) peut prendre son **Énergie** sur une fréquence quantique,
  choisie dans sa colonne Liaison quantique.
- Le module quantique de la [Quantum Ore Refinery](../../quantum-ore-refinery/) envoie ses lingots vers une
  fréquence quantique ou QIO.

## 5. Surveiller la fréquence

Placer un [Contrôleur de réseau quantique](../../quantum-network-controller/) n'importe où (il n'a pas besoin de
toucher le réseau), choisir la fréquence et l'onglet **Énergie** : il montre ce qui **entre**, ce que la fréquence
**contient** et ce qui **sort**, et quels types d'appareils la consomment. La
[Tablette de réseau quantique](../../quantum-network-tablet/) est le même écran, tenu en main : placer un contrôleur
seul dans la grille de fabrication pour en obtenir une, et la tablette seule pour récupérer le contrôleur.

:::note
Casser un récepteur, un Chargepad ou un contrôleur de raffinerie (la fréquence de son module quantique) ne conserve jamais la fréquence dans l'objet : il faut la choisir à nouveau
après l'avoir posé, pour que personne ne puisse ramasser le bloc et utiliser un réseau privé.
:::
