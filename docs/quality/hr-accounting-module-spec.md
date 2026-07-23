# RH & Comptabilité — ce que ces deux modules doivent vraiment être

_Rédigé le 2026-07-23, à la demande d'Othman : « pourquoi le compte Administration
a encore la compta et la RH ? et pourquoi ces 2 modules sont maigres ? fais une
vraie recherche de ce dont ils ont besoin, écris les notes, et commence à corriger. »_

Ce document fait trois choses : (1) il tranche **qui possède quoi** (la séparation
que CR-019 avait annoncée mais pas imposée) ; (2) il liste, recherche à l'appui, **ce
qu'un vrai module RH et un vrai module Comptabilité contiennent** ; (3) il pointe le
**gap** avec l'existant et propose un **séquencement**. Sources en fin de document.

---

## 1. Le constat (pourquoi ces notes)

- **Le compte Administration (`admin`) avait ENCORE tout l'argent et toute la RH.**
  `access.js`/`nav.js` donnaient à `admin` : `/app/hr`, `/app/staff`, `/app/recruit`,
  `/app/accounting`, `/app/finance`, `/app/budget`. La règle CR-016/020 dit pourtant :
  *« l'Administration PRÉPARE et enregistre ; jamais le même compte sur l'argent ou une
  action RH. »* La séparation n'existait que sur le papier. **Corrigé** (voir §2).
- **Les deux modules sont des squelettes.** Aujourd'hui :
  - RH (`core/src/hr.js`, 203 l.) : contrats CDI/CDD, congés (demande + 2 étapes +
    solde), paie (préparer/prime/valider/payer, retenue jours non travaillés).
  - Comptabilité (`core/src/accounting.js`, 233 l.) : barème par niveau, remises,
    `dueFor`, factures (émettre/annuler), reçus, encaissement, `financials()`. **Simple
    entrée.** Budget (`budget.js`) : dépenses + rapport mensuel.
  - C'est un bon départ, mais loin d'un ERP RH/Compta professionnel (Focus, ERPNext,
    NetSuite, Zoho, iSAMS).

---

## 2. Qui possède quoi (la séparation, désormais imposée)

Règle : **refus par défaut**, un domaine = un département propriétaire, la **Direction
approuve**, l'**Administration ne touche ni l'argent ni la RH**.

| Domaine | Propriétaire | Approuve | Ne doit PAS y toucher |
|---|---|---|---|
| RH, Personnel, Recrutement, Paie | **RH** (`hr`) | Direction (`schooladmin`) | Administration, Comptabilité |
| Comptabilité, Frais & Finances, Budget | **Comptabilité** (`accountant`) | Direction | Administration, RH |
| Admissions, Élèves, Présence, Documents, Journal | **Administration** (`admin`) | Direction | — |
| Décisions finales, comptes, paramètres | **Direction** (`schooladmin`) | — | — |

**Fait maintenant :** `admin` retiré de `/app/hr`, `/app/staff`, `/app/recruit`,
`/app/accounting`, `/app/finance`, `/app/budget` dans `access.js` **et** `nav.js`. La
démo a déjà les comptes dédiés `rh@alnour.tn` et `comptable@alnour.tn`. La Direction
garde tout (elle approuve) ; l'owner reste sur la console plateforme.

> **La suite de la séparation (à construire) :** le vrai contrôle interne est le
> **maker-checker** — celui qui saisit une paie ou une facture ne peut pas la valider ;
> c'est la Direction (ou un second rôle) qui approuve. Aujourd'hui `validatePayroll` et
> l'émission de facture ne vérifient pas que le validateur ≠ le préparateur. C'est le
> premier chantier de profondeur (voir §5).

---

## 3. Module RH — la cible

Structuré par sous-domaines (source : NetSuite, TechTarget, ERPNext/Frappe HR, Focus).

### 3.1 Dossier employé & cycle de vie
- **Fiche employé complète** : identité (→ CR-018 entité Personne), coordonnées,
  pièce d'identité par pays, poste, département, date d'entrée, manager, documents
  (contrat, diplômes, visa/permis — expiration **alertée**), photo.
- **Organigramme** (qui rapporte à qui) — aujourd'hui **absent**.
- **Cycle de vie** : onboarding (checklist d'arrivée) → mouvements (promotion,
  mutation, changement de salaire tracé) → **offboarding** (checklist de départ,
  restitution matériel, entretien de sortie, calcul du solde de tout compte).
- **Self-service employé** : demander un congé, voir son solde, télécharger sa fiche
  de paie, mettre à jour ses coordonnées — avec **workflow d'approbation**.

### 3.2 Temps & présence
- **Politiques de congés configurables** par pays/établissement (annuel, maladie,
  maternité, sans solde…), **jours fériés** tirés du calendrier local (déjà : `fetes.js`).
- **Soldes de congés** avec acquisition (accrual) mensuelle — aujourd'hui le solde est
  calculé mais **sans acquisition périodique paramétrable**.
- **Pointage** du personnel (arrivée/départ), heures supplémentaires, retards —
  le pointage élève/enseignant existe (`pointage`) ; **le pointage RH du personnel non
  enseignant reste à relier** à la paie.

### 3.3 Paie (le cœur, surtout pour le Golfe)
- **Structure de salaire multi-composants** : base + **indemnité logement** +
  **transport** + primes/indemnités variables (heures sup, astreinte). Aujourd'hui : un
  seul montant `salary`. **Gap majeur.** Le Golfe raisonne en composants, et la **base**
  sert de référence à la gratuité et aux cotisations.
- **Retenues** : cotisations sociales (nationaux GCC via GOSI/équiv.), avances,
  absences non justifiées (déjà : `unpaidDays`), assurance santé.
- **Bulletin de paie** détaillé (brut, retenues, net) — **imprimable**, aujourd'hui absent.
- **Fichier bancaire / WPS** (Wage Protection System) : virement électronique des
  salaires, exigé aux EAU/plusieurs pays du Golfe. **À prévoir** (comme l'export
  OneRoster : un bouton, un fichier standard).
- **Indemnité de fin de service (EOSB / gratuité)** : calcul automatique au départ selon
  la règle du pays et la **base** salariale. **Absent**, indispensable pour le Golfe.
- **Provisions** : la gratuité et les congés se **provisionnent** chaque mois (lien vers
  la Comptabilité, §4).

### 3.4 Recrutement
- Le pipeline existe (`recruit.js` : reçue→entretien→offre→embauchée, refus motivé).
  Manque : **passerelle vers l'onboarding** (un candidat embauché devient un employé
  sans ressaisie — même principe que candidature→élève).

### 3.5 Ce qui manque, résumé (RH)
Organigramme · dossier employé riche + alertes d'expiration de documents · onboarding/
offboarding · self-service · acquisition de congés · **salaire multi-composants** ·
**bulletin imprimable** · **WPS** · **EOSB/gratuité** · pointage personnel relié à la
paie · maker-checker sur la paie · provisions comptables.

---

## 4. Module Comptabilité — la cible

Structuré par sous-domaines (source : ERPNext/Tally GL, iSAMS, Vidyalaya, Edunext,
erpfocus, DualEntry).

### 4.1 Le socle comptable (ce qui fait « vrai ERP »)
- **Plan comptable** (chart of accounts) : l'ossature de tout rapport. **Absent** —
  aujourd'hui on additionne des recettes et des dépenses, il n'y a pas de comptes.
- **Partie double** : chaque opération = un débit et un crédit égaux. Aujourd'hui
  **simple entrée**. C'est **la** décision structurante (voir D-3 du plan des épics).
- **Journaux & pièces** (vouchers) : reçu, paiement, journal, opérations diverses,
  contra (caisse↔banque). Chaque écriture avec libellé et pièce jointe.
- **Grand livre par tiers** : un **ledger par élève** (créé à l'admission) et par
  fournisseur, retraçant toutes les opérations. Partiellement là côté élève (factures/
  reçus) mais pas formalisé en compte-tiers.
- **Balance, Bilan, Compte de résultat** : générés à la clôture ; débits = crédits.
  Aujourd'hui : un `financials()` sommaire, **pas de balance ni de bilan**.

### 4.2 Créances élèves (AR) — le plus développé aujourd'hui
- Barème par niveau ✅, remises tracées ✅, `dueFor` ✅, facture émise **immuable** ✅,
  avoir daté ✅, reçu à chaque encaissement ✅, méthodes de paiement ✅.
- Manque : **échéanciers** (paiement par tranches/trimestre), **relances** automatiques
  des impayés, **plans de paiement**, portail parent de paiement **en ligne** (passerelle
  régionale — bloqueur Golfe cité dans `gap-analysis.md`), **pénalités de retard**.

### 4.3 Dettes fournisseurs (AP) & achats
- **Fournisseurs**, **factures fournisseur**, **bons de commande**, paiements
  fournisseurs, échéances. **Absent** (le budget ne fait que des dépenses à plat).

### 4.4 Trésorerie & banque
- **Comptes de caisse/banque**, **rapprochement bancaire** (pointer relevé ↔ écritures),
  multi-devises (déjà : `currency.js`). **Absent.**

### 4.5 Reporting & clôture
- **Clôture de période** (un mois se ferme, on ne réécrit pas l'histoire) — **absent**,
  c'est un attribut « vrai ERP ».
- **TVA / taxe** : facturation avec taxe, déclaration — bloqueur Golfe (`gap-analysis.md`).
- **Budget vs réalisé**, tableaux de bord par dimension (établissement, niveau, période).

### 4.6 Ce qui manque, résumé (Compta)
**Plan comptable** · **partie double** · journaux/pièces · grand livre par tiers ·
**balance/bilan/résultat** · échéanciers + relances + paiement en ligne · **AP/achats/
fournisseurs** · **rapprochement bancaire** · **clôture de période** · **TVA** ·
budget vs réalisé · maker-checker sur l'émission et l'encaissement.

---

## 5. Séquencement proposé (du plus utile au plus lourd)

Aligné sur le principe « profondeur avant largeur » et sur le plan des épics ERP.

1. **Séparation imposée** — RH/Compta retirées à `admin`. ✅ **fait cette session.**
2. **Maker-checker** (RH + Compta) : préparateur ≠ validateur sur la paie et sur
   l'émission/annulation de facture. *Petit, fort signal ERP, faible risque.*
3. **RH — salaire multi-composants + bulletin imprimable.** *Débloque le Golfe côté paie.*
4. **Compta — plan comptable + grand livre par tiers** (même en gardant la simple entrée
   d'abord), puis **balance**. *Prépare la partie double sans tout casser.*
5. **Échéanciers + relances** (AR) : la douleur n°1 d'une école, très visible.
6. **EOSB/gratuité + WPS** (RH, Golfe) · **AP/fournisseurs** (Compta).
7. **Rapprochement bancaire · clôture de période · TVA · partie double complète** = V2
   « vrai ERP », après décision D-1/D-3 avec Othman.

Chaque étape est livrable seule, testée, sans casser la démo. Les étapes 6–7 dépendent
d'un marché signé (Golfe) et d'une décision produit (partie double).

---

## 6. Ce qui a été corrigé aujourd'hui vs ce qui reste

- ✅ **Fait** : la séparation d'accès (RH/Compta hors du compte Administration), dans
  `access.js` et `nav.js`, vérifiée par test.
- ⏭️ **À construire** : tout §5.2→§5.7. Ce sont des chantiers de module, à prendre un par
  un. Ce document est leur cahier des charges.

---

## 7. Sources

**RH / paie :**
- ERP HR module — key features — TechTarget — https://www.techtarget.com/searcherp/feature/The-ERP-HR-module-Key-features-explained
- Guide du module HR ERP — NetSuite — https://www.netsuite.com/portal/resource/articles/erp/erp-hr-module.shtml
- ERPNext HR & Payroll — Frappe — https://frappe.io/erpnext/erp-guide/human-resource-management
- Module RH & Paie — Focus Softnet — https://www.focussoftnet.com/us/human-resource-module
- Salaire multi-composants (base/logement/transport) GCC — QuickHCM — https://quickhcm.com/multi-component-salary-structures-gcc/
- Conformité paie & WPS/EOSB (Golfe) — PlugScale — https://www.plugscale.com/gcc-compliance-payroll-hr-operations
- Paie EAU / WPS — PayliteHR — https://www.paylitehr.com/blog/payroll-compliance-in-uae-the-ultimate-checklist/

**Comptabilité / finance :**
- Fonctionnalités module finance ERP — ERP Focus — https://www.erpfocus.com/erp-finance-module-features.html
- Grand livre dans un ERP — DualEntry — https://www.dualentry.com/blog/general-ledger-in-erp
- Logiciel comptable pour écoles — iSAMS — https://www.isams.com/platform/accounting-software-schools/
- Gestion financière école (ledgers/vouchers) — Vidyalaya — https://www.vidyalayaschoolsoftware.com/features/school-accounting-software-finance-management
- Comptabilité financière école (bilan, balance, résultat) — Edunext — https://edunexttechnologies.com/financial-accounting.php
- Rapprochement de comptes — Tipalti — https://tipalti.com/en-eu/resources/learn/account-reconciliation/
