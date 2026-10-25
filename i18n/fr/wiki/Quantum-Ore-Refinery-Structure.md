<!-- source: 56199d08ae988eb2f90adf0718a21d8f5d66305e -->
# Quantum Ore Refinery : structure et pièces

> Le plan fixe de 10 × 4 × 3 de la [Quantum Ore Refinery](Quantum-Ore-Refinery.md), couche par couche, avec chaque bloc et sa recette.


## Lire le plan

La raffinerie mesure 10 blocs de long, 4 de haut et 3 de profondeur. Chaque couche ci-dessous est une **vue en plan, de dessus, telle qu'on la voit
en se tenant devant le contrôleur** : la ligne du haut d'une couche est la rangée du fond, la ligne du bas est la rangée de devant (la rangée
où se trouve le contrôleur), et la gauche et la droite sont celles du joueur. La couche 1 est celle du bas, au niveau du contrôleur.

- Le **contrôleur** (`KC`) est sur la rangée de devant de la couche 1, deuxième bloc en partant de la gauche. Il se tourne vers le joueur quand on le pose :
  la structure se dresse derrière lui et à sa droite (huit blocs à droite du contrôleur, deux derrière lui).
- Le plan tourne par quarts de tour avec le contrôleur et n'est **jamais mis en miroir**.
- Seule la **sorte de bloc** compte dans chaque case, pas son orientation.
- Le plan est la structure **par défaut** : c'est ce que construit `/mekeng build` et ce que montre la page JEI. Quelques cases
  acceptent plus que ce qui y est dessiné (voir [Ports](#ports) ci-dessous) ; la page JEI les marque « au choix ».

| Code | Bloc | Code | Bloc |
|---|---|---|---|
| `PI` | Pilier de raffinerie de minerai | `IP` | Port d'entrée de raffinerie de minerai |
| `CS` | Carcasse de raffinerie de minerai | `OP` | Port de sortie de raffinerie de minerai |
| `GR` | Poutre de raffinerie de minerai | `EP` | Port d'énergie de raffinerie de minerai |
| `CV` | Tapis de raffinerie de minerai | `KC` | Contrôleur de la Quantum Ore Refinery |
| `AC` | Accélérateur de raffinerie de minerai **ou** Carcasse de raffinerie de minerai | `QM` | Case libre qui accepte aussi le Module quantique de raffinerie de minerai facultatif |
| `..` | Case libre : air, Vitre de raffinerie de minerai ou Carcasse de raffinerie de minerai | | |
| `TA` | Réservoir d'acide sulfurique de raffinerie de minerai | `TW` | Réservoir d'eau de raffinerie de minerai |
| `TH` | Réservoir de chlorure d'hydrogène de raffinerie de minerai | `TO` | Réservoir d'oxygène de raffinerie de minerai |
| `DI` | Module de dissolution | `WA` | Module de lavage |
| `CR` | Module de cristallisation | `IN` | Module d'injection |
| `PU` | Module de purification | `EN` | Module d'enrichissement |
| `SM` | Module de fonte | | |

(Les sept modules de traitement s'appellent « Module de dissolution de raffinerie de minerai », « Module de lavage de raffinerie de minerai », etc.)

```
Layer 1 (bottom, the controller's level)
  back    PI CS IP IP CS IP IP EP CS PI
  middle  IP CS CS CS CS CS CS CS CS OP
  front   PI KC DI WA CR IN PU EN SM PI

Layer 2
  back    PI CS CS CS CS CS CS CS CS PI
  middle  .. .. TA TW .. TH TO .. .. QM
  front   PI CV CV CV CV CV CV CV CV PI

Layer 3
  back    PI AC AC AC AC AC AC AC AC PI
  middle  .. .. TA TW .. TH TO .. .. ..
  front   PI .. .. .. .. .. .. .. .. PI

Layer 4 (top)
  back    PI GR GR GR GR GR GR GR GR PI
  middle  GR .. .. .. .. .. .. .. .. GR
  front   PI GR GR GR GR GR GR GR GR PI
```

Les quatre cases de réservoir (`TA`, `TW`, `TH`, `TO`) sont chacune une colonne **de deux blocs de haut**, sur les couches 2 et 3 (les capacités sont
les mêmes qu'avant). La couche 4 est le toit.

## Liste des matériaux

92 blocs sont obligatoires ; le module facultatif et les cases libres viennent en plus.

| Bloc | Nombre | Remarques |
|---|---|---|
| Carcasse de raffinerie de minerai | 19 | Plus une pour chacune des huit places d'accélérateur remplies d'une carcasse au lieu d'un accélérateur |
| Poutre de raffinerie de minerai | 18 | |
| Pilier de raffinerie de minerai | 16 | Quatre colonnes d'angle de quatre ; les piliers se raccordent à ceux du dessus et du dessous |
| Tapis de raffinerie de minerai | 8 | |
| Port d'entrée de raffinerie de minerai | 5 | Le nombre du plan ; on peut en construire plus (voir [Ports](#ports)) |
| Port de sortie de raffinerie de minerai | 1 | Facultatif (0 ou 1) |
| Port d'énergie de raffinerie de minerai | 1 | Le nombre du plan ; au moins 1 |
| Contrôleur de la Quantum Ore Refinery | 1 | |
| Modules de traitement | 7 | Un de chaque sorte |
| Blocs de réservoir | 8 | Deux de chacune des quatre sortes |
| Accélérateur ou Carcasse de raffinerie de minerai | 8 | Places pour 0 à 8 accélérateurs ; chaque accélérateur raccourcit un travail (voir [Vitesse et accélérateurs](Quantum-Ore-Refinery.md#speed-and-accelerators)) |
| Cases libres | 27 | Air, Vitre de raffinerie de minerai ou Carcasse de raffinerie de minerai |
| Module quantique de raffinerie de minerai | 0 ou 1 | Facultatif, dans la case marquée `QM`, ou à la place du port de sortie |

Exactement 84 cases demandent un bloc précis et 8 acceptent un accélérateur ou une carcasse : 92 en tout.

## Ports

Les ports sont les portes de la structure ; ce sont tous des blocs simples. La raffinerie les compte dans leur ensemble, donc **leur emplacement
est au choix** dans le cadre de ces règles :

- **Nombres** : **au moins cinq Ports d'entrée, au moins un Port d'énergie, et au plus un Port de sortie** (il est facultatif). Le
  plan a cinq Ports d'entrée, un Port de sortie et un Port d'énergie, et c'est ce que construit `/mekeng build` et ce que
  montre JEI, mais on peut mettre davantage de Ports d'entrée et de Ports d'énergie sur les cases qui acceptent un port. Avec trop peu de Ports d'entrée ou de
  Ports d'énergie, ou un second Port de sortie, la structure ne se forme pas et l'écran du contrôleur indique que le nombre de ports est
  incorrect.
- **Pas de Port de sortie ?** La structure se forme quand même, mais la raffinerie ne travaille pas tant que les produits n'ont nulle part où aller :
  un [Module quantique](Quantum-Ore-Refinery.md#the-quantum-module) avec une fréquence choisie. En attendant, l'écran indique
  « Pas de sortie » avec un avertissement. Rien n'est prélevé ni perdu, et elle se met au travail dès qu'on ajoute le port ou qu'on lie le module.
- **La rangée du fond des couches 1 et 2** (les huit cases de chaque couche entre les deux piliers d'angle) accepte une carcasse ou
  **n'importe quel port**. Sur la couche 2, la rangée du fond accepte aussi la Vitre de raffinerie de minerai.
- **Les deux bouts de la rangée du milieu de la couche 1** (le bout gauche et le bout de sortie) acceptent une carcasse, un Port d'entrée ou le
  Port de sortie, **jamais un Port d'énergie**. Un Port d'entrée placé à un bout fonctionne **avec les objets seulement** : un Configurateur ne le fait pas passer
  aux fluides ni aux gaz à cet endroit.
- Le plan met les cinq Ports d'entrée sur la rangée du fond de la couche 1 et au bout gauche, le Port de sortie au bout droit,
  le Port d'énergie dans la moitié droite de la rangée du fond de la couche 1 (la case voisine est une carcasse).
- **Ports d'entrée** (`IP`, cinq ou plus) : un Configurateur fait passer chacun par **Objets** (affiché en rouge), **Fluides** (violet) et
  **Gaz** (jaune). Voir [Automatisation](Quantum-Ore-Refinery.md#automation).
- **Module quantique** : un au plus. Il prend la place du Port de sortie (la structure n'a alors pas de Port de sortie et
  envoie ses produits vers une fréquence Quantum ou un QIO) ou la case au-dessus (`QM`). S'il y a aussi un Port de sortie, le port
  sert de tampon de secours : ce que le module ne peut pas contenir sort par le port.
- Un port appartient à une seule raffinerie.

## Recettes

La raffinerie est une construction de fin de jeu, donc ses recettes demandent des pièces de fin de jeu de Mekanism. Toutes les recettes sont des crafts avec forme.
« N'importe quel » désigne un tag : n'importe quel **Alliage atomique** (`mekanism:alloys/atomic`), n'importe quel **Circuit de contrôle ultime**
(`c:circuits/ultimate`). La Carcasse de raffinerie de minerai se fabrique en premier, car elle sert à presque tout le reste.

| Bloc | Motif | Ingrédients | Donne |
|---|---|---|---|
| Carcasse de raffinerie de minerai | ` X ` / `XAX` / ` X ` | X Boîtier en acier ×4, A n'importe quel Alliage atomique | 4 |
| Pilier de raffinerie de minerai | `X` / `A` / `X` | X Boîtier en acier ×2, A n'importe quel Alliage atomique | 2 |
| Poutre de raffinerie de minerai | `X` / `A` | X Boîtier en acier, A n'importe quel Alliage atomique | 4 |
| Tapis de raffinerie de minerai | `TNT` | T Transporteur logistique ultime ×2, N Carcasse de raffinerie de minerai | 2 |
| Vitre de raffinerie de minerai | `XGX` | X Boîtier en acier ×2, G Verre structurel | 4 |
| Accélérateur de raffinerie de minerai | `AUA` / `SNS` / `AUA` | A n'importe quel Alliage atomique ×4, U n'importe quel Circuit de contrôle ultime ×2, S Mise à niveau de la vitesse ×2, N Carcasse de raffinerie de minerai | 1 |
| Port d'entrée de raffinerie de minerai | `UTU` / `PSG` / `ANA` | U n'importe quel Circuit de contrôle ultime ×2, T Transporteur logistique ultime, P Tuyau mécanique ultime, S Trieur logistique, G Tube pressurisé ultime, A n'importe quel Alliage atomique ×2, N Carcasse de raffinerie de minerai | 1 |
| Port de sortie de raffinerie de minerai | `UTU` / `AXA` / `ANA` | U n'importe quel Circuit de contrôle ultime ×2, T Transporteur logistique ultime, X Exporteur du OQO, A n'importe quel Alliage atomique ×4, N Carcasse de raffinerie de minerai | 1 |
| Port d'énergie de raffinerie de minerai | `UIU` / `APA` / `ANA` | U n'importe quel Circuit de contrôle ultime ×2, I Cellule à induction ultime, P Port à induction, A n'importe quel Alliage atomique ×4, N Carcasse de raffinerie de minerai | 1 |
| Contrôleur de la Quantum Ore Refinery | `UTU` / `AEA` / `MNM` | U n'importe quel Circuit de contrôle ultime ×2, T Noyau de téléportation, A n'importe quel Alliage atomique ×2, E Cube d'énergie ultime, M Chambre d'enrichissement ×2, N Carcasse de raffinerie de minerai | 1 |
| Réservoir d'acide sulfurique de raffinerie de minerai | `GNG` / `ACA` / `GNG` | G Verre structurel ×4, N Carcasse de raffinerie de minerai ×2, A n'importe quel Alliage atomique ×2, C Réservoir chimique Ultime | 1 |
| Réservoir d'eau de raffinerie de minerai | `GNG` / `AFA` / `GNG` | G Verre structurel ×4, N Carcasse de raffinerie de minerai ×2, A n'importe quel Alliage atomique ×2, F Réservoir de fluide ultime | 1 |
| Réservoir de chlorure d'hydrogène de raffinerie de minerai | `NGN` / `ACA` / `GGG` | G Verre structurel ×4, N Carcasse de raffinerie de minerai ×2, A n'importe quel Alliage atomique ×2, C Réservoir chimique Ultime | 1 |
| Réservoir d'oxygène de raffinerie de minerai | `GNG` / `ACA` / `GGG` | G Verre structurel ×5, N Carcasse de raffinerie de minerai, A n'importe quel Alliage atomique ×2, C Réservoir chimique Ultime | 1 |

Chacun des sept modules de traitement utilise `UAU` / `LXR` / `ANA` : **U** n'importe quel Circuit de contrôle ultime ×2, **A** n'importe quel Alliage atomique ×3,
**N** Carcasse de raffinerie de minerai, et trois machines Mekanism : **X** la machine propre au module au centre, **L** et **R** les
machines de ses deux voisins dans la ligne (le Module de fonte, dernier de la ligne, prend la Chambre d'enrichissement à gauche
et la Chambre de purification à droite).

| Bloc | X (centre) | L (gauche) | R (droite) |
|---|---|---|---|
| Module de dissolution de raffinerie de minerai | Chambre de dissolution chimique | Laveuse chimique | Cristalliseur chimique |
| Module de lavage de raffinerie de minerai | Laveuse chimique | Chambre de dissolution chimique | Cristalliseur chimique |
| Module de cristallisation de raffinerie de minerai | Cristalliseur chimique | Laveuse chimique | Chambre d'injection chimiques |
| Module d'injection de raffinerie de minerai | Chambre d'injection chimiques | Cristalliseur chimique | Chambre de purification |
| Module de purification de raffinerie de minerai | Chambre de purification | Chambre d'injection chimiques | Chambre d'enrichissement |
| Module d'enrichissement de raffinerie de minerai | Chambre d'enrichissement | Chambre de purification | Fonderie électrique |
| Module de fonte de raffinerie de minerai | Fonderie électrique | Chambre d'enrichissement | Chambre de purification |

Le **Module quantique de raffinerie de minerai** facultatif utilise `UTU` / `IQX` / `ANA` : U n'importe quel Circuit de contrôle ultime ×2, T Noyau de
téléportation, I Importeur du OQO, Q Entangloporteur quantique, X Exporteur du OQO, A n'importe quel Alliage atomique ×2, N Carcasse de raffinerie de minerai.

Les blocs de réservoir ne servent qu'à la forme : c'est le contrôleur qui contient l'eau et les trois produits chimiques. Tous les blocs sont dans l'onglet
créatif du mod, et chacun a une courte description dans son infobulle.

## Conseils

- Poser d'abord le contrôleur, tourné vers soi, puis compter vers la droite : les sept modules se suivent à côté de lui dans l'ordre
  Dissolution, Lavage, Cristallisation, Injection, Purification, Enrichissement, Fonte.
- Le bloc au-dessus du contrôleur est un tapis (couche 2) ; la case du module facultatif est tout au bout, au-dessus du port de sortie.
- Si la structure ne se forme pas, l'écran du contrôleur nomme le premier bloc incorrect et sa position.
