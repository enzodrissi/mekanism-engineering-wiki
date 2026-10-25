<!-- source: b84a5b5f0d966e3898d3c4532b2c03cf244ec9e6 -->
# Contrôleur d'améliorations de précision

> Stocke les améliorations Mekanism de toute une usine et les pose dans chaque machine autour de lui.

![Contrôleur d'améliorations de précision](images/precision_upgrade_controller.png)

| | |
|---|---|
| Type | Machine |
| Taille | 1 bloc |
| Énergie | 400 J/t pendant un scan ou une application (`upgrade_controller.energyUsage`) ; stocke 200 000 J (`upgrade_controller.energyStorage`) |
| Améliorations | Vitesse, Énergie (n'agissent que sur la vitesse de scan et d'application du Contrôleur et sur son coût en énergie) |
| Configuration des faces | Oui (Mekanism) : objets et énergie |

## Ce qu'il fait

Le Contrôleur garde un coffre d'améliorations Mekanism (jusqu'à 1 024 de chaque type par défaut) et les installe
automatiquement dans chaque machine compatible d'une zone cubique autour de lui, au lieu d'ouvrir les machines une par
une. Il ne touche **qu'**aux améliorations : jamais aux entrées, aux sorties, à la configuration des faces, aux recettes ni à l'inventaire d'une machine.

- **La zone** est un cube centré sur le Contrôleur, dont la taille est fixée par le réglage serveur `upgrade_controller.radius` (8 blocs
  de chaque côté par défaut, soit 17 × 17 × 17 en tout). Les joueurs ne peuvent pas la changer depuis l'écran ; elle s'affiche
  dans le monde avec l'onglet **Visuels** de Mekanism, la même boîte translucide que Mekanism dessine pour la zone du Mineur digital.
- **Le coffre** contient jusqu'à `vaultCapacityPerType` (1 024 par défaut) de chacun des sept types d'amélioration de Mekanism
  (Vitesse, Énergie, Chemical, Filtre, Étouffement, Ancrage, Générateur de Roche). Il se remplit en déposant des objets dans
  l'emplacement Déposer, ou en envoyant par tuyau des améliorations dans n'importe quelle face configurée en entrée d'objets. Si Mekanism Extras (ou un autre
  addon) ajoute des types d'amélioration, ils apparaissent aussi dans le coffre.
- **Une amélioration à la fois.** L'écran montre toujours une seule amélioration, celle sélectionnée dans le coffre. Les nombres réglés,
  **Toutes les machines au max** et **Appliquer** ne concernent que cette amélioration. Appliquer Vitesse ne déplace jamais les Mises à
  niveau énergétiques, même si une autre amélioration est sélectionnée pendant le travail.
- **Scanner** lit les entités de bloc des chunks de la zone et regroupe par type de bloc les machines auxquelles on a
  accès ; il faut que les chunks de la zone soient chargés, et le scan indique combien ne le sont pas.
- Pour chaque type de machine, on l'inclut ou on l'exclut, et on règle combien de l'amélioration affichée il doit porter : un
  nombre réglé avec − / +, ou **Max** sur cette rangée, qui règle une fois le plafond de l'amélioration (8 pour Vitesse, Énergie et
  Chemical, 1 pour les autres).
- **Appliquer** ne déplace que la différence pour l'amélioration affichée : ce qui manque entre depuis le coffre, ce qui est en trop
  y retourne, en revérifiant chaque machine juste avant d'y toucher, quelques améliorations par tick. Deux Contrôleurs ne
  travaillent jamais sur la même machine en même temps : chacun réserve les machines qu'il doit encore visiter jusqu'à ce qu'il ait fini ou disparu.
- **Les retraits** (améliorations qu'une application *retirerait* d'une machine) sont affichés en rouge partout où ils apparaissent (les lignes
  des rangées de machines, le résumé), et le bouton Appliquer lui-même passe au rouge, avec une infobulle qui indique l'amélioration retirée
  et combien, qu'elles reviennent au coffre, et l'énergie stockée qui serait perdue. Retirer des Mises à niveau énergétiques
  ramène l'énergie stockée de la machine à son nouveau maximum (plus bas), exactement comme si on les avait retirées à la main ; cette
  perte est affichée avant d'appuyer sur Appliquer.
- Une machine à laquelle on n'a pas le droit de toucher, selon la sécurité de Mekanism, n'est jamais indexée ni modifiée.

## Fabrication

![Recette du Contrôleur d'améliorations de précision](images/precision_upgrade_controller-recipe.png)

```
ACA
TST
ACA
```

- `A`: Alliage infusé ×4
- `C`: Circuit de contrôle avancé ×2
- `S`: Boîtier en acier ×1
- `T`: Transporteur logistique de base ×2

## Premiers pas

1. Fabriquer le Contrôleur.
2. Le poser à peu près au centre de l'usine à gérer. Chaque machine qu'il doit atteindre doit se trouver
   dans son cube (8 blocs de chaque côté par défaut ; vérifier `upgrade_controller.radius` en cas de doute).
3. L'alimenter : relier un câble à une face configurée en énergie, ou mettre une batterie dans son emplacement d'énergie. Un
   Contrôleur sans énergie attend et l'indique à l'écran.
4. Remplir le coffre : déposer des améliorations dans l'emplacement Déposer, ou les envoyer par tuyau dans n'importe quelle face réglée en entrée d'objets.
5. Appuyer sur **Scanner** et attendre la fin ; l'écran indique combien de chunks sont lus.
6. Choisir une amélioration dans le coffre, inclure les types de machine à gérer, et régler combien de cette amélioration
   chaque type doit porter (ou appuyer sur **Max** sur sa rangée).
7. Appuyer sur **Appliquer**. Un bouton Appliquer rouge signifie que cette exécution va aussi retirer des améliorations de certaines machines :
   lire d'abord son infobulle si ce n'est pas le résultat attendu.

## L'interface

![Interface du Contrôleur d'améliorations de précision](images/precision_upgrade_controller-gui.png)

L'écran est haut : s'il ne tient pas dans la fenêtre (par exemple avec une Taille de l'interface de 3 dans une fenêtre de 1280×720), baisser la Taille de l'interface.

- **Coffre d'améliorations** (à gauche) : une ligne par amélioration, avec son icône, son nom et le nombre que contient le coffre (en gris à
  0). Cliquer sur une ligne sélectionne cette amélioration ; la ligne sélectionnée est entourée de bleu-vert. Maj + clic sur une ligne met une pile
  de cette amélioration dans l'inventaire. Le bouton **Retirer une pile** sous le coffre fait de même pour l'amélioration sélectionnée ; si
  l'inventaire est plein, la pile va dans l'emplacement Récupérer.
- **Liste déroulante pour les améliorations des autres mods.** Quand Mekanism Extras (ou un autre addon) ajoute des types d'amélioration, un
  bouton comme **+3 ▼** (le nombre indique combien sont ajoutés) se trouve sur la ligne de titre du coffre. Il ouvre ces améliorations
  dans une liste par-dessus le coffre (« Améliorations ajoutées par d'autres mods ») ; cliquer sur l'une d'elles pour l'afficher, cliquer n'importe où ailleurs pour fermer la
  liste. Maj + clic sur une ligne de la liste retire une pile, comme sur le coffre. Sans un tel addon, il n'y a pas de bouton.
- **Machines de la zone** (en haut au milieu) : les boutons **Scanner** et **Arrêt**. Le scan consomme de l'énergie pendant le travail ; Arrêt
  met fin à un scan ou à une application en cours, et rien n'est jamais laissé à moitié déplacé.
- **L'amélioration affichée** (au milieu) : son icône et son nom, puis **Toutes les machines au max**, qui règle au maximum qu'il
  peut porter chaque type de machine *inclus* qui prend cette amélioration. Les colonnes sont **Machines** et **Cible par
  machine**.
- **Une rangée par type de machine** (trois à la fois ; défiler avec la molette, et un compteur comme « 1–3 / 7 » indique
  la position) : un petit carré pour inclure ou exclure le type ; le vrai bloc de la machine comme icône, avec le nombre
  de machines de ce type trouvées par le dernier scan ; son nom ; « N installées » (ou « exclue ») ; et la cible avec − et +
  et **Max**. Une rangée exclue garde son icône en couleur et grise ses mots et ses nombres. Un type de machine resté dans
  l'ancien mode MAX (d'une ancienne sauvegarde) affiche le plafond de l'amélioration jusqu'à ce qu'on le change avec − / + ou Max.
- **Résumé** (deux lignes sous les rangées, avec le détail complet au survol) : ce que ferait Appliquer pour l'amélioration affichée, en
  vert pour ce qui est installé (« +N améliorations à installer ») et en rouge pour ce qui est retiré (« −N améliorations à retirer »), puis
  combien de machines sont touchées (« N machines concernées »). Quand quelque chose bloque, cette ligne prend sa
  place : « Pas d'énergie : le Contrôleur attend », « Arrêté par la redstone : le Contrôleur attend », « Appuyer sur Scan pour trouver les machines autour »,
  « Aucune machine à moins de N blocs », « N manquantes : le coffre ne suffit pas », « N chunks non chargés : le scan est
  partiel », « Dernière application : X améliorations déplacées sur Y », etc. Quand des Mises à niveau énergétiques seraient retirées, « Énergie stockée perdue : jusqu'à ... »
  apparaît.
- **Appliquer** : exécute le plan pour l'amélioration affichée. Le bouton passe au rouge quand il retire des améliorations.
- **Transferts** (en bas à gauche) : l'emplacement **Déposer** (améliorations entrantes) et l'emplacement **Récupérer** (ce que le bouton de retrait
  n'a pas pu mettre dans l'inventaire), la barre d'énergie et l'emplacement de recharge pour une batterie.
- L'onglet **Visuels** de Mekanism, sous les onglets de configuration des faces, dessine le cube de travail dans le monde.

## Automatisation

- La configuration des faces fonctionne comme sur n'importe quelle machine Mekanism : faces d'objets (améliorations entrantes, améliorations sortantes) et une face d'énergie. Par
  défaut, chaque face accepte les améliorations dans les deux sens et l'énergie en entrée ; activer l'éjection automatique depuis l'onglet de configuration des faces pour
  que le surplus du coffre soit poussé dehors automatiquement.
- Un transporteur logistique qui envoie des améliorations dans n'importe quelle face réglée en entrée d'objets remplit le coffre de la même façon que
  l'emplacement Déposer.
- Le rayon de la zone est un réglage valable pour tout le serveur, pas pour chaque bloc.
- Deux Contrôleurs peuvent sans risque couvrir des zones qui se chevauchent : pendant que l'un travaille sur une machine, l'autre la laisse tranquille, et un
  Contrôleur disparu, déchargé ou arrêté ne bloque jamais rien.
- Casser le bloc conserve dans l'objet obtenu le coffre, les réglages par type, l'énergie et le mode redstone. Quand un joueur le
  casse, l'objet va directement dans son inventaire ; seul ce que l'inventaire ne peut pas contenir tombe au sol.

## Configuration

Section `upgrade_controller` de `mekanismengineering-server.toml` :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `vaultCapacityPerType` | `1024` | 1 à 65 536 | Améliorations d'un même type que le coffre peut contenir. |
| `radius` | `8` | 1 à 64 | Rayon cubique sur lequel travaille chaque Contrôleur, en blocs. Les joueurs ne peuvent pas le changer ; l'onglet Visuels montre la zone. |
| `energyUsage` | `400` J/t | 0 à max | Énergie consommée par tick pendant un scan ou un déplacement d'améliorations, avant les Mises à niveau de la vitesse et énergétiques. |
| `energyStorage` | `200,000` J | 1 à max | Énergie que stocke le Contrôleur. |

## Conseils et dépannage

- « Scan : N / M chunks » qui ne se termine jamais signifie presque toujours un manque d'énergie : vérifier la barre d'énergie et la ligne « Pas d'énergie » dans
  le résumé.
- Un type de machine qui demande toujours plus que la valeur réglée, avec l'infobulle du coffre qui indique « Un type resté en ancien mode
  MAX veut toutes les améliorations qu'il accepte », vient d'une sauvegarde antérieure au Max par rangée : un tel type veut le
  plafond de *toutes* les améliorations qu'il accepte, Ancrage et Générateur de Roche compris. Utiliser − / + ou Max sur sa rangée pour donner à sa
  cible un nombre explicite.
- Après une application, le résultat « Dernière application » affiché est celui de l'application la plus récente, quelle que soit l'amélioration concernée, même
  si une autre amélioration sans rien à faire a été sélectionnée depuis.
