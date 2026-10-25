<!-- source: 320ab884f8b8ea739eb20e894c02535b4e7658c7 -->
# FAQ

## Pourquoi une machine ne répond-elle pas en mon absence, ou indique-t-elle qu'un chunk n'est pas chargé ?

Aucune machine ne charge de chunks par elle-même. Le Digital Miner Companion, le scan du Contrôleur d'améliorations de précision et le Contrôleur de réseau quantique ne lisent que des chunks déjà chargés par d'autres moyens (un joueur à proximité, un chargeur de chunks, etc.), et le signalent quand l'un d'eux ne l'est pas. [Premiers pas](Getting-Started.md) liste les machines qui acceptent la Mise à niveau d'ancrage de Mekanism.

## Pourquoi est-il impossible de casser le Quantum Entangloporter radioactif ?

Tant que son tampon (ou un ancien stock radioactif laissé sur une fréquence par une version précédente) contient encore un produit chimique radioactif (comme le Spent Nuclear Waste), le Quantum Entangloporter radioactif refuse d'être cassé : à la pioche, par la Boîte en carton, par une explosion ou par le Wither. Le vider d'abord par une face de sortie, il se casse alors normalement. Une fréquence dont le stock radioactif contient encore quelque chose ne peut pas non plus être supprimée depuis un bloc du mod.

## Pourquoi le Contrôleur de réseau quantique affiche-t-il « ≈ », « ≥ » ou « ? » devant certains nombres ?

« ≈ » marque un débit **estimé** : pour ce que les Entangloporteurs quantiques de Mekanism éjectent d'eux-mêmes, le Contrôleur n'a pas de mesure exacte par tick, il l'estime donc. « ≥ » signifie « au moins » : certains appareils n'ont pas pu être mesurés (la ligne orange « N appareils non mesurés » indique combien). « ? » signifie que la valeur ne peut pas être connue. Toutes les autres valeurs (Récepteurs d'énergie quantique, Quantum Chargepad, Quantum Digital Miner et ce qu'éjecte un Quantum Entangloporter radioactif) sont comptées directement et affichées sans marque.

## Pourquoi ma Quantum Ore Refinery attend-elle au lieu de travailler ?

Avec **Toujours actif** sur OFF (par défaut), elle attend que les réservoirs contiennent tout ce que demande le niveau choisi, et affiche « Attend le niveau » avec ce qui manque. Passer **Toujours actif** sur ON pour la laisser travailler au meilleur niveau que couvrent les réservoirs (jamais en dessous de x2), ou cliquer sur un niveau plus bas pour abaisser le plafond. Voir [Quantum Ore Refinery](Quantum-Ore-Refinery.md#choosing-the-level).

## Pourquoi la Quantum Ore Refinery ne se forme-t-elle pas ?

Son écran nomme le premier bloc incorrect et l'endroit où il devrait être (« bloc attendu : … en (x, y, z) »). Le plan est fixe, tourne par quarts de tour avec le contrôleur et n'est jamais inversé en miroir ; les couches sont dans [Structure et pièces](Quantum-Ore-Refinery-Structure.md). Un port déjà réservé par une autre raffinerie empêche une seconde structure de se former.

## Où se trouve la liste des fréquences de la Tablette de réseau quantique ?

La Tablette ouvre le même écran que le Contrôleur : la zone des fréquences en haut à gauche. Elle montre les fréquences accessibles (ses propres fréquences Publique et Privé, et les fréquences Confiance dont le propriétaire fait confiance au joueur) ; une Tablette n'a besoin d'aucun Contrôleur posé nulle part.

## Où voir la zone de travail du Contrôleur d'améliorations de précision ?

Son rayon cubique est un réglage du serveur, pas quelque chose qui se règle en jeu. Ouvrir l'onglet Visuels sur son écran (le même onglet que celui du Mineur digital) pour voir la zone mise en évidence dans le monde.

## Pourquoi est-il impossible de régler les faces du Quantum Digital Miner, de la Synthesis Plant, de l'Ore Refinery ou du Contrôleur de réseau quantique ?

Ce sont les machines du mod sans la configuration des faces de Mekanism. Le Quantum Digital Miner et la Petrogenic Synthesis Plant ont des ports fixes, comme le Mineur digital de Mekanism (leurs pages montrent où se trouve chaque port). La Quantum Ore Refinery fonctionne par les blocs de port de sa structure. Le Contrôleur de réseau quantique n'a aucun port.

## Pourquoi le Precision Logistical Distributor n'a-t-il pas livré exactement les pourcentages affichés ?

Les pourcentages décrivent les parts configurées, pas une capacité finale garantie : un inventaire voisin peut toujours refuser une livraison ou ne l'accepter qu'en partie. En mode « Attendre chaque sortie », une part refusée fait attendre tout le lot ; avec « Attendre chaque sortie » désactivé, une part refusée est redistribuée aux autres sorties. Les livraisons déjà envoyées ne sont jamais annulées.

## En cassant une machine, perd-on ses réglages ?

Non. Chaque machine du mod lâche un objet qui garde ses données, et la reposer les restaure (voir [Premiers pas](Getting-Started.md)). Deux points à savoir : les fréquences ne sont pas transportées par l'objet (elles se choisissent à nouveau sur l'écran ; un Quantum Digital Miner ne garde la sienne que lorsque son propriétaire le casse), et le Quantum Entangloporter radioactif ne peut pas être cassé tant qu'il contient des déchets radioactifs.

## Améliorer le palier d'un Récepteur d'énergie quantique le réinitialise-t-il ?

En grande partie non. Fabriquer un Récepteur dans son palier suivant (Basic → Advanced → Elite → Ultimate) utilise le Récepteur précédent comme ingrédient et conserve ses faces configurées, son mode de contrôle redstone et toute énergie déjà en transit. La fréquence n'est pas conservée : le nouveau Récepteur démarre délié, et la fréquence se choisit sur son écran.

## Que signifient Publique, Confiance et Privé sur l'onglet de fréquence ou de sécurité d'une machine ?

Ce sont les réglages de sécurité et de fréquence de Mekanism lui-même, rien de propre à ce mod. Une fréquence ou la sécurité d'une machine peut être Publique (tout le monde peut l'utiliser ou s'y lier), Confiance (les joueurs à qui le propriétaire fait confiance le peuvent) ou Privé (seulement le propriétaire). Les Récepteurs d'énergie quantique, le Quantum Chargepad, le Quantum Digital Miner et le Contrôleur de réseau quantique utilisent la liste de fréquences habituelle de l'Entangloporteur quantique de Mekanism ; le Quantum Entangloporter radioactif a ses propres fréquences radioactives, avec les trois mêmes niveaux.

## Pourquoi mon Industrial Fluid Pump ne pompe-t-elle rien ?

La pompe a besoin que son aspiration soit amorcée : la raccorder par un réseau de Tuyaux mécaniques qui se termine par un tuyau immergé dans une source de fluide (placé dans le fluide, ou rempli avec un seau). Un bloc source adjacent ne l'amorce pas à lui seul.

## Qu'arrive-t-il à la Petrogenic Synthesis Plant si une partie de sa structure est détruite ?

Si un Wither ou le Dragon de l'Ender détruit un bloc de structure de la Plant, toute la Plant est retirée sans lâcher d'objet : le même comportement que les multiblocs de Mekanism dans cette situation.
