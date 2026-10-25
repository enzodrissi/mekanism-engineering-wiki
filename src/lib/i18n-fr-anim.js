// French words of the block animations (src/lib/anim), by their English text; see src/lib/i18n.js.
export const FR_ANIM = {
  // shared (index.js, plant.js, pump.js)
  'Machine state': "État de la machine",
  'Idle': 'Inactif',
  'Running': 'En marche',
  'Empty': 'Vide',
  'Water': 'Eau',
  'Lava': 'Lave',

  // pump.js
  'Heavy water': 'Eau lourde',
  'Pumped fluid': 'Fluide pompé',

  // receiver.js (the tier names stay in English, as in the mod's French names)
  'Basic': 'Basic',
  'Advanced': 'Advanced',
  'Elite': 'Elite',
  'Ultimate': 'Ultimate',
  'Receiver tier': 'Niveau du récepteur',
  '{name} Receiver: up to {rate} J per tick. Only the colour of the trim changes between tiers. The game shows no change while it receives energy.':
    "Récepteur {name} : jusqu'à {rate} J par tick. Seule la couleur des bordures change d'un niveau à l'autre. Le jeu ne montre aucun changement pendant qu'il reçoit de l'énergie.",

  // synthesizer.js (Minecraft's French block names)
  'Cobblestone': 'Pierres',
  'Stone': 'Roche',
  'Smooth Stone': 'Roche lisse',
  'Obsidian': 'Obsidienne',
  'Basalt': 'Basalte',
  'Granite': 'Granite',
  'Diorite': 'Diorite',
  'Andesite': 'Andésite',
  'Cobbled Deepslate': 'Pierres des abîmes',
  'Deepslate': 'Ardoise des abîmes',
  'Tuff': 'Tuf',
  'Blackstone': 'Roche noire',
  'Smooth Basalt': 'Basalte lisse',
  'Running: the LEDs, the core field and the ports are lit.': 'En marche : les LED, le champ du cœur et les ports sont allumés.',
  'Idle: the LEDs, the core field and the ports are dark.': 'Inactif : les LED, le champ du cœur et les ports sont éteints.',
  '{product} shows on the roof ({water} mB of water and {lava} mB of lava a block).':
    "Sur le toit : {product} ({water} mB d'eau et {lava} mB de lave par bloc).",
  'No product chosen: the roof square stays teal.': 'Aucun produit choisi : le carré du toit reste turquoise.',
  'Product on the roof': 'Produit sur le toit',
  'None': 'Aucun',

  // plant.js (the module names stay in English, as in the mod's French names)
  '{n} Hydro Condenser Upgrade': '{n} Hydro Condenser Upgrade',
  '{n} Hydro Condenser Upgrades': '{n} Hydro Condenser Upgrades',
  '{n} Magma Synthesizer Upgrade': '{n} Magma Synthesizer Upgrade',
  '{n} Magma Synthesizer Upgrades': '{n} Magma Synthesizer Upgrades',
  'no module': 'aucun module',
  'Both towers are empty.': 'Les deux tours sont vides.',
  'The water tower holds water.': "La tour d'eau contient de l'eau.",
  'The lava tower holds lava.': 'La tour de lave contient de la lave.',
  'The towers hold water and lava.': "Les tours contiennent de l'eau et de la lave.",
  'Running: the ports are lit.': 'En marche : les ports sont allumés.',
  'Idle: the ports are dark.': 'Inactif : les ports sont éteints.',
  'Water tower: {water}. Lava tower: {lava}.': "Tour d'eau : {water}. Tour de lave : {lava}.",
  'Fluids in the towers': 'Fluides dans les tours',
  'Both': 'Les deux',
  'Water tower modules': "Modules de la tour d'eau",
  'Lava tower modules': 'Modules de la tour de lave',

  // chargepad.js
  'Running: a player with items that can charge is standing on the pad. It glows and gives off teal sparks.':
    'En marche : un joueur avec des objets rechargeables se tient sur le pad. Le pad brille et émet des étincelles turquoise.',
  'Idle: nobody is charging. The core and the strips on the pad are dark.':
    'Inactif : personne ne recharge. Le cœur et les bandes du pad sont éteints.',

  // distributor.js (Balanced / Weighted: the mod's French mode names)
  'Balanced': 'Équilibré',
  'Balanced: each kind of item is shared evenly, so iron goes to the front, then the side, then the front again.':
    "Équilibré : chaque sorte d'objet est répartie à parts égales ; le fer va donc à l'avant, puis sur le côté, puis de nouveau à l'avant.",
  'Weighted 3 : 1': 'Pondéré 3 : 1',
  'Weighted 3 : 1: the front output takes 3 items out of every 4 of each kind, the side output takes 1.':
    'Pondéré 3 : 1 : la sortie avant prend 3 objets sur 4 de chaque sorte, la sortie latérale en prend 1.',
  'Output full': 'Sortie pleine',
  'The side output is full, so it is skipped and every item leaves by the front. It gets its share again once it has room.':
    "La sortie latérale est pleine : elle est sautée et chaque objet sort par l'avant. Elle retrouve sa part dès qu'elle a de la place.",
  'Distribution': 'Répartition',

  // upgrade-controller.js
  'Show work cube': 'Afficher le cube de travail',
  'Radius': 'Rayon',
  "Work cube radius in blocks (the game's server setting allows 1 to {max})":
    'Rayon du cube de travail en blocs (le réglage serveur du jeu permet de 1 à {max})',
  '{r} (default)': '{r} (par défaut)',
  '{r} blocks, a cube of {s} by {s} by {s}': '{r} blocs, un cube de {s} sur {s} sur {s}',
  'Work cube: {s} × {s} × {s} blocks, centred on the Controller. In the game it is shown by the Visuals tab, and the radius is a server setting (1 to {max}, {def} by default).':
    "Cube de travail : {s} × {s} × {s} blocs, centré sur le Contrôleur. Dans le jeu, l'onglet Visuels le montre, et le rayon est un réglage du serveur (1 à {max}, {def} par défaut).",
  'The Controller fits upgrades into every machine inside a cube around it. Press Show work cube to see it.':
    "Le Contrôleur installe des améliorations dans chaque machine d'un cube autour de lui. Appuyer sur « Afficher le cube de travail » pour le voir.",
  'Running: the front panel is lit.': 'En marche : le panneau avant est allumé.',

  // miner.js: the in-game screen (the mod's own French, gui.mekanismengineering.qdm_screen.*)
  'SEARCHING': 'RECHERCHE',
  'scanning the zone...': 'analyse de la zone...',
  'WARNING · {p} %': 'ALERTE · {p} %',
  'MINING · {p} %': 'MINAGE · {p} %',
  '{n} block left': '{n} bloc restant',
  '{n} blocks left': '{n} blocs restants',
  // miner.js: the page
  "Default zone: radius 10 (21 × 21 blocks), height Y 0 to 60. This is the mod's starting setting; the miner is drawn at Y 30. The box is taller than the view: pinch or scroll to zoom out.":
    "Zone par défaut : rayon 10 (21 × 21 blocs), hauteur Y 0 à 60. C'est le réglage de départ du mod ; le Miner est dessiné à Y 30. La boîte est plus haute que la vue : pincer ou faire défiler pour dézoomer.",
  'Small zone, an example setting: radius 3 (7 × 7 blocks), height Y 24 to 36. You can set any radius up to 128.':
    "Petite zone, un exemple de réglage : rayon 3 (7 × 7 blocs), hauteur Y 24 à 36. Tout rayon jusqu'à 128 peut être réglé.",
  'Relocation: the machine charges inside a teal field with a bright core. It then flies up as a beam and is rebuilt at its new place.':
    "Relocalisation : la machine se charge dans un champ turquoise au cœur lumineux. Elle s'envole ensuite en rayon et est reconstruite à sa nouvelle place.",
  'Relocating: it scans, charges, flies away as a beam, then is rebuilt from the bottom up.':
    "Relocalisation en cours : la machine scanne, se charge, s'envole en rayon, puis est reconstruite de bas en haut.",
  'Idle: the wide screen is dark.': 'Inactif : le grand écran est éteint.',
  'Running: mining is held up, so the screen turns amber. The figures are examples.':
    "En marche : le minage est bloqué, l'écran devient donc ambre. Les chiffres sont des exemples.",
  'Running: the screen shows the state, the share mined and the blocks left. When the zone is done it goes back to its resting picture. The figures are examples.':
    "En marche : l'écran montre l'état, la part minée et les blocs restants. Une fois la zone terminée, il revient à son image de repos. Les chiffres sont des exemples.",
  'The ore flowing in is an illustration of the mining, not an effect of the game.':
    "Le minerai qui afflue illustre le minage ; ce n'est pas un effet du jeu.",
  'Mining illustration': 'Illustration du minage',
  'Ore flow: on': 'Flux de minerai : activé',
  'Ore flow: off': 'Flux de minerai : désactivé',
  'Screen state': "État de l'écran",
  'Screen: mining': 'Écran : minage',
  'Screen: warning': 'Écran : alerte',
  'Show mining zone': 'Afficher la zone de minage',
  'Zone off': 'Zone masquée',
  'Default zone': 'Zone par défaut',
  'Small zone': 'Petite zone',
  'Relocation': 'Relocalisation',
  'Relocate': 'Relocaliser',

  // refinery-run.js (job = « travail », as in the mod's French; products as in the modules' French texts)
  'makes dirty slurry.': 'produit de la boue sale.',
  'makes clean slurry.': 'produit de la boue propre.',
  'makes crystals.': 'produit des cristaux.',
  'makes shards.': 'produit des éclats.',
  'makes clumps.': 'produit des amas.',
  'makes dust.': 'produit de la poussière.',
  'makes ingots.': 'produit des lingots.',
  '{t} tick ({s} s)': '{t} tick ({s} s)',
  '{t} ticks ({s} s)': '{t} ticks ({s} s)',
  '{chain}. One iron ore gives {n} ingot; it takes nothing from the tanks.':
    '{chain}. Un minerai de fer donne {n} lingot ; cela ne prend rien dans les réservoirs.',
  '{chain}. One iron ore gives {n} ingots; it takes nothing from the tanks.':
    '{chain}. Un minerai de fer donne {n} lingots ; cela ne prend rien dans les réservoirs.',
  '{chain}. One iron ore gives {n} ingot; it takes {takes} from the tanks.':
    '{chain}. Un minerai de fer donne {n} lingot ; cela prend {takes} dans les réservoirs.',
  '{chain}. One iron ore gives {n} ingots; it takes {takes} from the tanks.':
    '{chain}. Un minerai de fer donne {n} lingots ; cela prend {takes} dans les réservoirs.',
  'A job takes {time} with {n} accelerator.': 'Un travail dure {time} avec {n} accélérateur.',
  'A job takes {time} with {n} accelerators.': 'Un travail dure {time} avec {n} accélérateurs.',
  'Shown over {s} s so each step can be seen.': 'Montré sur {s} s pour que chaque étape soit visible.',
  'Ore comes in through an input port. One item stands for the stack (up to 64) that a job works.':
    "Le minerai entre par un port d'entrée. Un objet représente la pile (jusqu'à 64) que traite un travail.",
  'Ingots go to the Quantum Module, then to its Quantum or QIO frequency.':
    'Les lingots vont au module quantique, puis à sa fréquence Quantum ou QIO.',
  'Ingots leave by the output port.': 'Les lingots sortent par le port de sortie.',
  'no module of its own in the structure.': 'aucun module propre dans la structure.',
  'Step {i} of {n} · {name} ({inputs}): {what}': 'Étape {i} sur {n} · {name} ({inputs}) : {what}',
  'Step {i} of {n} · {name}: {what}': 'Étape {i} sur {n} · {name} : {what}',
  'Next step': 'Étape suivante',
  'Run a job': 'Lancer un travail',
  'Stop': 'Arrêter',
  'Level of the refinery': 'Niveau de la raffinerie',
  'Accelerators in use': 'Accélérateurs utilisés',
  'Where the ingots go': 'Destination des lingots',
  'Output port': 'Port de sortie',
  'Quantum Module': 'Module quantique',
  'Level': 'Niveau',
  'Accelerators in use (of 8 places)': 'Accélérateurs utilisés (sur 8 places)',
  'Ingots go to': 'Lingots vers',
  // refinery-run.js, only when the French table (qor-levels.fr.json) is missing: the step names and inputs of qor-levels.json
  'Smelting': 'Fonte',
  'Enrichment': 'Enrichissement',
  'Purification': 'Purification',
  'Crusher': 'Broyeur',
  'Injection': 'Injection',
  'Dissolution': 'Dissolution',
  'Washing': 'Lavage',
  'Crystallization': 'Cristallisation',
  'ore and oxygen': 'minerai et oxygène',
  'ore and hydrogen chloride': "minerai et chlorure d'hydrogène",
  'shards and oxygen': 'éclats et oxygène',
  'ore and sulfuric acid': 'minerai et acide sulfurique',
  'water': 'eau',
};
