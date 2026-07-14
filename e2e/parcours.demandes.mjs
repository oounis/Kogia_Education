// LE TRAVAIL SUIT LA SIGNATURE : approbation à deux niveaux → assignation avec
// échéance → clôture avec un mot → trace « qui a fait quoi » → bilan du mois.
import { scenario } from './lib.mjs'

await scenario(8982, async ({ page, ok, login, base }) => {
  await login('admin@alnour.tn', 'office')                         // niveau 0 du circuit
  await page.goto(`${base}/#/app/requests`); await page.waitForTimeout(600)
  await page.getByText('Attestation de salaire').first().click(); await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Approuver' }).click(); await page.waitForTimeout(500)

  await login('direction@alnour.tn', 'admin')                      // niveau 1, puis le travail
  await page.goto(`${base}/#/app/requests`); await page.waitForTimeout(600)
  await page.getByText('Attestation de salaire').first().click(); await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Approuver' }).click(); await page.waitForTimeout(600)
  await page.getByText('Attestation de salaire').first().click(); await page.waitForTimeout(400)
  await page.locator('select').last().selectOption({ index: 2 })
  await page.getByRole('button', { name: 'Assigner' }).click(); await page.waitForTimeout(500)
  ok(await page.getByText(/Confié à/).count() >= 1, 'travail confié')
  await page.getByPlaceholder('Réparé, acheté, remis en main propre…').fill('Attestation signée et remise.')
  await page.getByRole('button', { name: 'Clôturer' }).click(); await page.waitForTimeout(500)
  ok(await page.getByText('Clôturée').count() >= 1, 'clôturée')
  await page.getByText('Attestation de salaire').first().click(); await page.waitForTimeout(400)
  ok(await page.getByText('Qui a fait quoi').count() === 1, 'la trace est là')
  ok(await page.getByText('a assigné').count() >= 1 && await page.getByText('a clôturé').count() >= 1, 'trace complète')
  await page.keyboard.press('Escape'); await page.waitForTimeout(300)
  await page.getByRole('button', { name: /Bilan du mois/ }).click(); await page.waitForTimeout(500)
  ok(await page.getByText('Documents').count() >= 1, 'bilan : la catégorie est comptée')
})
