<!-- source: a5910ff640a44ee71e313f060049fb6c92d60edc -->
# Contrôleur de réseau quantique

> Vue en lecture seule des fréquences, tampons et appareils quantiques accessibles dans toutes les dimensions.

![Contrôleur de réseau quantique](images/quantum_network_controller.png)

| | |
|---|---|
| Type | Machine (lecture seule) |
| Ajouté en | 0.6 (écran repensé en 1.2.0) |
| Taille | 1 bloc |
| Énergie | Aucune |
| Améliorations | Aucune |
| Configuration des faces | Non, écran en lecture seule (exception voulue, comme le Quantum Digital Miner) |

## Ce qu'il fait

Un écran en lecture seule sur chaque fréquence quantique accessible : les fréquences Publique et Privé du joueur, et toute fréquence
Confiance dont le propriétaire lui fait actuellement confiance. Choisir une fréquence et une ressource (Énergie, Objets, Fluides, Chimiques, Chaleur ou
Radiation), et l'écran dessine toute la situation d'un coup d'œil : ce qui **entre**, ce que la fréquence **contient**
(son tampon), ce qui **sort**, et quels types d'appareil la font sortir.

Il ne configure jamais rien : pas de configuration des faces, pas de contrôle redstone, pas d'améliorations et pas d'énergie propre. Il se contente de lire.
Le même écran est aussi disponible en main avec la [Tablette de réseau quantique](Quantum-Network-Tablet.md).

## Fabrication

```
GCG
ABA
SRS
```

- `G`: n'importe quelle vitre (tag `c:glass_panes`) ×2
- `C`: n'importe quel Circuit de contrôle avancé (tag `c:circuits/advanced`) ×1
- `A`: n'importe quel Alliage infusé (tag `mekanism:alloys/infused`) ×2
- `B`: Boîtier en acier ×1
- `S`: n'importe quel Lingot d'acier (tag `c:ingots/steel`) ×2
- `R`: n'importe quelle Poudre de redstone (tag `c:dusts/redstone`) ×1

Pour transformer un Contrôleur en [Tablette de réseau quantique](Quantum-Network-Tablet.md) (et inversement), voir cette page.

## Premiers pas

1. Fabriquer le Contrôleur.
2. Le poser n'importe où : il n'a pas besoin de toucher le réseau qu'il lit, et la lecture ne charge jamais de chunk.
3. Clic droit pour ouvrir son écran.
4. Cliquer sur la case de fréquence en haut à gauche, ou sur le bouton à côté, pour ouvrir la liste de toutes les fréquences accessibles, et
   en choisir une.
5. Cliquer sur un onglet de ressource (Énergie, Objets, Fluides, Chimiques, Chaleur, Radiation) pour voir les flux de cette ressource.
6. Lire la situation de gauche à droite : **Entrées**, **TAMPON**, **Sorties** ; les familles d'appareils qui font sortir la ressource
   sont listées en dessous.

## L'interface

![Interface du Contrôleur de réseau quantique](images/quantum_network_controller-gui.png)

L'écran mesure 400 × 270 pixels, ce qui est haut : s'il ne tient pas dans la fenêtre (par exemple avec une Taille de l'interface de 3 dans une fenêtre de 1280 × 720),
le haut reste à l'écran et le bas est coupé ; baisser la Taille de l'interface pour tout voir.

- **Case de fréquence** (en haut à gauche) : le nom de la fréquence lue et, en dessous, son mode de sécurité et son propriétaire.
  La survoler affiche son type (Inventaire, QIO ou Téléporteur) et sa place dans la liste (par exemple « 2/5 »). Quand rien n'est
  accessible, elle indique « Aucun réseau accessible ».
- **Liste des fréquences** (le bouton à droite de la case, ou un clic sur la case) : ouvre une fenêtre intitulée « Fréquences · N », avec le
  nombre de fréquences, qui liste toutes les fréquences accessibles, sept à la fois, par pages avec ‹ ›. Chaque entrée montre son nom,
  puis son type, son mode et son propriétaire ; un nom trop long pour sa rangée défile, et il figure en entier dans l'infobulle. Cliquer sur une entrée pour la choisir.
- **Six onglets de ressource**, dans cet ordre : **Énergie**, **Objets**, **Fluides**, **Chimiques**, **Chaleur**, **Radiation**. Chacun porte
  l'icône de Mekanism pour la ressource ; l'onglet sélectionné est éclairé en bleu-vert. L'onglet Chimiques regroupe tous les chemicals sauf les
  radioactifs, qui ont leur propre onglet **Radiation** (Spent Nuclear Waste et les autres chemicals radioactifs) ; ils
  ne sont jamais additionnés. Survoler l'un ou l'autre onglet pour voir quels chemicals il regroupe.
- **Ligne de bilan** (une fine bande sous les onglets) : « Bilan : *débit* / Réserve en hausse », « Réserve en baisse » ou « Réserve stable »,
  par exemple « Bilan : +120 J/t / Réserve en hausse ». « Bilan : mesure en cours… » s'affiche pendant les premiers instants après l'ouverture de
  l'écran ou un changement de fréquence ou d'onglet, et « Bilan : ? » quand il n'y a pas de chiffre. Le bilan est mesuré sur le tampon même
  de la fréquence : il reste donc exact quelles que soient les approximations du reste de l'écran.
- **Entrées** (panneau de gauche) : le débit total auquel les appareils envoient dans la fréquence. Le survoler affiche les familles
  qui envoient et leurs débits.
- **TAMPON** (panneau du milieu) : ce que la fréquence contient actuellement de cette ressource.
- **Sorties** (panneau de droite) : le débit total auquel les appareils font sortir la ressource. Le survoler affiche les familles et leurs débits.
  Les flèches entre les trois panneaux vont des Entrées au Tampon puis aux Sorties.
- **Sorties par famille** (cartes sous les panneaux) : une carte pour chaque **famille d'appareils** qui fait sortir la ressource,
  la plus active d'abord, quatre par page. Une carte montre le nom de la famille (Entangloporteurs, Receivers Basic, Advanced, Elite et
  Ultimate, Quantum Digital Miners, Quantum Chargepads), son débit, sa **part du total** en pourcentage et une barre
  à la couleur de la famille (les quatre Receivers utilisent les couleurs de niveau de Mekanism). Survoler une carte affiche le nombre d'appareils de la
  famille. Parcourir les cartes avec les boutons **<** et **>** en bas à droite ; la ligne du bas indique le nombre de familles
  (« 3 familles / parts du total »), avec le numéro de page à côté des boutons.
- Pour la Chaleur, où aucun flux n'est mesuré, les cartes sont remplacées par « Aucun débit n'est mesuré pour la chaleur ». Les fréquences QIO et
  Téléporteur n'ont pas de schéma Entrées/Tampon/Sorties : l'écran indique « Non applicable » (seules les fréquences Inventaire sont dessinées).
- L'onglet de **sécurité** de Mekanism se trouve sur le côté de l'écran : il appartient au bloc, ou à la Tablette quand l'écran est
  ouvert depuis la main.

### Les marques « ≈ », « ≥ » et « ? »

Certains nombres sont exacts et d'autres non ; l'écran indique toujours lesquels.

- **Aucune marque** : compté directement. L'éjection radioactive de chaque Quantum Entangloporter radioactif et le prélèvement de chaque Récepteur
  d'énergie quantique sont comptés, tout comme ce qu'un Entangloporteur quantique déplace par ses propres ports configurés.
- **≈** : estimé. Ce que les Entangloporteurs quantiques de Mekanism éjectent **d'eux-mêmes** vers leurs voisins connectés n'est pas
  mesuré directement : le Contrôleur le déduit du bilan global du tampon et répartit cette estimation entre les
  Entangloporteurs qui éjectent, de la même façon que Mekanism la répartit. Le survol affiche « ≈ estimé : Mekanism éjecte de lui-même ».
- **≥** : au moins. Certains appareils n'ont pas pu être mesurés : le vrai total est donc plus élevé.
- **?** : inconnu, le chiffre ne peut pas être mesuré. Le survol affiche « ? inconnu : ce chiffre ne peut pas être mesuré ».
- **« N appareils non mesurés »** (en ambre, au-dessus des cartes, à droite) : N appareils de la famille n'ont pas pu être lus ; les
  parts ne sont donc pas données en pourcentage mais sous la forme « ? » (« Pas de part : des appareils ne sont pas mesurés » dans l'infobulle).
- **« Chunk non chargé »** : un appareil du joueur se trouve dans un chunk qui n'est pas chargé en ce moment.

Les premiers chiffres mettent quelques secondes à apparaître après l'ouverture de l'écran ou un changement de fréquence ou d'onglet ; en attendant,
l'écran affiche « … ». L'écran demande des chiffres à jour environ toutes les deux secondes tant qu'il est ouvert, un peu plus vite
pendant un moment après un changement, et n'enregistre jamais rien en arrière-plan.

### Ce que le Contrôleur ne peut pas voir

Le Contrôleur **ne charge jamais de chunk** pour trouver ou lire des appareils. Il tient un catalogue des appareils quantiques qu'il a vus dans
un chunk chargé. Un appareil qui n'est pas **actuellement chargé et accessible au joueur** ne compte jamais dans les débits, les parts
ou le bilan affichés : seuls les appareils actifs et joignables sont mesurés. Un appareil du joueur dans un chunk non chargé est compté comme
non chargé ; celui d'un autre joueur n'est pas affiché du tout, pour que personne ne puisse apprendre où se trouve la base de quelqu'un d'autre.

## Automatisation

Aucune : ce bloc n'a pas de configuration des faces à régler, pas de contrôle redstone, pas d'améliorations et pas d'énergie. Le casser ne fait rien perdre.

## Configuration

Pas de section dédiée dans `mekanismengineering-server.toml`.

## Conseils et dépannage

- **Aucun réseau accessible** : le joueur n'a actuellement accès à aucune fréquence ; en créer ou en lier une d'abord depuis un Entangloporteur
  quantique, un Récepteur ou un autre bloc quantique.
- Un appareil attendu manque : son chunk n'est probablement pas chargé en ce moment, ou il n'est pas accessible au joueur ; le
  Contrôleur ne force jamais le chargement de chunks pour vérifier.
- Toutes les familles affichent « ? » au lieu d'un pourcentage : au moins un appareil n'a pas pu être mesuré ; lire la ligne ambre au-dessus des cartes.
- L'onglet **Radiation** est vide sur une fréquence qui ne transporte aucun chemical radioactif ; utiliser l'onglet Chimiques pour tout le reste.
