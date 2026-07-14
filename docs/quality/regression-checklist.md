# Régression — chaque défaut laisse un test derrière lui

> **La règle : un défaut corrigé sans test n'est pas corrigé — il est en
> vacances.** Ce fichier est la liste des défauts réels et du test qui les
> empêche de revenir.

| Date | Le défaut (réel, trouvé en production ou en test) | Le test qui l'empêche de revenir |
|---|---|---|
| 2026-07-15 | **Écran blanc de la Présence** : la clé `classId_iso` était coupée au **premier** `_`, or les classes de petite enfance s'appellent `kg_ns`, `kg_pk`. Date invalide → crash. Et l'agrégation du tableau de bord **excluait la crèche en silence**. | `core.test.mjs` « présence : un identifiant de classe peut contenir des underscores » + `attParts()` : **un seul lecteur** du format, dans le cœur |
| 2026-07-14 | **Faux reçu de pré-inscription** : quota du navigateur dépassé → `setItem` avalait l'erreur → le parent recevait une référence pour un dossier **jamais enregistré**. Deux vraies candidatures perdues. | `core.test.mjs` « inscription : jamais de faux reçu » (quota simulé, 3 scénarios) + `e2e/parcours.public.mjs` (photo lourde réelle) |
| 2026-07-14 | Les pièces jointes ne stockaient que le **nom** du fichier : l'administration croyait détenir un acte de naissance qu'elle ne pouvait pas ouvrir. | `e2e/parcours.public.mjs` : le fichier est **relu depuis le stockage** après dépôt |
| 2026-07-14 | Un admin pouvait **s'auto-approuver** sa demande (il était au niveau 0 de sa propre chaîne). | `core.test.mjs` « bureau : personne ne décide de sa propre demande » |
| 2026-07-10 | Notifications de rôle envoyées à **tous** les parents de l'école (fuite entre familles). | `notify.js` + `reaches()` — ⚠️ **test à écrire** |
| 2026-07-10 | Déduction de paie, numérotation d'avoirs, IDs OneRoster accentués, page RH blanche. | Tests d'exécution du cœur (`hr`, `accounting`, `oneroster`) |

## La procédure, à chaque correctif

1. **Reproduire** le défaut (un test qui échoue **avant** le correctif).
2. Corriger — et si possible **supprimer la classe entière du défaut** (le bug
   de la clé d'appel n'a pas été rustiné à 5 endroits : le format n'a plus
   qu'**un seul lecteur**, dans le cœur).
3. Le test passe au vert.
4. La ligne entre dans ce tableau.
