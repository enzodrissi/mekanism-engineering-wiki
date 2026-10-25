<!-- source: c3c31bbb4e6df4ac25003b89f2c9720521f7a3f0 -->
# Petrogenic Synthesizer

> Fabrique la roche, l'obsidienne, le basalte, le granite et les autres roches à partir d'eau et de lave, un produit à la fois.

![Petrogenic Synthesizer](images/petrogenic_synthesizer.png)

| | |
|---|---|
| Type | Machine |
| Taille | 1 bloc |
| Énergie | 100 J/t (40 FE/t) sans améliorations, pour les Pierres (les autres produits varient selon leur propre recette) ; 160 000 J (64 000 FE) stockés (`petrogenic_synthesis.synthesizerEnergyUsage` / `synthesizerEnergyStorage`) |
| Améliorations | Mise à niveau de la vitesse, Mise à niveau énergétique, Mise à niveau de l'étouffement (Mekanism) |
| Configuration des faces | oui (Mekanism), objets, fluides et énergie |

## Ce qu'il fait

Le Synthesizer contient deux petits réservoirs, eau et lave, et les transforme en une roche choisie à la fois, avec de
l'énergie : on choisit un produit sur son écran, et il produit ce bloc tant que l'eau, la lave et l'énergie continuent
d'arriver. Un seul produit est actif à la fois ; changer de produit abandonne le bloc en cours, comme un changement de
recette sur n'importe quelle machine de Mekanism.

Les mêmes 13 produits sont disponibles sur le Synthesizer et sur la [Petrogenic Synthesis
Plant](Petrogenic-Synthesis-Plant.md) : la différence entre les deux machines est la vitesse, la consommation de fluides et
d'énergie, la taille des tampons et le parallélisme, jamais les produits disponibles :

| Produit | Eau / bloc | Lave / bloc | Temps (× Pierres) | Énergie (× Pierres) |
|---|---|---|---|---|
| Pierres | 250 mB | 250 mB | ×1 | ×1 |
| Roche | 250 mB | 250 mB | ×1 | ×1,25 |
| Roche lisse | 250 mB | 500 mB | ×2 | ×2 |
| Obsidienne | 1 000 mB | 1 000 mB | ×4 | ×2 |
| Basalte | 500 mB | 500 mB | ×2 | ×1,5 |
| Granite | 250 mB | 500 mB | ×2 | ×2 |
| Diorite | 250 mB | 500 mB | ×2 | ×2 |
| Andésite | 250 mB | 500 mB | ×2 | ×2 |
| Pierres des abîmes | 250 mB | 375 mB | ×1,5 | ×1,5 |
| Ardoise des abîmes | 250 mB | 500 mB | ×2 | ×2 |
| Tuf | 500 mB | 500 mB | ×2 | ×1,5 |
| Roche noire | 250 mB | 500 mB | ×2 | ×2 |
| Basalte lisse | 500 mB | 750 mB | ×3 | ×3 |

Un modpack peut ajouter, retirer ou modifier ces recettes avec un datapack (type de recette `mekanismengineering:petrogenic`) ; la
rangée de produits du Synthesizer pagine autant de recettes qu'il en existe.

## Fabrication

![Recette du Petrogenic Synthesizer](images/petrogenic_synthesizer-recipe.png)

```
T C T
A S A
C P C
```

- **T** : Réservoir de fluide de base, ×2
- **C** : n'importe quel Circuit de contrôle avancé (`c:circuits/advanced`), ×3
- **A** : n'importe quel Alliage infusé (`mekanism:alloys/infused`), ×2
- **S** : Boîtier en acier, ×1
- **P** : Pompe électrique, ×1

Résultat : 1 Petrogenic Synthesizer. Une Pompe électrique qui contient déjà de l'énergie ou des améliorations transmet ces données
au nouveau Synthesizer.

## Premiers pas

1. Fabriquer le Synthesizer (voir ci-dessus).
2. Le placer.
3. Raccorder une source d'eau ou un tuyau à sa face gauche et une source de lave ou un tuyau à sa face droite : cela correspond
   aux deux réservoirs de la machine ; on peut aussi réattribuer l'une ou l'autre face dans l'onglet de configuration des faces.
4. Amener l'énergie par la face arrière.
5. Ouvrir l'écran et cliquer sur l'un des produits de la rangée pour le choisir.
6. Les blocs finis sont poussés par la face avant dans ce qui y est placé ; le produit choisi reste encadré de bleu sarcelle
   dans la rangée et s'affiche sur le toit de la machine.

## L'interface

![Interface du Petrogenic Synthesizer](images/petrogenic_synthesizer-gui.png)

- **Deux jauges de fluide** (en haut à gauche), nommées « Eau » et « Lave » : le réservoir d'eau, puis le réservoir de lave.
- **Écran** (en haut au milieu) : le produit choisi dessiné en grand, puis son nom, sa vitesse (« 2 blocs/s ») et son état,
  une seule fois : « En production », ou ce qui ne va pas, comme « En attente d'eau », « En attente de lave », « Freinée : manque
  d'eau » (ou de lave, ou d'énergie), « Énergie insuffisante », « Sortie pleine » ou « Arrêtée par la redstone ». Sans produit,
  il affiche « Aucun produit choisi ». Survoler l'écran pour voir l'état en entier et l'eau, la lave et l'énergie utilisées par
  tick (« Eau 25 mB/t », « Lave 25 mB/t », « Énergie 100 J/t » avec l'unité du réglage d'énergie choisi).
- **Barre d'énergie et onglet d'énergie** (à droite) : l'énergie stockée, avec l'avertissement habituel de Mekanism en cas
  d'énergie faible.
- **Choix du produit** : une rangée de sept produits, avec une flèche de chaque côté et un compteur de pages comme « 1 / 2 ».
  Les 13 produits occupent deux pages. Cliquer sur un produit pour le choisir (un seul clic, quelle que soit la page) ; le produit
  choisi est encadré de bleu sarcelle. Survoler un produit affiche son nom et « 250 mB d'eau et 250 mB de lave par bloc ». Avec
  plus de 7 produits (ajout d'un modpack), les flèches font défiler les suivants.
- Case de **Sortie** et case d'énergie (à droite) : la case de sortie contient le bloc fini.

Sur le bloc lui-même, le produit choisi s'affiche à plat sur le toit de la machine. Sans produit choisi, le carré du toit reste
bleu sarcelle.

## Automatisation

Par défaut, l'eau entre à gauche, la lave à droite, l'énergie à l'arrière, et les blocs finis sont poussés par
l'avant : chacune de ces quatre faces peut être réglée autrement dans l'onglet de configuration des faces de Mekanism, pour
les objets, les fluides et l'énergie. Casser le Synthesizer lâche un seul objet qui garde les deux réservoirs, son énergie, ses
améliorations et le produit choisi.

## Configuration

Section `petrogenic_synthesis` de `mekanismengineering-server.toml` (partagée avec la [Petrogenic Synthesis
Plant](Petrogenic-Synthesis-Plant.md) ; seules les clés propres au Synthesizer sont listées ici) :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `synthesizerTicks` | 10,0 | 0,05–72 000,0 | Ticks pour un bloc de Pierres sans Mises à niveau de la vitesse (les autres produits prennent le multiple de temps de leur recette). |
| `synthesizerEnergyUsage` | 100 J/t | 0–max | Énergie consommée par tick sur les Pierres sans améliorations. |
| `synthesizerEnergyStorage` | 160 000 J | 1–max | Énergie stockée sans Mises à niveau énergétiques. |
| `synthesizerTankCapacity` | 16 000 mB | 1 000–max | Capacité de chacun des deux réservoirs (eau, lave). |

La vitesse suit la formule d'amélioration de Mekanism (un multiplicateur de ×10 à 8 Mises à niveau de la vitesse par défaut).
Contrairement à la Plant, la consommation d'eau et de lave par bloc du Synthesizer augmente aussi avec les Mises à niveau de la
vitesse ; pour les Pierres :

| Mises à niveau de la vitesse | Vitesse | Énergie | Eau | Lave |
|---|---|---|---|---|
| 0 | 2 blocs/s | 100 J/t | 25 mB/t | 25 mB/t |
| 4 | 6,3 blocs/s | 1 000 J/t | 250 mB/t | 250 mB/t |
| 8 | 20 blocs/s | 10 000 J/t | 2 500 mB/t | 2 500 mB/t |

## Conseils et dépannage

- Les Mises à niveau de la vitesse rendent volontairement le Synthesizer gourmand : huit d'entre elles donnent dix fois la vitesse
  mais cent fois la consommation d'eau et de lave par tick (la consommation de fluide croît avec le carré du facteur de vitesse). À
  haute vitesse, les seaux ne suivent pas : une vraie pompe, comme l'[Industrial Fluid Pump](Quantum-Fluid-Pump.md), y arrive.
- Les deux réservoirs sont petits (16 000 mB) à dessein : à pleine vitesse, ils ne contiennent que quelques ticks de travail, donc
  un approvisionnement régulier compte plus qu'un gros tampon.
- L'obsidienne est le produit le plus exigeant : 1 000 mB d'eau et 1 000 mB de lave par bloc, quatre fois le temps et deux fois
  l'énergie des Pierres.
- La sortie n'a qu'une seule case : sans rien pour les recevoir, ou si la face avant est bloquée, les blocs finis y attendent
  jusqu'à ce que quelque chose puisse les prendre.
- Pour un débit bien plus élevé, des tampons plus grands et une eau ou une lave produites sur place, voir la [Petrogenic Synthesis
  Plant](Petrogenic-Synthesis-Plant.md).
