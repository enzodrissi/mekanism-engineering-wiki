---
title: Miner à distance avec le Quantum Digital Miner
description: "Installer un Quantum Digital Miner, préparer ses filtres de n'importe où avec le Digital Miner Companion, et le déplacer vers une nouvelle zone une fois terminé."
sidebar:
  order: 2
---

Le [Quantum Digital Miner](../../quantum-digital-miner/) est le successeur de fin de jeu du Mineur digital :
les mêmes filtres et réglages, un rayon jusqu'à 128 blocs et une vitesse de minage multipliée par quatre (deux réglages
du serveur). Le [Digital Miner Companion](../../digital-miner-companion/) est la télécommande qui l'accompagne.

## 1. Fabriquer et placer le mineur

1. Réunir les ingrédients ([recette](../../quantum-digital-miner/#fabrication)). Un Mineur digital entre dans la recette :
   ses améliorations et ses objets stockés passent dans la nouvelle machine, ses filtres et ses réglages non.
2. Le placer et l'alimenter : par ses propres ports, ou par une fréquence quantique (étape 3).
3. Faire un clic droit dessus, puis cliquer sur **Configuration** (ou Maj + clic droit sur la machine) : régler le rayon,
   la plage de Y, les filtres, le Toucher de soie, l'Éjection automatique et le Tirage automatique, ainsi que le mode
   inversé, avec le même écran et les mêmes règles que le Mineur digital.

## 2. Récupérer ce qu'il mine

Les ports ont la disposition fixe du Mineur digital : entrée des objets par le dessus, sortie des objets par le centre
de la face arrière supérieure, énergie par le dessous (et aussi à gauche et à droite). Pour l'installation la plus
simple, placer un coffre directement contre le port arrière et régler **Export** sur **Locale** et **Éjection
automatique** sur Activé.

## 3. Ou passer au quantique

Dans la colonne **Liaison quantique**, choisir séparément la source de l'**Énergie**, de l'**Import** et de
l'**Export** : Locale, une fréquence Quantique (partagée avec les Entangloporteurs quantiques) ou QIO. Une fréquence
quantique contient un seul type d'objet et une seule réserve d'énergie à la fois. Cliquer ensuite sur **Démarrer**.

:::caution[Chargement des chunks]
Le mineur ne charge jamais de chunk de lui-même. Avec une **Mise à niveau d'ancrage**, il garde chargés son propre
chunk et le chunk qu'il mine, comme le Mineur digital. Sans elle, un chunk non chargé dans le rayon compte comme vide.
:::

## 4. Le piloter de n'importe où

1. Faire Maj + clic droit sur le mineur avec le Companion pour le lier.
2. Faire un clic droit n'importe où pour ouvrir le Companion. Dans l'onglet **Minage**, ajouter des filtres (Maj + clic
   droit sur des blocs dans le monde) ou récupérer ceux de la machine avec **Pull**, puis **Scanner** pour compter ce
   qu'ils mineraient actuellement. Un scan ne charge jamais de chunk et ne démarre jamais la machine.
3. Envoyer le brouillon à la machine avec **Push** (seulement quand elle est arrêtée et réinitialisée), ou utiliser
   **Démarrer / Arrêt / Réinitialiser** dans l'onglet **Mineur digital**.

Le Companion fonctionne à n'importe quelle distance et dans n'importe quelle dimension, tant que le chunk du mineur est
déjà chargé et que la sécurité de Mekanism autorise l'accès. Son voyant indique l'état d'un coup d'œil : gris hors
ligne ou non lié, rouge non prêt, ambre clignotant en marche, ambre atténué en pause, vert terminé.

## 5. Passer à une nouvelle zone

Une fois sa zone entièrement minée, un Quantum Digital Miner peut se déplacer vers une zone voisine qu'il n'a jamais minée :

- **Automatique** : tirée au hasard parmi jusqu'à 8 zones voisines libres.
- **Manuel** : placée devant le joueur, au-delà d'une marge de sécurité de 1 à 8 blocs (3 par défaut).

Le déplacement coûte 80 MJ par défaut, prélevés sur la **batterie du Companion lui-même** : le recharger d'abord dans
n'importe quel chargeur ou cube d'énergie de Mekanism. Le mineur atterrit sur une plateforme de pierre libre de 5 × 5.

## Ensuite

- [Construire sa première Quantum Ore Refinery](../../guides/first-ore-refinery/) : transformer le minerai en jusqu'à cinq lingots chacun.
- [Notifications](../../quantum-digital-miner/#notifications) et
  [filtres rapides](../../quantum-digital-miner/#filtres-rapides-et-listes-de-filtres-enregistrées) du mineur.
