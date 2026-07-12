// Notifications — port natif de app/src/pages/Notifications.jsx (+ NotifItem.jsx).
// Boîte de réception via core/notify.js ; un appui marque lu puis suit le lien
// (passé par safeLink : jamais vers une page interdite au rôle, comme le web).
import { useState, useReducer } from 'react'
import { View, Text, Pressable } from 'react-native'
import { inboxFor, markRead, markAllRead } from '@core/notify.js'
import { safeLink } from '@core/access.js'
import { ROLE } from '@core/theme.js'
import { Screen, Card, Chip, Avatar, EmptyState, C } from '../components.js'
import { Ic } from '../icons.js'

// Mêmes teintes par nature que le web (NotifItem.jsx / STATUS de ui.jsx).
const KIND = {
  request: { tint: '#0E7FB8', icon: 'FileText' },
  incident: { tint: '#DC4B54', icon: 'ShieldAlert' },
  payment: { tint: '#C97C1E', icon: 'CreditCard' },
  notice: { tint: '#7539E4', icon: 'Megaphone' },
  message: { tint: '#12946F', icon: 'MessageSquare' },
  evaluation: { tint: '#8B5CF6', icon: 'Star' },
  info: { tint: '#94A3B8', icon: 'CalendarCheck' },
}

const ago = at => {
  const m = Math.round((Date.now() - at) / 60000)
  if (m < 1) return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `il y a ${h} h`
  return `il y a ${Math.round(h / 24)} j`
}

// Équivalents locaux de isToday / isThisWeek (date-fns : semaine débutant dimanche).
const isToday = at => {
  const d = new Date(at), n = new Date()
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
}
const isThisWeek = at => {
  const n = new Date()
  const start = new Date(n.getFullYear(), n.getMonth(), n.getDate() - n.getDay()).getTime()
  return at >= start && at < start + 7 * 86400000
}

function NotifRow({ n, accent, soft, last, onPress }) {
  const k = KIND[n.kind] || KIND.info
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
      paddingVertical: 12, paddingHorizontal: 10, borderRadius: 14,
      backgroundColor: n.read ? 'transparent' : soft,
      borderBottomWidth: last ? 0 : 1, borderBottomColor: C.line,
      opacity: pressed ? 0.7 : 1,
    })}>
      <View>
        {n.actor
          ? <Avatar name={n.actor} size={44} color={k.tint} />
          : <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: k.tint, alignItems: 'center', justifyContent: 'center' }}>
              <Ic n={k.icon} size={18} color="#fff" />
            </View>}
        {!!n.actor && (
          <View style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: k.tint, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
            <Ic n={k.icon} size={10} color="#fff" />
          </View>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 14, color: C.ink, lineHeight: 19 }}>
          {!!n.actor && <Text style={{ fontWeight: '800' }}>{n.actor} </Text>}
          <Text style={{ color: n.actor ? C.muted : C.ink }}>{n.title}</Text>
        </Text>
        {!!n.body && <Text numberOfLines={1} style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{n.body}</Text>}
        <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 2, color: n.read ? '#94A3B8' : accent }}>{ago(n.at)}</Text>
      </View>
      {!n.read && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: accent, marginTop: 6 }} />}
    </Pressable>
  )
}

export default function Notifications({ user, params, nav }) {
  const u = user
  const [, force] = useReducer(x => x + 1, 0)
  const [tab, setTab] = useState('all')
  const r = ROLE[u.role] || ROLE.admin
  const accent = r.color, soft = r.soft

  const inbox = inboxFor(u)
  const unread = inbox.filter(n => !n.read).length
  let all = inbox
  if (tab === 'unread') all = all.filter(n => !n.read)
  const today = all.filter(n => isToday(n.at))
  const week = all.filter(n => !isToday(n.at) && isThisWeek(n.at))
  const older = all.filter(n => !isThisWeek(n.at))

  const open = n => {
    markRead(n.id)
    force()
    if (n.link) {
      const to = safeLink(u.role, n.link)
      if (to !== '/app/notifications') nav.navigate(to)
    }
  }

  const Group = ({ title, items }) => items.length > 0 && (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: 6, marginLeft: 4 }}>{title}</Text>
      <Card style={{ paddingVertical: 4, paddingHorizontal: 6 }}>
        {items.map((n, i) => <NotifRow key={n.id} n={n} accent={accent} soft={soft} last={i === items.length - 1} onPress={() => open(n)} />)}
      </Card>
    </View>
  )

  return (
    <Screen title="Notifications" sub={`${unread} non lues`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <Chip label="Toutes" color={accent} active={tab === 'all'} onPress={() => setTab('all')} />
        <Chip label={`Non lues${unread ? ` (${unread})` : ''}`} color={accent} active={tab === 'unread'} onPress={() => setTab('unread')} />
        <Pressable onPress={() => { markAllRead(u); force() }}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto', opacity: pressed ? 0.7 : 1 })}>
          <Ic n="CheckCheck" size={14} color={accent} />
          <Text style={{ color: accent, fontWeight: '800', fontSize: 12 }}>Tout marquer comme lu</Text>
        </Pressable>
      </View>

      {all.length === 0 && (
        <Card>
          <EmptyState icon="Bell" title="Vous êtes à jour"
            sub={tab === 'unread' ? 'Aucune notification non lue.' : 'Aucune notification pour le moment.'} />
        </Card>
      )}

      <Group title="Aujourd'hui" items={today} />
      <Group title="Cette semaine" items={week} />
      <Group title="Plus tôt" items={older} />
    </Screen>
  )
}
