// Table route → écran natif. Même clés que le web (nav.js / access.js).
// Un écran absent d'ici s'affiche « Bientôt sur mobile » (Shell.js) — la barre
// et le menu Plus listent TOUT le menu du rôle, comme le web.
import Dashboard from './screens/Dashboard.js'
import Live from './screens/Live.js'
import Social from './screens/Social.js'
import Events from './screens/Events.js'
import Messages from './screens/Messages.js'
import Notices from './screens/Notices.js'
import Notifications from './screens/Notifications.js'
import Payments from './screens/Payments.js'
import Bulletin from './screens/Bulletin.js'
import Evaluate from './screens/Evaluate.js'
import Attendance from './screens/Attendance.js'
import Timetable from './screens/Timetable.js'
import Pointage from './screens/Pointage.js'

export const SCREENS = {
  '/app': Dashboard,
  '/app/live': Live,
  '/app/social': Social,
  '/app/events': Events,
  '/app/messages': Messages,
  '/app/notices': Notices,
  '/app/notifications': Notifications,
  '/app/payments': Payments,
  '/app/evaluate': Evaluate,
  '/app/attendance': Attendance,
  '/app/timetable': Timetable,
  '/app/pointage': Pointage,
  // Écrans mobiles sans route web directe (préfixe ~ : pas de garde d'accès web)
  '~bulletin': Bulletin,
}
