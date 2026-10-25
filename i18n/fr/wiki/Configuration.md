<!-- source: dc7ac655b576028a48647c5bff42ac1c3d1a07e8 -->
# Configuration

Mekanism: Engineering enregistre une configuration NeoForge **SERVER**, qui contient presque tous les réglages, et une petite configuration **CLIENT** (voir [Réglages client](#client-settings)) ; il n'y a pas de configuration COMMON. La configuration serveur est propre à chaque monde, ici :

```
<world>/serverconfig/mekanismengineering-server.toml
```

Elle est générée au premier lancement du monde avec le mod installé. En multijoueur, c'est le fichier du **serveur** qui s'applique, pas celui d'un client. Chaque entrée ci-dessous est rangée selon sa section dans ce fichier ; le nom de la section figure entre crochets dans chaque titre.

NeoForge ramène un nombre hors de la plage indiquée à la valeur autorisée la plus proche, et une valeur qui n'est pas un nombre revient à la valeur par défaut. Par exemple, un `intervalTicks` du Distributor inférieur à 40 devient 40.

## Quantum Ore Refinery

La [Quantum Ore Refinery](Quantum-Ore-Refinery.md) n'a **aucune clé** dans ce fichier : ses niveaux, sa vitesse (de 200 ticks jusqu'à 4 avec
les accélérateurs), ses réservoirs et son prix en énergie sont fixés dans l'addon. Son énergie suit le réglage de la Chambre
d'enrichissement de Mekanism (chaque recette de minerai coûte 200 fois ce que la chambre consomme en un tick) : un modpack qui modifie l'énergie
des machines de Mekanism modifie donc aussi celle de la raffinerie. Il en va de même pour le [Quantum Entangloporter
radioactif](Radioactive-Quantum-Entangloporter.md), dont la réserve, la vitesse et les prix sont des valeurs fixes, et pour la [Tablette
de réseau quantique](Quantum-Network-Tablet.md).

## Digital Miner Companion `[surveyor]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | `true` | s. o. | Active ou désactive le Digital Miner Companion : liaison, lecture, contrôle à distance, estimations et relocalisations. |
| `cooldownTicks` | `10` | 1 – 200 | Délai minimal (en ticks) entre deux liaisons du même Companion, par joueur. |
| `estimateEnabled` | `true` | s. o. | Autorise l'« estimation à jour » à la demande du Companion, qui compte les blocs que le brouillon minerait actuellement. Lecture seule : elle ne lit que les chunks déjà chargés, ne démarre jamais le mineur et se répartit sur plusieurs ticks. |
| `estimateBudgetMicros` | `2000` | 100 – 20 000 | Temps serveur (microsecondes par tick) partagé entre toutes les estimations en cours. |
| `estimateMaxBlocks` | `4,000,000` | 1 – 50 000 000 | Plus grand volume configuré (en positions de blocs) qu'une estimation accepte avant de refuser de se lancer. |
| `estimateMaxConcurrent` | `4` | 1 – 32 | Nombre maximal d'estimations pouvant tourner en même temps sur le serveur (au plus une par joueur). |

## Precision Logistical Distributor `[distributor]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | `true` | s. o. | Active ou désactive le Precision Logistical Distributor. Désactivé, il refuse les entrées et cesse de distribuer. |
| `intervalTicks` | `40` | 40 – 1 200 | Nombre de ticks de base entre deux cycles de distribution, avant réduction par les Mises à niveau de la vitesse (huit mises à niveau le divisent par 10 par défaut). |

## Quantum Digital Miner `[quantum_miner]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | `true` | s. o. | Active ou désactive le Quantum Digital Miner : désactivé, il ne cherche ni ne mine. |
| `maxRadius` | `128` | 1 – 128 | Plus grand rayon de minage que les joueurs peuvent régler, en blocs. |
| `speedMultiplier` | `4.0` | 1,0 – 16,0 | Combien de fois plus vite il mine que le Mineur digital de Mekanism avec les mêmes Mises à niveau de la vitesse. |
| `energyMultiplier` | `4.0` | 0,0 – 64,0 | Consommation d'énergie et stockage de base, en multiple des réglages du Mineur digital de Mekanism. |
| `maxBlocksPerTick` | `8` | 1 – 64 | Nombre maximal de blocs qu'un Quantum Digital Miner peut miner en un seul tick. |
| `maxChecksPerTick` | `512` | 16 – 65 536 | Nombre maximal de positions cibles examinées en un seul tick, y compris celles qui ont changé depuis la recherche. |
| `searchBudgetMicros` | `2000` | 100 – 50 000 | Temps serveur (microsecondes par tick) partagé entre toutes les recherches en cours. |
| `searchThreads` | `1` | 1 – 4 | Fils d'exécution en arrière-plan qui analysent les données des chunks pour l'ensemble des Quantum Digital Miners. |
| `searchMaxPendingChunks` | `8` | 1 – 64 | Avec une Mise à niveau d'ancrage, nombre de chunks qu'une recherche peut charger en même temps. |
| `verboseLogs` | `false` | s. o. | Journalise les détails de recherche, de fréquence et de relocalisation au niveau INFO. Uniquement pour mesurer les latences. |

## Relocalisation du Quantum Digital Miner `[relocation]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | `true` | s. o. | Autorise le déplacement d'un Quantum Digital Miner qui a terminé sa zone vers une zone voisine jamais exploitée, avec le Digital Miner Companion. |
| `energyCost` | `80,000,000` J | 0 – max | Énergie prélevée sur le Companion pour une relocalisation. |
| `gap` | `2` | 0 – 64 | Blocs laissés intacts entre la zone terminée et la suivante. |
| `maxHeightDifference` | `3` | 0 – 16 | Plus grand écart de hauteur du sol encore accepté sous la plateforme d'arrivée ; les emplacements plus accidentés sont ignorés. |
| `maxHistory` | `256` | 1 – 4 096 | Zones terminées mémorisées par mineur ; la plus ancienne est oubliée en premier. |
| `candidateTimeoutTicks` | `200` | 20 – 2 400 | Ticks d'attente du chargement des chunks d'un site candidat avant de passer au suivant. |
| `ceilingSearchRange` | `16` | 1 – 64 | Dans les dimensions à plafond (le Nether), blocs explorés au-dessus et au-dessous de la hauteur du mineur pour trouver un sol. |
| `chargeTicks` | `30` | 0 – 200 | Ticks pendant lesquels le mineur se charge visiblement sur place avant de partir. `0` le déplace immédiatement. |

## Batterie du Digital Miner Companion `[companion]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `energyCapacity` | `256,000,000` J | 1 – max | Énergie stockée par le Digital Miner Companion. |
| `chargeRate` | `1,000,000` J | 1 – max | Énergie acceptée par le Companion à chaque tick pendant la charge. |

## Quantum Portable Teleporter `[quantum_teleporter]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `enabled` | `true` | s. o. | Autorise les sauts avec le Quantum Portable Teleporter. Désactivé, l'objet se charge toujours mais refuse tous les sauts. |
| `energyCapacity` | `1,000,000,000` J | 1 – max | Énergie stockée par le téléporteur (1 GJ). |
| `chargeRate` | `5,000,000` J | 1 – max | Énergie qu'il accepte à chaque tick pendant la charge. |
| `costTeleporterPercent` | `1.0` | 0,0 – 100,0 | Un saut vers un Téléporteur de Mekanism, en pourcentage de la batterie pleine. |
| `costCoordinatesPercent` | `50.0` | 0,0 – 100,0 | Un saut vers des coordonnées vérifiées, en pourcentage de la batterie pleine. |
| `costRandomPercent` | `25.0` | 0,0 – 100,0 | Un saut vers un endroit sûr aléatoire, en pourcentage de la batterie pleine. |
| `randomMinDistance` | `1,000` | 16 – 1 000 000 | Distance minimale d'une destination aléatoire, en blocs depuis le joueur. |
| `randomMaxDistance` | `8,000` | 16 – 1 000 000 | Distance maximale d'une destination aléatoire, en blocs depuis le joueur. |
| `randomTries` | `8` | 1 – 32 | Emplacements essayés par une recherche aléatoire avant d'abandonner, sans frais. Une recherche relancée avant la fin de son temps de recharge reprend avec les essais déjà utilisés. |
| `searchCooldownTicks` | `160` | 0 – 12 000 | Ticks d'attente d'un joueur entre deux recherches aléatoires. |
| `jumpCooldownTicks` | `20` | 0 – 12 000 | Ticks après un saut avant que le même joueur puisse sauter de nouveau (vérifié par le serveur). |
| `maxConcurrentChecks` | `2` | 1 – 64 | Chunks de destination que l'ensemble du serveur peut charger en même temps pour les vérifications (au plus un par joueur). |
| `destinationHoldTicks` | `200` | 20 – 1 200 | Ticks pendant lesquels une destination vérifiée reste chargée en attendant le saut, avant que son ticket temporaire soit rendu. |
| `blockedDimensions` | aucune | liste d'identifiants | Dimensions vers lesquelles et depuis lesquelles le téléporteur ne saute jamais, sous forme d'identifiants (par exemple `minecraft:the_end`). |
| `allowCoordinates` | true | – | Désactivé, l'onglet Coordonnées est grisé et toute vérification ou tout saut vers des coordonnées est refusé, sans frais. Les onglets Teleporter et Aléatoire ne sont pas concernés. |
| `allowRandom` | true | – | Désactivé, l'onglet Aléatoire est grisé et toute recherche aléatoire est refusée, sans frais. Les onglets Teleporter et Coordonnées ne sont pas concernés. |
| `coordinateAndRandomBlockedDimensions` | aucune | liste d'identifiants | Dimensions depuis lesquelles un joueur ne peut pas utiliser les onglets Coordonnées et Aléatoire, sous forme d'identifiants. Seule compte la dimension où se trouve le joueur, pas celle où il irait ; les sauts vers un Téléporteur fonctionnent toujours. `blockedDimensions` ci-dessus est plus strict : il bloque tout saut vers ou depuis la dimension. |

## Quantum Chargepad `[quantum_chargepad]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `energyStorage` | `1,000,000,000` J | 1 – max | Énergie stockée par la plaque (Plaque de rechargement de Mekanism : 2 048 000). |
| `transferRate` | `256,000,000` J | 1 – max | Énergie qu'elle donne à chaque tick à chaque joueur qui se tient dessus, partagée entre tous ses objets à la fois ; chaque objet ne prend toutefois pas plus que sa propre vitesse de charge. |

## Contrôleur d'améliorations de précision `[upgrade_controller]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `vaultCapacityPerType` | `1,024` | 1 – 65 536 | Nombre de mises à niveau d'un même type que la réserve du contrôleur peut stocker. |
| `radius` | `8` | 1 – 64 | Rayon cubique (en blocs) que chaque contrôleur scanne et gère. Fixé par le serveur, non réglable en jeu ; affiché dans son écran avec l'onglet Visuels de Mekanism. |
| `energyUsage` | `400` J/t | 0 – max | Énergie consommée par le contrôleur à chaque tick pendant qu'il scanne ou déplace des mises à niveau. Augmentée par les Mises à niveau de la vitesse et réduite par les Mises à niveau énergétiques, selon la règle de Mekanism. |
| `energyStorage` | `200,000` J | 1 – max | Énergie stockée par le contrôleur. |

## Industrial Fluid Pump `[quantum_fluid_pump]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `baseRate` | `16,000` mB/t | 1 – 10 000 000 | Eau fournie sans Mise à niveau de la vitesse. Les Mises à niveau de la vitesse la multiplient par le multiplicateur maximal de mise à niveau de Mekanism (×10 par défaut avec huit mises à niveau). |
| `lavaShare` | `0.75` | 0,0 – 1,0 | Part du débit d'eau utilisée pour pomper de la lave ou un autre fluide dont les blocs source sont prélevés dans le monde. |
| `stabilizedLavaShare` | `0.75` | 0,0 – 1,0 | Part du débit d'eau utilisée pour la lave maintenue en place par le Stabilisateur de source. |
| `heavyWaterShare` | `0.75` | 0,0 – 1,0 | Avec une Mise à niveau du filtre, la production d'eau lourde vaut le débit d'eau multiplié par le taux d'eau lourde de Mekanism, multiplié par cette part. |
| `maxSourcesPerTick` | `16` | 1 – 64 | Nombre maximal de blocs source que la pompe peut retirer du monde en un seul tick (lave sans le Stabilisateur de source, et autres fluides prélevés). |
| `sourceRadius` | `32` | 4 – 64 | Rayon autour de la prise, en blocs, dans lequel les blocs source à prélever sont recherchés. |
| `searchBudget` | `256` | 16 – 4 096 | Nombre maximal de blocs lus par la recherche de sources en un tick. |
| `energyUsage` | `32,000` J/t | 0 – max | Énergie consommée par tick de travail sans mise à niveau. Modifiée par les Mises à niveau de la vitesse et énergétiques selon la règle de Mekanism. |
| `energyStorage` | `16,000,000` J | 1 – max | Énergie stockée sans Mise à niveau énergétique. |
| `stabilizerEnergyMultiplier` | `4.0` | 1,0 – 64,0 | Multiplicateur du coût en énergie pendant que le Stabilisateur de source maintient une source de lave en place. |
| `tankCapacity` | `2,000,000` mB | 1 000 – max | Capacité du réservoir tampon de la pompe. |
| `intakeMaxPipes` | `2,048` | 1 – 65 536 | Plus grand réseau de tuyaux de prise que la pompe suit ; un réseau plus grand est signalé au lieu d'être parcouru. |
| `intakePipesPerTick` | `64` | 1 – 4 096 | Tuyaux du réseau de prise suivis en un tick. |
| `intakeRecheckTicks` | `20` | 1 – 1 200 | Ticks entre deux vérifications que la prise est toujours en place. |
| `fluidloggedPipeIntake` | `true` | s. o. | Permet à un Tuyau mécanique immergé (placé dans une source de fluide, ou rempli avec un seau) d'amorcer la pompe. `false` désactive les nouvelles prises de ce type. |
| `otherFluids` | `true` | s. o. | Autorise le pompage d'autres fluides que l'eau et la lave (venant d'autres mods) ; leurs sources sont prélevées comme celles de la lave. |
| `stabilizedLavaEnergyPerMb` | `50.0` J/mB | 0,0 – 1 000 000,0 | Coût minimal en énergie par mB de lave maintenue par le Stabilisateur de source, quelles que soient les Mises à niveau énergétiques, gardé au-dessus de ce qu'un générateur produirait avec cette lave. |

## Petrogenic Synthesizer et Petrogenic Synthesis Plant `[petrogenic_synthesis]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `synthesizerTicks` | `10.0` | 0,05 – 72 000,0 | Ticks nécessaires au Petrogenic Synthesizer pour un bloc de Pierres sans Mise à niveau de la vitesse (les autres produits utilisent un multiple de cette valeur selon leur propre recette). |
| `synthesizerEnergyUsage` | `100` J/t | 0 – max | Énergie consommée par tick sur les Pierres sans mise à niveau. Modifiée par les Mises à niveau de la vitesse et énergétiques ; pour les autres produits, par leur recette. |
| `synthesizerEnergyStorage` | `160,000` J | 1 – max | Énergie stockée sans Mise à niveau énergétique. |
| `synthesizerTankCapacity` | `16,000` mB | 1 000 – max | Capacité de chacun des deux réservoirs du Synthesizer (eau, lave). Volontairement réduite : à haute vitesse, l'approvisionnement doit suivre. |
| `plantLineTicks` | `5.0` | 0,05 – 72 000,0 | Ticks nécessaires à l'une des huit lignes de la Petrogenic Synthesis Plant pour un bloc de Pierres sans Mise à niveau de la vitesse. |
| `plantEnergyUsage` | `1,280` J/t | 0 – max | Énergie consommée par tick avec les huit lignes en marche sur les Pierres, sans mise à niveau. |
| `plantEnergyStorage` | `64,000,000` J | 1 – max | Énergie stockée sans Mise à niveau énergétique. |
| `plantTankCapacity` | `2,000,000` mB | 1 000 – max | Capacité de chacun des deux tampons de la Plant (eau, lave). |
| `hydroCondenserRate` | `1,000` mB/t | 0 – 1 000 000 | Quantité maximale d'eau produite par une Hydro Condenser Upgrade. |
| `hydroCondenserEnergyPerMb` | `5.0` J/mB | 0,0 – 1 000 000,0 | Coût en énergie par mB d'eau produite par les Hydro Condenser Upgrades. Les Mises à niveau énergétiques ne le réduisent pas. |
| `magmaSynthesizerRate` | `1,000` mB/t | 0 – 1 000 000 | Quantité maximale de lave produite par une Magma Synthesizer Upgrade. |
| `magmaSynthesizerEnergyPerMb` | `1,000.0` J/mB | 0,0 – 1 000 000,0 | Coût en énergie par mB de lave produite par les Magma Synthesizer Upgrades. Les Mises à niveau énergétiques ne le réduisent pas ; il est gardé au-dessus de ce qu'un générateur produirait avec cette lave. |

## Contrôleur de réseau quantique `[quantum_network]`

| Clé | Défaut | Plage | Signification |
|---|---|---|---|
| `timingLogs` | `false` | s. o. | Écrit une ligne dans `latest.log` pour chaque instantané envoyé par le contrôleur (côté serveur) et pour chaque attente affichée par l'écran du contrôleur (côté client) : où le temps est passé, combien d'appareils ont été examinés, quelle était la taille de la réponse. Mesure uniquement : rien de ce qui est affiché ou sauvegardé ne change. Pour le débogage seulement. |
| `cacheSeconds` | `30` | 0 – 300 | Durée, en secondes, pendant laquelle l'écran du contrôleur ou de la tablette peut afficher les derniers chiffres connus pour une fréquence et une ressource, pendant que tourne la première mesure d'un écran ou d'un onglet tout juste ouvert. Les chiffres en direct les remplacent dès qu'ils existent, environ une ou deux secondes plus tard. `0` n'affiche aucun chiffre antérieur. |

## Réglages client

Une petite configuration **CLIENT**, `mekanismengineering-client.toml`, dans le dossier `config` de l'instance du joueur (elle appartient au joueur, pas
à un serveur).

| Clé | Défaut | Signification |
|---|---|---|
| `notifications` | `true` | Affiche une notification, avec le son de notification de Minecraft, quand un [Quantum Digital Miner](Quantum-Digital-Miner.md#notifications) du joueur a fini de miner, est bloqué ou s'est déplacé. Désactivé : aucune notification ni aucun son pour toutes les notifications du mod. Le serveur continue de les envoyer. |
