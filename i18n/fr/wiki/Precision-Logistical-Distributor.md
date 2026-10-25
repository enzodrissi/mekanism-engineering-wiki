<!-- source: 015acec8869f92460ef887e82165503eb3797fcd -->
# Precision Logistical Distributor

> Répartit les objets en attente entre ses faces de sortie, en parts équilibrées ou pondérées, exactes dans la durée.

![Precision Logistical Distributor](images/precision_logistical_distributor.png)

| | |
|---|---|
| Type | Machine |
| Taille | 1 bloc |
| Énergie | Aucune |
| Améliorations | Vitesse (jusqu'à 8) |
| Configuration des faces | Oui (Mekanism) |

## Ce qu'il fait

Le Distributor met en tampon les objets reçus sur une ou plusieurs faces d'entrée et les distribue à ses faces de sortie à chaque cycle, soit
en **parts égales** (« Équilibré »), soit en parts réglées face par face (« Pondéré »). Il distribue des objets entiers et tient le compte
de chacun, si bien qu'à la longue chaque sortie reçoit **exactement** sa part. Son écran montre la répartition idéale d'un lot
de référence ; un seul lot réel peut s'en écarter d'un ou deux objets (voir *Arrondi d'un lot à l'autre* plus bas).

À chaque cycle, un curseur parcourt les 9 emplacements du tampon et rassemble un lot : toutes les unités du même objet avec les mêmes
composants, où qu'elles soient dans le tampon, jusqu'à 576 objets (neuf piles de 64). Ce lot est ensuite réparti entre toutes les
faces de sortie actuellement branchées :

- **Équilibré** : parts égales, en simple tourniquet : un lot de 61 sur trois sorties donne 21/20/20, puis
  20/21/20, puis 20/20/21 sur les lots suivants, si bien qu'aucune sortie n'est toujours favorisée.
- **Pondéré** : parts proportionnelles aux poids réglés pour chaque sortie (1 à 99 999).

### Équitable dans la durée

La répartition ne dépend pas de la façon dont les objets arrivent. Les objets sont distribués un par un par un tourniquet
pondéré lissé qui se souvient où il en est : 100 objets arrivant un par un, par petits lots ou en une pile complète
finissent tous répartis de la même façon : 75/25 reste 75/25 même quand un transporteur lent ou un Entonnoir n'apporte qu'un objet à la fois.
Un seul type d'objet qui circule seul reste à tout moment à un ou deux objets du rapport choisi ; un type mélangé à
d'autres reste à trois objets au plus.

- **Par type d'objet** : chaque type d'objet (objet et composants, les 32 derniers types distribués) garde son propre équilibre. De la Roche
  et du fer qui arrivent tour à tour sont chacun répartis selon le rapport choisi, au lieu d'être triés un par sortie.
- **Le flux entier** : chaque objet compte aussi dans un équilibre commun de ce que le flux doit à chaque sortie. Les objets dont
  la machine ne se souvient pas (tout nouveaux, tous différents comme des objets renommés ou endommagés, ou plus de 32 types) partent
  de cet équilibre, et gardent donc eux aussi le rapport choisi, quel que soit leur regroupement. Un mélange de nombreux types dans un ordre aléatoire peut tout de même s'écarter
  du rapport exact, au total, de quelques objets, sans que l'écart s'accumule.
- **Une sortie qui ne peut pas prendre d'objets** (pleine, retirée, ou la face par laquelle un objet est entré) est sautée et garde sa
  place, et pendant ce temps les autres sorties se partagent chaque objet selon leur propre rapport : une machine lente sur une face ne fait pas pencher
  les autres. Dès qu'elle reprend des objets, elle retrouve sa part normale. Elle ne rattrape pas ce qu'elle a manqué.
- **Changer un réglage** (mode, poids, rôle d'une face) applique la nouvelle répartition dès l'objet suivant.
- Cet équilibre est enregistré avec la machine : il survit à un redémarrage, au rechargement d'un tronçon, et au fait de casser puis reposer la machine.

**Attendre chaque sortie** change ce qui se passe quand une sortie refuse une partie de sa part : désactivé, une part refusée est
redistribuée aux autres sorties, selon leurs poids, jusqu'à ce que plus rien ne rentre ; activé, le lot n'est envoyé que si *chaque*
sortie peut prendre toute sa part ; sinon rien ne bouge et l'état affiche « Attend chaque sortie ». Toute direction par laquelle le lot
est entré (même après une fusion, une rotation ou une reconfiguration) est exclue comme destination de ce lot, si bien qu'il
ne repart jamais directement d'où il vient.

Quand une sortie se remplit tout juste, les deux modes peuvent placer l'objet suivant sur des sorties différentes : désactivé, la sortie pleine
est retirée du tour suivant, tandis qu'activé, la répartition d'origine est gardée pour tout le lot. Les deux gardent chaque objet.

## Fabrication

![Recette du Precision Logistical Distributor](images/precision_logistical_distributor-recipe.png)

```
RER
TXT
RSR
```

- `R` : tout Alliage renforcé (tag `mekanism:alloys/reinforced`) ×4
- `E` : tout Circuit de contrôle d'élite (tag `c:circuits/elite`) ×1
- `T` : Transporteur logistique d'élite ×2
- `X` : Boîtier en acier ×1
- `S` : Trieur logistique ×1

## Prise en main

1. Fabriquer le Distributor (voir Fabrication plus haut).
2. Le poser là où il peut recevoir des objets sur une face et atteindre, sur les autres, les inventaires à alimenter.
3. Faire un clic droit dessus pour ouvrir son écran.
4. Régler ses faces avec l'onglet de configuration des faces de Mekanism (ou clic droit accroupi avec le Configurateur) : choisir
   « Entrée », « Sortie » ou « Entrée / Sortie » pour chaque face. Par défaut, l'arrière est en Entrée et l'avant, la gauche et la droite en Sortie.
5. Choisir un mode de distribution : **Équilibré** ou **Pondéré**.
6. En mode Pondéré, appuyer sur « Configurer la répartition », choisir une face de sortie, et utiliser − / + pour régler combien d'objets du
   lot de référence cette face doit recevoir (Maj-clic pour ±10, Ctrl-clic pour le minimum ou le maximum).
7. Apporter des objets sur n'importe quelle face d'entrée. Le Distributor met en tampon jusqu'à 9 piles et commence à distribuer automatiquement à
   chaque cycle.

## L'interface

![Interface du Precision Logistical Distributor](images/precision_logistical_distributor-gui.png)

- **État** : « Actif », « Inactif », « Bloqué », « Tampon plein », « Aucune sortie », « Attend chaque sortie », « Désactivé » ou « Arrêté par la redstone ».
- **Cadence** : « Max. 9 piles / X s », avec une infobulle qui détaille le nombre de ticks et le plafond de 576 objets.
- **Mode** : boutons « Équilibré » / « Pondéré » ; le bouton actif est mis en évidence.
- **Attendre chaque sortie** : un seul bouton, allumé quand l'option est activée (l'état se lit à la barre allumée, comme pour Équilibré et Pondéré), avec une
  infobulle qui décrit l'état actuel et l'effet du prochain clic. La même option se trouve dans la barre du bas de la fenêtre « Configurer
  la répartition ».
- **Entrées / Sorties** : un court résumé des faces configurées, par exemple « 1 entrée · 3 sorties ».
- **Tampon** : une grille de 3×3 (9 emplacements), avec un affichage « nombre / capacité » ; dépôt, retrait et Maj-clic fonctionnent
  comme dans un conteneur normal.
- **Configurer la répartition** : ouvre une vue 3D dimétrique fixe du bloc et de ses six voisins, reliés par
  des lignes droites le long des arêtes du cube. Un bouton ↻ tourne la vue d'un quart de tour (Maj-clic : dans l'autre sens) ; le
  bloc lui-même ne bouge jamais. « Côté du joueur » marque l'endroit où se tient le joueur. Chaque voisin montre le rôle de sa face dans Mekanism
  et, pour une sortie, sa part et son nombre d'objets pour le lot ci-dessous ; le survol montre le bloc, son rôle, sa part exacte ou
  approchée, et son débit en objets/s.
  - La barre du bas montre Équilibré/Pondéré, Attendre chaque sortie, le bouton de rôle de la face sélectionnée, et − / + autour d'un
    pourcentage et d'un nombre d'objets (par ex. « 60,00 % · 38 / 64 ») avec une barre de progression. Un clic change le nombre de 1, un Maj-clic
    de 10, un Ctrl-clic passe au minimum (1) ou au maximum. La taille du lot elle-même ne change pas : les autres
    sorties absorbent la différence proportionnellement, en commençant par celles qui n'ont pas encore été réglées à la main. Depuis Équilibré,
    changer un nombre fait passer la machine en Pondéré.
  - « Aperçu pour [n] objets » (1 à 99 999, par défaut la dernière taille de lot réglée, 64 au départ) et le débit
    calculé en objets/s et objets/t : `min(batch, buffer capacity) × 20 / ticks per cycle`, en supposant une entrée suffisante et des sorties
    libres.

**Arrondi d'un lot à l'autre** : les nombres affichés dans « Configurer la répartition » décrivent la répartition idéale d'un lot
de référence et restent fixes d'un affichage à l'autre. Les lots réels suivent l'équilibre dans la durée décrit plus haut, si bien qu'un seul lot
peut s'en écarter d'un ou deux objets tandis que le total garde le rapport choisi. Une part qui ne tombe pas juste est affichée
avec un « ≈ » et une infobulle : « Le reste alterne d’un lot à l’autre. » Une part sans « ≈ » tombe juste.

## Automatisation

- Les faces se configurent comme sur toute machine de Mekanism (onglet de configuration des faces, Configurateur en clic droit accroupi, ou
  Carte de configuration) : AUCUN, ENTRÉE, SORTIE ou ENTRÉE / SORTIE, par rapport à l'orientation du bloc (AVANT/ARRIÈRE/GAUCHE/DROITE/
  DESSUS/BAS). ENTRÉE accepte l'insertion de l'extérieur (transporteurs, Entonnoirs, autres mods) ; SORTIE expose un point de connexion
  qui n'accepte jamais ni insertion ni extraction : le Distributor ne tire jamais lui-même depuis un inventaire
  voisin.
- Le casser conserve son inventaire, ses faces, ses mises à niveau, sa sécurité et son mode redstone (composants propres à Mekanism), ainsi que son
  mode, son réglage Attendre chaque sortie, ses poids et son équilibre d'équité, copiés dans l'objet obtenu.
- Le surplus refusé retourne dans le tampon dès qu'il y a de la place ; les piles identiques fusionnent ; la liste de
  surplus contient au plus 64 entrées et le reste tombe au sol près de la machine (jamais détruit), avec un seul
  avertissement journalisé par machine.
- Aucune énergie n'est consommée ; seules les Mises à niveau de la vitesse changent la durée du cycle (voir plus bas).

## Configuration

Section `distributor` de `mekanismengineering-server.toml` :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | `true` | booléen | Active le Distributor. Désactivé, il refuse les entrées et arrête de distribuer. |
| `intervalTicks` | `40` | 40–1200 | Ticks de base entre deux cycles de distribution, avant les Mises à niveau de la vitesse. Les valeurs enregistrées inférieures à 40 par d'anciennes versions sont corrigées à 40 au chargement. |

### Mises à niveau de la vitesse et intervalle

Le Distributor n'accepte que les **Mises à niveau de la vitesse** (jusqu'à 8, l'objet standard de Mekanism) : aucun emplacement pour les mises à niveau énergétique, de l'étouffement, d'ancrage
ni pour d'autres. La durée de base d'un cycle est `intervalTicks` (40 ticks = 2 s à 20 TPS par défaut) ; chaque Mise à niveau
de la vitesse la raccourcit selon la formule de Mekanism, pilotée par le `maxUpgradeMultiplier` de Mekanism (10 par défaut) : avec
8 Mises à niveau de la vitesse et les réglages par défaut, un cycle descend à 4 ticks (0,2 s). Les mises à niveau installées se gèrent dans
l'onglet « Améliorations » de Mekanism, et la ligne de cadence de l'écran se met à jour en conséquence. Le premier cycle après la pose du bloc, ou après l'ajout ou le retrait d'une
mise à niveau, peut démarrer immédiatement.

## Astuces et dépannage

- **Attend chaque sortie** signifie que les parts du lot en cours ont été refusées par au moins une sortie alors que l'option Attendre chaque sortie est activée ;
  rien ne bouge tant que chaque sortie ne peut pas prendre toute sa part. Désactiver Attendre chaque sortie pour que les parts refusées soient
  redistribuées automatiquement.
- **Tampon plein** signifie que les 9 emplacements sont occupés par des objets que le Distributor n'a pas encore réussi à envoyer : vérifier que
  les sorties sont branchées et ont de la place.
- Un pourcentage dans la vue de répartition décrit les parts *configurées*, pas une capacité disponible garantie : si l'inventaire réel
  d'une destination est plus petit que sa part, ou si plusieurs faces mènent au même stockage, une livraison peut
  tout de même être incomplète. Les refus restent dans le tampon ; les livraisons déjà faites ne sont jamais annulées. Une sortie qui
  prend moins que ce qu'elle annonçait n'est pas sautée comme une sortie pleine : sa part réelle baisse de ce qu'elle a refusé.
- Alimenter un Distributor un objet à la fois ne pose aucun problème : le rapport se maintient dans la durée quelle que soit la taille des lots. Si
  une sortie semble recevoir moins que sa part, vérifier qu'elle n'est ni pleine ni absente (elle est sautée pendant ce temps, sans
  rattrapage ensuite).
