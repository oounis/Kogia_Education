# La liste de contrôle d'une mise en ligne

## Avant CHAQUE commit sur `main` (aujourd'hui : chaque commit déploie)

- [ ] `npm test --prefix core` — vert (les règles du métier).
- [ ] `npm run build --prefix app` — vert.
- [ ] `npm run all --prefix e2e` — vert (parcours + smoke 60 pages × 5 rôles).
- [ ] Le défaut corrigé a **laissé un test derrière lui** (`regression-checklist.md`).
- [ ] Aucun secret dans le diff (le dépôt est **public**).
- [ ] Le carnet (`docs/PLAN.md`) dit la vérité sur ce qui vient de changer.

> **La CI applique les trois premiers points elle-même** : depuis le
> 2026-07-15, un test rouge **bloque le déploiement**. Avant cette date, la CI
> construisait et déployait sans jamais lancer un test — un test cassé ne
> protégeait rien.

## Après la mise en ligne (automatique)

- [ ] Job `smoke-prod` : le site réel répond 200, sert bien **notre** bundle
      (cœur + arabe), et non un cache ancien.
- [ ] Vérification humaine à la première ouverture : **rechargement forcé**
      (Ctrl+Shift+R) — le navigateur garde le bundle précédent.

## Le jour où il y aura des versions (première vente)

- [ ] Numéro de version (`vX.Y.Z`) et **notes de version** écrites pour l'école,
      pas pour le développeur.
- [ ] Branche `release/*`, `main` protégée.
- [ ] Validation de la **release candidate** en pré-production.
- [ ] Migration de schéma testée **sur une copie des données réelles**
      (`migrate()` existe et migre déjà sans détruire — le vérifier à chaque fois).
- [ ] Procédure de **retour arrière** écrite et **essayée**.
- [ ] L'école est **prévenue** avant, pas après.
