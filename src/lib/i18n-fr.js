// French words of the site's own parts (3D views, bill of materials, crafting card, calculator, home page, footer), by
// their English text; see src/lib/i18n.js. Block names come from the mod's French language file, through the import.
import { FR_ANIM } from './i18n-fr-anim.js';

export const FR = {
  ...FR_ANIM,
  // how to build the refinery, block by block (src/lib/build.js, PageTitle.astro)
  'How to build it': 'Comment la construire',
  'Block by block, in an order that is easy in game. Stand in front of the controller: left and right are yours, and layer 1 is the bottom one. Only the kind of block matters in each cell, not the way it faces.':
    'Bloc par bloc, dans un ordre simple à suivre en jeu. On se tient devant le contrôleur : la gauche et la droite sont celles du joueur, et la couche 1 est celle du bas. Seule compte la sorte de bloc dans chaque case, pas le sens dans lequel il est tourné.',
  'Parts of the build': 'Parties de la construction',
  'Controller row': 'Rangée du contrôleur',
  'Layer 1': 'Couche 1',
  'Layer 2': 'Couche 2',
  'Layer 3': 'Couche 3',
  'Roof': 'Toit',
  'Quantum Module': 'Module quantique',
  'optional': 'facultatif',
  '{n} blocks': '{n} blocs',
  '▶ Play': '▶ Lecture',
  '❚❚ Pause': '❚❚ Pause',
  'Step': 'Étape',
  'Step {i}': 'Étape {i}',
  'Step {i} of {n}': 'Étape {i} sur {n}',
  '{n}st from the left': '{n}re en partant de la gauche',
  '{n}nd from the left': '{n}e en partant de la gauche',
  '{n}rd from the left': '{n}e en partant de la gauche',
  '{n}th from the left': '{n}e en partant de la gauche',
  'left end': 'bout gauche',
  'right end': 'bout droit',
  'front row': 'rangée de devant',
  'middle row': 'rangée du milieu',
  'back row': 'rangée du fond',
  'Front': 'Devant',
  'Middle': 'Milieu',
  'Back': 'Fond',
  'Free cell': 'Case libre',
  'seen from above': 'vue de dessus',
  '▲ You stand here, facing the controller': '▲ Le joueur ici, face au contrôleur',
  'Last required block. The structure forms: redstone dust runs along its edges, or the controller\'s screen says "Multiblock formed".':
    'Dernier bloc obligatoire. La structure se forme : de la poudre de redstone court le long de ses arêtes, ou l’écran du contrôleur affiche « Multibloc formé ».',
  'Place it first. It turns to face you, and the whole structure stands behind it and to its right. The drawing turns with it and is never mirrored.':
    'Le poser en premier. Il se tourne vers le joueur, et toute la structure se dresse derrière lui et sur sa droite. Le plan tourne avec lui et n’est jamais mis en miroir.',
  'The seven process modules sit right of the controller, in this order: Dissolution, Washing, Crystallization, Injection, Purification, Enrichment, Smelting.':
    'Les sept modules de traitement suivent le contrôleur vers la droite, dans cet ordre : dissolution, lavage, cristallisation, injection, purification, enrichissement, fonte.',
  'A corner post. The four corners are columns of four pillars, which join the ones above and below.':
    'Un poteau d’angle. Les quatre angles sont des colonnes de quatre piliers, qui se raccordent à ceux du dessus et du dessous.',
  'At an end of the middle row, an Input Port works on items only: a Configurator will not turn it to fluids or gases there.':
    'À un bout de la rangée du milieu, un Port d’entrée fonctionne avec les objets seulement : un Configurateur ne le fait pas passer aux fluides ni aux gaz à cet endroit.',
  'You need at least five Input Ports. Any cell of the back row of layers 1 and 2 takes one. A Configurator turns each one to Items, Fluids or Gases.':
    'Il faut au moins cinq Ports d’entrée. Toute case de la rangée du fond des couches 1 et 2 en accepte un. Un Configurateur fait passer chacun en Objets, Fluides ou Gaz.',
  'You need at least one. It goes on the back row of layer 1 or 2, never at an end of the middle row. It takes Joules or Forge Energy.':
    'Il en faut au moins un. Il se pose sur la rangée du fond de la couche 1 ou 2, jamais à un bout de la rangée du milieu. Il accepte des joules ou du Forge Energy.',
  'Optional, at most one. The ingots leave here. Without it, the refinery needs a Quantum Module with a frequency.':
    'Facultatif, un au plus. Les lingots sortent par ici. Sans lui, la raffinerie a besoin d’un module quantique réglé sur une fréquence.',
  'This back cell also takes any port, if you want more Input or Energy Ports.':
    'Cette case du fond accepte aussi n’importe quel port, pour ajouter des Ports d’entrée ou d’énergie.',
  'The body of the multiblock.': 'Le corps du multibloc.',
  'The conveyors run along the front, right above the controller and the modules.':
    'Les tapis courent sur le devant, juste au-dessus du contrôleur et des modules.',
  'Each tank is two blocks high: this is its bottom half. The empty cells of this middle row stay free (air, Ore Refinery Glass or a casing).':
    'Chaque réservoir est haut de deux blocs : voici sa moitié du bas. Les cases vides de cette rangée du milieu restent libres (air, Vitre de raffinerie de minerai ou carcasse).',
  'The top half of the tank, on the bottom half.': 'La moitié du haut du réservoir, posée sur celle du bas.',
  'One of eight accelerator places. Each accelerator makes a job shorter; a casing fits here too.':
    'L’une des huit places d’accélérateur. Chaque accélérateur raccourcit un travail ; une carcasse convient aussi.',
  'The roof. A girder turns to follow the axis it is placed on.': 'Le toit. Une poutre se tourne selon l’axe où on la pose.',
  'Optional. It goes here, above the Output Port, or in its place. Choose a frequency on its screen and the ingots go to a Quantum or QIO network.':
    'Facultatif. Il se pose ici, au-dessus du Port de sortie, ou à sa place. Choisir une fréquence sur son écran envoie les lingots vers un réseau Quantum ou QIO.',
  // 3D views
  'Drag to turn the 3D view': 'Faire glisser pour tourner la vue 3D',
  '⟲ Drag to turn': '⟲ Glisser pour tourner',
  '⟲ Drag to turn · tap a block': '⟲ Glisser pour tourner · toucher un bloc',
  'Loading the 3D view…': 'Chargement de la vue 3D…',
  'The 3D view could not load on this device.': 'La vue 3D n’a pas pu se charger sur cet appareil.',
  'View': 'Vue',
  'Assembled': 'Assemblée',
  'Exploded': 'Éclatée',
  'Layer by layer': 'Couche par couche',
  '⟳ Reset view': '⟳ Recentrer la vue',
  'Layer {n}': 'Couche {n}',
  'Controller': 'Contrôleur',
  'Input Port (at least 5)': 'Port d’entrée (au moins 5)',
  'Process modules (7)': 'Modules de traitement (7)',
  'Water Tank': 'Réservoir d’eau',
  'Accelerators (8 places)': 'Accélérateurs (8 places)',
  'Quantum Module (optional)': 'Module quantique (facultatif)',
  'Output Port (optional)': 'Port de sortie (facultatif)',
  'Girders (roof)': 'Poutres (toit)',
  '8 Accelerators': '8 accélérateurs',
  'Quantum Module': 'Module quantique',
  '{n} in the structure': '{n} dans la structure',
  'One in the structure': 'Un seul dans la structure',
  'top layer': 'couche du haut',
  'layer {n}': 'couche {n}',
  'Selected · {many} · {where}': 'Sélectionné · {many} · {where}',
  'See its craft': 'Voir son craft',
  'Open its page →': 'Ouvrir sa page →',
  // bill of materials
  'Bill of materials': 'Liste des blocs',
  '<b>{n}</b> blocks to place, plus the optional output port and Quantum Module. Tap a block to see its craft.':
    '<b>{n}</b> blocs à poser, plus le port de sortie et le module quantique, facultatifs. Toucher un bloc pour voir son craft.',
  '{name}: see its craft': '{name} : voir son craft',
  'at least 5': 'au moins 5',
  'at least 1': 'au moins 1',
  'optional': 'facultatif',
  'Ports go anywhere on the back of the two lower floors: at least 5 input ports and 1 energy port. A port you leave out is a casing.':
    'Les ports se placent n’importe où au dos des deux étages du bas : au moins 5 ports d’entrée et 1 port d’énergie. Un port non posé est remplacé par une carcasse.',
  'With the Quantum Module on, the output port is a backup buffer. Without one, ore processing stops when the network can\'t take the result.':
    'Avec le module quantique, le port de sortie sert de tampon de secours. Sans ce port, le traitement du minerai s’arrête quand le réseau ne peut plus prendre le résultat.',
  'Each accelerator place can hold a casing instead.': 'Chaque place d’accélérateur peut recevoir une carcasse à la place.',
  // crafting card
  'No crafting table recipe for this block.': 'Aucune recette d’établi pour ce bloc.',
  'The structure places {placed}, and the crafts of its other blocks use {used} more: <b>{need}</b> in all.':
    'La structure en pose {placed}, et les crafts de ses autres blocs en utilisent {used} de plus : <b>{need}</b> en tout.',
  'The structure needs <b>{need}</b>.': 'La structure en demande <b>{need}</b>.',
  'One craft makes {count}, so craft it <b>{crafts}</b> times ({left} left over).': 'Un craft en donne {count} : le faire <b>{crafts}</b> fois ({left} en trop).',
  'One craft makes {count}, so craft it <b>{crafts}</b> times.': 'Un craft en donne {count} : le faire <b>{crafts}</b> fois.',
  'Craft it <b>{crafts}</b> times.': 'Le faire <b>{crafts}</b> fois.',
  'Craft it once.': 'Le faire une fois.',
  'For {n} crafts': 'Pour {n} crafts',
  'For one craft': 'Pour un craft',
  'Craft': 'Craft',
  'Craft · {i} of {n}': 'Craft · {i} sur {n}',
  'Close': 'Fermer',
  '← Previous': '← Précédent',
  'Next →': 'Suivant →',
  'Open its page': 'Ouvrir sa page',
  // refinery speed calculator
  'Speed': 'Vitesse',
  'Level': 'Niveau',
  'Accelerators': 'Accélérateurs',
  'Accelerator {n}': 'Accélérateur {n}',
  '{n} tick': '{n} tick',
  '{n} ticks': '{n} ticks',
  'per x{level} job · {s} s': 'par traitement en x{level} · {s} s',
  'The x1 works a whole stack in one tick, whatever the accelerators.': 'Le x1 traite une pile entière en un tick, quels que soient les accélérateurs.',
  '{acc} of 8 Ore Refinery Accelerators · tap one to add or remove': '{acc} accélérateurs sur 8 · en toucher un pour l’ajouter ou le retirer',
  'One iron ore at x{level}': 'Un minerai de fer en x{level}',
  'ingot from one ore': 'lingot par minerai',
  'ingots from one ore': 'lingots par minerai',
  'nothing from the tanks': 'rien des réservoirs',
  'Iron ore, Mekanism\'s default recipes, from the table above. A job takes a stack of up to 64 ore.':
    'Minerai de fer, recettes par défaut de Mekanism, d’après le tableau ci-dessus. Un traitement prend une pile de 64 minerais au plus.',
  // page header, home page, footer
  'New': 'Nouveau',
  'Mekanism addon': 'Addon de Mekanism',
  'Engineering,<br />at quantum scale.': 'L’ingénierie,<br />à l’échelle quantique.',
  'Remote mining, whole-chain ore refining, quantum networks and precise logistics. The complete wiki of Mekanism: Engineering.':
    'Minage à distance, raffinage du minerai sur toute la chaîne, réseaux quantiques et logistique précise. Le wiki complet de Mekanism: Engineering.',
  'Start here →': 'Commencer ici →',
  'First refinery': 'Première raffinerie',
  'The Quantum Ore Refinery': 'La Quantum Ore Refinery',
  'The machines': 'Les machines',
  '{n} machines and tools. Blue: Quantum. Copper: Mekanism style.': '{n} machines et outils. Bleu : Quantum. Cuivre : style Mekanism.',
  'Previous machines': 'Machines précédentes',
  'Next machines': 'Machines suivantes',
  'new': 'nouveau',
  'Start here': 'Commencer ici',
  'New to the mod? These pages take you from your first machine to a working setup.':
    'Nouveau sur le mod ? Ces pages mènent de la première machine à une installation qui tourne.',
  'Overview': 'Présentation',
  'Basics': 'Bases',
  'Guide': 'Tuto',
  'Reference': 'Référence',
  'Help': 'Aide',
  'Written from the mod\'s own wiki and data files': 'Rédigé à partir du wiki et des fichiers de données du mod',
  'Mod v{v} for {builds}.': 'Mod v{v} pour {builds}.',
  'Minecraft {mc} ({loader}, Mekanism {mek})': 'Minecraft {mc} ({loader}, Mekanism {mek})',
  ' and ': ' et ',
  'Block and item pictures are drawn from the game\'s models and textures; Mekanism\'s are under the MIT licence.':
    'Les images des blocs et des objets sont dessinées à partir des modèles et des textures du jeu ; celles de Mekanism sont sous licence MIT.',
  'Not an official Minecraft product, not approved by or associated with Mojang or Microsoft.':
    'Produit non officiel de Minecraft, ni approuvé par Mojang ou Microsoft, ni associé à eux.',
};
