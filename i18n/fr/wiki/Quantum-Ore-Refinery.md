<!-- source: 67a581eeb21826c5663be1f8c37730e5e150ea65 -->
# Quantum Ore Refinery

> Toute la chaîne de traitement du minerai de Mekanism dans un seul multibloc : du minerai en entrée, jusqu'à cinq lingots par minerai en sortie.

![Quantum Ore Refinery](images/quantum_ore_refinery.png)

| | |
|---|---|
| Type | Machine multibloc |
| Ajoutée en | 1.2.0 |
| Taille | 10 × 4 × 3 blocs, 92 blocs obligatoires (voir [Structure et pièces](Quantum-Ore-Refinery-Structure.md)) |
| Énergie | La consommation par tick de la Chambre d'enrichissement, lue dans la configuration de Mekanism (`usage.enrichmentChamber`, 50 J/t par défaut) ; une réserve au moins assez grande pour une pile de 64 recettes de minerai (640 000 J par défaut) |
| Améliorations | Aucune |
| Configuration des faces | Pas de configuration des faces Mekanism : les blocs de port de la structure (huit sur le plan) s'en chargent. Les ports d'entrée passent entre objets, fluides et gaz avec un Configurateur |

## Ce qu'elle fait

La Quantum Ore Refinery prend du minerai et le transforme en lingots. Elle n'invente pas ses propres recettes : ses cinq **niveaux**
sont les cinq chaînes de traitement du minerai de Mekanism, exécutées l'une après l'autre dans la machine, avec les recettes de Mekanism
pour chaque étape. Plus le niveau est élevé, plus un minerai donne de lingots, et plus le travail prend de produits chimiques dans les
réservoirs de la raffinerie.

| Niveau | Chaîne (machines Mekanism qu'elle remplace) | Lingots pour un minerai de fer | Prélevé dans les réservoirs, pour un minerai de fer |
|---|---|---|---|
| **x1** | Fonte seule | 1 | rien |
| **x2** | Enrichissement, puis fonte | 2 | rien |
| **x3** | Purification (minerai et oxygène), Broyeur, Enrichissement, fonte | 3 | 200 mB d'oxygène |
| **x4** | Injection (minerai et chlorure d'hydrogène), Purification (éclats et oxygène), Broyeur, Enrichissement, fonte | 4 | 200 mB de chlorure d'hydrogène, 800 mB d'oxygène |
| **x5** | Dissolution (minerai et acide sulfurique), Lavage (eau), Cristallisation, Injection, Purification, Broyeur, Enrichissement, fonte | 5 | 200 mB d'acide sulfurique, 5 000 mB d'eau, 1 000 mB de chlorure d'hydrogène, 1 000 mB d'oxygène |

Les chiffres des deux dernières colonnes sont ceux que donnent les recettes de Mekanism pour le **minerai de fer**, avec les réglages
par défaut de Mekanism. Chaque quantité est lue dans les recettes de l'objet à chaque étape, donc un autre minerai a ses propres rapports : trois
fers bruts, par exemple, donnent 4, 6 et 10 lingots à x2, x3 et x5. Une recette modifiée par Mekanism ou par un modpack modifie
la raffinerie avec elle. Un niveau pour lequel un minerai n'a pas de recette dans la chaîne n'est tout simplement pas disponible pour ce minerai, et
rien n'est prélevé.

Ce que la raffinerie accepte comme minerai est le tag d'objet `mekanismengineering:refinery_ores` (les minerais, les métaux bruts et les
blocs de métal brut de fer, d'or, de cuivre, d'osmium, d'étain, de plomb et d'uranium ; un datapack peut l'étendre ou le réduire), à
condition que la Chambre d'enrichissement de Mekanism ait une recette pour l'objet.

- **Une pile à la fois.** À l'arrêt, la machine regarde ses neuf emplacements de minerai environ une fois par seconde et prend le
  premier qui contient quelque chose qu'elle peut raffiner. Un travail traite la pile de cet emplacement, **jusqu'à 64 objets**, d'un seul coup.
- **La même énergie à chaque niveau.** Une recette de minerai coûte la même énergie quels que soient le niveau et la vitesse : 200 ticks de
  la consommation de la Chambre d'enrichissement, soit 10 000 J avec les 50 J/t par défaut de Mekanism. Le coût est payé tick par tick pendant
  le travail (un travail en pause garde ce qu'il a déjà payé). Une pile de 64 recettes de minerai coûte 640 000 J par défaut.
- **Tout le reste traverse.** Un objet qui n'est pas un minerai que la raffinerie peut traiter n'est pas refusé par un port
  d'entrée en mode objets : il va à la sortie et repart par le port de sortie, intact et sans frais. Un tapis d'objets
  mélangés peut alimenter la machine sans filtre. (Sans port de sortie, un tel objet est refusé.)
- **Les ressources ne sont prélevées qu'à la fin du travail**, dans le même tick que l'apparition des lingots. Si les réservoirs ne contiennent plus
  ce que le niveau demande à ce moment-là, rien n'est prélevé (voir *Choisir le niveau* ci-dessous).

## Choisir le niveau

La machine a deux commandes, toutes deux sur l'écran Accueil :

- **Plafond de niveau.** Cliquer sur l'une des cases de niveau (x1 à x5) pour fixer le niveau maximal auquel la machine peut travailler. Tant qu'on n'a pas cliqué, le
  plafond est x5. La machine ne travaille jamais au-dessus du plafond.
- **Toujours actif**, OFF ou ON (OFF par défaut).
  - **OFF** : la machine attend que les réservoirs contiennent tout ce que demande le **niveau plafond** pour le minerai en cours, puis
    travaille exactement à ce niveau. En attendant, le statut indique « Attend le niveau » et l'écran liste ce qui manque
    (« Manque pour x5 : ... »).
  - **ON** : la machine travaille au **meilleur niveau, jusqu'au plafond, dont les réservoirs couvrent les ressources**. Elle ne descend jamais sous
    x2 (qui ne demande rien aux réservoirs), sauf si le plafond est à x1, si bien qu'elle continue de raffiner pendant que les produits chimiques se remplissent. Un
    travail qui, à sa fin, ne trouve plus les ressources de son niveau se replie sur le meilleur niveau inférieur couvert par les réservoirs ;
    avec Toujours actif sur OFF, il les attend à la place.

## Vitesse et accélérateurs

- **x1** traite une pile entière de jusqu'à 64 minerais **en un tick**.
- **x5** prend **200 ticks (10 secondes)** par travail sans accélérateur. Chacune des **huit places d'accélérateur** de la structure
  qui contient un Accélérateur de raffinerie de minerai raccourcit le travail ; avec les huit, il prend **4 ticks**. Plus un niveau donne de lingots,
  plus il est long : **x4 prend les trois quarts du temps de x5, x3 la moitié, x2 un quart** (50 ticks, 2,5 secondes, sans accélérateur ; 1 tick avec huit) :

| Accélérateurs | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| Ticks par travail (x5) | 200 | 123 | 75 | 46 | 28 | 17 | 11 | 7 | 4 |

Le temps est de `200 × 50^(−n/8)` ticks pour `n` accélérateurs, arrondi au tick. Une place d'accélérateur peut aussi recevoir une
simple carcasse ; la structure se forme dans les deux cas. Le nombre d'accélérateurs est lu au début d'un travail.


## Réservoirs

Le contrôleur garde lui-même les quatre stocks de la machine ; les blocs de réservoir de la structure ne font que compléter la forme. Chaque
stock a la taille d'environ **une minute d'un Quantum Digital Miner à son maximum** :

| Stock | Capacité | Demandé à partir du niveau |
|---|---|---|
| Eau | 3 000 000 mB | x5 |
| Chlorure d'hydrogène | 600 000 mB | x4 |
| Oxygène | 600 000 mB | x3 |
| Acide sulfurique | 120 000 mB | x5 |


## La construire

La structure suit un plan fixe : [Structure et pièces](Quantum-Ore-Refinery-Structure.md) la montre couche par couche, avec
chaque recette. En bref :

1. Le **Contrôleur de la Quantum Ore Refinery** se trouve sur la rangée avant du bas, deuxième bloc en partant de la gauche quand on lui fait face. Il
   se tourne vers le joueur quand on le pose, et la structure se dresse **derrière** lui et à sa droite.
2. Le plan tourne avec le contrôleur par quarts de tour et n'est jamais mis en miroir.
3. Construire le reste : carcasse, piliers, poutres, tapis, ports (le plan en a sept : cinq d'entrée, un de sortie, un d'énergie ; il faut au moins cinq ports d'entrée et un d'énergie, et la sortie est facultative), sept modules de traitement, quatre cases de réservoir de deux
   blocs chacune, et autant d'accélérateurs que voulu (jusqu'à huit).
4. La machine vérifie la structure environ une fois par seconde et ne charge jamais de chunk pour cela. Tant qu'elle est incorrecte, l'écran du
   contrôleur indique quel bloc est faux ou manquant, et où (« Formation impossible, bloc attendu : ... en (x, y, z) »).
5. Quand le dernier bloc est posé, de la poudre de redstone court le long des arêtes de la structure, comme sur un multibloc de Mekanism (l'effet
   suit le réglage de Mekanism ; s'il est désactivé, un message « Multibloc formé » s'affiche à la place).

Un port appartient à **une seule** raffinerie : un port déjà pris par un autre contrôleur empêche la seconde structure de se former
(« le port en (x, y, z) sert déjà une autre Quantum Ore Refinery »).

## Premiers pas

1. Construire la structure d'après [Structure et pièces](Quantum-Ore-Refinery-Structure.md). L'écran indique « Multibloc formé » quand elle est correcte.
2. Amener de l'**énergie** à un Port d'énergie (joules ou Forge Energy, depuis un câble ou un bloc d'énergie).
3. Fournir du **minerai** à un Port d'entrée dans son mode par défaut **Objets**, ou mettre le minerai à la main dans les neuf emplacements de minerai. x1 et x2 ne demandent
   aucun produit chimique. Avec **Toujours actif** sur ON, la machine raffine aussitôt à x2 ; sur OFF (par défaut), elle attend le
   x5 (voir *Choisir le niveau*).
4. Pour x3 et au-delà, régler d'autres Ports d'entrée avec un **Configurateur** (accroupi + clic droit) : un sur **Fluides** pour l'eau, et un sur **Gaz**
   pour l'oxygène, le chlorure d'hydrogène et l'acide sulfurique (un seul port Gaz prend les trois produits chimiques ; chacun va
   dans son propre réservoir, et tout autre chemical est refusé).
5. Récupérer les lingots au Port de sortie avec un tuyau, un entonnoir ou un coffre placé contre lui, ou ajouter le
   [Module quantique](#the-quantum-module) facultatif pour les envoyer plutôt vers une fréquence Quantum ou QIO. **La machine a besoin de l'un
   des deux** : sans Port de sortie ni module lié, elle se forme mais affiche « Pas de sortie » et ne travaille pas.

## L'interface

![Interface de la Quantum Ore Refinery](images/quantum_ore_refinery-gui.png)

Le contrôleur ouvre un écran bleu avec les onglets latéraux de Mekanism pour les autres pages. Un clic droit sur n'importe quel bloc de la
structure l'ouvre aussi.

### Accueil

- Bandeau de **statut** : ce que fait la machine, avec l'énergie qu'elle consomme par tick. Les statuts possibles sont listés dans
  *Conseils et dépannage*.
- **Cinq cases de niveau** (x1 à x5) : allumée quand le niveau travaille en ce moment, prête quand les réservoirs le couvrent, rouge quand il
  attend une ressource, grisée au-dessus du plafond. Survoler une case pour voir ce qu'elle demande ; cliquer dessus pour fixer le plafond.
- **Toujours actif** avec ses boutons **OFF** et **ON**, et une ligne d'avertissement (« Manque pour x5 : ... ») qui nomme la ressource qui manque au
  niveau plafond.
- **Neuf emplacements de minerai**, chacun avec une fine barre de progression en dessous, et l'inventaire du joueur.
- La **barre d'énergie** verticale de Mekanism et l'onglet Énergie.

### Module de sortie

Uniquement quand la structure contient le Module quantique. Voir [Le module quantique](#the-quantum-module).

### Réservoirs

Quatre jauges Mekanism (acide sulfurique, eau, chlorure d'hydrogène, oxygène) avec leur nom au-dessus et, sous chacune, le premier
niveau que ce stock rend possible (« Débloque x3 », ...), en rouge tant que le stock est vide. Survoler une jauge affiche son contenu.

### Statistiques

- **Production** : minerais traités par minute et lingots produits par minute, un graphique des lingots par minute sur les cinq dernières
  minutes (non sauvegardé avec le monde), le **multiplicateur max** atteignable en ce moment, la **consommation**, et le nombre
  d'**accélérateurs** sur huit.
- **Multiplicateurs** : un tableau des cinq niveaux face aux quatre stocks. Un stock que le niveau demande mais qui manque dans les réservoirs pour le
  minerai en cours est encadré de rouge. Chaque niveau indique **Sélectionné**, **Disponible**, **En attente** ou **Indisponible**.

## Le module quantique


Le **Module quantique de raffinerie de minerai** est un bloc facultatif de la structure, au bout côté sortie, sur la rangée du milieu,
au-dessus du Port de sortie ou à sa place (la structure se forme avec ou sans lui). Avec le module en place et une fréquence choisie sur son écran, les
lingots vont dans le **tampon de 64 piles** du module au lieu des emplacements de sortie, et toutes les demi-secondes le tampon est envoyé
vers la destination :

- **Quantum** : une fréquence Quantum (Inventaire), comme celles qu'utilisent les Entangloporteurs quantiques et le Quantum Digital Miner.
  Comme pour le Quantum Digital Miner, une fréquence Quantum ne contient qu'un seul type d'objet à la fois.
- **QIO** : une fréquence QIO, vers le stockage du réseau.

L'écran du module propose le choix **Quantum | QIO**, la liste des fréquences utilisables et l'état de la destination
(« Connecté », « Choisir une fréquence », « Aucune fréquence disponible »), avec le tampon (« Tampon x / 64 »). Quand la destination est
pleine, absente ou supprimée, les lingots attendent dans le tampon (« Destination pleine », « Produits gardés dans le tampon ») ; rien n'est
perdu, et ils repartent dès qu'il y a de la place. Un tampon plein empêche la machine de terminer ses travaux, exactement comme une sortie pleine.
Sans le module, ou sans fréquence, les lingots repartent par le port de sortie, et ce que le tampon contient encore
les suit. Si la structure a aussi un Port de sortie, il sert de **tampon de secours** : ce que le tampon du module ne peut pas contenir sort par le port. Si elle n'a pas de Port de sortie, un tampon plein fait attendre la machine (« Sortie pleine »). Si elle n'a ni Port de sortie ni module lié, la machine ne travaille pas du tout (« Pas de sortie »). Un objet que la raffinerie ne fait que laisser passer ne passe jamais par le module.

Les boutons **OFF** et **ON** en haut de l'écran du module l'éteignent sans le retirer : sur OFF, le module est ignoré comme s'il n'était pas posé, les lingots (et ce que le tampon contient) sortent par le Port de sortie, rien n'est envoyé et les fréquences choisies sont gardées ; sans Port de sortie, la raffinerie attend. ON est la position par défaut.

## Automatisation

- Les **Ports d'entrée** (au moins cinq) sont tous le même bloc. Un Configurateur en fait passer un par **Objets**, **Fluides** et **Gaz** avec un clic droit accroupi, et un message indique le nouveau mode (un simple clic droit ne fait que l'afficher).
  En mode Clé à molette, un clic droit accroupi démonte n'importe quelle pièce de la structure. En mode objets, un port donne accès aux neuf emplacements de minerai, en insertion seulement. En mode fluides, il ne prend
  que de l'eau. En mode gaz, il ne prend que de l'acide sulfurique, du chlorure d'hydrogène et de l'oxygène. Rien ne peut être extrait par
  un port d'entrée.
- **Port de sortie** (aucun ou un) : toutes les demi-secondes, il propose les produits aux inventaires voisins, jamais aux propres blocs
  de la structure. Un produit que personne ne prend reste dans la machine (jusqu'à 32 piles).
- **Ports d'énergie** (au moins un ; le plan en a un) : joules ou Forge Energy.
- Un port ne sert qu'une seule raffinerie.
- **Casser le contrôleur** avec un outil garde son contenu (minerai, produits, stocks, énergie et travail en cours) dans
  l'objet. La fréquence choisie d'un Module quantique n'est jamais gardée : un contrôleur reposé démarre sans fréquence.
- Une raffinerie ne charge aucun chunk. Si un chunk de la structure n'est pas chargé, le statut indique « Attend les chunks » et rien
  n'est perdu.

## Jade, WTHIT et JEI

Avec Jade ou WTHIT, regarder n'importe quel bloc de la structure affiche l'état et le niveau de la raffinerie, les quatre stocks sous forme de jauges,
et pour un port son mode, ce qu'il sert et à combien de voisins le port de sortie propose les produits. Une structure non formée
indique quel bloc elle attend et où. Voir [JEI, Jade et WTHIT](JEI-Jade-WTHIT.md).


## Configuration

Aucune section dédiée dans `mekanismengineering-server.toml`. La consommation et le stockage d'énergie suivent la configuration de la Chambre
d'enrichissement de Mekanism ; les recettes suivent celles de Mekanism.

| Suit la clé de Mekanism | Par défaut | Signification |
|---|---|---|
| `usage.enrichmentChamber` | 50 J/t | Énergie par tick du coût de 200 ticks d'une recette de minerai. |
| `storage.enrichmentChamber` | (celle de Mekanism) | Le contrôleur stocke au moins cette valeur, ou l'équivalent d'une pile de 64 recettes de minerai (640 000 J à la consommation par défaut) si c'est plus. |

## Conseils et dépannage

| Statut | Signification |
|---|---|
| Non formé | La structure est incomplète ou incorrecte. L'écran nomme le premier bloc faux ou manquant. |
| Attend les chunks | Un chunk de la structure n'est pas chargé. |
| Coupé (redstone) | Le contrôle par redstone de Mekanism arrête la machine. |
| Pas de sortie | La structure n'a ni Port de sortie ni Module quantique lié. Rien n'est traité ; ajouter un port ou lier le module, et elle reprend. |
| Pas de minerai | Aucun emplacement de minerai ne contient quelque chose que la raffinerie peut traiter. |
| Attend le niveau | Toujours actif est sur OFF et les réservoirs ne couvrent pas encore le niveau plafond. |
| Manque d'énergie | Le travail ne peut pas payer l'énergie de ce tick ; il garde ce qu'il a payé et reprend quand l'énergie arrive. |
| Attend ressources | Un travail terminé manque des produits chimiques de son niveau ; rien n'a été prélevé. |
| Sortie pleine | Les produits ne rentrent pas ; le travail attend et réessaie toutes les demi-secondes. |
| En marche à x*N* | Travaille au niveau *N*. |

- **Elle ne se forme pas.** Comparer avec [Structure et pièces](Quantum-Ore-Refinery-Structure.md), couche par couche. Les cases libres (les
  cases grises « .. » du plan) peuvent être vides, en vitre ou en carcasse, et rien d'autre. Les huit places d'accélérateur prennent un
  accélérateur ou une carcasse.
- **Seul x2 fonctionne.** Les produits chimiques manquent : vérifier qu'un Port d'entrée est réglé sur Fluides pour l'eau et un sur Gaz, et
  regarder l'écran Réservoirs.
- **« Pas de sortie » et rien ne se passe.** La structure n'a ni Port de sortie ni Module quantique avec une fréquence. Construire un Port de sortie, ou choisir une fréquence sur l'écran du module.
- **Bloquée sur « Attend le niveau ».** Toujours actif est sur OFF et le plafond est au-dessus de ce que couvrent les réservoirs. Baisser le plafond en cliquant sur un
  niveau inférieur, ou mettre Toujours actif sur ON.
- **Un objet est ressorti du port de sortie sans changement.** Ce n'est pas un minerai que la raffinerie peut traiter, ou la Chambre
  d'enrichissement de Mekanism n'a pas de recette pour lui : il traverse, c'est voulu.
- **Deux raffineries ne peuvent pas partager un port**, donc deux structures ne peuvent pas se chevaucher.
