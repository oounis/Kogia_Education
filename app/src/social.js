// ── Espace parents : logique des événements proposés par les parents ────────
//
// Un parent propose une sortie (match de football, atelier danse, café des parents…).
// Les autres parents s'inscrivent pendant une fenêtre de 24 h. Si le quorum est
// atteint, la proposition part à la Direction, qui approuve et réserve le lieu.
//
// Les règles ci-dessous sont celles des plateformes qui font ça pour de vrai
// (Spond, Meetup, Playo, Eventbrite) :
//
//  • QUORUM + ÉCHÉANCE. On fixe un minimum de participants et une date limite
//    d'inscription. Passée l'échéance sans le quorum, l'événement est annulé
//    automatiquement et personne ne doit rien : c'est le « minimum players /
//    auto-cancel » de Spond et Playo.
//  • CONSENTEMENT AU PRIX AVANT L'INSCRIPTION. Le prix par personne est affiché
//    sur la carte ET dans la boîte d'inscription, et le parent doit cocher
//    « J'ai compris que ma participation coûte X DT » pour pouvoir s'inscrire.
//    On enregistre le montant accepté et l'horodatage : c'est cette trace qui
//    évite qu'un parent arrive au terrain en croyant que c'est gratuit.
//    Si l'organisateur change le prix après coup, tous les consentements sautent
//    et chacun doit re-confirmer (sinon on lui aurait fait accepter un autre prix).
//  • ON NE PRÉLÈVE RIEN DANS L'APPLICATION. Le parent s'engage (« pledge »),
//    et l'argent est encaissé par l'administration — exactement comme les frais
//    de scolarité : le parent signale, l'administration confirme. Jamais l'inverse.
//  • DÉLAI DE RÉSERVATION. Un lieu scolaire se réserve à l'avance : on impose
//    3 jours francs entre la proposition et l'événement, pour laisser le temps
//    des inscriptions (24 h) puis de la décision de la Direction.
//  • ANNULATION. Quorum manqué, refus de la Direction, ou annulation par
//    l'organisateur : dans les trois cas, aucun paiement n'est dû.

export const MIN_LEAD_DAYS = 3        // délai minimum entre la proposition et l'événement
export const RSVP_WINDOW_H = 24       // fenêtre d'inscription
export const DEFAULT_MIN = 8          // quorum par défaut (un match de foot : 8 joueurs)
export const CANCEL_WINDOW_H = 48     // au-delà, un désistement est « tardif »

// Le libellé du bouton d'inscription doit ÉNONCER l'obligation de payer — un simple
// « Confirmer » ne suffit pas, même quand le paiement est conditionnel (directive
// européenne 2011/83 art. 8(2) ; CJUE C-249/21 Fuhrmann, C-400/22 Conny). On garde
// la même exigence ici : c'est aussi la meilleure protection contre le parent qui
// arrive au terrain en pensant que c'est gratuit.
export const joinButtonLabel = ev => (ev.pricePerPerson || 0) > 0
  ? `Réserver ma place — ${ev.pricePerPerson} DT si confirmé`
  : 'Réserver ma place — gratuit'

// ── États ───────────────────────────────────────────────────────────────────
// collecte   : inscriptions ouvertes, quorum pas encore atteint
// quorum     : quorum atteint, inscriptions toujours ouvertes jusqu'à l'échéance
// soumis     : envoyé à la Direction, en attente de décision
// approuve   : validé, lieu réservé, ajouté au calendrier de l'école
// refuse     : refusé par la Direction (motif obligatoire)
// annule     : annulé par l'organisateur
// echoue     : échéance passée sans le quorum → annulation automatique
// termine    : la date est passée
export const STATES = {
  collecte: { label: 'Inscriptions ouvertes', color: '#0E7FB8' },
  quorum:   { label: 'Quorum atteint',        color: '#12946F' },
  soumis:   { label: 'En attente de la Direction', color: '#C97C1E' },
  approuve: { label: 'Approuvé',              color: '#12946F' },
  refuse:   { label: 'Refusé',                color: '#DC4B54' },
  annule:   { label: 'Annulé',                color: '#94A3B8' },
  echoue:   { label: 'Quorum non atteint',    color: '#94A3B8' },
  termine:  { label: 'Terminé',               color: '#94A3B8' },
}
export const isLive = s => s === 'collecte' || s === 'quorum'
export const isDead = s => s === 'refuse' || s === 'annule' || s === 'echoue'

// ── Catégories, mixité, enfants ─────────────────────────────────────────────
export const CATEGORIES = [
  { k: 'sport',      label: 'Sport',            icon: '⚽' },
  { k: 'atelier',    label: 'Atelier',          icon: '🎨' },
  { k: 'sortie',     label: 'Sortie',           icon: '🚌' },
  { k: 'rencontre',  label: 'Rencontre',        icon: '☕' },
  { k: 'solidarite', label: 'Solidarité',       icon: '🤝' },
  { k: 'fete',       label: 'Fête',             icon: '🎉' },
]

// Mixité. En Tunisie, une activité « réservée aux mères » est courante et se dit
// simplement ainsi. On parle des PARENTS (mères / pères), pas d'un genre abstrait :
// c'est plus clair, plus respectueux, et cohérent avec le fait que cet espace est
// réservé aux parents de l'école. Une activité mixte reste le défaut.
// On dit « réservé aux… » (désigné) plutôt que « interdit aux… » (barré) : même
// règle, formulation respectueuse. Mixte est le défaut, et une activité non mixte
// exige un motif — pour qu'elle réponde à un besoin réel (confort, sport, garde)
// et non à une exclusion, ce que la Constitution tunisienne (art. 21) et la loi
// de 2018 contre les discriminations invitent à prendre au sérieux.
// `restricted` s'accorde avec « activité » (féminin) : « réservée aux mères ».
export const AUDIENCES = [
  { k: 'mixte',  label: 'Mixte — tous les parents', short: 'Mixte', gender: null,    restricted: null },
  { k: 'meres',  label: 'Réservé aux mères',        short: 'Mères', gender: 'Femme', restricted: 'réservée aux mères' },
  { k: 'peres',  label: 'Réservé aux pères',        short: 'Pères', gender: 'Homme', restricted: 'réservée aux pères' },
]
export const audienceOf = k => AUDIENCES.find(a => a.k === k) || AUDIENCES[0]
export const needsReason = k => !!audienceOf(k).gender

// Les enfants : la question que tout parent se pose avant de dire oui.
export const KIDS = [
  { k: 'bienvenus', label: 'Enfants bienvenus',        hint: 'Vous pouvez venir avec vos enfants.' },
  { k: 'sans',      label: 'Sans les enfants',         hint: 'Activité réservée aux adultes — merci de ne pas amener les enfants.' },
  { k: 'garde',     label: 'Garde d’enfants prévue',   hint: 'Une garde est organisée sur place pendant l’activité.' },
  { k: 'pour',      label: 'Pour les enfants',         hint: 'L’activité est destinée aux enfants, accompagnés d’un parent.' },
]
export const kidsOf = k => KIDS.find(x => x.k === k) || KIDS[0]

export const PLACES = ['Terrain de football', 'Cour de l’école', 'Gymnase', 'Salle polyvalente', 'Salle de classe', 'Bibliothèque', 'Extérieur (hors école)']

// ── Règles de date ──────────────────────────────────────────────────────────
const DAY = 86400000
export const addDays = (d, n) => new Date(d.getTime() + n * DAY)

// La date la plus proche autorisée pour un événement (aujourd'hui + 3 jours).
export function earliestDate(now) {
  const d = addDays(now, MIN_LEAD_DAYS)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
// Échéance d'inscription : 24 h après la proposition, sans jamais dépasser la veille
// de l'événement (on doit laisser à la Direction le temps de décider).
export function rsvpDeadline(createdAt, dateISO) {
  const window = createdAt + RSVP_WINDOW_H * 3600000
  const eve = new Date(dateISO + 'T00:00:00').getTime() - DAY
  return Math.min(window, eve)
}
export const deadlinePassed = (ev, now = Date.now()) => now >= rsvpDeadline(ev.at, ev.date)

// ── Participants ────────────────────────────────────────────────────────────
// Un participant : { userId, name, rsvp:'oui'|'peut-etre', adults, children,
//                    priceAgreedPerPerson, amountAgreed, agreedAt, waitlisted }
// Seul « oui » compte pour le quorum et pour la capacité — « peut-être » est un
// signal, pas un engagement (c'est la convention de Spond, Bloomz, TeamSnap).
const going = ev => (ev.participants || []).filter(p => p.rsvp === 'oui' && !p.waitlisted)
export const goingList = going
export const maybeList = ev => (ev.participants || []).filter(p => p.rsvp === 'peut-etre')
export const waitlist = ev => (ev.participants || []).filter(p => p.waitlisted)

// On compte les têtes, pas les inscriptions : un parent qui vient avec 2 enfants
// occupe 3 places. Adultes et enfants sont comptés séparément (modèle ParentSquare).
export const headsOf = p => Math.max(1, p.adults || 1) + Math.max(0, p.children || 0)
export const goingCount = ev => going(ev).reduce((n, p) => n + headsOf(p), 0)
export const adultCount = ev => going(ev).reduce((n, p) => n + Math.max(1, p.adults || 1), 0)
export const childCount = ev => going(ev).reduce((n, p) => n + Math.max(0, p.children || 0), 0)

export const seatsLeft = ev => (ev.maxParticipants ? Math.max(0, ev.maxParticipants - goingCount(ev)) : null)
export const isFull = ev => ev.maxParticipants ? goingCount(ev) >= ev.maxParticipants : false
export const hasJoined = (ev, userId) => (ev.participants || []).some(p => p.userId === userId)
export const participantOf = (ev, userId) => (ev.participants || []).find(p => p.userId === userId)
// Le quorum se mesure en ADULTES : huit joueurs de football, pas huit poussettes.
export const quorumReached = ev => adultCount(ev) >= (ev.minParticipants || DEFAULT_MIN)
export const missingForQuorum = ev => Math.max(0, (ev.minParticipants || DEFAULT_MIN) - adultCount(ev))

// Un parent peut-il rejoindre ? Renvoie null si oui, sinon la raison (affichée telle quelle).
export function joinBlockedReason(ev, user) {
  if (!isLive(ev.status)) return "Les inscriptions sont closes."
  if (deadlinePassed(ev)) return "La date limite d'inscription est passée."
  if (hasJoined(ev, user.id)) return null
  const aud = audienceOf(ev.audience)
  if (aud.gender) {
    if (!user.gender) return `Activité ${aud.restricted} — renseignez votre civilité dans votre profil pour vous inscrire.`
    if (user.gender !== aud.gender) return `Activité ${aud.restricted}.`
  }
  return null   // complet → on n'interdit pas, on met en liste d'attente
}

// Le total qu'un parent s'engage à payer : une place par tête présente.
export const amountFor = (ev, adults = 1, children = 0) =>
  (ev.pricePerPerson || 0) * (Math.max(1, adults) + Math.max(0, children))

// Quand une place se libère, le premier de la liste d'attente est promu (FIFO).
export function promoteFromWaitlist(ev) {
  const promoted = []
  for (const p of (ev.participants || [])) {
    if (!p.waitlisted) continue
    if (ev.maxParticipants && goingCount(ev) + headsOf(p) > ev.maxParticipants) break
    p.waitlisted = false
    promoted.push(p)
  }
  return promoted
}

// Un désistement tardif (moins de 48 h avant) prive l'organisateur d'une place
// qu'il ne pourra plus remplir : on le signale, sans le bloquer.
export const isLateWithdrawal = (ev, now = Date.now()) =>
  new Date(ev.date + 'T00:00:00').getTime() - now < CANCEL_WINDOW_H * 3600000

// La Direction ne doit pas réserver un lieu déjà pris ce jour-là par l'école.
export function facilityClash(ev, schoolEvents = []) {
  if (!ev.place || ev.place.startsWith('Extérieur')) return null
  return schoolEvents.find(e => e.date === ev.date && e.place && e.place.trim().toLowerCase() === ev.place.trim().toLowerCase()) || null
}

// Le consentement d'un participant est-il toujours valable ? Si l'organisateur a
// changé le prix depuis, non : il faut re-confirmer le nouveau montant. On ne peut
// pas faire payer à quelqu'un un prix qu'il n'a jamais accepté.
export const consentStale = (ev, p) => (ev.pricePerPerson || 0) !== (p.priceAgreedPerPerson ?? 0)

// ── Transitions automatiques ────────────────────────────────────────────────
// Appelée à l'affichage : fait avancer les événements que le temps a rattrapés.
// Renvoie la liste des changements pour que l'appelant puisse notifier.
export function sweep(events, now = Date.now()) {
  const changes = []
  for (const ev of events) {
    if (isDead(ev.status) || ev.status === 'termine') continue
    const past = new Date(ev.date + 'T23:59:59').getTime() < now
    if (ev.status === 'approuve' && past) { ev.status = 'termine'; changes.push({ ev, to: 'termine' }); continue }
    if (isLive(ev.status) && deadlinePassed(ev, now)) {
      if (quorumReached(ev)) { ev.status = 'soumis'; ev.submittedAt = now; changes.push({ ev, to: 'soumis' }) }
      else { ev.status = 'echoue'; changes.push({ ev, to: 'echoue' }) }
      continue
    }
    if (isLive(ev.status)) {
      const next = quorumReached(ev) ? 'quorum' : 'collecte'
      if (next !== ev.status) { ev.status = next; changes.push({ ev, to: next }) }
    }
    if ((ev.status === 'soumis' || ev.status === 'approuve') && past && ev.status !== 'termine') {
      ev.status = 'termine'; changes.push({ ev, to: 'termine' })
    }
  }
  return changes
}

// ── Catalogue d'activités ───────────────────────────────────────────────────
// Le titre n'est pas un champ libre : on choisit une activité, et tout le reste
// suit — catégorie, lieu, mixité, enfants, quorum, prix. Un parent qui veut un
// match de football ne devrait pas avoir à décider dans quelle « catégorie » il
// range son match, ni sur quel terrain il se joue.
export const IDEAS = [
  { title: 'Match de football entre pères',       cat: 'sport',      audience: 'peres', kids: 'sans',      place: 'Terrain de football', min: 10, price: 5,  desc: 'Deux équipes, une heure de jeu, bonne humeur garantie.', covers: 'la location du terrain et les arbitres' },
  { title: 'Atelier danse entre mères',           cat: 'atelier',    audience: 'meres', kids: 'garde',     place: 'Salle polyvalente',   min: 8,  price: 8,  desc: 'Une heure de danse avec une intervenante. Une garde d’enfants est organisée sur place.', covers: 'l’intervenante et la garde d’enfants' },
  { title: 'Café des parents',                    cat: 'rencontre',  audience: 'mixte', kids: 'bienvenus', place: 'Bibliothèque',        min: 6,  price: 0,  desc: 'Un moment simple pour se rencontrer autour d’un café. Gratuit.' },
  { title: 'Tournoi de pétanque',                 cat: 'sport',      audience: 'mixte', kids: 'bienvenus', place: 'Cour de l’école',     min: 8,  price: 3,  desc: 'Doublettes tirées au sort.', covers: 'les boissons' },
  { title: 'Journée propreté du jardin',          cat: 'solidarite', audience: 'mixte', kids: 'bienvenus', place: 'Cour de l’école',     min: 6,  price: 0,  desc: 'On remet le jardin de l’école en état, ensemble. Apportez des gants.' },
  { title: 'Atelier cuisine tunisienne',          cat: 'atelier',    audience: 'mixte', kids: 'sans',      place: 'Salle polyvalente',   min: 8,  price: 12, desc: 'On cuisine et on partage le repas.', covers: 'les ingrédients' },
  { title: 'Sortie randonnée familiale',          cat: 'sortie',     audience: 'mixte', kids: 'pour',      place: 'Extérieur (hors école)', min: 10, price: 6, desc: 'Randonnée facile, adaptée aux enfants.', covers: 'le transport' },
  { title: 'Tournoi d’échecs parents–enfants',    cat: 'sport',      audience: 'mixte', kids: 'pour',      place: 'Bibliothèque',        min: 6,  price: 0,  desc: 'Chaque enfant joue avec un parent. Gratuit, échiquiers fournis.' },
  { title: 'Fête de fin d’année des parents',     cat: 'fete',       audience: 'mixte', kids: 'bienvenus', place: 'Cour de l’école',     min: 15, price: 10, desc: 'Chacun apporte un plat.', covers: 'la sono et la décoration' },
  { title: 'Séance de yoga entre mères',          cat: 'atelier',    audience: 'meres', kids: 'garde',     place: 'Gymnase',             min: 8,  price: 7,  desc: 'Une heure de yoga doux avec une professeure. Tapis fournis.', covers: 'la professeure et la garde d’enfants' },
  { title: 'Tournoi de volley-ball',              cat: 'sport',      audience: 'mixte', kids: 'bienvenus', place: 'Cour de l’école',     min: 12, price: 3,  desc: 'Équipes mixtes tirées au sort, deux terrains.', covers: 'les filets et les ballons' },
  { title: 'Basket entre parents',                cat: 'sport',      audience: 'mixte', kids: 'sans',      place: 'Gymnase',             min: 10, price: 4,  desc: 'Match amical, cinq contre cinq.', covers: 'la location du gymnase' },
  { title: 'Atelier lecture pour les enfants',    cat: 'atelier',    audience: 'mixte', kids: 'pour',      place: 'Bibliothèque',        min: 6,  price: 0,  desc: 'Des parents lisent des histoires aux enfants.' },
  { title: 'Match de football entre mères',       cat: 'sport',      audience: 'meres', kids: 'garde',     place: 'Terrain de football', min: 10, price: 5,  desc: 'Deux équipes, une heure de jeu. Garde d’enfants sur place.', covers: 'la location du terrain et la garde d’enfants' },
]
// index par titre : le titre choisi remplit tout le formulaire
export const ideaByTitle = t => IDEAS.find(i => i.title === t) || null
export const IDEAS_BY_CAT = CATEGORIES.map(c => ({ ...c, items: IDEAS.filter(i => i.cat === c.k) })).filter(g => g.items.length)
