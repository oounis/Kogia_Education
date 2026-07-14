# Le cycle de vie d'un test — quel test, à quel moment

## Ce qui est exécutable AUJOURD'HUI (dépôt + CI)

| Niveau | Où | Commande | Bloquant |
|---|---|---|---|
| **Unitaire** | `core/test/core.test.mjs` | `npm test --prefix core` | ✅ CI |
| **Intégration** | idem — les modules du cœur ensemble (candidature → capacité → élève ; demande → assignation → clôture → bilan) | idem | ✅ CI |
| **Composant** | couvert par les parcours (le composant est exercé **dans** l'application, pas isolé) | `npm run all --prefix e2e` | ✅ CI |
| **Système** | parcours de bout en bout sur le vrai bundle | idem | ✅ CI |
| **Fonctionnel** | `e2e/parcours.public.mjs`, `.demandes.mjs`, `.arabe.mjs` | idem | ✅ CI |
| **Smoke (build)** | `e2e/parcours.smoke.mjs` — 60 pages × 5 rôles | `npm run smoke --prefix e2e` | ✅ CI |
| **Smoke (production)** | le site réel après déploiement | job `smoke-prod` | ✅ CI |
| **Régression** | chaque défaut corrigé **laisse un test derrière lui** (`regression-checklist.md`) | inclus ci-dessus | ✅ CI |
| **Sanity (après correctif)** | `smoke-test-checklist.md` §Sanity | manuel, 3 min | ⚠️ discipline |
| **UI/UX** | contrastes calculés (jamais estimés), RTL, clavier, mobile | `smoke-test-checklist.md` §UI | ⚠️ partiellement manuel |
| **Sécurité (base)** | `npm audit`, revue des règles d'accès (`access.js` — refus par défaut) | CI + `security-checklist.md` | ✅ CI (avertissement) |

## Ce qui ATTEND une infrastructure (documenté, pas oublié)

| Niveau | Pourquoi impossible aujourd'hui | Déclencheur |
|---|---|---|
| **Performance** | Aucun serveur : tout est dans le navigateur. Mesurer la latence d'une API qui n'existe pas n'a pas de sens. On mesure ce qui existe : le poids du bundle (`performance-plan.md`). | Premier backend |
| **Charge / stress** | idem | Premier backend |
| **Sécurité offensive** | Il n'y a **rien à attaquer** : pas de serveur, pas de session, pas de jeton. Les vraies failles connues (mots de passe en clair, rôle côté client) sont **déjà listées** et **bloquent la première école** — voir `production-readiness-checklist.md`. | Premier backend |
| **UAT** | Aucune école cliente. | Premier pilote |
| **Validation de release candidate** | Pas encore de versions numérotées ni de branche de release. | Première vente |

**Aucun de ces manques ne bloque le développement.** Chacun a sa liste de
contrôle écrite, prête à être exécutée le jour où l'environnement existe.
