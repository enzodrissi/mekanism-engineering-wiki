<!-- source: a8c48fd9577cc4ec3e9dd6d94356797aea518b83 -->
# Quantum Chargepad

> La Plaque de rechargement de Mekanism au rythme de l'endgame : il suffit de monter dessus pour que tous les objets à énergie portés se rechargent en même temps, avec l'énergie d'un câble ou d'une fréquence quantique.

![Quantum Chargepad](images/quantum_chargepad.png)

| | |
|---|---|
| Type | Machine (plaque) |
| Ajouté en | 0.7 (écran et mode quantum en 1.2.0) |
| Taille | 1 bloc, une plaque d'un pixel sur laquelle on marche |
| Énergie | 1 000 000 000 J (400 000 000 FE) stockés ; donne à chaque joueur jusqu'à 256 000 000 J (102 400 000 FE) par tick (`quantum_chargepad.energyStorage` / `transferRate`) |
| Améliorations | Aucune, comme la Plaque de rechargement de Mekanism |
| Configuration des faces | Oui (Mekanism), énergie seulement : entrée à l'arrière et par-dessous par défaut ; en mode quantum, aucune face ne prend d'énergie |

## Ce qu'il fait

Se tenir sur la plaque : chaque objet porté qui contient de l'énergie et n'est pas plein se recharge dans le même tick, au lieu d'un
objet à la fois comme sur la Plaque de rechargement de Mekanism. Cela couvre l'armure portée, la main secondaire, la barre d'accès
rapide et l'inventaire principal, plus les emplacements Curios quand Curios est installé. Les objets rangés dans d'autres objets (un
sac à dos, une boîte de Shulker) ne sont pas rechargés.

Chaque objet ne se recharge toujours pas plus vite que son propre débit de charge (une pièce de MekaSuit : 100 000 J par tick, plus
avec des Unités d'énergie), l'ensemble des objets d'un joueur ne prend pas plus que le débit de transfert de la plaque, et la plaque ne
donne jamais plus que ce qu'elle contient. Quand son énergie vient à manquer, l'armure portée se recharge en premier (de la tête aux
pieds), puis la main secondaire, l'emplacement sélectionné de la barre d'accès rapide, le reste de la barre d'accès rapide, l'inventaire, puis les emplacements Curios.

La plaque s'allume et émet des étincelles bleu sarcelle pendant la recharge. Les Robits qui s'y tiennent sont rechargés
aussi, comme sur la plaque de Mekanism.

### Deux modes

Depuis la 1.2.0, la plaque a un écran avec deux modes :

- **Local** (par défaut) est ce que la plaque a toujours fait : l'énergie arrive par câble par les faces configurées, dans la
  réserve propre de la plaque. Les plaques des versions précédentes se chargent en mode local et ne perdent rien.
- **Quantum** prend l'énergie sur une **fréquence quantique (d'inventaire)** choisie sur l'écran de la plaque, avec les mêmes
  droits que le [Quantum Digital Miner](Quantum-Digital-Miner.md) : une fréquence Publique, l'une de ses propres fréquences Privé, ou une
  fréquence Confiance tant que son propriétaire fait confiance au joueur. Dans ce mode, la plaque ne prend **aucune énergie physique** :
  aucune face ne lui en propose, donc aucun câble, Cube d'énergie ou insertion directe ne peut la remplir. Chaque objet prend son énergie
  sur la fréquence à ce moment-là ; rien n'est créé et rien n'est perdu.
- Changer de mode ne convertit ni ne perd jamais d'énergie : ce qu'un câble a laissé dans la réserve de la plaque y reste, inutilisé
  tant que la plaque est en mode quantum, et sert de nouveau en mode local.
- Une plaque en mode quantum est comptée par le [Contrôleur de réseau quantique](Quantum-Network-Controller.md) comme une famille de
  sorties (Quantum Chargepads), avec un débit exact.

## Fabrication

![Recette du Quantum Chargepad](images/quantum_chargepad-recipe.png)

```
UQU
APA
UXU
```

- **U** : n'importe quel Circuit de contrôle ultime (`c:circuits/ultimate`), ×4
- **Q** : Entangloporteur quantique, ×1
- **A** : n'importe quel Alliage atomique (`mekanism:alloys/atomic`), ×2
- **P** : Plaque de rechargement (Mekanism), ×1
- **X** : Cube d'énergie ultime, ×1

Résultat : 1 Quantum Chargepad. L'énergie stockée dans la Plaque de rechargement et dans le Cube d'énergie passe dans la nouvelle plaque.

## Premiers pas

1. Placer la plaque.
2. **Mode local :** amener l'énergie à l'arrière ou par-dessous (un câble, la face de sortie d'un Cube d'énergie, un Récepteur
   d'énergie quantique). **Mode quantum :** faire un clic droit sur la plaque, appuyer sur **Quantum**, puis choisir une fréquence avec l'onglet de gauche.
3. Marcher sur la plaque : tout ce qui n'est pas plein commence à se recharger en même temps.
4. Utiliser un Configurateur pour faire entrer l'énergie par d'autres faces (mode local).

## L'interface

![Interface du Quantum Chargepad](images/quantum_chargepad-gui.png)

Faire un clic droit sur la plaque pour ouvrir son écran. Il est volontairement réduit :

- deux boutons, **Local** et **Quantum** ; celui du mode qui n'est pas actif est celui sur lequel on peut appuyer ;
- **Local :** la ligne « Mode : local », la réserve (« Réserve : … ») et « L'énergie arrive par câble » ;
- **Quantum :** la ligne « Mode : quantum » et, en dessous, soit « Aucune fréquence liée » avec « Voir l'onglet de gauche », soit le nom
  de la fréquence avec son mode de sécurité et « Disponible : … » (l'énergie que contient la fréquence), soit « Fréquence sans énergie » ;
- l'**onglet de fréquence** à gauche ouvre la fenêtre de fréquences de Mekanism (celle qu'utilisent les [Récepteurs d'énergie
  quantique](Quantum-Energy-Receiver.md)) ;
- l'**onglet Énergie** de Mekanism montre la réserve en mode local et l'énergie de la fréquence en mode quantum ;
- l'**onglet de sécurité** de Mekanism indique qui peut changer le mode et la fréquence. La plaque recharge toute personne qui s'y tient.

### Ce que la plaque garde quand on la casse

Son propriétaire, son mode de sécurité et son mode sont conservés dans l'objet. La **fréquence ne l'est pas** : une plaque posée démarre
toujours déliée, ainsi une plaque cassée ou copiée par quelqu'un d'autre ne peut jamais puiser dans le réseau privé de l'ancien propriétaire. Une Carte
de configuration ne lie la plaque qu'à une fréquence qui existe encore. En mode local, l'énergie stockée et les réglages des faces sont conservés
comme avant.

## Automatisation

Ses faces d'énergie se configurent comme sur toute machine de Mekanism (énergie seulement), et ne comptent qu'en mode local. La casser conserve son
énergie et ses réglages de faces dans l'objet, et la plaque lâche son objet quand elle est minée à la pioche en mode Survie.

## Configuration

Section `quantum_chargepad` de `mekanismengineering-server.toml` :

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `energyStorage` | 1 000 000 000 J | 1 J – sans limite | Énergie que la plaque stocke. |
| `transferRate` | 256 000 000 J | 1 J – sans limite | Énergie donnée par tick à chaque joueur qui s'y tient, partagée entre tous ses objets ; chaque objet ne prend toujours pas plus que son propre débit de charge. |

## Conseils

- La plaque va aussi vite que l'énergie qu'on lui apporte : une grande réserve stockée recharge d'un coup un premier équipement, puis
  c'est l'approvisionnement qui donne le rythme.
- Plusieurs joueurs peuvent se tenir sur une même plaque ; chacun reçoit sa propre part du débit de transfert.
- En mode quantum, la plaque va aussi vite que la fréquence est remplie : elle puise à chaque tick où un joueur s'y trouve, et ne charge aucun chunk.
- Une plaque qui ne recharge rien en mode quantum : vérifier la ligne sous « Mode : quantum » (« Aucune fréquence liée » ou « Fréquence sans énergie »).
