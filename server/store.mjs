// ── Le magasin du serveur : des fichiers JSON, écrits ATOMIQUEMENT ──────────
// Pilote v1 : une école = un blob + un registre d'authentification. L'écriture
// passe par un fichier temporaire puis un rename (atomique sur un même volume) :
// une coupure de courant laisse l'ancienne version, jamais un fichier à moitié.
// Les sauvegardes sont des copies datées, conservées 30 — et testables.
import { readFileSync, writeFileSync, renameSync, mkdirSync, readdirSync, copyFileSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function makeStore(dataDir) {
  mkdirSync(dataDir, { recursive: true })
  mkdirSync(join(dataDir, 'backups'), { recursive: true })
  const fileOf = name => join(dataDir, name + '.json')

  const read = (name, fallback) => {
    try { return JSON.parse(readFileSync(fileOf(name), 'utf8')) } catch { return fallback }
  }
  const write = (name, value) => {
    const tmp = fileOf(name) + '.tmp'
    writeFileSync(tmp, JSON.stringify(value))
    renameSync(tmp, fileOf(name))
  }

  const backup = () => {
    if (!existsSync(fileOf('school'))) return null
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')
    const dest = join(dataDir, 'backups', `school-${stamp}.json`)
    copyFileSync(fileOf('school'), dest)
    // rotation : on garde les 30 plus récentes
    const all = readdirSync(join(dataDir, 'backups')).filter(f => f.startsWith('school-')).sort()
    for (const f of all.slice(0, Math.max(0, all.length - 30))) unlinkSync(join(dataDir, 'backups', f))
    return dest
  }

  return { read, write, backup }
}
