// Mots de passe : scrypt + sel, comparaison à temps constant. Partagé entre
// le serveur et le script d'import — le SEUL endroit qui touche un hachage.
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export const hashPw = (pw, salt = randomBytes(16).toString('hex')) =>
  salt + ':' + scryptSync(String(pw), salt, 32).toString('hex')

export const checkPw = (pw, stored) => {
  const [salt, hex] = String(stored || '').split(':')
  if (!salt || !hex) return false
  const a = scryptSync(String(pw), salt, 32), b = Buffer.from(hex, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}
