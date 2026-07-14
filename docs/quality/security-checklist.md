# Sécurité — ce qui est vrai aujourd'hui, sans enjoliver

> **Le produit N'EST PAS PRÊT à recevoir les données réelles d'une école.**
> Ce n'est pas une opinion prudente : c'est une conséquence directe de
> l'architecture actuelle (tout vit dans le navigateur, il n'y a pas de serveur).
> Cette page dit exactement pourquoi, pour qu'aucune vente ne se fasse dans le flou.

## 🔴 Les failles CONNUES qui bloquent la première vraie école

| Faille | Réalité | Conséquence |
|---|---|---|
| **Mots de passe en clair** | Ils sont dans `localStorage`, lisibles en trois secondes dans la console | Toute personne ayant accès à l'ordinateur d'un enseignant a tous les comptes |
| **Le rôle est côté client** | `role: 'parent'` est une donnée du navigateur | Un parent peut se donner le rôle « direction » — escalade triviale |
| **Aucune authentification serveur** | Il n'y a pas de serveur | Aucune session, aucun jeton, aucune expiration |
| **Connexion de démonstration en un clic** | Boutons de rôle sur l'écran de connexion | Acceptable en démo, **inacceptable** avec de vraies données |
| **Données d'enfants non chiffrées** | Santé, vaccins, personnes autorisées, accidents — en clair dans le navigateur | Données **sensibles** au sens du RGPD et de la loi tunisienne (INPDP) |
| **Pièces jointes non analysées** | Aucun antivirus, aucune validation de contenu au-delà du type et de la taille | Un fichier malveillant peut être déposé |

**➡️ Verrou explicite : aucune école réelle ne met ses données ici avant le
backend.** Voir `production-readiness-checklist.md`.

## ✅ Ce qui est DÉJÀ tenu (et testé)

- **Refus par défaut** : `core/src/access.js` — une route inconnue est refusée,
  jamais autorisée par omission. **Testé** (`canAccess('admin', '/route-inconnue') === false`).
- **Cloisonnement par rôle** : un enseignant ne voit pas les paiements ; un
  parent ne voit pas les évaluations d'un autre enfant. **Testé**.
- **Fuite entre familles corrigée** : une notification de rôle est restreinte à
  la classe concernée (`notify.js` → `reaches()`).
- **Séparation des pouvoirs** : personne ne valide sa propre demande ; deux
  paires d'yeux sur un accident. **Testé**.
- **Aucun secret dans le dépôt** : les identifiants vivent hors des dépôts
  publics (`_Private/Kogia/`). Les dépôts `coreon-edu` et `kogia-group` sont
  publics — **rien de sensible n'y entre**.
- **Audit des dépendances** à chaque CI (`npm audit --audit-level=high`).
- **Pièces jointes** : type et taille contrôlés, images ré-encodées (une
  ré-encodage JPEG neutralise la plupart des charges utiles cachées dans une image).

## Le jour où le backend existe — la liste à exécuter

- [ ] Mots de passe : `argon2id` (jamais `md5`/`sha1`, jamais en clair).
- [ ] Sessions : jeton signé, expiration, révocation.
- [ ] **Le rôle est décidé par le serveur**, jamais par le client.
- [ ] Autorisation vérifiée **à chaque requête** (pas seulement à l'écran).
- [ ] HTTPS partout (déjà le cas sur le site), en-têtes de sécurité (CSP, HSTS).
- [ ] Chiffrement au repos des données de santé et des pièces jointes.
- [ ] Antivirus sur les fichiers déposés.
- [ ] Journal d'audit **inaltérable** (qui a lu le dossier médical d'un enfant ?).
- [ ] Limitation de débit sur la connexion et la pré-inscription publique.
- [ ] Conformité **INPDP** (Tunisie) et **RGPD** (France) : registre, durées de
      conservation, droit à l'export (déjà tenu : OneRoster), droit à l'effacement.
- [ ] Test d'intrusion externe avant la première école.
