# Coreon Edu — état des lieux (reprise de session)

Ce fichier existe pour qu'une nouvelle session Claude reprenne **exactement** ici.
Produit : **Coreon Edu**, département **Kogia Education**, éditeur **Kogia Group**.
Ce n'est **pas** un ERP scolaire — c'est un produit qu'on ouvre avec plaisir. On garde
ce qui fait vivre l'école tous les jours et on éteint ce que tout le monde vend déjà.

Dernière session : 2026-07-10.

---

## ✅ Fait et livré

### 1. Modules cachés (pas supprimés) — commit `7affb5b`
Devoirs, Examens, Bibliothèque, Transport scolaire sont **éteints**, pas effacés.
- Interrupteurs dans `core/src/features.js` (`homework/exams/library/transport: false`).
- Un module éteint disparaît du **menu** (`nav.js`), de la **palette Ctrl+K**, et
  refuse l'**URL directe** (`access.js` + `App.jsx`). Le code des pages reste là,
  testé, prêt à rallumer d'un `true` (futur « pack gestion » pour l'école qui le demande).
- Dashboard parent : le bouton « Devoirs » est devenu « ✨ Espace parents ».

### 2. Site Kogia Group refait — commit `6dca18e` (poussé, en ligne sur kogiagroup.com)
- Nouveau hero, 9 cartes de fonctionnalités « fun » (Évaluer 30 s, journée en direct,
  Espace parents, Poste de sécurité, appel, frais, rien ne se perd, badgeuse, mobile).
- Bloc **« Ce que nous ne sommes pas — un ERP scolaire de plus »** (❌ cahier de textes,
  bibliothèque, transport / ✅ ce qu'on fait vraiment).
- Annonce mobile **honnête** : Android d'abord, iPhone ensuite, web + téléphone synchronisés.
- Titre / OG / Twitter / JSON-LD (`operatingSystem: Web, Android`) / FAQ mis à jour.
- Repo du site : `oounis/Kogia_Group` (⚠️ PUBLIC — aucun secret dedans).

### 3. Cœur partagé extrait — ⚠️ NON committé (en attente, voir plus bas)
Prérequis technique pour partager le code entre web et Android. **`app/src/build` passe.**
- Toute la logique métier (16 modules `.js`) déplacée `app/src/*.js` → **`core/src/*.js`**.
- Nouveau **`core/src/storage.js`** : seule couture plateforme. Le web branche
  `localStorage`, Android branchera `react-native-mmkv`, via `setStorage()`. API synchrone.
  `db.js` / `clock.js` passent désormais par lui — plus aucun `localStorage` en dur.
- **Dé-couplage des icônes** : `data.js` et `nav.js` ne portent plus de composants
  lucide mais des **noms** (`icon:'Star'`). Le web les résout via le nouveau
  `app/src/icons.jsx` (`<Ic n="Star"/>` → `lucide-react`) ; Android via
  `lucide-react-native`. Consommateurs recâblés : Evaluate, Results, Bulletin,
  GradeHistory, CommandPalette, AppShell.
- `theme.js` : `applyAccent()` renvoie la palette et ne touche au DOM que si présent.
- Alias **`@core` → `../core/src`** dans `app/vite.config.js` ; tous les imports UI
  passent de `'../db.js'` à `'@core/db.js'`.
- **`core/` ne contient plus aucun `import 'lucide…'`, `localStorage`, `document`,
  `window`** (sauf gardés derrière `typeof`). C'est du JS pur, prêt pour React Native.

---

## ⏳ En cours / à faire — reprendre ICI

### A. ⚠️ LE BLOCAGE À DIRE AU CLIENT AVANT D'ÉCRIRE LA MOINDRE LIGNE ANDROID
Othman veut « garder les 2 versions (web + mobile) **synchronisées** ».
**C'est impossible avec l'architecture actuelle** : les données vivent dans le
`localStorage` du navigateur (`core/src/db.js`). Deux téléphones, ou un téléphone +
un web, ne partagent rien. La synchro exige un **backend** (proposition : Supabase /
Postgres + une petite API). `storage.js` est précisément la couture par laquelle ce
backend entrera **sans réécrire `db.js`**. Ce même backend débloque aussi les vrais
comptes (mots de passe hachés, rôle vérifié côté serveur) — obligatoires avant qu'une
vraie école y mette des données d'enfants.
→ **Décision produit attendue d'Othman** : (1) backend d'abord puis Android, ou
(2) Android en mode démo local (non synchronisé) pour montrer, backend ensuite.

### B. Application Android (React Native / Expo) — PAS ENCORE COMMENCÉE
Plan une fois la couche `core/` committée et la décision A prise :
1. `mobile/` avec Expo, qui **importe `@core`** (même Metro alias que Vite).
2. `mobile/src/icons.jsx` → `lucide-react-native` (contrat identique à `app/src/icons.jsx`).
3. Au boot : `setStorage(mmkvAdapter)` avant tout appel à `db()`.
4. Réutiliser tel quel : `db, auth, access, nav, features, social, security, results,
   data, clock, tunisia`. Ré-écrire seulement la **présentation** (composants natifs).

### C. Cœur partagé — à committer
Le travail #3 ci-dessus est sur le disque, **staged mais pas committé** (la session
s'est arrêtée). `npm run build` passe. Message de commit prêt :
> « Extract shared core/: platform-free business logic for web + Android »
Vérifier ensuite en **rendant** quelques pages (Login, Dashboard parent, Évaluer,
Résultats) que les icônes s'affichent — le build ne le garantit pas.

---

## Rappels d'architecture (pour ne pas casser l'existant)
- **DB** = un blob `localStorage` clé `coreon_db`, version `_v` dans le blob, évolutions
  par `migrate()`. `SCHEMA=21`. Ne jamais changer `KEY` ni sauter une migration.
- `demoUsers()` / `demoSocialEvents()` sont des fabriques au niveau module, appelées
  par `seed()` **et** `migrate()` (sinon un rôle ajouté après coup n'atteint jamais les
  navigateurs déjà installés — c'est le bug « où est sécurité ?! » de la session passée).
- Séparation des pouvoirs : **personne n'approuve sa propre demande / congé / événement**
  (`canDecide`, `ev.by!==user.id`).
- Espaces cloisonnés : parent / enseignant / personnel — un admin ne réserve pas un
  événement parent (`belongsToSpace`).
- Paiements : le parent **ne peut pas** se marquer payé ; l'admin confirme ; ça se
  reflète chez le parent.
- Dates : **jamais `toISOString()`** (UTC) → `isoOf()` local. Mode démo `?live=1`.
- Palette charts VALIDÉE (skill dataviz), jamais choisie à l'œil.

## Secrets
Coffre **hors de tout repo** : `/mnt/c/Current LAB/_Private/Kogia/KOGIA_credentials.txt`.
`Kogia_Group` (site) et `Kogia_Education` sont **publics** → rien de sensible dedans.
