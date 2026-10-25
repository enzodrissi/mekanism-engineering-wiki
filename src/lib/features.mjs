// The big additions of a version that the site puts forward: a card on the home page, a banner under the page header and the
// section itself drawn as a feature (src/lib/rehype-features.mjs). Each one names its page and the heading of its section in
// the wiki, as the import writes them; every summary below only repeats that section's own text. When the heading is no longer
// on the page, nothing is shown.
export const FEATURES = [
  {
    page: 'quantum-digital-miner',
    version: '1.2',
    icon: 'quantum_digital_miner',
    // real screens of the game (the mod's client GUI bench, 1.21.1, GUI scale 4), one animation and its four pictures:
    // public/screens/quick-filters-<en|fr>.gif and -1.png to -4.png
    screens: 'screens/quick-filters',
    en: {
      heading: 'Quick filters and saved filter lists',
      anchor: 'quick-filters-and-saved-filter-lists',
      badge: 'New in 1.2',
      machine: 'Quantum Digital Miner',
      title: 'Quick filters and saved filter lists',
      lead: 'Two shortcuts in the New filter window: ready-made ore tag filters, and filter lists saved under a name to load on any miner. Only the filter list changes, every other setting stays as it is.',
      cards: [
        ['Quick filters', 'Ready-made ore tag filters: iron, gold, coal and redstone, plus copper, lapis, diamond, emerald, tin, lead, osmium and uranium when their tag exists. <b>Replace</b> the list with one, or <b>Add</b> it at the end; ores from other mods are included.'],
        ['Configurations', '<b>Save current filters</b> under a name, then load the list on any miner with Replace or Add. Your own library, in the world or on the server: up to 32 lists of 128 filters.'],
      ],
      shots: ['The New filter window starts with Quick filters and Configurations', 'Quick filters: Coal chosen, its tag c:ores/coal, Replace or Add', 'Add: “Coal added (1 filter)”, the filter is in the list', 'Configurations: the list saved as “Charbon”, ready to load on any miner'],
      alt: 'The Quick filters in game: the New filter window, Coal chosen and added, then the list saved under a name',
      more: 'How it works',
      open: 'Discover quick filters',
    },
    fr: {
      heading: 'Filtres rapides et listes de filtres enregistrées',
      anchor: 'filtres-rapides-et-listes-de-filtres-enregistrées',
      badge: 'Nouveau en 1.2',
      machine: 'Quantum Digital Miner',
      title: 'Filtres rapides et listes de filtres enregistrées',
      lead: 'Deux raccourcis dans la fenêtre Nouveau filtre : des filtres de tag de minerai tout prêts, et des listes de filtres enregistrées sous un nom, à charger sur n’importe quel mineur. Seule la liste des filtres change, les autres réglages restent tels quels.',
      cards: [
        ['Filtres rapides', 'Des filtres de tag de minerai tout prêts : fer, or, charbon et redstone, plus cuivre, lapis, diamant, émeraude, étain, plomb, osmium et uranium quand leur tag existe. <b>Remplacer</b> la liste par l’un d’eux ou l’<b>Ajouter</b> à la fin ; les minerais d’autres mods sont inclus.'],
        ['Configurations', '<b>Enregistrer les filtres actuels</b> sous un nom, puis charger la liste sur n’importe quel mineur avec Remplacer ou Ajouter. Une bibliothèque personnelle, dans le monde ou sur le serveur : jusqu’à 32 listes de 128 filtres.'],
      ],
      shots: ['La fenêtre Nouveau filtre commence par Filtres rapides et Configurations', 'Filtres rapides : Charbon choisi, son tag c:ores/coal, Remplacer ou Ajouter', 'Ajouter : « Charbon ajouté (1 filtre) », le filtre est dans la liste', 'Configurations : la liste enregistrée sous « Charbon », prête à charger sur n’importe quel mineur'],
      alt: 'Les filtres rapides en jeu : la fenêtre Nouveau filtre, Charbon choisi et ajouté, puis la liste enregistrée sous un nom',
      more: 'Voir le fonctionnement',
      open: 'Découvrir les filtres rapides',
    },
  },
];

// The home page's "What's new" block: the new multiblock first, then the feature cards above, then a link to the version's
// changelog. The multiblock's texts only repeat its page (quantum-ore-refinery) and the frozen 1.2 changelog.
export const NEWS = {
  version: '1.2',
  changelog: 'changelog/1-2',
  en: { eyebrow: 'What’s new in 1.2', title: 'New multiblock and Quick filters', filters: 'Quick filters', all: 'See everything new in 1.2 →' },
  fr: { eyebrow: 'Nouveautés de la 1.2', title: 'Nouveau multibloc et Quick filters', filters: 'Quick filters', all: 'Voir toutes les nouveautés de la 1.2 →' },
  multiblock: {
    page: 'quantum-ore-refinery',
    // the controller's four tabs in the game (Home, Buffers, Stats, Output module), from the mod's client GUI bench:
    // public/screens/qor-tabs-<en|fr>.gif and -1.png to -4.png
    screens: 'screens/qor-tabs',
    en: {
      badge: 'New multiblock',
      family: 'Ore refining',
      title: 'Quantum Ore Refinery',
      lead: 'Ore goes in, up to five ingots come out. Mekanism’s whole ore-processing chain runs inside one multiblock, with Mekanism’s own recipes.',
      alt: 'The controller’s tabs in game: Home, Buffers, Stats and the Output module',
      points: [
        ['Five levels, x1 to x5', 'The level is how many ingots one ore gives: <b>x1</b> smelts it, <b>x5</b> dissolves, washes and crystallizes it. An iron ore gives 1 to 5 ingots.'],
        ['One structure, one screen', 'A <b>10 × 4 × 3</b> structure, run from the controller’s screen: status, the five levels, energy and the four tanks.'],
        ['Quantum/QIO module', 'Optional: sends the ingots straight to a <b>Quantum</b> or <b>QIO</b> frequency. Without it, they leave by the output port.'],
      ],
      open: 'Discover the refinery',
    },
    fr: {
      badge: 'Nouveau multibloc',
      family: 'Raffinage du minerai',
      title: 'Quantum Ore Refinery',
      lead: 'Du minerai en entrée, jusqu’à cinq lingots en sortie. Toute la chaîne de traitement du minerai de Mekanism dans un seul multibloc, avec les recettes de Mekanism.',
      alt: 'Les onglets du contrôleur en jeu : Accueil, Réservoirs, Stats et le module de sortie',
      points: [
        ['Cinq niveaux, de x1 à x5', 'Le niveau fixe le nombre de lingots par minerai : <b>x1</b> le fond, <b>x5</b> le dissout, le lave et le cristallise. Un minerai de fer donne de 1 à 5 lingots.'],
        ['Une structure, un écran', 'Une structure de <b>10 × 4 × 3</b>, pilotée depuis l’écran du contrôleur : statut, les cinq niveaux, énergie et les quatre réservoirs.'],
        ['Module quantique', 'Facultatif : il envoie les lingots directement vers une fréquence <b>Quantum</b> ou <b>QIO</b>. Sans lui, ils repartent par le port de sortie.'],
      ],
      open: 'Découvrir la raffinerie',
    },
  },
};

/** The features of a page (its id without the fr/ prefix) in language `lng`, each with its texts merged in. */
export const featuresOf = (page, lng) => FEATURES.filter(f => f.page === page).map(f => ({ ...f, ...f[lng === 'fr' ? 'fr' : 'en'] }));

/** True when the page's Markdown still has the feature's heading (the import may rename or drop a section). */
export const hasSection = (body, f) => new RegExp(`^#{2,4} +${f.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} *$`, 'm').test(body || '');

/** A small funnel, the sign of a filter, drawn in the current text colour. */
export const FILTER_ICON = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5h17l-6.6 7.6v5.6l-3.8 1.9v-7.5z"/></svg>';
