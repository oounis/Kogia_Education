# La qualité chez Kogia — le dossier

Ce dossier n'est pas une déclaration d'intention. **Chaque affirmation qu'il
contient est soit exécutable par une commande, soit marquée comme une limite
assumée et datée.**

| Fichier | Ce qu'il répond |
|---|---|
| [testing-strategy.md](testing-strategy.md) | **Pourquoi** on teste comme ça — et le dossier de preuves (les défauts réels que seule l'exécution a trouvés) |
| [test-lifecycle.md](test-lifecycle.md) | **Quel test, à quel stade** — ce qui tourne aujourd'hui, ce qui attend une infrastructure |
| [test-plan.md](test-plan.md) | Les **9 règles** du produit et le test qui prouve chacune (**5 trous assumés**) |
| [smoke-test-checklist.md](smoke-test-checklist.md) | Smoke automatique, smoke de production, **sanity après correctif**, UI/UX |
| [regression-checklist.md](regression-checklist.md) | Chaque défaut réel et **le test qui l'empêche de revenir** |
| [security-checklist.md](security-checklist.md) | Les failles **connues** qui bloquent la première école, et ce qui est déjà tenu |
| [performance-plan.md](performance-plan.md) | Ce qu'on mesure (le bundle : **777 Ko, trop lourd**) et le plan de charge futur |
| [release-checklist.md](release-checklist.md) | Ce qui doit être vert **avant** une mise en ligne |
| [production-readiness-checklist.md](production-readiness-checklist.md) | 🔴 **Pourquoi aucune école réelle ne doit encore mettre ses données ici** |

## Les commandes

```bash
npm test --prefix core      # les règles du métier (19 tests d'exécution)
npm run build --prefix app  # le bundle
npm run all --prefix e2e    # parcours + smoke : 60 pages × 5 rôles sur le vrai bundle
```

**La CI (`.github/workflows/deploy.yml`) exécute les trois, dans cet ordre, et
refuse de déployer si l'un échoue.** Après la mise en ligne, elle interroge le
site réel (`smoke-prod`).
