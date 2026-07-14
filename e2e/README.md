# Les parcours — « on vérifie en conduisant »

Chaque script pilote un vrai navigateur sur le **vrai bundle** (`app/dist`),
pas sur un mock. C'est ainsi qu'ont été attrapés le faux reçu du stockage
plein, la déduction de paie, la numérotation d'avoirs et la page RH blanche.

```bash
cd e2e && npm i                       # une fois
npm run build --prefix ../app         # le harnais teste dist/, pas src/
npm run all                           # ou : npm run public / demandes / arabe
```

Chromium : le harnais prend `$CHROME_PATH`, sinon le cache Playwright
(`~/.cache/ms-playwright`), sinon le Chromium du système. Pour l'installer :
`npx playwright@1.61 install chromium-headless-shell`.

Chaque scénario démarre son propre serveur et son propre navigateur — la base
de démonstration se sème dans un localStorage vierge, aucun état ne survit.
