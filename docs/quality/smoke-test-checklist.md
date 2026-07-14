# Smoke & Sanity — les listes de contrôle

## Smoke automatisé (à chaque build, bloquant)

```bash
npm run build --prefix app     # le smoke teste dist/, pas src/
npm run all --prefix e2e       # public · demandes · arabe · smoke
```

Le smoke parcourt **60 pages × 5 rôles** et échoue sur :
- une **erreur JavaScript** sur n'importe quelle page ;
- une **page quasi vide** (< 40 caractères — l'écran blanc) ;
- un **« NaN »** ou un **« undefined »** visible à l'écran.

C'est ce parcours qui a trouvé l'écran blanc de `/app/attendance` (2026-07-15).

## Smoke de production (après chaque déploiement, automatisé)

Job `smoke-prod` de la CI, sur https://edu.kogiagroup.com :
- le site répond **200** ;
- la page contient bien `<div id="root">` ;
- le **bundle** référencé se télécharge (200) ;
- le bundle contient le cœur (`coreon_db`) **et** l'arabe (`لوحة المتابعة`) —
  c'est-à-dire : le site sert bien **notre** version, pas un cache ancien.

## Sanity manuel — après CHAQUE correctif (3 minutes)

À faire **sur le bundle construit**, pas en `npm run dev` :

- [ ] Le défaut corrigé **ne se reproduit pas** (refaire le geste exact qui le déclenchait).
- [ ] La page qui portait le défaut s'affiche **entièrement**.
- [ ] Les **deux** rôles les plus proches de la page fonctionnent encore.
- [ ] `npm test --prefix core` — vert.
- [ ] `npm run all --prefix e2e` — vert.
- [ ] Un **test de régression** a été ajouté (sinon le correctif n'est pas fini).

## UI / UX — la liste qui n'est pas automatisable (encore)

- [ ] **Contraste calculé, jamais estimé.** Toute couleur de texte : ≥ 4,5:1
      (AA). Les jetons sont dans `core/src/tokens.js` — on ne peint pas dans
      une page. *(L'ardoise a été assombrie à 7,31:1 le 2026-07-14 après un
      retour d'Othman : « le texte est trop clair ». Il avait raison, et la
      correction s'est faite au **calcul**, pas à l'œil.)*
- [ ] **Arabe / RTL** : la barre latérale passe à droite, les flèches se
      retournent, rien ne déborde horizontalement.
- [ ] **Mobile (390 px)** : aucun défilement horizontal.
- [ ] **Clavier seul** : on peut atteindre et déclencher chaque action
      (le glisser-déposer de l'évaluation a une voie clavier).
- [ ] **Un écran vide dit quelque chose** — « L'école est à jour » est une
      information ; une page blanche est un défaut.
