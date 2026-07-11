# 🐋 Coreon Edu — par Kogia Group

**L'école qu'on a envie d'ouvrir.** Pas un ERP scolaire de plus : Coreon Edu fait vivre
le quotidien de l'école — évaluer une classe en 30 secondes, suivre la journée de son
enfant en direct, laisser parents et enseignants organiser la vie commune.

**Démo en ligne :** https://oounis.github.io/Kogia_Education/ · **Site :** https://kogiagroup.com
Sur l'écran de connexion, entrez d'un clic dans n'importe quel portail (Direction,
Enseignant, Parent…). La première visite simule une journée de classe (mode démo,
réversible).

## Structure du dépôt

| Dossier | Rôle |
|---|---|
| `core/src/` | **Le cœur métier partagé** — JS pur, zéro dépendance, zéro API navigateur. Données, règles, autorisations, notifications. Web et mobile l'importent tel quel (`@core`). |
| `app/` | **Application web** (React 19 + Vite + Tailwind). Six portails par rôle. |
| `mobile/` | **Application Android/iOS** (Expo / React Native). 22 écrans natifs sur le même cœur. |
| `brand/` | Logos et identité visuelle (source de vérité). |
| `source_assets/` | Illustrations sources (non embarquées). |
| `HANDOFF.md` | État précis du produit — **à lire pour reprendre le développement.** |

## Développer

```bash
# Web
cd app && npm install && npm run dev          # http://localhost:5173

# Mobile (Expo SDK 54 — la version supportée par Expo Go sur l'App Store)
cd mobile && npm install && npx expo start --tunnel   # scanner avec Expo Go
npx expo export --platform web                # aperçu navigateur depuis dist/

# Qualité
npx expo lint          # dans mobile/ — 0 erreur attendu
npx expo-doctor        # 20/20 attendu
```

Règles d'or : la logique vit dans `core/` (jamais dupliquée par plateforme) ;
`core/src/storage.js` est la seule couture plateforme ; les mêmes formes de données
partout — un appel fait sur mobile produit exactement le bulletin que le parent voit
sur le web. Détails et pièges connus : `HANDOFF.md`.

## État

Pré-production : données locales de démonstration (pas encore de backend — c'est la
prochaine étape, avec les vrais comptes). Modules Devoirs/Examens/Bibliothèque/
Transport volontairement éteints (`core/src/features.js`) — le code reste prêt.

© Kogia Group · Tunisie
