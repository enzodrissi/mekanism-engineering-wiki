<!-- source: 56ea3fda13461a35c1a06e8099723b50e8b1d90c -->
# Tablette de réseau quantique

> Le Contrôleur de réseau quantique dans la main : le même écran, les mêmes droits, où que l'on soit.

![Tablette de réseau quantique](images/quantum_network_tablet.png)

| | |
|---|---|
| Type | Outil (objet tenu en main) |
| Ajouté en | 1.2.0 |
| Taille | Objet tenu en main, non empilable |
| Énergie | Aucune |
| Améliorations | Aucune |
| Configuration des faces | Non, c'est un objet |

## Ce qu'elle fait

Faire un clic droit avec la Tablette, dans l'une ou l'autre main : elle ouvre **le même écran que le [Contrôleur de réseau
quantique](Quantum-Network-Controller.md)**, avec les mêmes droits : les fréquences publiques et privées du joueur, et les fréquences de confiance
dont le propriétaire lui fait confiance. Rien n'est posé, et elle **ne charge aucun tronçon** pour cela : comme le Contrôleur, elle ne lit que
les appareils déjà chargés et auxquels le joueur a accès.

Comme tout objet de Mekanism qui a un propriétaire, la Tablette a la sécurité de Mekanism (Publique, Confiance ou Privé). Le premier joueur qui utilise une
Tablette sans propriétaire en devient le propriétaire ; une Tablette privée ne s'ouvre que pour son propriétaire.

## Fabrication

```
GRG
ABA
SCS
```

- `G` : toute vitre (tag `c:glass_panes`) ×2
- `R` : toute poudre de redstone (tag `c:dusts/redstone`) ×1
- `A` : tout Alliage infusé (tag `mekanism:alloys/infused`) ×2
- `B` : Boîtier en acier ×1
- `S` : tout lingot d'acier (tag `c:ingots/steel`) ×2
- `C` : tout Circuit de contrôle avancé (tag `c:circuits/advanced`) ×1

Les mêmes ingrédients que le Contrôleur, avec le circuit et la redstone intervertis.

### Le Contrôleur et la Tablette se changent l'un en l'autre

Placer un **Contrôleur de réseau quantique seul dans la grille de fabrication** pour obtenir une Tablette, et une **Tablette seule** pour retrouver le
Contrôleur. **Le propriétaire, le mode de sécurité et le nom sont conservés** dans les deux sens, et rien d'autre.

## L'interface

La Tablette ouvre l'écran du Contrôleur sans changement : voir [L'interface](Quantum-Network-Controller.md#the-interface). La seule
différence est l'onglet de sécurité, qui appartient à l'objet.

## Astuces et dépannage

- Une Tablette fonctionne loin de tout Contrôleur : il n'est pas nécessaire d'en avoir un posé quelque part.
- Elle ne charge jamais de tronçon, donc un appareil situé dans un tronçon déchargé n'est pas mesuré ; l'écran signale les chiffres qu'il n'a pas pu lire
  (« ≥ », « ? », « N appareils non mesurés »).
