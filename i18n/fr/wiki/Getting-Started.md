<!-- source: c56bf8f30031a4cedb2873cdcb4279432103983c -->
# Premiers pas

Les règles qui s'appliquent à toutes les machines de Mekanism: Engineering, pas seulement à l'une d'elles.

## Configuration des faces

Chaque machine du mod dispose de la configuration des faces de Mekanism (clic droit avec le Configurateur, ou ouvrir l'écran de la machine), **sauf** quatre :

- le **Quantum Digital Miner** et la **Petrogenic Synthesis Plant**, qui ont des ports fixes, comme le Mineur digital de Mekanism ;
- la **Quantum Ore Refinery**, dont les portes sont les blocs de port de sa structure (huit sur le plan) (un Configurateur fait passer un Port d'entrée entre objets, fluides et gaz) ;
- le **Contrôleur de réseau quantique**, un écran en lecture seule sans aucun port (la Tablette de réseau quantique est un objet).

Sur une machine multibloc (par exemple l'Industrial Fluid Pump ou la Petrogenic Synthesis Plant), le Configurateur agit sur **n'importe quelle face visible**, y compris les blocs extérieurs de la structure, pas seulement sur le bloc principal : cliquer sur un bloc de la structure revient à cliquer sur la machine elle-même.

## Installer des améliorations

Installer une amélioration Mekanism (vitesse, énergie, filtre, ancrage, etc.) en faisant un **clic droit accroupi** sur la machine, l'amélioration en main : le même geste que pour les machines de Mekanism. Cela fonctionne sur n'importe quel bloc de la machine, y compris les blocs extérieurs d'un multibloc.

Certains objets s'installent autrement et ne passent **pas** par l'onglet Améliorations : le Stabilisateur de source (Industrial Fluid Pump) et les modules de l'usine (Petrogenic Synthesis Plant) se posent avec le même clic droit accroupi, mais dans leur propre emplacement dédié plutôt que dans la liste générale des améliorations. Voir la page de chaque machine pour les détails.

## Sécurité et fréquences

Les machines qui ont un propriétaire (la plupart des machines du mod) utilisent **le système de sécurité de Mekanism** : Publique, Confiance ou Privé, réglé depuis l'écran de la machine ou depuis le Bureau de sécurité de Mekanism. Les Récepteurs d'énergie quantique, le Quantum Chargepad, le Quantum Digital Miner, le Contrôleur de réseau quantique et le module Quantum de la Quantum Ore Refinery utilisent **les fréquences de l'Entangloporteur quantique (Inventaire) de Mekanism** : la même liste de fréquences et la même visibilité Publique/Confiance/Privé qu'un Entangloporteur ordinaire. Le Quantum Entangloporter radioactif a **ses propres fréquences radioactives**, avec les mêmes règles Publique/Confiance/Privé (voir sa page).

## Les machines cassées gardent leurs données

Casser une machine à la pioche (ou par un autre moyen de retrait approuvé) donne un objet qui garde ses données : le propriétaire, le réglage de sécurité, le mode de contrôle par redstone, la configuration des faces, l'énergie, les objets et les fluides stockés, et l'état propre à la machine (par exemple la face choisie d'un Récepteur d'énergie quantique, ou le coffre d'un Contrôleur d'améliorations de précision) reviennent tous avec lui. Le reposer restaure cet état.

**Les fréquences font exception.** Un Récepteur d'énergie quantique, un Quantum Chargepad ou un Contrôleur de la Quantum Ore Refinery ne garde jamais sa fréquence dans l'objet : il faut la choisir de nouveau sur son écran après l'avoir posé. Un Quantum Digital Miner ne garde ses fréquences et ses liens que si c'est son **propriétaire** qui le casse. Ainsi, personne ne peut ramasser le bloc d'un autre joueur et utiliser son réseau privé.

## Pas de chargement de chunks

Aucune machine ne charge de chunks par elle-même. Le Digital Miner Companion, le Contrôleur d'améliorations de précision, le Contrôleur de réseau quantique et la Tablette de réseau quantique ne lisent que des chunks déjà chargés, et l'indiquent quand l'un d'eux ne l'est pas. La Quantum Ore Refinery ne charge jamais de chunk pour vérifier sa structure. Les machines qui acceptent la **Mise à niveau d'ancrage** de Mekanism (le Quantum Digital Miner, l'Industrial Fluid Pump et la Petrogenic Synthesis Plant) ne gardent des chunks chargés que lorsqu'une telle amélioration y est installée, exactement comme les machines de Mekanism.

## Voir aussi

[Configuration](Configuration.md) pour chaque réglage du serveur, et la [FAQ](FAQ.md) pour les questions courantes.
