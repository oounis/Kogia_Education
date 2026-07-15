# Le serveur Coreon — pilote v1

Un seul processus Node (≥ 20), **zéro dépendance**. Il héberge UNE école et lève
les verrous de `docs/quality/production-readiness-checklist.md` : mots de passe
hachés (scrypt), données servies **par rôle** (`core/src/acl.js`, défaut refus),
écritures sous **verrou de révision** (fini le « dernier écrase le premier »),
sauvegardes datées automatiques.

## Démarrer (local)

```bash
node server/import.mjs --demo     # une fois : sème l'école de démonstration
node server/server.mjs            # → http://localhost:8787
```

## Reprendre les données d'une vraie école

Dans le navigateur de l'école : console → `copy(localStorage.coreon_db)` →
coller dans `export.json`, puis :

```bash
node server/import.mjs export.json
```

## Brancher l'application

Le client passe en mode serveur quand `coreon_api` est posé :

```js
localStorage.setItem('coreon_api', 'https://api.votre-hote.tld')  // puis recharger
```

Sans cette clé, rien ne change : la démo publique reste 100 % locale.

## Déployer (jour J — avec Othman)

N'importe quel hôte qui fait tourner Node : un VPS à ~5 €/mois (Hetzner…) ou
un PaaS (Fly.io, Railway). Variables : `PORT`, `COREON_DATA` (répertoire des
données), `COREON_ORIGINS` (origines CORS autorisées, ex.
`https://edu.kogiagroup.com`), `COREON_STATIC=../app/dist` pour servir aussi
l'application. HTTPS par le reverse-proxy de l'hôte (Caddy fait ça en 3 lignes).

**Sauvegardes** : copie datée au démarrage + toutes les 6 h dans
`data/backups/` (rotation 30). Le jour J, ajouter UNE ligne de cron qui copie
`data/` hors de la machine (rclone/S3) — et TESTER une restauration.

## L'API

| Méthode | Chemin | Qui | Quoi |
|---|---|---|---|
| POST | /api/login | public | `{email, pw}` → `{token, user}` (session 8 h) |
| POST | /api/apply | public | pré-inscription (limitée par IP) |
| GET | /api/db | session | `{rev, blob}` — filtré par rôle (acl.js) |
| POST | /api/db | personnel | `{baseRev, blob}` → fusion des collections du rôle ; **409** si périmé |
| POST | /api/op | parent | `{op, args}` — opérations nommées gardées (acknowledge, toggleLike) |
| GET | /api/rev | session | la révision courante (sondage léger) |
| GET | /api/health | public | `{ok, rev}` |

## Ce que la v1.1 devra ajouter (assumé)

- Messagerie et RSVP parents (extraire les écritures de Messages.jsx/Social.jsx
  vers le cœur, puis les exposer en opérations).
- Multi-écoles (un blob par école, comptes rattachés).
- Journal d'audit des accès (INPDP).
