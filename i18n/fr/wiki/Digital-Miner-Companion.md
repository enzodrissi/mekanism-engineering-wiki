<!-- source: 9409644be3a83e637227dea27c765bd3725187fd -->
# Digital Miner Companion

> Lier un Mineur digital, voir ce qu'il minerait, préparer ses filtres, le démarrer, le mettre en pause et le réinitialiser depuis n'importe où.

![Digital Miner Companion](images/digital_miner_companion.png)

| | |
|---|---|
| Type | Outil |
| Taille | Objet tenu en main, ne s'empile pas |
| Énergie | Sa propre batterie : `companion.energyCapacity` (256 MJ par défaut), rechargée jusqu'à `companion.chargeRate` (1 MJ/t) dans n'importe quel chargeur ou cube d'énergie de Mekanism. Dépensée uniquement pour relocaliser un [Quantum Digital Miner](Quantum-Digital-Miner.md) (`relocation.energyCost`, 80 MJ par défaut) |
| Mises à niveau | Aucune : c'est un outil, pas une machine |
| Configuration des faces | Non : c'est un objet, pas un bloc |

## Ce qu'il fait

Le Digital Miner Companion se lie à un Mineur digital ou à un Quantum Digital Miner et permet de le lire et de le contrôler
depuis n'importe où : à n'importe quelle distance, dans n'importe quelle dimension, tant que son chunk est déjà chargé quelque part (le Companion
n'en charge jamais lui-même) et que la sécurité de Mekanism autorise l'accès.

- **Liaison** : faire Maj + clic droit sur un Mineur digital ou un Quantum Digital Miner pour y lier le Companion,
  en remplaçant toute liaison précédente. Un court temps de recharge (`surveyor.cooldownTicks`) évite qu'un clic maintenu lie
  deux fois. Quand la machine liée est cassée ou remplacée par une autre, le Companion l'oublie de lui-même et repasse
  à l'état non lié (en main, dans l'écran ouvert ou dans l'inventaire) ; une machine simplement hors de portée, ou
  dans un chunk ou une dimension non chargés, garde sa liaison.
- **Un clic droit n'importe où** ouvre le Companion, sur deux onglets :
  - **Minage** : une configuration et une liste de filtres en brouillon, à modifier avant de les envoyer, et un **Scanner**
    à la demande, en lecture seule, qui compte autour de la machine liée les blocs que le brouillon minerait actuellement. Aucun chunk n'est chargé
    et la machine n'est jamais démarrée ; un scan qui rencontre des chunks non chargés est signalé comme partiel.
  - **Mineur digital** : l'état en direct de la machine liée (en ligne, ou pourquoi elle ne l'est pas), son énergie stockée, ses mises à niveau, ses propres
    filtres et sa configuration, les commandes à distance **Démarrer / Arrêt / Réinitialiser** selon les règles de la machine et, pour un Quantum
    Digital Miner, son numéro de zone, sa source de sortie des objets et son panneau de relocalisation.
- **Pull** remplace le brouillon par les filtres ou les réglages actuels de la machine liée ; **Push** envoie le brouillon à
  la machine, uniquement quand elle n'est pas prête (arrêtée et réinitialisée), exactement la règle de Mekanism pour modifier la configuration
  d'un Mineur digital. Si la machine a changé depuis le dernier Pull, Push demande un second clic avant
  de l'écraser.
- **Maj + clic droit sur tout autre bloc** ouvre une petite fenêtre pour l'ajouter aux filtres du brouillon : le bloc exact,
  ou l'un des tags de bloc utilisables par le Mineur digital.
- **Relocalisation** (Quantum Digital Miner uniquement) : une fois sa zone entièrement minée, le Companion peut le déplacer vers une
  zone voisine jamais exploitée :
  - **Automatique** : tirée au hasard parmi jusqu'à 8 zones voisines libres.
  - **Manuel** : placé devant le joueur, au-delà d'une marge de sécurité (1–8 blocs, 3 par défaut), à la hauteur de ses pieds,
    tourné vers lui ; la destination peut être tournée par quarts de tour avant de confirmer.
  - Dans les deux cas, la machine se charge sur place pendant `relocation.chargeTicks` (30 ticks par défaut) avant de partir,
    la destination est revérifiée juste avant le déplacement, et tout le déplacement se fait en un seul tick, si bien qu'il ne peut pas
    être interrompu à mi-chemin. La plateforme de 5 × 5 sur laquelle elle arrive est générée gratuitement (25 pierres), et tout bloc sur son
    chemin est détruit sur place plutôt que lâché, si bien que rien n'est dupliqué. Le coût, `relocation.energyCost` (80
    MJ par défaut), est prélevé sur la batterie du Companion, jamais sur la machine.
- **Voyant de l'objet et de l'antenne** : montre d'un coup d'œil un état en cache (gris hors ligne ou non lié, rouge quand non prêt,
  orangé clignotant pendant le travail, orangé atténué en pause, vert une fois terminé), actualisé tant que l'objet se trouve dans
  l'inventaire d'un joueur.

## Fabrication

![Recette du Digital Miner Companion](images/digital_miner_companion-recipe.png)

```
UGU
AEA
UTU
```

- **U** (×4): n'importe quel Circuit de contrôle ultime
- **G**: n'importe quelle vitre
- **A** (×2): n'importe quel Alliage atomique
- **E**: Tablette d'énergie
- **T**: Noyau de téléportation

La charge stockée dans la Tablette d'énergie est transférée dans la batterie du Companion : le fabriquer avec une tablette
chargée évite un passage par un chargeur.

## Premiers pas

1. Fabriquer la recette ci-dessus.
2. Faire Maj + clic droit sur un Mineur digital ou un Quantum Digital Miner posé pour y lier le Companion.
3. Faire un clic droit n'importe où pour ouvrir le Companion.
4. Dans l'onglet **Minage**, ajouter des filtres (Maj + clic droit sur des blocs dans le monde) ou récupérer avec **Pull** les filtres
   de la machine, puis **Scanner** pour voir ce qu'ils mineraient actuellement.
5. Envoyer le brouillon à la machine avec **Push** (uniquement quand elle est arrêtée et réinitialisée), ou utiliser **Démarrer / Arrêt / Réinitialiser** dans
   l'onglet **Mineur digital** pour faire tourner la machine avec ses propres filtres tels quels.
6. Charger le Companion dans n'importe quel chargeur ou cube d'énergie de Mekanism avant de relocaliser un Quantum Digital Miner.

## L'interface

![Interface du Digital Miner Companion](images/digital_miner_companion-gui.png)

- **En-tête** : état de la liaison : la position de la machine liée et son état en ligne, ou la raison pour laquelle elle est hors ligne (chunk non
  chargé, accès refusé) ; une machine détruite ou remplacée est oubliée et le Companion apparaît comme non lié, avec la couleur du voyant.
- **Onglet Minage** : trois tuiles de statistiques (blocs trouvés, temps estimé, énergie, avec l'onglet énergie de Mekanism pour les
  unités), le bouton **Scanner**, un détail paginé bloc par bloc et la liste des filtres (activer, désactiver, retirer,
  Pull, Push).
- **Onglet Mineur digital** : la machine liée affichée en 3D, son état et sa progression en direct, **Démarrer / Arrêt / Réinitialiser**,
  sa configuration (rayon, plage Y, Toucher de soie, éjection automatique, tirage automatique, mode inversé, avec Pull/Push et un
  avertissement de conflit) et, sur un Quantum Digital Miner, sa zone, sa source de sortie des objets et un bouton **Relocaliser** qui
  ouvre le panneau de relocalisation (mode, marge ou aperçu de la destination, coût en énergie, confirmation).
- Maj + clic droit sur un bloc autre qu'un mineur ouvre **Ajouter un filtre** : le bloc exact, ou l'un des tags de bloc
  utilisables par le Mineur digital, chacun avec le nombre de blocs qu'il couvre. Un simple clic droit sur n'importe quel bloc ouvre seulement
  l'écran du Companion.

## Automatisation

Non automatisable, c'est un outil à main, mais :

- Il se charge comme n'importe quel objet à énergie de Mekanism, dans les chargeurs et les cubes d'énergie ; rien ne le vide sauf une
  relocalisation manuelle.
- Sa liaison, sa configuration en brouillon et son état en cache sont tous stockés dans l'objet lui-même : il les conserve d'un
  inventaire et d'une dimension à l'autre ; rien n'est perdu en le tenant ou en le rangeant simplement.

## Configuration

Configuration serveur, section `surveyor` (liaison, lecture, scan) :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | true | – | Désactive entièrement la liaison, la lecture, le contrôle à distance et la relocalisation |
| `cooldownTicks` | 10 | 1–200 | Délai minimal entre deux liaisons d'un même joueur |
| `estimateEnabled` | true | – | Active ou désactive le Scanner |
| `estimateBudgetMicros` | 2 000 | 100–20 000 | Temps du fil serveur par tick partagé entre tous les scans en cours |
| `estimateMaxBlocks` | 4 000 000 | 1–50 000 000 | Refuse un scan dont le volume configuré dépasse cette valeur |
| `estimateMaxConcurrent` | 4 | 1–32 | Nombre maximal de scans en même temps sur le serveur |

Section `companion` (sa batterie) :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `energyCapacity` | 256 000 000 J (256 MJ) | 1 J – sans limite | Énergie stockée par le Companion |
| `chargeRate` | 1 000 000 J/t (1 MJ/t) | 1 J/t – sans limite | Énergie acceptée à chaque tick pendant la charge |

Section `relocation` (déplacement d'un Quantum Digital Miner) :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | true | – | Autorise la relocalisation d'un Quantum Digital Miner qui a terminé |
| `energyCost` | 80 000 000 J (80 MJ) | 0 J – sans limite | Énergie prélevée sur le Companion pour une relocalisation |
| `gap` | 2 | 0–64 | Blocs laissés intacts entre une zone terminée et la suivante |
| `maxHeightDifference` | 3 | 0–16 | Plus grand écart de hauteur du sol toléré sous la plateforme de 5 × 5 |
| `maxHistory` | 256 | 1–4 096 | Zones terminées mémorisées par machine |
| `candidateTimeoutTicks` | 200 | 20–2 400 | Ticks d'attente du chargement des chunks d'un emplacement candidat |
| `ceilingSearchRange` | 16 | 1–64 | Dans les dimensions à plafond (le Nether), blocs explorés pour trouver un sol |
| `chargeTicks` | 30 | 0–200 | Ticks pendant lesquels la machine se charge sur place, entière et inchangée, avant de partir |

## Astuces et dépannage

- **« Envoi possible quand le Miner est non prêt »** : réinitialiser d'abord la machine (depuis son propre écran, ou avec le bouton
  Réinitialiser du Companion) : Mekanism refuse les changements de configuration sur un Mineur digital en marche ou en recherche.
- **Hors ligne** : l'en-tête indique la raison exacte : chunk non chargé (personne ne le force à rester chargé à la place du joueur), machine
  détruite, remplacée par la machine d'un autre propriétaire, ou accès refusé par la sécurité de Mekanism.
- **Pas de bouton Relocaliser, ou il refuse** : seul un Quantum Digital Miner se relocalise ; il faut aussi que sa zone soit terminée
  (0 bloc restant) et que le Companion soit chargé.
- **La relocalisation échoue avec « Aucune zone voisine valide »** : chaque emplacement candidat autour chevauche une zone déjà exploitée,
  dépasse la bordure du monde ou n'a pas le temps de se charger : réessayer plus tard ou réduire `gap`.
