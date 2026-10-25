<!-- source: 07c8c4594d58cb140fd3af361be5510f0d30df9d -->
# Industrial Fluid Pump

> Une seule pompe endgame de 3 × 3 × 3 au lieu d'une centaine de Pompes électriques.

![Industrial Fluid Pump](images/quantum_fluid_pump.png)

| | |
|---|---|
| Type | Multibloc (3 × 3 × 3, posé en une fois) |
| Taille | 3 × 3 × 3 blocs (un bloc principal, 26 blocs de structure invisibles posés automatiquement) |
| Énergie | 32 000 J/t (12 800 FE/t) sans amélioration, selon la formule d'amélioration de Mekanism ; 16 000 000 J (6 400 000 FE) stockés (`quantum_fluid_pump.energyUsage` / `energyStorage`) |
| Améliorations | Vitesse, Énergie, Filtre, Étouffement, Ancrage (les mises à niveau de Mekanism) ; le Stabilisateur de source dans son propre emplacement |
| Configuration des faces | oui (Mekanism), fluides et énergie sur chacune de ses trois prises |

## Ce qu'elle fait

L'Industrial Fluid Pump ne puise pas dans le monde par elle-même : elle pompe par le bout d'un réseau de Tuyaux
mécaniques de Mekanism branché sur sa prise d'aspiration. Tirer des tuyaux de la pompe jusqu'à une étendue d'eau ou de lave ;
le bout de cette ligne doit se trouver dans la source de fluide elle-même (le tuyau devient immergé), ou être rempli avec un seau.
Un tuyau simplement posé à côté ou au-dessus d'une source ne l'amorce pas. Le fluide suit ensuite le réseau de tuyaux
comme n'importe quel fluide de Mekanism, jusqu'au réservoir de la pompe.

- **L'eau** coule sans fin : la source reste en place, exactement comme avec la Pompe électrique de Mekanism.
- **L'eau lourde** s'obtient en pompant de l'eau avec une Mise à niveau du filtre installée (la mise à niveau de Mekanism, une au maximum) :
  la pompe donne la quantité d'eau lourde par seau de Mekanism (10 mB), réduite par une part configurée.
- **La lave** est normalement consommée : chaque bloc source prélevé modifie réellement le monde, donc la pompe limite le nombre
  de sources prises en un tick et en cherche d'autres dans un rayon autour de l'aspiration.
- **La lave gardée par le Stabilisateur de source** reste en place au lieu d'être consommée, et ne s'épuise jamais.
- **Les fluides d'autres mods** sont traités comme la lave : leurs blocs sources sont consommés, cherchés et limités
  de la même façon.

Le réservoir ne contient jamais qu'un seul fluide à la fois ; rien n'est mélangé, rien n'est détruit. Si le fluide de l'aspiration
change alors que le réservoir contient encore l'ancien, la pompe vide ce qu'elle contient avant de changer.

## Fabrication

![Recette de l'Industrial Fluid Pump](images/quantum_fluid_pump-recipe.png)

```
U Q U
A E A
U T U
```

- **U** : tout Circuit de contrôle ultime (`c:circuits/ultimate`), ×4
- **Q** : Entangloporteur quantique, ×1
- **A** : tout Alliage atomique (`mekanism:alloys/atomic`), ×2
- **E** : Pompe électrique, ×1
- **T** : Réservoir de fluide ultime, ×1

Résultat : 1 Industrial Fluid Pump.

C'est une recette de fabrication spéciale : la Pompe électrique au centre peut déjà contenir de l'énergie, un fluide et des mises à niveau,
et ils passent dans la nouvelle pompe. Inutile de vider d'abord l'inventaire de la Pompe électrique : tout objet
qui ne trouve pas sa place dans le résultat (un seau, une batterie de rechange…) revient comme un reste de fabrication normal, jamais
détruit ni copié dans la pompe.

### Stabilisateur de source

![Stabilisateur de source](images/source_stabilizer_upgrade.png)

Se place dans l'emplacement Stabilisateur de source de la pompe (clic droit accroupi sur la pompe, l'objet en main) : les sources de lave restent
en place pendant que la pompe les puise, contre davantage d'énergie.

![Recette du Stabilisateur de source](images/source_stabilizer_upgrade-recipe.png)

```
  P
A T A
  P
```

- **P** : Pastille de Polonium, ×2
- **A** : tout Alliage atomique (`mekanism:alloys/atomic`), ×2
- **T** : Noyau de téléportation, ×1

Résultat : 1 Stabilisateur de source.

## Prise en main

1. Fabriquer la pompe (voir plus haut). Utiliser une Pompe électrique déjà améliorée conserve son énergie, son fluide et ses mises à niveau.
2. Dégager un espace de 3 × 3 × 3 et poser la pompe. Casser plus tard n'importe lequel de ses 27 blocs donne un seul objet qui garde
   tout son contenu (réservoir, énergie, mises à niveau, Stabilisateur de source).
3. Depuis la face d'aspiration (à gauche par défaut, vue de face), tirer des Tuyaux mécaniques de Mekanism jusqu'à une source
   d'eau ou de lave. Le dernier tuyau de cette ligne doit être immergé : posé dans la source, ou rempli avec un
   seau.
4. Alimenter la face arrière en énergie.
5. Brancher un tuyau ou un réservoir sur la face de sortie (à droite par défaut) pour recevoir le fluide ; sans cela, la pompe remplit
   son propre réservoir puis affiche « Sortie bloquée ».
6. Ouvrir l'écran pour lire ses lignes. Faire un clic droit accroupi sur n'importe lequel des 27 blocs de la pompe avec une Mise à niveau de la vitesse,
   énergétique, du filtre, de l'étouffement ou d'ancrage en main pour l'installer ; faire de même avec un Stabilisateur de source pour garder
   les sources de lave au lieu de les consommer.

## L'interface

![Interface de l'Industrial Fluid Pump](images/quantum_fluid_pump-gui.png)

- **Jauge de fluide** (à gauche) : le réservoir de la pompe et ce qu'il contient (survoler pour la quantité exacte).
- **Écran intérieur** (au milieu), trois lignes et parfois une quatrième :
  1. le fluide : ce que contient le réservoir ou, si le réservoir est vide, le fluide que l'aspiration pomperait ensuite (« Pas de fluide » s'il n'y en a aucun) ;
  2. le débit, par exemple « Pompage · 16 000 mB/t » (en gris quand la pompe ne pompe pas) ;
  3. l'entrée, toujours : « Entrée : OK », ou la cause quand le problème vient de l'aspiration (en orange) ;
  4. une quatrième ligne seulement quand l'état en demande une (voir le tableau ci-dessous).

  Le survol de l'écran donne l'état complet, puis « Aspiration : N blocs sous » (ou « au-dessus », « même niveau », « aucune »),
  « Sortie : branchée » ou « Sortie : rien de branché », « N aspirations trouvées : la plus proche est utilisée » quand il y en a plusieurs, et
  « Les tuyaux d'aspiration portent N mB/t au plus ».
- **Barre d'énergie et onglet d'énergie** (à droite) : l'énergie stockée, avec l'avertissement habituel de Mekanism quand il n'y en a pas assez
  pour un tick.
- **Ligne du Stabilisateur de source** (sous l'écran) : l'emplacement, son nom, et « Installé » ou « Vide ». Le survoler pour le
  détail : « Installé : lave préservée », « Installé : attend de la lave » (aucune source de lave n'a encore atteint l'aspiration) ou « Vide :
  la lave est prise ». Un emplacement vide montre un Stabilisateur de source en filigrane.

La pompe dit toujours pourquoi elle ne déplace pas de fluide, elle n'attend jamais en silence.

| Ligne | Texte | Signification |
|---|---|---|
| Entrée | Entrée : OK | Une aspiration, une source et un fluide accepté sont trouvés ; ce qui arrête la pompe ensuite figure sur la quatrième ligne. |
| Entrée | Entrée : recherche | Recherche d'un réseau de tuyaux d'aspiration et d'une source valide. |
| Entrée | Entrée : aucune aspiration | Aucune prise n'est réglée en aspiration, ou aucun tuyau n'y est branché. |
| Entrée | Entrée : zone déchargée | Un tuyau de la ligne d'aspiration se trouve dans un tronçon déchargé. |
| Entrée | Entrée : source absente | La source utilisée par la pompe a disparu, ou il n'y a plus de source de lave (ou d'un autre fluide) dans le rayon de recherche. |
| Entrée | Entrée : fluide incompatible | Le débit de ce fluide est réglé à zéro sur le serveur. |
| Entrée | Entrée : réseau partagé | L'aspiration et l'une des sorties de la pompe partagent le même réseau de tuyaux. |
| Entrée | Entrée : réseau trop grand | Le réseau de tuyaux de l'aspiration dépasse la limite configurée. |
| Quatrième ligne | Sortie bloquée | Le réservoir (ou le réseau au-delà) n'a plus de place. |
| Quatrième ligne | Énergie insuffisante | Pas assez d'énergie pour un tick : rien ne bouge. |
| Quatrième ligne | Changement de fluide : vidage | Le réservoir ou les tuyaux contiennent encore le fluide précédent ; il sort d'abord. |
| Quatrième ligne | Arrêtée par la redstone | Le contrôle par redstone maintient la pompe à l'arrêt. |
| Quatrième ligne | Freinée par les tuyaux | La pompe pompe, mais les tuyaux du réseau d'aspiration portent moins que ce qu'elle pourrait envoyer. |
| Quatrième ligne | Eau lourde / Lave stabilisée | Information : la Mise à niveau du filtre produit de l'eau lourde, ou le Stabilisateur de source garde une source de lave. |

## Automatisation

Par défaut, l'aspiration est à gauche, la sortie à droite et l'énergie à l'arrière (toujours vue de
face) ; l'avant, le dessus et le dessous n'ont aucune prise. Chacune des trois prises se règle autrement dans
l'onglet de configuration des faces de Mekanism, pour les fluides et pour l'énergie, sur n'importe lequel des 27 blocs de la pompe. Un comparateur
placé contre la prise de sortie lit le remplissage du réservoir, comme pour tout réservoir de fluide de Mekanism.

Casser la pompe, depuis n'importe lequel de ses blocs, donne un seul objet qui garde son réservoir, son énergie, ses Mises à niveau de la vitesse,
énergétiques, du filtre, de l'étouffement et d'ancrage, et son Stabilisateur de source s'il y en a un.

## Configuration

Section `quantum_fluid_pump` de `mekanismengineering-server.toml` :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `baseRate` | 16 000 | 1–10 000 000 | Eau fournie par tick sans Mise à niveau de la vitesse, en mB/t. |
| `lavaShare` | 0,75 | 0,0–1,0 | Part du débit d'eau appliquée à la lave consommée et aux autres fluides consommés. |
| `stabilizedLavaShare` | 0,75 | 0,0–1,0 | Part du débit d'eau appliquée à la lave gardée par le Stabilisateur de source. |
| `heavyWaterShare` | 0,75 | 0,0–1,0 | Multiplie la règle d'eau lourde par seau de Mekanism pour la Mise à niveau du filtre. |
| `maxSourcesPerTick` | 16 | 1–64 | Nombre maximal de blocs sources de lave (ou d'un autre fluide) que la pompe peut prendre au monde en un tick. |
| `sourceRadius` | 32 | 4–64 | Rayon autour de l'aspiration, en blocs, dans lequel les sources consommées sont cherchées. |
| `searchBudget` | 256 | 16–4 096 | Nombre maximal de blocs lus par la recherche de sources en un tick. |
| `energyUsage` | 32 000 J/t | 0–max | Énergie consommée par tick de travail sans amélioration. |
| `energyStorage` | 16 000 000 J | 1–max | Énergie stockée sans Mise à niveau énergétique. |
| `stabilizerEnergyMultiplier` | 4,0 | 1,0–64,0 | Multiplie la consommation d'énergie tant que le Stabilisateur de source garde une source de lave. |
| `tankCapacity` | 2 000 000 mB | 1 000–max | Capacité du réservoir de la pompe. |
| `intakeMaxPipes` | 2 048 | 1–65 536 | Plus grand réseau de tuyaux d'aspiration que la pompe parcourt. |
| `intakePipesPerTick` | 64 | 1–4 096 | Tuyaux du réseau d'aspiration parcourus en un tick. |
| `intakeRecheckTicks` | 20 | 1–1 200 | Ticks entre deux vérifications que l'aspiration est toujours en place. |
| `fluidloggedPipeIntake` | true | n/a | Autorise un Tuyau mécanique immergé (ou rempli au seau) à amorcer la pompe. |
| `otherFluids` | true | n/a | Pompe les fluides autres que l'eau et la lave, prélevés comme les sources de lave. |
| `stabilizedLavaEnergyPerMb` | 50,0 J | 0,0–1 000 000,0 | Énergie minimale coûtée par chaque mB de lave gardée par le Stabilisateur, quelles que soient les Mises à niveau énergétiques. |

## Astuces et dépannage

- « Entrée : recherche » ou « Entrée : aucune aspiration » : vérifier qu'un réseau de Tuyaux mécaniques va de la face d'aspiration jusqu'à une
  source, et que le dernier tuyau de la ligne est posé dans la source (ou rempli avec un seau) : un tuyau sec
  qui touche ou surplombe simplement la source ne compte pas.
- « Freinée par les tuyaux » : la capacité totale des tuyaux du réseau d'aspiration est inférieure à ce que la pompe pourrait envoyer. Les
  niveaux de tuyaux de Mekanism s'additionnent par réseau (de base 2 000 mB, avancé 8 000 mB, d'élite 32 000 mB, ultime 128 000 mB) ; utiliser
  des tuyaux plus grands ou plus nombreux sur cette ligne.
- « Entrée : réseau partagé » : la ligne de tuyaux d'aspiration et l'une des sorties de la pompe se retrouvent reliées au
  même réseau. Les séparer, sinon la pompe renverrait sa propre sortie dans son aspiration.
- Les sources de lave sans Stabilisateur de source finissent par s'épuiser (la recherche ne va pas plus loin qu'un certain rayon) ; installer un
  Stabilisateur de source pour un approvisionnement sans fin, pour quatre fois le coût en énergie : et jamais moins de 50 J par mB,
  quelles que soient les Mises à niveau énergétiques installées, si bien que la lave stabilisée ne peut jamais alimenter un générateur gratuitement.
- L'eau lourde demande la Mise à niveau du filtre pendant que la pompe est sur de l'eau ; elle ne ralentit pas la pompe, elle change
  ce qui en sort.
- Le Stabilisateur de source a son propre emplacement, pas l'onglet « Améliorations » : faire un clic droit accroupi sur la pompe avec lui, ou
  le déposer directement dans cet emplacement. La liste des mises à niveau de Mekanism est fermée, donc un addon ne peut pas y ajouter.
