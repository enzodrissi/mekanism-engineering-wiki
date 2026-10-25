<!-- source: 950561433901033a99d13ead89afb010235c38b3 -->
# Quantum Portable Teleporter

> Le Téléporteur portable, en version adulte : sauter vers un Téléporteur de Mekanism, vers des coordonnées ou vers un endroit sûr au hasard.

![Quantum Portable Teleporter](images/quantum_portable_teleporter.png)

| | |
|---|---|
| Type | Outil |
| Ajouté en | 0.7 |
| Taille | Objet tenu en main, non empilable |
| Énergie | Sa propre batterie : `quantum_teleporter.energyCapacity` (1 000 000 000 J / 400 000 000 FE par défaut, 1 GJ), rechargée jusqu'à `quantum_teleporter.chargeRate` (5 000 000 J/t / 2 000 000 FE/t) depuis son propre écran ou n'importe quel chargeur de Mekanism |
| Améliorations | Aucune, c'est un outil, pas une machine |
| Configuration des faces | Non, c'est un objet, pas un bloc |

## Ce qu'il fait

Faire un clic droit avec le Quantum Portable Teleporter, dans l'une ou l'autre main, pour ouvrir son écran. Il porte sa propre batterie et
fait sauter le joueur de trois façons, choisies avec les boutons en haut de l'écran :

- **Teleporter** : sauter vers un Téléporteur de Mekanism réglé sur l'une des fréquences de Téléporteur du joueur (Publique, Confiance ou
  Privé, avec la sécurité de Mekanism). Choisir une fréquence dans la liste ; dès qu'un Téléporteur y est actif,
  « Téléporter » fait sauter directement là-bas, sans vérification séparée. Coûte 1 % de la batterie pleine.
- **Coordonnées** : taper X, Y, Z (ou cliquer sur « Ici » pour la position actuelle) dans une dimension choisie, éventuellement « Surface » pour
  atterrir sur le sol le plus haut au lieu d'un Y choisi, puis « Vérifier ». Le serveur charge ce seul endroit, confirme qu'il est
  sûr (ou déplace l'arrivée vers l'endroit sûr le plus proche) et montre l'arrivée réelle avant tout paiement. Coûte 50 % de
  la batterie pleine.
- **Aléatoire** : « Chercher » un endroit sûr quelque part entre 1 000 et 8 000 blocs dans la dimension actuelle.
  Les endroits manifestement mauvais (océan, vide) sont écartés sans rien charger ; seul le tronçon prometteur trouvé est
  chargé, brièvement, pour confirmer qu'il est sûr. La recherche est gratuite : seul le saut lui-même coûte de l'énergie, 25 % de la batterie
  pleine.

L'énergie n'est prise qu'au moment du saut lui-même : vérifier une destination ou chercher ne coûte jamais
rien, même sans se téléporter ensuite. En mode Créatif, le saut est gratuit. Un court temps de recharge suit chaque saut avant
de pouvoir sauter à nouveau, et la recherche aléatoire a son propre temps de recharge entre deux recherches.

Le téléporteur garde **une dernière destination**, c'est-à-dire ce qui a été *choisi*, et non l'endroit d'arrivée :

- après un saut vers des **coordonnées**, la dimension et les coordonnées tapées (et si « Surface » était activé) ;
- après un saut vers un **Téléporteur**, la fréquence visée (une fréquence reste une fréquence) ;
- un saut **aléatoire** ne garde ni l'un ni l'autre : un endroit au hasard n'est pas un choix. Le panneau latéral continue d'afficher la précédente.

Les deux n'existent jamais ensemble : un saut vers des coordonnées oublie la fréquence, et inversement. La dernière destination est
affichée à part, sur le côté de l'écran, et nommée dans l'infobulle de l'objet. **Reprendre** remet en place ce qui avait été choisi : il repasse
en mode « Teleporter » et sélectionne la fréquence, ou en mode « Coordonnées » et remplit à nouveau la dimension, les champs et « Surface ». Le bouton ne
téléporte jamais de lui-même : appuyer sur « Téléporter » une fois prêt (une destination par coordonnées demande toujours sa vérification). Un saut refusé
laisse la dernière destination telle quelle.

Comme tout objet de Mekanism, il a sa propre sécurité (Publique, Confiance ou Privé, réglée dans son onglet de sécurité) ; un exemplaire
privé ne s'ouvre et ne saute que pour son propriétaire.

## Fabrication

![Recette du Quantum Portable Teleporter](images/quantum_portable_teleporter-recipe.png)

```
HUH
TPT
AQA
```

- **H** (×2) : toute Pastille d'antimatière (`c:pellets/antimatter`)
- **U** : tout Circuit de contrôle ultime (`c:circuits/ultimate`)
- **T** (×2) : Noyau de téléportation
- **P** : Téléporteur portable
- **A** (×2) : tout Alliage atomique (`mekanism:alloys/atomic`)
- **Q** : Entangloporteur quantique

Résultat : 1 Quantum Portable Teleporter.

C'est une recette de fabrication spéciale : le Téléporteur portable au centre garde son énergie stockée et sa fréquence
réglée, toutes deux transmises au nouveau Quantum Portable Teleporter ; fabriquer donc l'objet avec un Téléporteur portable déjà chargé
et déjà réglé pour gagner une étape.

## Prise en main

1. Fabriquer l'objet avec la recette ci-dessus (voir Fabrication) : un Téléporteur portable déjà réglé et déjà chargé garde sa
   fréquence et son énergie dans le résultat, mais un neuf fonctionne aussi.
2. Faire un clic droit avec le Quantum Portable Teleporter, dans l'une ou l'autre main, pour ouvrir son écran.
3. Le recharger : mettre un cube d'énergie, une batterie ou n'importe quel objet énergétique de Mekanism dans l'emplacement sous la barre d'énergie, ou
   le recharger au préalable dans n'importe quel chargeur ou cube d'énergie de Mekanism, comme tout autre objet énergétique de Mekanism.
4. Choisir un mode en haut : « Teleporter » pour sauter vers l'une des fréquences de Téléporteur existantes, « Coordonnées » pour taper
   une destination et la vérifier, ou « Aléatoire » pour chercher un endroit sûr à 1 000 à 8 000 blocs.
5. Dès que la ligne d'état affiche une destination sûre et abordable, cliquer sur « Téléporter ».

## L'interface

![Interface du Quantum Portable Teleporter](images/quantum_portable_teleporter-gui.png)

- **Boutons de mode** (en haut) : « Teleporter », « Coordonnées », « Aléatoire » ; changer de mode annule ce que l'autre mode était en train
  de vérifier ou de chercher, sans aucun coût.
- **Radar** (à gauche) : le joueur au centre, le nord en haut, des anneaux gradués en blocs ; un point vert est une destination confirmée ou
  sélectionnée, un point ambre une destination par coordonnées pas encore vérifiée, un point rouge un essai aléatoire rejeté.
- **Panneau** (au milieu), selon le mode :
  - **Teleporter** : filtres Publique / Confiance / Privé sur la liste des fréquences de Téléporteur du joueur, chacune suivie de
    « prêt » ou « inactif » ; en choisir une la sélectionne exactement comme la liste de fréquences de Mekanism. Sous la liste :
    l'arrivée et « le Teleporter actif le plus proche », ou la raison du refus.
  - **Coordonnées** : un bouton de dimension (cliquer pour faire défiler, clic droit pour revenir en arrière), les champs X/Y/Z, « Ici » pour remplir
    la position du joueur, « Surface » pour chercher le sol le plus haut au lieu d'un Y fixe, et « Vérifier ».
  - **Aléatoire** : « Chercher » / « Chercher encore », la plage de distance configurée et, pendant la recherche ou une fois un endroit
    trouvé : l'essai qui l'a trouvé, le biome et les coordonnées, la distance, et le décompte des essais rejetés par raison
    (océan, lave, vide, autre).
- **Barre d'énergie** (à droite) : la barre d'énergie verticale de Mekanism, avec le coût du saut en cours affiché en bande ambre
  au-dessus de la charge, et l'emplacement de recharge en dessous.
- **Ligne d'état et bouton « Téléporter »** : l'état actuel ou la raison du refus d'un saut, en langage clair, et
  le bouton vert « Téléporter », actif seulement quand une destination est prête et abordable.
- **Affichage de la batterie et du coût** (en bas) : à gauche, l'énergie stockée en pourcentage et en unités d'énergie ; à droite, le coût
  de ce saut en pourcentage, son coût en énergie, et combien d'autres sauts identiques la batterie peut encore payer.
- **Dernière destination** (panneau latéral, intitulé « DERNIÈRE DESTINATION ») : pour des coordonnées, la dimension, les coordonnées et la distance
  qui les sépare du joueur ; pour un Téléporteur, « Fréquence » avec son nom et son mode de sécurité ; « Aucune pour l'instant » avant le premier
  saut ; et le bouton **Reprendre**.

## Automatisation

Non automatisable, c'est un outil à main, mais :

- Il se recharge comme tout objet énergétique de Mekanism, dans les chargeurs et les cubes d'énergie, ainsi que depuis son propre écran.
- Sa fréquence, son énergie stockée, ses réglages de sécurité et sa dernière destination (coordonnées ou fréquence de Téléporteur)
  sont tous enregistrés dans l'objet lui-même : ils survivent au rangement, au passage d'un inventaire à l'autre ou à la fabrication (voir Fabrication plus haut).

## Configuration

Section `quantum_teleporter` de `mekanismengineering-server.toml` :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | true | – | Autorise les sauts ; désactivé, l'objet se recharge toujours mais refuse tous les sauts. |
| `energyCapacity` | 1 000 000 000 J (1 GJ) | 1 J – sans limite | Énergie stockée par le téléporteur. |
| `chargeRate` | 5 000 000 J/t | 1 J/t – sans limite | Énergie acceptée par tick pendant la recharge. |
| `costTeleporterPercent` | 1,0 | 0–100 | Un saut vers un Téléporteur de Mekanism, en pourcentage de la batterie pleine. |
| `costCoordinatesPercent` | 50,0 | 0–100 | Un saut vers des coordonnées vérifiées, en pourcentage de la batterie pleine. |
| `costRandomPercent` | 25,0 | 0–100 | Un saut vers un endroit sûr au hasard, en pourcentage de la batterie pleine. |
| `randomMinDistance` | 1 000 | 16–1 000 000 | Distance minimale d'une destination aléatoire, en blocs depuis le joueur. |
| `randomMaxDistance` | 8 000 | 16–1 000 000 | Distance maximale d'une destination aléatoire, en blocs depuis le joueur. |
| `randomTries` | 8 | 1–32 | Endroits essayés par une recherche aléatoire avant d'abandonner, sans coût ; une recherche relancée avant la fin de son temps de recharge reprend avec les essais déjà utilisés. |
| `searchCooldownTicks` | 160 | 0–12 000 | Ticks entre deux recherches aléatoires. |
| `jumpCooldownTicks` | 20 | 0–12 000 | Ticks après un saut avant que le même joueur puisse sauter à nouveau. |
| `maxConcurrentChecks` | 2 | 1–64 | Tronçons de destination que tout le serveur peut charger en même temps pour les vérifications. |
| `destinationHoldTicks` | 200 | 20–1 200 | Ticks pendant lesquels une destination vérifiée reste chargée, en attendant le saut. |
| `blockedDimensions` | aucune | – | Dimensions vers ou depuis lesquelles le téléporteur ne saute jamais, sous forme d'ids (par ex. `minecraft:the_end`). |
| `allowCoordinates` | true | – | Désactivé, l'onglet « Coordonnées » est grisé et refuse toute vérification et tout saut, sans coût. |
| `allowRandom` | true | – | Désactivé, l'onglet « Aléatoire » est grisé et refuse toute recherche, sans coût. |
| `coordinateAndRandomBlockedDimensions` | aucune | – | Dimensions depuis lesquelles les onglets « Coordonnées » et « Aléatoire » ne peuvent pas être utilisés (celle où se trouve le joueur ; la destination ne compte pas). Les Téléporteurs fonctionnent toujours. |

Si `randomMaxDistance` est réglé en dessous de `randomMinDistance`, les deux bords de l'anneau de recherche utilisent la distance minimale. Le
radar affiche cette plage effective.

Un onglet fermé par le serveur est grisé à l'écran ; le survoler en donne la raison. Le serveur vérifie à nouveau les réglages à la
vérification et au saut, donc un changement fait entre les deux arrête le saut sans prendre d'énergie.

## Astuces et dépannage

- Un saut en mode « Teleporter » ne demande aucune vérification : dès qu'une fréquence affiche « prêt », « Téléporter » fonctionne. Elle affiche
  « inactif » à la place quand Mekanism n'a, pour l'instant, aucun Téléporteur chargé sur cette fréquence.
- La liste « Teleporter » ne montre que les fréquences qui existent déjà ; pour en atteindre une nouvelle, la régler d'abord depuis un
  Téléporteur de Mekanism posé ou un Téléporteur portable ordinaire, ou partir d'un Téléporteur portable déjà réglé
  pour fabriquer cet objet.
- « Reprendre » ne fait que remettre le dernier choix et ne téléporte jamais : après une destination par coordonnées, cliquer sur « Vérifier » avant que
  « Téléporter » redevienne actif, car le terrain a pu changer depuis la dernière visite.
- Une destination vérifiée ou trouvée reste réservée au joueur pendant un temps limité (`destinationHoldTicks`, 10 secondes par
  défaut) ; au-delà, elle expire : vérifier ou chercher à nouveau.
- Une dimension bloquée arrête les sauts aussi bien vers elle que depuis elle : un serveur qui bloque l'End refuse aussi un saut qui
  y commence, pas seulement un saut qui la vise.
- « Trop près de la bordure du monde » : une vérification de coordonnées doit arriver à une certaine marge à l'intérieur de la bordure du monde.
- « Le serveur vérifie d'autres endroits » : seules quelques vérifications de destination tournent en même temps sur tout le
  serveur (`maxConcurrentChecks`) ; attendre un instant et réessayer.
- La recherche aléatoire ne coûte jamais d'énergie, quel que soit le nombre d'essais. Seul le saut final en coûte, donc on peut chercher à nouveau
  librement si l'endroit trouvé ne convient pas. Annuler une recherche et la relancer aussitôt ne remet pas le
  compte à zéro : les essais déjà utilisés comptent jusqu'à la fin du temps de recharge de la recherche, y compris en cas de déconnexion et
  de reconnexion pendant ce temps.
- « Vérifier » cliqué deux fois en moins d'une demi-seconde : c'est la vérification la plus récente qui reçoit la réponse, au plus une demi-seconde plus tard.
- Limite connue : la liste « Teleporter » contient au plus 256 fréquences, les publiques d'abord. Sur un serveur qui a plus de 256
  fréquences de Téléporteur publiques, les fréquences privées et de confiance du joueur peuvent ne pas figurer dans la liste.
