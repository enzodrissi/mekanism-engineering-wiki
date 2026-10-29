---
title: Construire sa première Quantum Ore Refinery
description: "D'un sol vide à cinq lingots par minerai : construire la structure, l'alimenter, la remplir et choisir le niveau."
sidebar:
  order: 1
---

La Quantum Ore Refinery fait tourner les cinq chaînes de traitement de minerai de Mekanism dans une seule structure de
10 × 4 × 3. Ce guide accompagne la construction de la première, dans l'ordre où chaque chose devient utile. Chaque détail
renvoie à la page complète.

## 1. Construire la structure

<div class="not-content" data-me3d data-kind="refinery" data-mode="layers"></div>

La structure suit un plan fixe qui se construit couche par couche : toucher **Couche par couche** ci-dessus pour voir
chacune d'elles, et toucher un bloc pour voir son nom. Le plan complet, le nombre de blocs et toutes les recettes sont sur
[Structure et pièces](../../quantum-ore-refinery/structure/).

1. Placer d'abord le **Contrôleur de la Quantum Ore Refinery**. Il se trouve sur la rangée avant du bas, deuxième bloc
   en partant de la gauche quand on lui fait face, et se tourne vers le joueur au moment où on le pose : la structure se
   dresse **derrière** lui et sur sa droite.
2. Construire le reste : carcasses, piliers, poutres, tapis, les ports (au moins cinq ports d'entrée, au moins un port
   d'énergie et au plus un port de sortie, que le module quantique peut remplacer, voir l'étape 6), sept modules de traitement, quatre cellules de réservoir de deux blocs chacune, et autant d'accélérateurs qu'on le souhaite (jusqu'à huit). Un emplacement d'accélérateur peut aussi accueillir une simple carcasse.
3. Tant qu'un élément est incorrect, l'écran du contrôleur indique quel bloc est incorrect ou manquant, et où. Quand le
   dernier bloc est posé, l'écran affiche « Multibloc formé » (et de la poudre de redstone court le long des arêtes, si
   l'effet de Mekanism est activé).

:::tip
Le plan tourne avec le contrôleur par quarts de tour et n'est jamais inversé en miroir. La machine vérifie la structure
environ une fois par seconde et ne charge jamais de chunk pour le faire.
:::

## 2. Lui fournir de l'énergie et du minerai

1. Amener de l'**énergie** à un port d'énergie (Joules ou Forge Energy, depuis un câble ou un bloc d'énergie).
2. Fournir le **minerai** à un port d'entrée dans son mode par défaut **Objets**, ou placer le minerai à la main dans
   les neuf emplacements de minerai.
3. Donner une sortie aux lingots : les récupérer au **port de sortie** avec un tuyau, un entonnoir ou un coffre placé
   contre lui, ou utiliser le module quantique de l'[étape 6](#6-envoyer-les-lingots-vers-son-réseau-facultatif).
   **La raffinerie a besoin de l'un des deux** : sans port de sortie ni module quantique réglé, la structure se forme,
   mais l'écran affiche « Pas de sortie » et rien n'est traité.

Les niveaux **x1** et **x2** ne demandent aucun produit chimique, mais avec les réglages par défaut la raffinerie ne
démarre pas encore : elle attend tout ce que demande le **x5** (l'écran affiche « Attend le niveau »). L'étape 3
montre comment la faire travailler tout de suite.

## 3. Choisir son fonctionnement

L'écran Accueil propose deux réglages ([détails](../../quantum-ore-refinery/#choisir-le-niveau)) :

- **Plafond de niveau** (x1 à x5, x5 tant qu'on n'a pas cliqué) : le niveau maximal auquel la machine peut travailler.
- **Toujours actif**, désactivé par défaut. **Désactivé** : elle attend que les réservoirs contiennent tout ce que
  demande le niveau plafond. **Activé** : elle travaille au meilleur niveau, jusqu'au plafond, que ses réservoirs
  permettent, et jamais en dessous de x2 sauf si le plafond est réglé sur x1.

:::note[Premiers pas ?]
Activer **Toujours actif** : la raffinerie travaille aussitôt en x2 (deux lingots par minerai de fer) pendant la mise en place des produits chimiques.
:::

## 4. Ajouter les produits chimiques pour x3 à x5

Passer d'autres ports d'entrée dans un autre mode avec un **Configurateur** (accroupi + clic droit) : un en **Fluides**
pour l'eau, et un en **Gaz** pour l'oxygène, le chlorure d'hydrogène et l'acide sulfurique (un seul port Gaz accepte les
trois ; tout autre produit chimique est refusé). Par minerai de fer, avec les recettes par défaut de Mekanism :

| Niveau | Lingots par minerai de fer | Prélevé dans les réservoirs |
|---|---|---|
| x3 | 3 | 200 mB d'oxygène |
| x4 | 4 | 200 mB de chlorure d'hydrogène, 800 mB d'oxygène |
| x5 | 5 | 200 mB d'acide sulfurique, 5 000 mB d'eau, 1 000 mB de chlorure d'hydrogène, 1 000 mB d'oxygène |

Les ressources ne sont prélevées qu'à la fin d'une opération. Les quatre stocks contiennent 3 000 000 mB d'eau,
600 000 mB de chlorure d'hydrogène, 600 000 mB d'oxygène et 120 000 mB d'acide sulfurique.

## 5. L'accélérer

Chaque emplacement d'accélérateur occupé par un **Accélérateur de raffinerie de minerai** raccourcit les opérations. En
x5, une opération dure 200 ticks (10 secondes) sans accélérateur et 4 ticks avec les huit ; les niveaux inférieurs
sont plus rapides. Essayer :

<div class="me-qor-calc not-content"></div>

## 6. Envoyer les lingots vers son réseau (facultatif)

Ajouter le **Module quantique de raffinerie de minerai** à l'extrémité de sortie de la structure, dans **l'une de deux
cellules seulement** : la place du port de sortie, ou la cellule juste au-dessus. Ne le poser nulle part ailleurs, et
n'en mettre qu'un (voir [Structure et pièces](../../quantum-ore-refinery/structure/#ports)). Choisir ensuite une
fréquence sur son écran : les lingots partent alors vers une fréquence quantique (d'inventaire) ou dans un
réseau QIO, toutes les demi-secondes, en passant par un tampon de 64 piles. Rien n'est perdu quand la destination est
pleine. Voir [Le module quantique](../../quantum-ore-refinery/#le-module-quantique). Si la structure garde aussi son port de
sortie, celui-ci sert de tampon de secours : ce que le tampon du module ne peut pas contenir sort par le port.

## Ensuite

- [Quantum Ore Refinery](../../quantum-ore-refinery/) : l'interface, l'automatisation et le dépannage.
- [Miner à distance avec le Quantum Digital Miner](../../guides/remote-mining/) : alimenter la raffinerie depuis un mineur.
