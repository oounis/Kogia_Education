// La devise de l'école. `money()` est appelé partout en rendu (une page de
// comptabilité formate des centaines de montants) : il ne doit JAMAIS relire la
// base pour connaître la devise. On la garde en mémoire, posée au démarrage et à
// chaque enregistrement des paramètres (setCurrency). Défaut : le dinar tunisien.
let CUR = 'DT'
export const setCurrency = c => { CUR = (String(c || '').trim() || 'DT') }
export const currency = () => CUR
export const money = n => `${(n || 0).toLocaleString('fr-FR')} ${CUR}`
