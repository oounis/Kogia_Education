# La stratégie de qualité — Coreon EDU

**Le principe, avant les niveaux de test :**

> **Une règle qui ne vit que dans l'interface n'est pas une règle.**
> Les règles du métier vivent dans `core/` et sont prouvées par **exécution**.
> Les écrans sont prouvés en **conduisant un vrai navigateur** sur le **vrai
> bundle** — jamais en regardant une capture d'écran.

Cette stratégie n'est pas une aspiration : chaque ligne ci-dessous correspond à
une commande qui tourne aujourd'hui, ou à une limite **assumée et datée**.

## Pourquoi cette exigence (le dossier de preuves)

Les défauts sérieux du produit n'ont **jamais** été trouvés en relisant le code
ni en regardant l'écran. Ils ont été trouvés en l'exécutant :

| Défaut | Trouvé par | Coût s'il était passé en production |
|---|---|---|
| **Faux reçu de pré-inscription** : le quota du navigateur explosait, l'écriture échouait en silence, le parent repartait avec une référence d'un dossier jamais enregistré | Othman, sur **deux vraies candidatures** | Des familles perdues. Le produit **mentait**. |
| **Écran blanc de la Présence** : la clé `classId_iso` coupée au premier `_`, alors que les classes de crèche s'appellent `kg_ns` | **Smoke test** (2026-07-15) | Le directeur ouvre « Présence » le jour de la démo : page blanche. |
| Déduction de paie, numérotation d'avoirs, ID OneRoster accentués, page RH blanche | Tests d'exécution / conduite du navigateur | Une paie fausse. Une compta indéfendable. |

**Conclusion tenue pour acquise : ce qui n'est pas exécuté n'est pas vérifié.**

## Les trois étages, et ce qui bloque quoi

| Étage | Ce qui tourne | Bloque ? |
|---|---|---|
| **Développement** (local + GitHub) | cœur (unitaire + intégration), parcours navigateur, smoke, lint, audit des dépendances | **Oui** — la CI refuse le déploiement |
| **Pré-production** (staging) | perf, charge, sécurité offensive, UAT | ⏳ **Impossible aujourd'hui : il n'y a pas de backend.** Voir `production-readiness-checklist.md` |
| **Production** | smoke de production après chaque déploiement | **Oui** — automatisé dans la CI (`smoke-prod`) |

## La règle qui gouverne les tests qu'on ne peut pas encore faire

> On ne bloque pas le développement en attendant une infrastructure qui n'existe
> pas. On **construit la fondation maintenant**, on **automatise ce qui peut
> l'être**, et on **écrit la liste de contrôle** pour l'environnement futur —
> datée, dans ce dossier, jamais dans une tête.

## Ce qu'on ne fait pas (et pourquoi)

- **Pas de tests unitaires de composants React isolés.** Ils prouvent qu'un
  bouton s'affiche, pas qu'une règle tient. Nos parcours navigateur couvrent la
  même surface avec une vraie valeur métier. *(À reconsidérer si le nombre de
  composants purs augmente.)*
- **Pas d'objectif chiffré de couverture de lignes.** Une couverture de 90 % qui
  ne teste aucune règle du métier ne vaut rien. On mesure la couverture des
  **règles** (`test-plan.md`), pas des lignes.
