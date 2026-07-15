# Le backend — v1 pilote (2026-07-15)

**Le verrou rouge de `production-readiness-checklist.md` est levé en code.**
Ce document dit ce qui existe, ce qui a été décidé, et ce qui reste pour le
jour J. Le mode d'emploi opérationnel vit dans `server/README.md`.

## La décision d'architecture

**Un serveur Node à zéro dépendance qui exécute LE MÊME cœur que le web et le
mobile** — plutôt qu'un BaaS (Supabase & co).

Pourquoi : nos règles d'accès (un parent ne voit que SES enfants, un enseignant
jamais la paie) ne s'expriment pas en politiques SQL par ligne — il aurait fallu
écrire des fonctions serveur de toute façon. Ici, le serveur importe
`core/src/` : `acknowledge()`, `apply()`, l'ACL — écrits une fois, testés une
fois, exécutés partout. Le déploiement reste libre (tout hôte qui fait tourner
Node), la sortie reste possible (des fichiers JSON lisibles + OneRoster).

## Ce qui existe (testé, dans la CI)

| Verrou (checklist) | Levée | Preuve |
|---|---|---|
| Pas de backend | `server/server.mjs` — une école, API complète | `server/test/` (6 tests) + `e2e/parcours.live.mjs` |
| Mots de passe en clair | scrypt+sel côté serveur, `pw` retiré de TOUT blob sortant | tests « aucun mot de passe ne voyage » |
| Rôle côté client | le serveur filtre PAR RÔLE (`core/src/acl.js`, défaut refus pour le parent) | tests acl + parcours live |
| Écriture concurrente | verrou de révision : écriture périmée → **409** + données fraîches ; fusion limitée aux collections du rôle | test « verrou de révision » |
| Aucune sauvegarde | copie datée au démarrage + toutes les 6 h, rotation 30, atomique | `server/store.mjs` |
| Quota navigateur ~5 Mo | le blob vit sur le serveur ; le navigateur n'est qu'un cache | — |

Le client (`app/src/remote.js` + `RemoteGate.jsx`) ne change RIEN sans la clé
`coreon_api` : la démo publique reste 100 % locale. Avec la clé : connexion
serveur, pousser débouncé (personnel), sondage 20 s (multi-appareils), les
actions parent en opérations nommées (`/api/op`).

## Ce qui reste pour le jour J (assumé, dans l'ordre)

1. **L'hébergement** — avec Othman : un VPS ~5 €/mois ou un PaaS ; HTTPS par
   reverse-proxy ; `COREON_ORIGINS` sur le domaine réel. (1 heure.)
2. **La copie hors machine des sauvegardes** (une ligne de cron rclone/S3) et
   **UNE restauration testée**. Non négociable avant les vraies données.
3. **V1.1 parents** : messagerie et RSVP (extraire les écritures de
   Messages.jsx/Social.jsx vers le cœur, puis les exposer en opérations).
4. **Multi-écoles** : un blob par école — la structure du magasin le permet
   (un répertoire de données par école, un processus ou un routage par nom).
5. **Journal d'audit des accès** (INPDP) + registre des traitements (juridique).
6. `security-checklist.md` § « le jour où le backend existe » — en entier.

## Migration d'une école déjà en localStorage

`copy(localStorage.coreon_db)` dans le navigateur → `export.json` →
`node server/import.mjs export.json`. Les comptes existants gardent leurs mots
de passe (hachés à l'import), le blob est nettoyé. Rien ne se ressaisit.
