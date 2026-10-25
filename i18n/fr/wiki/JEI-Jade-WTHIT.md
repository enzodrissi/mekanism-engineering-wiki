<!-- source: d22e2c3c398e2d87ebc559e7ac756d4fef288de2 -->
# JEI, Jade et WTHIT

> Prise en charge facultative de trois mods d'information : des pages de recettes dans JEI, un affichage des machines dans Jade et dans WTHIT.

| | |
|---|---|
| Type | Intégrations facultatives |
| Ajouté en | 1.1.0 (lignes de la Quantum Ore Refinery en 1.2.0) |
| Requis | Non : aucun des trois n'est nécessaire, et aucun n'est fourni avec l'addon |
| Versions | JEI 19.25.1.332 ou plus récent ; Jade 15.10 ou plus récent ; WTHIT (compilé avec son API NeoForge 12.10.2) |
| Où il tourne | JEI sur le client ; Jade et WTHIT sur le client et le serveur |

## Ce que ça fait

Si JEI, Jade ou WTHIT est installé à côté de Mekanism: Engineering, l'addon ajoute ses propres pages de recettes et ses
propres lignes d'affichage. Sans eux, l'addon se comporte exactement comme avant : rien n'est chargé, rien n'est demandé, et rien
ne change dans les réglages de l'addon. Chacun des trois fonctionne seul ; Jade et WTHIT peuvent être installés ensemble.

## JEI

- **Une catégorie pour le [Petrogenic Synthesizer](Petrogenic-Synthesizer.md) et une pour la [Petrogenic Synthesis
  Plant](Petrogenic-Synthesis-Plant.md)**, chacune listant toutes les recettes pétrogéniques chargées (les 13 produits par
  défaut, plus ceux qu'ajoute un datapack ou un modpack). Une page de recette montre la durée, la production en blocs par seconde,
  l'énergie (par tick et par cycle), et l'eau et la lave consommées. La catégorie de la Plant montre les chiffres d'une ligne
  et le total de ses huit lignes identiques (« Synthèse minérale · une ligne »). La machine est le catalyseur de la catégorie :
  demander à JEI les utilisations de la machine liste donc les recettes.
- **Essayer les améliorations.** Le panneau a deux petits sélecteurs, Mises à niveau de la vitesse et Mises à niveau énergétiques (0 à 8 ; Maj + clic
  saute à zéro ou au maximum). Ils ne changent que les chiffres affichés ; leur infobulle indique « Consultation seulement : rien n'est
  appliqué à une machine. ». Dans le Synthesizer, les Mises à niveau de la vitesse augmentent aussi l'eau et la lave consommées par cycle, et
  l'infobulle le précise.
- **D'où viennent les chiffres.** Ils sont lus dans les règles propres à la machine et dans les réglages du serveur, pas saisis
  à la main. Sur un serveur, ils suivent ses réglages (« Nominal · valeurs du serveur ») ; sur l'écran titre, ou si le serveur n'en a envoyé aucun,
  ce sont les valeurs par défaut de l'addon (« Nominal · valeurs par défaut »). Ils sont nominaux : ce qu'une machine paie réellement peut différer
  un peu (millibuckets et joules entiers, travail réparti entre les ticks).
- **Pages d'information** pour les blocs et objets de l'addon (la Tablette de réseau quantique en a une en 1.2), chacune avec ce que fait l'élément, ce dont il a besoin, ce qu'il
  donne, et une liste « À savoir » avec les chiffres qui s'appliquent (par exemple la zone et la taille du coffre du
  [Contrôleur d'améliorations de précision](Precision-Upgrade-Controller.md)). Les pages des éléments fabriqués à partir d'une machine remplie
  portent aussi une note « Avant un craft » sur ce que deviennent les fluides.
- **Page de la Quantum Ore Refinery.** Une page pour la structure de la
  [Quantum Ore Refinery](Quantum-Ore-Refinery.md) : une vue 3D orientable, les quatre couches une par une, et la
  liste des pièces, plus une fiche d'aide pour chacun des 22 blocs de la structure. La ligne Jade « Voir JEI : couche N sur M » y renvoie.
- Les recettes de fabrication, le transfert des ingrédients vers une grille de fabrication et les ingrédients fantômes des filtres sont ceux de JEI et
  de Mekanism, laissés tels quels.

## Jade et WTHIT

Les deux affichent les mêmes lignes avec les mêmes mots : une **vue compacte** par défaut, et **plus de détails tant que la
touche de détails est maintenue** (dans Jade, sa propre touche « show details »). WTHIT affiche les détails en permanence par défaut, ou en
s'accroupissant si son option « Shift for details » est activée. La vue compacte contient l'état et les jauges de la machine ; la vue détaillée ajoute les quantités exactes et des lignes supplémentaires.
Une ligne le signale quand il y a plus à voir.

| Machine | Vue compacte | Avec la touche de détails |
|---|---|---|
| [Quantum Chargepad](Quantum-Chargepad.md) | « Prêt », « En charge » ou « Réserve vide » (pas de barre d'énergie de l'addon) | Rien de plus |
| [Récepteur d'énergie quantique](Quantum-Energy-Receiver.md) | La fréquence que le joueur a le droit d'utiliser, ou « Aucune fréquence » ; jamais de barre d'énergie stockée | |
| [Quantum Entangloporter radioactif](Radioactive-Quantum-Entangloporter.md) | La fréquence, une barre d'énergie, une barre pour le chemical radioactif qu'il contient, et « Démontage verrouillé : gaz ou matière radioactive » quand il est verrouillé | Le mode d'accès de la fréquence |
| [Contrôleur de réseau quantique](Quantum-Network-Controller.md) | Son nom seulement | |
| [Quantum Ore Refinery](Quantum-Ore-Refinery.md) (contrôleur) | « Multibloc formé · En marche à x*N* » ou « Multibloc formé · *état* », « Plafond x*N* · *énergie*/t », des jauges pour les quatre stocks ; une structure non formée indique « Bloc attendu : *bloc* en (X, Y, Z) » et « Voir JEI : couche N sur M » | |
| Ports de raffinerie | « Mode : Objets / Fluides / Gaz » ou « Ne fait pas partie d'une raffinerie formée » ; le Port de sortie ajoute « Éjecte vers : N voisins » | « Configurateur : changer le mode » sur les Ports d'entrée, « Produits en attente : N » sur le Port de sortie |
| [Industrial Fluid Pump](Quantum-Fluid-Pump.md) | Son état, la ligne d'entrée (« Entrée : OK » ou la cause), une barre pour le fluide de son réservoir | « Débit » en mB/t, « Stabilisateur de source installé » ou « Aucun stabilisateur de source » |
| [Petrogenic Synthesizer](Petrogenic-Synthesizer.md) | Le produit choisi, son état, des barres pour l'énergie, l'eau et la lave | « Vitesse : N blocs/s », « Améliorations : Vitesse N, Énergie N » |
| [Petrogenic Synthesis Plant](Petrogenic-Synthesis-Plant.md) | Son état, « Lignes : N configurées, M en production », jusqu'à trois produits, des barres pour l'énergie, l'eau et la lave | Le nombre de modules, les lignes qui attendent et ce qu'elles attendent, « + N autres produits : voir l'écran » |
| [Precision Logistical Distributor](Precision-Logistical-Distributor.md) | Son état et une barre « Stock » sur la capacité réelle de ses neuf emplacements, rouge à partir de 90 % avec « Stock presque plein » ou « Stock plein » | Le mode et « Attendre chaque sortie : activé » ou « désactivé », le nombre de sorties |
| [Contrôleur d'améliorations de précision](Precision-Upgrade-Controller.md) | Les améliorations gardées dans son coffre, ou « Aucune amélioration en réserve » | |
| [Quantum Digital Miner](Quantum-Digital-Miner.md) | Son état (« Prêt à rechercher », « Recherche en cours », « Minage », « En pause », ...), la cause quand le minage est bloqué, les trois premiers filtres actifs (ou « Filtres d'exclusion » en mode inversé, ou « Aucun filtre actif » ; un mineur inversé sans filtre n'affiche aucune ligne de filtre), et, une fois une recherche terminée, une barre de progression et « N blocs restants » | Les filtres par nom (« Minerai de fer »), un tag ou un mod par son identifiant (`#c:ores`, `@create`), « Recherche : N blocs trouvés », « Rayon N · Y a à b » (avec « Toucher de soie » quand il est activé) |

Une jauge montre toujours le stock réel sur la capacité réelle, jamais un zéro à la place d'un chiffre manquant : une jauge dont
la capacité ne peut pas être lue est omise, et le stock du Distributor indique « Indisponible ». Chaque couleur est doublée par des mots.

### Ce que vérifie le serveur

- Les règles d'accès de Mekanism s'appliquent, vérifiées sur le serveur pour le joueur qui regarde : une machine qu'il n'a pas le droit d'utiliser affiche
  son nom et « Accès restreint », et aucune ligne de l'addon (avec WTHIT, les lignes d'énergie et de fluide de Mekanism peuvent quand même
  s'afficher : voir plus bas ; le Contrôleur de réseau quantique n'affiche que son nom à tout le monde). Un Récepteur ou un Entangloporter n'affiche sa fréquence que si le joueur
  a le droit d'utiliser cette fréquence ; une fréquence privée d'un autre joueur reste privée.
- Un bloc est lu au plus une fois toutes les 5 ticks pour chaque joueur, quel que soit le nombre de demandes de l'affichage, et sa lecture
  ne lance jamais de scan, ne charge jamais de chunk et ne crée jamais rien.
- Si le code d'un autre mod échoue pendant une lecture, l'erreur est journalisée une fois et l'affichage ne montre aucune ligne de l'addon ; cela ne peut pas casser
  un tick.

### Les lignes propres à Mekanism

Mekanism fournit sa propre prise en charge de Jade et de WTHIT, qui ajoute des lignes d'énergie, de fluide et de chemical à ses blocs et,
sans vérification du joueur, à tout bloc qui répond aux capacités habituelles.

- **Avec Jade**, ces lignes sont masquées sur les machines de l'addon, tout comme la liste d'objets propre à Jade, pour que chaque stock n'apparaisse
  qu'une fois.
- **Avec WTHIT**, les lignes de Mekanism ne peuvent pas être masquées par un autre mod (elles ne portent aucun identifiant) : sur certaines machines, on
  voit donc à la fois la jauge de l'addon et celle de Mekanism, par exemple sur l'Industrial Fluid Pump, le Petrogenic Synthesizer et la
  Plant, le Quantum Digital Miner, le Quantum Chargepad et le Contrôleur d'améliorations de précision. Mekanism montre ces lignes à
  tous les joueurs, comme sur ses propres machines. L'addon masque quand même les lignes d'énergie,
  de fluide, d'objets et de progression propres à WTHIT sur ses machines.
- Sur les Récepteurs d'énergie quantique et le Quantum Entangloporter radioactif, rien n'est lu à l'intérieur du bloc :
  ni les lignes d'affichage de Mekanism ni celles de The One Probe ne peuvent donc y montrer une fréquence privée ou une barre « 0 FE / Infinite ».

### Désactiver

Dans la configuration de Jade, les lignes de l'addon sont l'option « HUD des machines » sous « Mekanism: Engineering ». On peut aussi simplement ne pas
installer le mod : rien dans l'addon n'en dépend.

### Quantum Ore Refinery


Chaque bloc d'une raffinerie formée répond à Jade et à WTHIT avec les lignes propres à la raffinerie ; le tableau ci-dessus les liste. Les règles
d'accès de Mekanism s'appliquent comme pour les autres machines.

## Conseils et dépannage

- Rien n'apparaît dans Jade ou WTHIT : vérifier que le mod est installé sur le serveur comme sur le client (les deux préparent
  leurs données sur le serveur), et que la machine regardée est l'une de celles du tableau ci-dessus.
- Un affichage qui montre deux barres d'énergie sur une machine, c'est WTHIT avec les lignes de Mekanism (voir plus haut) ; Jade les masque.
- JEI n'affiche pas les catégories pétrogéniques : elles demandent JEI 19.25.1.332 ou plus récent, et elles listent les recettes pétrogéniques
  que le monde en cours a chargées.
