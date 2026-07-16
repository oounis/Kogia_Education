# Performance — mesurer ce qui existe, préparer ce qui viendra

## Aujourd'hui : il n'y a pas de serveur — donc pas de latence d'API à mesurer

Ce serait un test de théâtre. Ce qui existe et qui **compte réellement pour
l'utilisateur** aujourd'hui, c'est ce que son navigateur télécharge et exécute.

### Ce qu'on mesure maintenant

| Indicateur | Valeur au 2026-07-15 | Seuil | État |
|---|---|---|---|
| Poids du bundle (gzip) | **371 Ko à la première visite** (code-splitting 2026-07-15 : 45 pages à la demande ; ~207 Ko de tronc commun restent extractibles) | < 400 Ko souhaitable | ✅ **Atteint** |
| Bundle brut | ~2,7 Mo | — | 🔴 |
| Découpage du code | **aucun** (un seul fichier pour toute l'application) | par route | ❌ À faire |
| Temps de build | ~1,5 s | < 30 s | ✅ |

**Le diagnostic honnête :** l'application charge **tout** — l'évaluation, la
paie, la comptabilité, les graphiques, le PDF — avant d'afficher la page de
connexion. Sur un téléphone tunisien en 3G, c'est plusieurs secondes de trop.

**Le chantier :** `React.lazy` par route + séparer `recharts` et `jspdf`
(les deux plus gros passagers, utiles seulement sur quelques écrans).

### Ce qui est déjà correct

- Polices **auto-hébergées** (aucun appel à un CDN externe, aucune fuite vers Google).
- Images des pièces **compressées avant stockage** (1400 px, JPEG).
- Aucune dépendance de graphique dupliquée entre web et mobile (cœur partagé).

## Le jour où le backend existe — le plan de charge

| Test | Cible | Outil prévu |
|---|---|---|
| Latence API (p95) | < 300 ms | k6 / autocannon |
| Charge nominale | 1 école, 50 utilisateurs simultanés (un appel du matin : tous les enseignants en même temps) | k6 |
| **Le pic réel du métier** | **08:00 — 20 enseignants font l'appel dans la même minute**, et 200 parents ouvrent l'application en même temps | k6 |
| Stress | Jusqu'à rupture, pour connaître le point de bascule | k6 |
| Endurance | 24 h à charge nominale (fuites mémoire) | k6 |
| Restauration | Temps de retour après coupure de la base | manuel |

**Le scénario qui compte n'est pas « 10 000 utilisateurs »** — c'est
**« 8h00 du matin, une école entière fait l'appel »**. Une école de 300 élèves
qui plante à la première minute de la journée n'a pas besoin d'un ERP qui tient
10 000 utilisateurs théoriques.
