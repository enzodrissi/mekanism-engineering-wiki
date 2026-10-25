<!-- source: 6e62af4819e42abeccd2325adc7cc62ca26f98df -->
# Récepteur d'énergie quantique

> Prélève l'énergie d'une fréquence Quantum existante et l'injecte dans la machine sur sa face de fixation.

![Récepteur d'énergie quantique](images/quantum_energy_receiver.png)

| | |
|---|---|
| Type | Machine (plaque fixée sur une face) |
| Ajouté en | 0.6 |
| Taille | Plaque fine (4 px), fixée sur une face d'un autre bloc |
| Énergie | Fournit jusqu'au débit de son palier (suit la sortie des paliers du Cube d'énergie de Mekanism) ; ne stocke rien en propre au-delà d'une petite réserve en transit |
| Améliorations | Aucune |
| Configuration des faces | Oui (Mekanism), mais seule la face contre laquelle il est fixé est active |

## Ce qu'il fait

Une plaque qui se fixe sur n'importe quelle face d'un autre bloc, dessus, dessous ou sur un côté, et alimente ce bloc avec
l'énergie prélevée sur une **fréquence Quantum** existante : les mêmes fréquences d'inventaire que partagent les Entangloporteurs
quantiques de Mekanism. Il ne déplace que de l'énergie : ni objets, ni fluides, ni produits chimiques, ni chaleur, et il ne renvoie
jamais d'énergie sur la fréquence. Il existe quatre paliers (Basic, Advanced, Elite, Ultimate) ; seul le débit de transfert maximal
change de l'un à l'autre, au même niveau que le débit du Cube d'énergie de chaque palier.

Palier et débit maximal :

| Palier | Débit (défaut de Mekanism) |
|---|---|
| Basic | 4 000 J/t (Cube énergétique de base) |
| Advanced | 16 000 J/t (Cube d'énergie avancé) |
| Elite | 64 000 J/t (Cube d'énergie d'élite) |
| Ultimate | 256 000 J/t (Cube d'énergie ultime) |

## Fabrication

(Les paliers des Récepteurs sont aussi des familles dans le [Contrôleur de réseau quantique](Quantum-Network-Controller.md) : Receivers
Basic, Advanced, Elite et Ultimate.)

Basic :

![Recette du Récepteur d'énergie quantique (Basic, puis un palier au-dessus)](images/quantum_energy_receiver-recipe.png)

```
RTR
EBE
RIR
```

- `R` : n'importe quelle Poudre de redstone (tag `c:dusts/redstone`) ×4
- `T` : Noyau de téléportation ×1
- `E` : Tablette d'énergie ×2
- `B` : Cube énergétique de base ×1
- `I` : n'importe quel Lingot de fer (tag `c:ingots/iron`) ×1

Advanced, Elite et Ultimate utilisent le même motif, fabriqués avec le Récepteur du palier précédent pour que ses données (faces, mode
redstone, énergie en transit) soient conservées ; sa fréquence ne l'est pas (voir [Automatisation](#automation)) :

```
ARA
CXC
AMA
```

| Palier | `A` (alliage, ×4) | `R` (palier précédent, ×1) | `C` (circuit, ×2) | `X` (Cube d'énergie, ×1) | `M` (métal, ×1) |
|---|---|---|---|---|---|
| Advanced | Alliage infusé | Récepteur d'énergie quantique Basic | Circuit de contrôle avancé | Cube d'énergie avancé | Lingot d'Osmium |
| Elite | Alliage renforcé | Récepteur d'énergie quantique Advanced | Circuit de contrôle d'élite | Cube d'énergie d'élite | Lingot d'or |
| Ultimate | Alliage atomique | Récepteur d'énergie quantique Elite | Circuit de contrôle ultime | Cube d'énergie ultime | Diamant |

(`C` et `M` utilisent des ingrédients par tag : n'importe quel circuit ou métal du palier correspondant.)

## Premiers pas

1. Fabriquer un Récepteur d'énergie quantique Basic (ou d'un palier supérieur, une fois un Récepteur amélioré dans la grille de fabrication).
2. Le Récepteur en main, faire un clic droit sur n'importe quelle face de la machine à alimenter : il se fixe sur cette face comme
   une plaque.
3. Faire un clic droit sur le Récepteur lui-même pour ouvrir son écran.
4. Ouvrir l'onglet **Fréquence** et lier une fréquence d'inventaire accessible (Publique, Confiance ou Privé) : la même fréquence que
   partagent les Entangloporteurs quantiques. L'onglet ouvre la fenêtre de fréquences de Mekanism, on peut donc aussi y créer une
   fréquence, ou supprimer l'une des siennes.
5. Dès que la fréquence contient de l'énergie et que la machine derrière la plaque peut l'accepter, le Récepteur commence à
   fournir automatiquement, jusqu'au débit de son palier.
6. Utiliser l'onglet **Faces** (ou un Configurateur) pour déplacer la plaque sur une autre face du même bloc.

## L'interface

![Interface du Récepteur d'énergie quantique](images/quantum_energy_receiver-gui.png)

- **Écran du haut** : le nom de la fréquence liée (ou « Aucune fréquence liée »), avec son mode de sécurité (Publique / Fiable
  / Privée) à droite.
- **Écran central** : le débit fourni en grand, une barre qui montre ce débit par rapport au maximum du palier (« sur
  X/t · nom du palier » en dessous), une ligne d'état en couleur, et l'énergie totale stockée sur la fréquence en bas.
- **Onglet Énergie** (à gauche) : l'énergie stockée sur la fréquence, et le débit fourni.
- **Onglet Fréquence** (à gauche) : la fenêtre de fréquences de Mekanism, la même que sur le Quantum Digital Miner et le Quantum
  Chargepad : les filtres Publique / Confiance / Privé, une liste déroulante, et les commandes pour lier, créer et supprimer une fréquence
  (il n'y a pas de bouton Délier séparé). Une fréquence dont le stock radioactif contient encore quelque chose ne peut être supprimée depuis aucun bloc de ce mod.
- **Onglet Faces** (à gauche) : la croix des six faces du monde de Mekanism ; chaque bouton de face montre le bloc voisin, et
  cliquer sur l'un d'eux y déplace la plaque.
- **La ligne d'état** couvre chaque raison pour laquelle rien ne passe, jamais d'attente silencieuse : « Machine connectée » (en vert, avec
  le nom du bloc alimenté et la face), « Aucune destination énergétique » (rien qui accepte l'énergie derrière la plaque, ou aucune face choisie),
  « Aucune fréquence liée », « Arrêté par le contrôle redstone », ou « En transit : … » (un reste refusé en cours de nouvel essai).

## Automatisation

- La configuration des faces existe, à la manière de Mekanism, mais ne porte jamais qu'une seule face de type Énergie : celle
  contre le bloc alimenté. Choisir une autre face dans la fenêtre Faces, ou avec un Configurateur, déplace physiquement la plaque : elle
  alimente toujours ce qu'elle touche.
- Aucune automatisation d'objets, de fluides, de produits chimiques ou de chaleur : ce bloc ne déplace que de l'énergie.
- Le casser conserve dans l'objet lâché sa face choisie, son mode redstone et toute énergie prise en cours de transfert. Il **ne garde
  jamais sa fréquence**, quel que soit celui qui le casse : un Récepteur posé démarre toujours délié et la fréquence se choisit sur son
  écran, ainsi un Récepteur cassé ou copié par quelqu'un d'autre ne peut pas puiser dans le réseau privé de l'ancien propriétaire. Une Carte
  de configuration ne le lie qu'à une fréquence qui existe encore ; elle n'en recrée jamais une supprimée.

## Configuration

Pas de section dédiée dans `mekanismengineering-server.toml`. Le débit maximal de chaque palier suit la configuration de sortie des
paliers du Cube d'énergie de Mekanism, donc un modpack qui change la sortie des Cubes d'énergie change aussi celle des Récepteurs correspondants.

## Conseils et dépannage

- **Aucune fréquence liée** : ouvrir l'onglet Fréquence et en lier une, ou en créer une. Un Récepteur démarre toujours délié
  après avoir été posé ou fabriqué.
- **Aucune destination énergétique** : la face de la plaque n'a actuellement aucun bloc qui accepte l'énergie derrière elle (ou le chunk
  n'est pas chargé) ; vérifier sur quoi elle est fixée.
- **Arrêté par le contrôle redstone** : vérifier l'onglet de mode redstone du Récepteur.
- **En transit : …** : la cible a brièvement refusé une partie de l'énergie ; le Récepteur réessaie de la livrer (d'abord vers la
  fréquence source si c'est encore possible, sinon directement vers la cible) au lieu de la perdre. Si le mode de sécurité de la
  fréquence change pendant que de l'énergie est en transit, l'énergie retourne à la fréquence, pas à la machine.
- Seule l'énergie passe par ce bloc ; il n'affichera jamais de valeurs d'objets, de fluides, de produits chimiques ou de chaleur.
- Avec Jade ou WTHIT, un Récepteur affiche son nom et la fréquence qu'on a le droit d'utiliser, sans barre d'énergie (voir
  [JEI, Jade et WTHIT](JEI-Jade-WTHIT.md)).
