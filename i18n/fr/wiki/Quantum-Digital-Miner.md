<!-- source: 7544acecb789ae39da214c934b00f5060b778fa3 -->
# Quantum Digital Miner

> Évolution de fin de jeu du Mineur digital : mêmes filtres et réglages, rayon jusqu'à 128, vitesse de minage quadruplée,
> énergie et objets par fréquences quantiques, et relocalisation vers une zone vierge avec le [Digital Miner
> Companion](Digital-Miner-Companion.md).

![Quantum Digital Miner](images/quantum_digital_miner.png)

| | |
|---|---|
| Type | Machine |
| Taille | Emprise de 3 × 3 sur 2 blocs de haut (bloc principal + 17 blocs d'encombrement, même emprise que le Mineur digital de Mekanism) |
| Énergie | Suit la formule du Mineur digital de Mekanism (`usage.digitalMiner`, `storage.digitalMiner`) × `quantum_miner.energyMultiplier` (4,0 par défaut) : 4 000 J/t et 200 000 J de stockage sans mise à niveau, davantage selon les Mises à niveau de la vitesse et énergétiques, le rayon et la plage de hauteur |
| Mises à niveau | Vitesse, Énergie, Ancrage, Générateur de Roche (les mises à niveau du Mineur digital de Mekanism) |
| Configuration des faces | Non : c'est l'une des trois seules machines du mod sans l'écran de configuration des faces de Mekanism (les autres sont la Petrogenic Synthesis Plant et le Contrôleur de réseau quantique) ; le flux d'objets suit la disposition fixe des ports décrite plus bas, basculée entre Locale, Quantique et QIO depuis la colonne Liaison quantique |

## Ce qu'il fait

Le Quantum Digital Miner mine les blocs dans un cube autour de lui exactement comme le Mineur digital de Mekanism : mêmes filtres
(objet, tag de bloc ou identifiant de mod, avec un mode inversé et un bloc de remplacement obligatoire), mêmes règles de recherche et
de minage, et mêmes Mises à niveau de la vitesse, énergétique, d'ancrage et du générateur de roche. Ce qui change :

- **Rayon** : jusqu'à 128 blocs (limite serveur `quantum_miner.maxRadius`), contre une limite de 32 pour le Mineur digital.
- **Vitesse** : mine quatre fois plus vite qu'un Mineur digital avec les mêmes Mises à niveau de la vitesse (`quantum_miner.speedMultiplier`).
- **Énergie et objets par fréquences quantiques** : en plus de ses propres ports et de sa batterie (comme le Mineur digital), il
  peut tirer son énergie d'une fréquence quantique partagée avec d'autres machines (réserve façon Entangloporteur quantique de Mekanism :
  un type d'objet, une réserve d'énergie) ou du réseau QIO, y envoyer les objets minés et y prendre les blocs de remplacement. Choisir
  la source pour Énergie, Import et Export séparément depuis la colonne Liaison quantique.
- **Relocalisation** : une fois sa zone actuelle entièrement minée, il peut être déplacé vers une zone voisine jamais exploitée,
  à l'aide d'un Digital Miner Companion : voir [Digital Miner Companion](Digital-Miner-Companion.md) pour la marche à suivre. Le Digital
  Miner Companion peut aussi se lier à un simple Mineur digital, le lire et le contrôler à distance, mais seul un Quantum Digital Miner
  se relocalise.
- **Chargement des chunks** : il ne charge jamais de chunks de lui-même. Avec une Mise à niveau d'ancrage, il se comporte comme le Mineur digital :
  son propre chunk et le chunk en cours de minage restent chargés, et la recherche peut charger brièvement des chunks proches.
  Sans elle, un chunk non chargé dans le rayon est traité comme vide.

Sa face avant porte un écran en direct : un état (`SEARCHING`, `MINING`, un `WARNING` orangé dès que le minage est bloqué
pendant trois rafraîchissements de suite : un seul tick bloqué n'est pas une panne, puisqu'une machine à pleine vitesse vide sa
réserve d'énergie à chaque tick), le pourcentage de la zone déjà miné, les blocs restants et une barre de cases pleines et vides.
L'écran s'éteint quand la machine est arrêtée et garde sa dernière image une fois la zone terminée.

Depuis la 1.2.0, il **prévient** aussi quand il a terminé, est bloqué ou s'est déplacé (voir [Notifications](#notifications)), et sa
fenêtre Nouveau filtre propose des [filtres rapides et des listes de filtres enregistrées](#quick-filters-and-saved-filter-lists).

L'onglet **Visuels** de Mekanism dessine la zone de minage dans le monde sous la forme d'une boîte translucide, quel que soit le rayon
configuré jusqu'à 128 : le Mineur digital de Mekanism cesse de l'afficher au-delà d'un rayon de 64.

## Fabrication

![Recette du Quantum Digital Miner](images/quantum_digital_miner-recipe.png)

```
ITX
QDQ
UCU
```

- **I**: Importeur du OQO
- **T**: Noyau de téléportation
- **X**: Exporteur du OQO
- **Q** (×2): Entangloporteur quantique
- **D**: Mineur digital
- **U** (×2): Circuit de contrôle ultime
- **C**: Cellule à induction ultime

Ce n'est pas une recette avec forme ordinaire : la fabrication transfère dans le nouveau Quantum Digital Miner les mises à niveau,
les objets stockés, le stockage de débordement, l'énergie (autant que la nouvelle machine peut en contenir) et le propriétaire du Mineur digital,
comme les recettes de Mekanism transfèrent le contenu d'une machine vers son niveau supérieur. Les filtres et les réglages de minage du Mineur
digital ne sont pas copiés : les régler à nouveau sur la nouvelle machine (le Digital Miner Companion peut les récupérer avec Pull sur l'ancienne
machine avant la fabrication, puis les envoyer avec Push sur la nouvelle).

Des ingrédients déjà configurés ne bloquent jamais la fabrication, que ce soit dans un établi ou dans le Terminal d'artisanat
d'Applied Energistics 2. Les mises à niveau du Mineur digital passent dans la nouvelle machine ; celles des autres
ingrédients (un Importeur du OQO avec des Mises à niveau de la vitesse, un Entangloporteur quantique avec une Mise à niveau d'ancrage) les rejoignent
tant qu'elles tiennent dans le maximum, et sinon reviennent sous forme d'objets de mise à niveau dans le résultat de fabrication, avec tout objet
pour lequel la nouvelle machine n'a pas de place. Rien n'est perdu ni dupliqué.

## Premiers pas

1. Réunir les ingrédients ci-dessus ; les mises à niveau et les objets stockés du Mineur digital passent dans la nouvelle machine, ses
   filtres et ses réglages non.
2. Fabriquer le Quantum Digital Miner.
3. Le placer et l'alimenter (par ses propres ports, ou par une source d'énergie Quantique/QIO configurée plus tard).
4. Faire un clic droit dessus pour ouvrir son écran, puis cliquer sur **Configuration** (ou faire Maj + clic droit sur la machine) pour ouvrir
   l'écran de configuration : régler le rayon (jusqu'à 128 par défaut), la plage Y, les filtres, le Toucher de soie, l'éjection automatique,
   le tirage automatique et le mode inversé : même écran et mêmes règles que pour le Mineur digital.
5. Au besoin, choisir une source Quantique ou QIO pour Énergie, Import ou Export depuis la colonne Liaison quantique.
6. Cliquer sur **Démarrer**.

## L'interface

![Interface du Quantum Digital Miner](images/quantum_digital_miner-gui.png)

- **Écran d'état** (en haut à gauche) : l'état de la machine (`Running`, `Low Power` ou `Not ready`, ou un avertissement comme
  une sortie pleine ou un signal redstone manquant), l'état de la recherche et `To mine: n`.
- Lignes **Export / Import / Soie** : interrupteurs horizontaux OFF | ON pour l'éjection automatique, le tirage automatique et le Toucher de soie.
- **Barre d'énergie** : une barre d'énergie verticale qui avertit quand la réserve ne peut pas couvrir le coût du tick suivant.
- **Emplacement du bloc manquant** : affiche le bloc de remplacement attendu par la machine, s'il y en a un.
- Onglets **Visuels** et **Énergie** : les onglets de Mekanism, pour le contour de la zone dans le monde et le résumé énergétique.
- Boutons **Démarrer / Arrêt / Configuration / Réinitialiser**, activés ou désactivés exactement comme sur l'écran du Mineur digital.
- **Colonne Liaison quantique** : une carte par source (Énergie, Import, Export) qui affiche son état (connectée, vide, aucune
  fréquence, ou « Comme le Miner »), chacune avec un bouton de configuration qui ouvre le sélecteur de fréquence de Mekanism
  pour choisir Locale, une fréquence Quantique nommée ou QIO. La colonne affiche aussi le numéro de la zone actuelle et le
  rayon.
- **Configuration** ouvre l'écran de configuration du Mineur digital. Il est haut : s'il ne tient pas dans la fenêtre
  (par exemple avec une échelle d'interface de 3 dans une fenêtre de 1280×720), baisser l'échelle d'interface. Son panneau de gauche contient, de haut en bas :
  « Filtres : N » ; « Rayon du bloc : N » avec un champ et un bouton de validation pour le régler, et ses limites à côté (« Min 0 » au-dessus de
  « Max 128 » avec le réglage serveur par défaut) ; « Niveau Y min : N » et « Niveau Y max : N », chacun avec un champ, un bouton de validation
  et ses propres « Min » et « Max » (du bloc le plus bas du monde jusqu'au sommet de la zone pour le minimum, du bas de la zone jusqu'au
  dernier bloc du monde pour le maximum ; le serveur ramène la valeur saisie dans ces mêmes limites) ; l'interrupteur du mode inversé ;
  l'emplacement du bloc de remplacement (y glisser un bloc, Maj + clic pour le vider) et le bouton qui le rend obligatoire. À
  droite, la liste des filtres avec sa barre de défilement et le bouton **Nouveau filtre** ; une flèche de retour en haut à gauche ramène à
  l'écran principal.

### Notifications


Le Quantum Digital Miner prévient, par une notification et le son de notification de Minecraft, quand :

- le minage est **terminé** (« Minage terminé », ou « Terminé dans les chunks chargés seulement » quand une partie de la zone n'était pas chargée) ;
- le minage est **en pause**, avec la raison : énergie insuffisante, stockage plein, objets en trop à vider, bloc de remplacement manquant,
  placement refusé ou zone non chargée ;
- une **relocalisation est réussie**.

Chaque notification indique la dimension et les coordonnées X, Y et Z de la machine. Seul le **propriétaire** les reçoit, et seulement quand il est connecté.
Au-delà de huit à la fois, les suivantes sont regroupées dans une seule notification « +N autres ». Les désactiver avec le réglage client
`notifications` (voir [Configuration](Configuration.md)) ; cela désactive la notification et son son pour tout le mod.

### Filtres rapides et listes de filtres enregistrées

La fenêtre **Nouveau filtre** commence par deux raccourcis, et seule la liste des filtres change : le rayon, la hauteur, le Toucher de soie et tous
les autres réglages restent tels quels.

- **Filtres rapides** : un court catalogue de tags de minerais. Le fer, l'or, le charbon et la redstone sont toujours proposés ; le cuivre, le lapis, le diamant,
  l'émeraude, l'étain, le plomb, l'osmium et l'uranium sont proposés quand leur tag de minerai commun existe dans l'instance. Chacun crée un filtre de
  tag Mekanism ordinaire sur le tag commun (par exemple `c:ores/iron`), si bien que les minerais ajoutés par d'autres mods sont inclus.
  **Remplacer** réduit la liste à ce seul filtre (une confirmation est demandée d'abord si la liste n'est pas vide) ; **Ajouter** le place à la
  fin de la liste, sauf si un filtre sur ce tag y figure déjà. Un tag exclu par la liste noire du mineur de Mekanism s'affiche comme
  « Tag exclu du minage » et ne peut pas être utilisé ; un tag absent de l'instance indique « Tag absent » ; un tag déjà dans la liste
  indique « Dans la liste ». Le monde n'est jamais scanné et aucun chunk n'est chargé pour cela. La liste des filtres s'arrête à 128 filtres.
- **Configurations** : **Enregistrer les filtres actuels** stocke la liste des filtres du mineur sous un nom ; elle peut ensuite être chargée sur n'importe quel mineur
  avec Remplacer ou Ajouter, écrasée ou supprimée. Chaque joueur a sa propre bibliothèque, dans le monde ou sur le serveur (la
  fenêtre indique « Personnel · ce monde » ou « Personnel · ce serveur ») : jusqu'à 32 listes de 128 filtres, noms de 24 caractères au plus.
  Une liste illisible est conservée mais pas appliquée (« Illisible ») ; une liste qui a besoin d'un tag ou d'un mod absent indique
  « Tag ou mod absent ».

## Automatisation

- **Ports**, même disposition que le Mineur digital : entrée des objets sur le dessus, sortie des objets par le centre de la face arrière supérieure,
  énergie par le dessous (utilisable aussi à gauche et à droite), accessibles au centre de chaque face. Placer un coffre
  directement contre l'extérieur de ce port arrière et régler Export sur Locale et l'éjection automatique sur ON. Cette machine n'ayant pas de configuration
  des faces Mekanism, cette disposition est fixe : changer le rôle d'une face entre Locale, Quantique et QIO depuis la
  colonne Liaison quantique plutôt que dans l'éditeur de faces de Mekanism.
- **Conservé quand on le casse puis le replace** : filtres, réglages, mises à niveau, énergie, inventaire, sécurité, contrôle par redstone et
  l'historique des zones terminées suivent la machine. Sa recherche en cours, non : comme le Mineur digital,
  il recommence sa recherche après avoir été rechargé. Ses **liaisons de fréquence** d'énergie, QIO, d'import et d'export ne suivent l'objet que
  si c'est le **propriétaire** qui l'a cassé ; cassé par quelqu'un d'autre, ou s'il s'agit d'un objet ancien ou falsifié, le mineur est posé **sans liaison**
  (le mode de source choisi est conservé), afin que personne ne puisse puiser dans le réseau privé du propriétaire.
- **Chargement des chunks** : uniquement avec une Mise à niveau d'ancrage installée, et uniquement son propre chunk et celui qu'il mine : voir
  *Ce qu'il fait* plus haut.

## Configuration

Configuration serveur, section `quantum_miner` :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | true | – | Désactive entièrement la recherche et le minage |
| `maxRadius` | 128 | 1–128 | Plus grand rayon de minage que les joueurs peuvent régler |
| `speedMultiplier` | 4,0 | 1,0–16,0 | Vitesse de minage par rapport à un Mineur digital avec les mêmes Mises à niveau de la vitesse |
| `energyMultiplier` | 4,0 | 0,0–64,0 | Consommation d'énergie et stockage de base par rapport à la configuration du Mineur digital de Mekanism |
| `maxBlocksPerTick` | 8 | 1–64 | Plafond strict de blocs minés par une machine en un seul tick |
| `maxChecksPerTick` | 512 | 16–65 536 | Plafond strict de positions examinées en un seul tick |
| `searchBudgetMicros` | 2 000 | 100–50 000 | Temps du fil serveur par tick partagé entre toutes les recherches en cours |
| `searchThreads` | 1 | 1–4 | Fils d'exécution en arrière-plan qui analysent les chunks, partagés par tous les Quantum Digital Miners |
| `searchMaxPendingChunks` | 8 | 1–64 | Avec une Mise à niveau d'ancrage, chunks qu'une recherche peut charger à la fois (brièvement, sans jamais bloquer) |
| `verboseLogs` | false | – | Journalisation supplémentaire pour le débogage |

La relocalisation elle-même (déclenchée depuis le Digital Miner Companion) a sa propre section `relocation` : voir [Digital
Miner Companion](Digital-Miner-Companion.md#configuration).

Configuration client (`mekanismengineering-client.toml`) : `notifications` (activé par défaut) désactive les notifications du mineur et leur son
pour tout le mod. Le serveur continue de les envoyer.

### Sécurité de la relocalisation

Une relocalisation va jusqu'au bout ou est annulée, en laissant le monde tel qu'il était. Si une **annulation elle-même ne peut pas remettre un bloc en place**, le
serveur **s'arrête par sécurité** et **rejoue son journal au redémarrage suivant**, au lieu de perdre silencieusement la trace de ce qui a été
déplacé. C'est voulu ; c'est le comportement depuis la 1.1.1.

## Astuces et dépannage

- **Écran bloqué sur un avertissement** : il ne passe à l'orangé qu'après trois rafraîchissements de suite sans rien miner : vérifier la
  raison affichée sur l'écran d'état (énergie, sortie pleine, redstone, bloc de remplacement manquant).
- **Faible puissance** : les Mises à niveau de la vitesse dépassent les Mises à niveau énergétiques, exactement comme sur un Mineur digital : ajouter des Mises à niveau énergétiques, ou
  passer sa source d'énergie sur une fréquence Quantique ou QIO depuis la colonne Liaison quantique.
- **Seule cette machine se relocalise** : un simple Mineur digital lié à un Digital Miner Companion peut être lu et
  contrôlé à distance, jamais déplacé.
