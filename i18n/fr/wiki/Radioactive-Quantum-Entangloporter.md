<!-- source: 8a3dea53245044a6bb66b52167fae629a74701f3 -->
# Quantum Entangloporter radioactif

> Le transport quantique blindé des produits chimiques radioactifs : ses propres fréquences, son propre tampon, sa propre énergie.

![Quantum Entangloporter radioactif](images/radioactive_quantum_entangloporter.png)

| | |
|---|---|
| Type | Machine |
| Ajouté en | 0.6 (refondu en 1.2.0) |
| Taille | 1 bloc |
| Énergie | Sa propre réserve de 1 000 000 J, qui paie les transferts ; jusqu'à 10 000 000 J avec 8 Mises à niveau énergétiques au multiplicateur d'amélioration par défaut de Mekanism |
| Améliorations | Mise à niveau énergétique (emplacement standard de Mekanism, dans l'onglet des améliorations en haut à droite) |
| Configuration des faces | Oui (Mekanism), faces de produits chimiques |

## Ce qu'il fait

Le Quantum Entangloporter radioactif déplace les **produits chimiques radioactifs**, comme le Spent Nuclear Waste et tout autre
produit chimique que Mekanism marque comme radioactif, entre les blocs qui partagent une **fréquence radioactive**, sans que les
déchets passent jamais par un Entangloporteur ordinaire. Tout le reste (objets, fluides, gaz ordinaires, énergie, chaleur) est le
travail de l'Entangloporteur quantique de Mekanism.

- **Les fréquences radioactives** forment une famille à part, distincte des fréquences d'inventaire de Mekanism : aucun autre
  Entangloporter, Receiver ou Controller ne les utilise. Elles fonctionnent comme les fréquences de Mekanism : **Publique**,
  **Confiance** (le propriétaire et les joueurs auxquels il fait confiance) et **Privé**, avec un nom et un propriétaire ; seul le
  propriétaire peut en supprimer une. On les choisit, les crée et les supprime dans la fenêtre **Fréquences radioactives**, qui est la
  fenêtre de fréquences de Mekanism avec ses icônes Publique, Confiance et Privé, ouverte depuis l'onglet de fréquence du bloc. Une
  fréquence qui contient encore des déchets radioactifs ne peut pas être supprimée.
- **Un tampon local de 64 000 mB** dans chaque bloc, pour **un seul produit chimique à la fois**. La réception est volontairement
  lente : **10 mB par tick pour chaque récepteur**.
- **Ce qu'un bloc fait de son gaz dépend de ses faces de produits chimiques**, comme sur un Entangloporteur quantique : une face
  réglée en **entrée** remplit le tampon et le bloc envoie ce gaz aux autres blocs de sa fréquence ; une face réglée en **sortie**
  vide le tampon, et le bloc reçoit du gaz de sa fréquence ; une face réglée sur les deux fait les deux. Le gaz qu'un bloc a reçu du
  réseau ne lui est jamais renvoyé, et un bloc seul sur sa fréquence ne sert personne, pas même lui-même. Un bloc sans aucune face
  de produits chimiques activée ne fait rien et garde son gaz.
- **Sa propre réserve d'énergie de 1 000 000 J** paie les transferts : **100 J par mB à chaque extrémité** d'un transfert, chaque
  extrémité payant sa part. L'énergie qui entre par une face remplit d'abord la réserve. La réserve ne ressort jamais par une face ;
  sans énergie, le bloc s'arrête et garde ce qu'il contient.
- **Mises à niveau énergétiques.** Le bloc accepte la Mise à niveau énergétique standard de Mekanism dans l'onglet des améliorations
  habituel. Chaque amélioration augmente la réserve (jusqu'à 10 MJ avec huit améliorations au réglage par défaut de Mekanism) et
  baisse le prix d'un transfert (jusqu'à 10 J par mB). Retirer une amélioration ramène l'énergie stockée dans la nouvelle capacité.
- **Le démontage est refusé tant que le tampon contient quelque chose**, avec un message qui en donne la raison. La réserve ne
  verrouille pas le bloc et est perdue quand le bloc est cassé. Tant qu'il est verrouillé, le bloc ne peut être cassé ni à la main,
  ni par des casseurs de blocs, ni par la Boîte en carton de Mekanism, ni par des explosions, ni par le Wither ou le Dragon de l'Ender.

## Fabrication

![Recette du Quantum Entangloporter radioactif](images/radioactive_quantum_entangloporter-recipe.png)

```
PHP
AQA
PHP
```

- `P` : Pastille de Plutonium ×4
- `H` : Feuille de PE-HD ×2
- `A` : Pastille de Polonium ×2
- `Q` : Entangloporteur quantique (le bloc de Mekanism) ×1

Résultat : 1 Quantum Entangloporter radioactif. (Les versions précédentes utilisaient des Blocs de Plomb et de l'Alliage atomique ;
la recette a changé en 1.2.)

## Premiers pas

1. Fabriquer d'abord un Entangloporteur quantique (Mekanism) : c'est un ingrédient de la recette ci-dessus.
2. Placer le Quantum Entangloporter radioactif là où un point d'accès au réseau capable de gérer la radioactivité est nécessaire.
3. Ouvrir son écran et choisir ou créer une **fréquence radioactive** depuis l'onglet de fréquence.
4. Utiliser l'onglet de configuration des faces pour les produits chimiques (ou un Configurateur) pour activer les faces
   nécessaires : **entrée** sur le bloc qui collecte les déchets, **sortie** sur les blocs qui doivent les recevoir.
5. Amener par tube le Spent Nuclear Waste (ou un autre produit chimique radioactif) dans une face d'entrée : il remplit le tampon
   local et est partagé, à 10 mB par tick pour chaque récepteur, avec les autres blocs de la fréquence.
6. Mettre une Mise à niveau énergétique dans l'onglet des améliorations si la réserve de 1 000 000 J ne suffit pas pour le débit
   voulu, et amener de l'énergie par une face d'énergie : les transferts s'arrêtent quand la réserve est vide.

## L'interface

![Interface du Quantum Entangloporter radioactif](images/radioactive_quantum_entangloporter-gui.png)

L'écran est le cadre gris des machines de Mekanism avec ses onglets habituels. Son centre est une **console de sécurité** sombre au cadre rayé de bandes de danger :

- un **cadran** de 18 segments avec le symbole de radiation en son centre, qui se remplit avec le tampon, avec le pourcentage en
  dessous ; à partir de 90 % de remplissage, le cadran passe au rouge ;
- le **nom du produit chimique** contenu et la quantité sur 64 000 mB ;
- une barre pour la réserve d'**Énergie** du bloc, avec le texte **Attente : pas d'énergie** en jaune quand elle est vide ;
- quand le bloc contient encore de la matière radioactive d'une version précédente, une ligne **Ancien stock**. Il n'y a pas de
  bouton pour la vider : elle reste dans le bloc jusqu'à ce qu'elle sorte par une face de sortie.

Les onglets de Mekanism l'entourent : l'onglet de fréquence ouvre la fenêtre des fréquences ; les onglets de configuration et du
transporteur règlent les faces de produits chimiques ; l'onglet Énergie montre la réserve ; les onglets des améliorations, de sécurité
et de redstone sont à droite. Aucun réglage d'envoi ou de réception sur l'écran : le sens vient des faces.

![Fenêtre des fréquences radioactives](images/radioactive_quantum_entangloporter-frequencies.png)

## Automatisation

- Les faces de produits chimiques se règlent face par face comme sur toute machine de Mekanism : une face d'entrée fait entrer les
  produits chimiques radioactifs, une face de sortie les fait sortir.
- Casser le bloc est refusé tant que son tampon (ou un stock plus ancien) contient quelque chose ; le vider d'abord par une face de
  sortie (il n'y a pas de bouton pour vider). Un bloc qui ne contient rien se casse et se lâche comme l'Entangloporteur de Mekanism.
- Les fréquences radioactives sont sauvegardées avec le monde. Supprimer une fréquence délie les blocs qui y sont au tick suivant et
  ne fait rien perdre : leurs tampons restent dans chaque bloc.

## Configuration

Pas de section dédiée dans `mekanismengineering-server.toml`. L'ancien stock radioactif partagé sur une fréquence d'inventaire,
s'il existe, garde la taille que lui a donnée la configuration de Mekanism (`quantum_entangloporter.chemicalBuffer`, 8 192 000 mB par défaut).

| Valeur fixe | Signification |
|---|---|
| 64 000 mB | Tampon local d'un bloc (un produit chimique à la fois). |
| 10 mB par tick | Ce que prend chaque récepteur. |
| 1 000 000 J | Réserve d'énergie sans amélioration. |
| 100 J par mB | Prix d'un transfert à chaque extrémité, sans Mise à niveau énergétique. |

## Mise à jour depuis la 1.1.1 et les bêtas

- Les sauvegardes de la 1.1.1 se chargent sans changement. Un bloc démarre avec un tampon vide et une réserve vide.
- Le stock radioactif que les versions précédentes gardaient sur une fréquence d'**inventaire** n'est pas perdu : il **reste dans le
  bloc**, ne peut que se **vider** par une face de sortie, jamais se remplir, et verrouille toujours le bloc tant qu'il contient quelque chose.
- Tout **gaz non radioactif** que contenait le bloc est **vidé automatiquement** au chargement du monde,
  et rien n'est libéré dans le monde : aucune radiation.
- Un bloc qui était lié à une fréquence d'inventaire ordinaire en est **délié** au chargement
  du monde, sans détruire la fréquence ni ce qu'elle contient. C'est le bloc qui change : l'Entangloporteur quantique de Mekanism
  continue de servir cette fréquence.
- Un produit chimique stocké dont le mod a été retiré est conservé et redevient utilisable si le mod revient.

## Conseils et dépannage

- **Impossible de le casser ?** Son tampon ou son stock plus ancien contient de la matière radioactive. La faire sortir par une face
  de sortie, puis casser le bloc.
- **Rien ne bouge.** Vérifier la réserve : sans énergie, le bloc s'arrête et garde son gaz. Vérifier qu'un bloc de la fréquence a
  une face d'entrée et un autre une face de sortie.
- **Le récepteur est lent.** C'est voulu : 10 mB par tick pour chaque récepteur.
- Les mods d'affichage (Jade, WTHIT, The One Probe) ne lisent rien de l'intérieur de ce bloc, donc une fréquence privée reste privée ;
  l'affichage Jade et WTHIT propre à l'addon ne montre la fréquence qu'aux joueurs autorisés à l'utiliser (voir
  [JEI, Jade et WTHIT](JEI-Jade-WTHIT.md)).
