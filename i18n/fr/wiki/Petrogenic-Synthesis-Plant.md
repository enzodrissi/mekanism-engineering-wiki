<!-- source: ef2efe4a7dc7aaf25eb9818447faae548a12a42a -->
# Petrogenic Synthesis Plant

> Usine endgame de 3 × 3 × 3 blocs, posée en une fois : huit lignes de production côte à côte, chacune avec son
> propre produit.

![Petrogenic Synthesis Plant](images/petrogenic_synthesis_plant.png)

| | |
|---|---|
| Type | Multibloc (3 × 3 × 3, posé en une fois) |
| Taille | 3 × 3 × 3 blocs (un bloc principal, 26 blocs de structure invisibles posés automatiquement) |
| Énergie | 1 280 J/t (512 FE/t) pour les huit lignes réunies, sur des Pierres sans amélioration ; 64 000 000 J (25 600 000 FE) stockés (`petrogenic_synthesis.plantEnergyUsage` / `plantEnergyStorage`) |
| Améliorations | Vitesse, Énergie, Étouffement, Ancrage (Mekanism) ; jusqu'à 4 Hydro Condenser Upgrades et 4 Magma Synthesizer Upgrades dans leurs propres baies |
| Configuration des faces | non, ports fixes (comme le Quantum Digital Miner) |

## Ce qu'elle fait

La Plant est une structure compacte de 3 × 3 × 3 : une chambre centrale à l'avant et, à l'arrière, deux tours reliées
à elle par des tuyaux bas, l'eau à gauche vue de face et la lave à droite. Chaque tour montre si son tampon
contient du fluide : elle est **vide à 0 mB et pleine dès le premier millibucket**, quel que soit le niveau exact (les
quantités exactes sont à l'écran), et l'eau et la lave sont indépendantes. Les Hydro Condenser Upgrades ou Magma
Synthesizer Upgrades installés sont dessinés sur les supports des tours. Les produits que fabriquent les lignes s'affichent à l'écran, pas sur le bloc.

C'est le [Petrogenic Synthesizer](Petrogenic-Synthesizer.md) à l'échelle industrielle : seize fois sa production pour
les mêmes améliorations, et dix fois moins d'eau et de lave par bloc à pleine vitesse. Elle fait tourner **huit lignes
de production indépendantes** côte à côte, chacune transformant l'eau et la lave en son propre produit, choisi dans la
même liste de 13 produits que la petite machine : une ligne peut rester vide, fabriquer le même produit qu'une autre
ligne ou autre chose ; changer le produit d'une ligne abandonne le bloc en cours, comme changer de recette sur
n'importe quelle machine Mekanism.

Deux grands tampons (eau, lave) alimentent toutes les lignes, et chacun peut être rempli de trois façons :

- Par des **tuyaux**, à l'entrée fixe propre au tampon : toujours utilisés en premier.
- **À la main** : un seau ou un Réservoir de fluide Mekanism du bon fluide, placé dans l'emplacement de fluide de
  l'écran au-dessus de la baie correspondante, complète ce tampon, mais seulement tant qu'aucun module de ce fluide
  n'est installé ; un module installé a toujours la priorité, et le récipient laissé dans l'emplacement n'est alors simplement pas touché.
- Par les améliorations propres à la Plant : la **Hydro Condenser Upgrade** fabrique de l'eau avec de l'énergie, la
  **Magma Synthesizer Upgrade** fabrique de la lave avec beaucoup d'énergie ; chacune ne complète que ce qui manque
  encore au tampon, jusqu'au plein, et ne paie l'énergie que pour ce qu'elle fabrique réellement.

## Fabrication

![Recette de la Petrogenic Synthesis Plant](images/petrogenic_synthesis_plant-recipe.png)

```
S U S
T A T
S U S
```

- **S**: Petrogenic Synthesizer, ×4
- **U**: n'importe quel Circuit de contrôle ultime (`c:circuits/ultimate`), ×2
- **T**: Réservoir de fluide ultime, ×2
- **A**: n'importe quel Alliage atomique (`mekanism:alloys/atomic`), ×1

Résultat : 1 Petrogenic Synthesis Plant.

### Hydro Condenser Upgrade

![Hydro Condenser Upgrade](images/hydro_condenser_upgrade.png)

Fabrique de l'eau avec de l'énergie dans la Plant : jusqu'à 1 000 mB par tick par module (jusqu'à 4 000 mB/t avec les
quatre), 5 J par mB, en remplissant ce qui manque encore au tampon d'eau, jusqu'au plein : ce qui arrive par les tuyaux passe d'abord.

![Recette de la Hydro Condenser Upgrade](images/hydro_condenser_upgrade-recipe.png)

```
I E I
R C R
I E I
```

- **I**: n'importe quel Lingot d'acier (`c:ingots/steel`), ×4
- **E**: n'importe quel Circuit de contrôle d'élite (`c:circuits/elite`), ×2
- **R**: n'importe quel Alliage renforcé (`mekanism:alloys/reinforced`), ×2
- **C**: Condensateur rotatif, ×1

Résultat : 1 Hydro Condenser Upgrade.

### Magma Synthesizer Upgrade

![Magma Synthesizer Upgrade](images/magma_synthesizer_upgrade.png)

Fabrique de la lave avec beaucoup d'énergie dans la Plant : jusqu'à 1 000 mB par tick par module (jusqu'à 4 000 mB/t
avec les quatre), 1 000 J par mB quelles que soient les Mises à niveau énergétiques, en remplissant ce qui manque encore au tampon de lave, jusqu'au plein.

![Recette de la Magma Synthesizer Upgrade](images/magma_synthesizer_upgrade-recipe.png)

```
U P U
H S H
A   A
```

- **U**: n'importe quel Circuit de contrôle ultime (`c:circuits/ultimate`), ×2
- **P**: Pastille de Polonium, ×1
- **H**: Élément de surchauffe, ×2
- **S**: [Stabilisateur de source](Quantum-Fluid-Pump.md), ×1
- **A**: n'importe quel Alliage atomique (`mekanism:alloys/atomic`), ×2

Résultat : 1 Magma Synthesizer Upgrade.

## Premiers pas

1. Fabriquer la Plant (voir plus haut) : elle demande quatre Petrogenic Synthesizers, à fabriquer d'abord.
2. Dégager un espace de 3 × 3 × 3 et poser le bloc principal au centre de la couche du bas de cet espace ; les 26
   blocs de structure invisibles remplissent le reste automatiquement. La pose est refusée si l'une de ces 27 positions
   est occupée.
3. Relier un tuyau d'eau au dos de la tour d'eau (à gauche vue de face) et un tuyau de lave au dos de la tour de lave
   (à droite vue de face) ; chaque port ne prend que son propre fluide. Un seau ou un Réservoir de fluide Mekanism du
   bon fluide fonctionne aussi, dans l'emplacement de fluide correspondant de l'écran, tant qu'aucun module de ce
   fluide n'est encore installé.
4. Amener l'énergie au port fixe au centre du dos, entre les deux tours.
5. Relier un tuyau d'objets ou un inventaire à l'un ou l'autre côté de l'avant : les deux côtés sont des sorties, utilisées
   à tour de rôle ; sinon, laisser les blocs finis s'accumuler dans le tampon propre à la Plant.
6. Ouvrir l'écran et cliquer sur l'une des huit cases de produit ; une fenêtre s'ouvre pour choisir le produit de cette
   ligne (Maj + clic sur un produit dans cette fenêtre pour le donner d'un coup à toutes les lignes).
7. Facultatif : clic droit accroupi sur n'importe quel bloc de la Plant, une Hydro Condenser Upgrade ou une Magma
   Synthesizer Upgrade en main, pour l'ajouter à sa baie (jusqu'à quatre de chaque) et réduire la quantité d'eau ou de
   lave à fournir de l'extérieur.

## L'interface

![Interface de la Petrogenic Synthesis Plant](images/petrogenic_synthesis_plant-gui.png)

L'écran est haut : s'il ne tient pas dans la fenêtre (par exemple avec une Taille de l'interface de 3 dans une fenêtre de 1280×720), baisser la Taille de l'interface.

- **Jauge d'eau** (à gauche, intitulée « Eau ») et **jauge de lave** (à droite, intitulée « Lave ») : les deux tampons.
  Survoler une jauge affiche la quantité à la manière de Mekanism, puis « Niveau : N % », « Produit par les modules : +N mB/t » (seulement quand un module de ce
  fluide est installé), « Apporté par les tuyaux : +N mB/t » et « Utilisé par les lignes : −N mB/t ».
- **Emplacement de fluide et baie** sous chaque jauge : l'emplacement au-dessus de la baie prend un seau ou un Réservoir
  de fluide Mekanism de ce fluide ; la baie prend la Hydro Condenser Upgrade (côté eau) ou la Magma Synthesizer Upgrade
  (côté lave), jusqu'à quatre chacune. Tous deux montrent un objet fantôme grisé quand ils sont vides.
- **Écran de production** (au milieu) : en haut, « En production · N blocs/s » pendant la marche, ou une icône
  d'avertissement et la raison de l'arrêt (« Manque d'eau », « Manque de lave », « Manque d'énergie » ; les autres états, comme une sortie
  ralentie ou pleine, ont leur propre texte). Le survoler affiche le débit de la Plant, et la première ligne qui attend et ce
  qui lui manque (« 12 blocs/s · ligne 3 : attend l'eau »).
- **Huit cases de produit** en grille de 4 × 2 : chacune montre le produit de sa ligne, ou un « + » quand la ligne est vide.
  Une petite icône d'avertissement dans le coin d'une case signale que cette ligne attend (ou tourne au ralenti). Survoler une
  case affiche « Ligne N : produit », son débit en blocs/s, ce qu'elle attend (eau, lave, énergie ou place), « Clic : choisir son
  produit » et « Maj + clic : toutes les lignes ». Cliquer sur une case ouvre la **fenêtre de produit**, intitulée « Ligne N : produit » :
  tous les produits, 14 par page avec des flèches de page et un compteur ; un clic règle cette ligne, un Maj + clic règle
  les huit lignes, et le bouton **Vider la ligne** vide seulement celle-ci.
- **Tampon interne** (sous les cases) : une icône de coffre, « Tampon interne », le nombre rapporté à la capacité du tampon
  (par exemple « 120 / 2 304 ») et une barre. Le nombre est celui des blocs finis qui attendent une sortie.
- **Barre d'énergie et emplacement de recharge** (en bas) : la barre d'énergie horizontale et l'onglet d'énergie de Mekanism
  (survoler l'onglet pour l'affichage d'énergie habituel de Mekanism, y compris l'énergie utilisée à ce tick), avec un
  emplacement sous la baie de lave pour recharger la Plant directement depuis une batterie ou un Cube d'énergie.

## Automatisation

L'entrée d'eau et l'entrée de lave de la Plant, son port d'énergie et ses deux sorties d'objets sont **fixes** et ne
peuvent pas être réattribués : c'est l'approche que Mekanism suit pour le Mineur digital. Casser la Plant, depuis
n'importe lequel de ses 27 blocs, donne un seul objet qui garde les deux tampons, son énergie, les produits choisis pour ses lignes, ses
améliorations et ses modules installés.

## Configuration

Section `petrogenic_synthesis` de `mekanismengineering-server.toml` (partagée avec le [Petrogenic
Synthesizer](Petrogenic-Synthesizer.md) ; seules les clés propres à la Plant sont listées ici) :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `plantLineTicks` | 5,0 | 0,05–72 000,0 | Ticks que met une ligne pour un bloc de Pierres sans Mise à niveau de la vitesse. |
| `plantEnergyUsage` | 1 280 J/t | 0–max | Énergie consommée par tick avec les huit lignes sur des Pierres, sans amélioration. |
| `plantEnergyStorage` | 64 000 000 J | 1–max | Énergie stockée sans Mise à niveau énergétique. |
| `plantTankCapacity` | 2 000 000 mB | 1 000–max | Capacité de chacun des deux tampons (eau, lave). |
| `hydroCondenserRate` | 1 000 mB/t | 0–1 000 000 | Eau qu'une Hydro Condenser Upgrade fabrique au plus. |
| `hydroCondenserEnergyPerMb` | 5,0 J | 0,0–1 000 000,0 | Énergie par mB d'eau fabriquée ; non réduite par les Mises à niveau énergétiques. |
| `magmaSynthesizerRate` | 1 000 mB/t | 0–1 000 000 | Lave qu'une Magma Synthesizer Upgrade fabrique au plus. |
| `magmaSynthesizerEnergyPerMb` | 1 000,0 J | 0,0–1 000 000,0 | Énergie par mB de lave fabriquée ; non réduite par les Mises à niveau énergétiques. |

Contrairement au Synthesizer, la consommation d'eau et de lave par bloc de la Plant n'augmente **pas** avec les Mises à
niveau de la vitesse : seule sa vitesse augmente. Les chiffres ci-dessous sont cumulés sur les huit lignes, pour des Pierres :

| Mises à niveau de la vitesse | Vitesse (cumulée) | Énergie | Eau (cumulée) | Lave (cumulée) |
|---|---|---|---|---|
| 0 | 32 blocs/s | 1 280 J/t | 400 mB/t | 400 mB/t |
| 4 | 101 blocs/s | 12 800 J/t | 1 265 mB/t | 1 265 mB/t |
| 8 | 320 blocs/s | 128 000 J/t | 4 000 mB/t | 4 000 mB/t |

## Conseils et dépannage

- L'alimentation extérieure par tuyaux passe toujours en premier : les Hydro Condenser Upgrades et Magma Synthesizer
  Upgrades ne remplissent que ce qui manque encore au tampon, et ne gaspillent donc jamais d'énergie à compléter un tampon que les tuyaux remplissent déjà.
- Le coût de la Magma Synthesizer Upgrade (1 000 J/mB, une Pastille de Polonium pour la fabriquer) est volontairement
  élevé : l'autonomie complète en fluides avec quatre modules de chaque est un objectif endgame, pas une amélioration de début de partie.
- Le tampon d'objets contient 2 304 objets répartis sur 36 emplacements ; une fois plein, une ligne qui n'a plus où mettre son
  produit cesse de consommer de l'eau, de la lave et de l'énergie pour cette ligne au lieu de les gaspiller.
- Pour une installation compacte et déplaçable, voir plutôt le [Petrogenic Synthesizer](Petrogenic-Synthesizer.md).
