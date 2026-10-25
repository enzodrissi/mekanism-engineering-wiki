// The big additions of a version that the site puts forward: a card on the home page, a banner under the page header and the
// section itself drawn as a feature (src/lib/rehype-features.mjs). Each one names its page and the heading of its section in
// the wiki, as the import writes them; every summary below only repeats that section's own text. When the heading is no longer
// on the page, nothing is shown.
export const FEATURES = [
  {
    page: 'quantum-digital-miner',
    version: '1.2',
    icon: 'quantum_digital_miner',
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
      more: 'Voir le fonctionnement',
      open: 'Découvrir les filtres rapides',
    },
  },
];

/** The features of a page (its id without the fr/ prefix) in language `lng`, each with its texts merged in. */
export const featuresOf = (page, lng) => FEATURES.filter(f => f.page === page).map(f => ({ ...f, ...f[lng === 'fr' ? 'fr' : 'en'] }));

/** True when the page's Markdown still has the feature's heading (the import may rename or drop a section). */
export const hasSection = (body, f) => new RegExp(`^#{2,4} +${f.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} *$`, 'm').test(body || '');

/** A small funnel, the sign of a filter, drawn in the current text colour. */
export const FILTER_ICON = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5h17l-6.6 7.6v5.6l-3.8 1.9v-7.5z"/></svg>';
