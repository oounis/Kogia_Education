// Annonces — port natif de app/src/pages/Notices.jsx.
// Fil des communications de l'école ; la Direction et l'Administration publient
// (mêmes rôles que le web), les autres lisent ce qui vise leur rôle ou leur compte.
import { useState, useReducer } from 'react'
import { View, Text } from 'react-native'
import { db } from '@core/db.js'
import { notify } from '@core/notify.js'
import { ROLE } from '@core/theme.js'
import { Screen, Card, Chip, Btn, Input, EmptyState, C } from '../components.js'
import { Ic } from '../icons.js'

const ago = at => {
  const m = Math.round((Date.now() - at) / 60000)
  if (m < 1) return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `il y a ${h} h`
  return `il y a ${Math.round(h / 24)} j`
}

const AUD_FR = { parent: 'aux parents', teacher: 'aux enseignants', supervisor: 'aux surveillants' }
const AUDIENCES = [['parent', 'Parents'], ['teacher', 'Enseignants'], ['supervisor', 'Surveillants']]
const BRAND = '#7539E4'

export default function Notices({ user, params, nav }) {
  const u = user
  const canPost = ['schooladmin', 'admin'].includes(u.role)
  const [, force] = useReducer(x => x + 1, 0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [aud, setAud] = useState('parent')
  const accent = ROLE[u.role]?.color || BRAND

  // Même filtre que le web : les annonces sont des notifications kind:'notice'.
  const feed = db().notifications.filter(n => n.kind === 'notice' && (n.role === u.role || n.to === u.id || canPost)).slice(0, 30)

  const post = () => {
    if (!title.trim()) return
    notify({ role: aud, kind: 'notice', title, body })
    setTitle(''); setBody('')
    force()
  }

  return (
    <Screen title="Annonces" sub="Communications de l'école">
      {canPost && (
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Ic n="Megaphone" size={18} color={accent} />
            <Text style={{ fontWeight: '800', color: C.ink, fontSize: 15 }}>Publier une annonce</Text>
          </View>
          <Input value={title} onChangeText={setTitle} placeholder="ex. École fermée vendredi" />
          <Input value={body} onChangeText={setBody} placeholder="Détails…" multiline
            style={{ marginTop: 10, minHeight: 70, textAlignVertical: 'top' }} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.muted, marginTop: 12, marginBottom: 8 }}>Destinataires</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {AUDIENCES.map(([value, label]) => (
              <Chip key={value} label={label} color={accent} active={aud === value} onPress={() => setAud(value)} />
            ))}
          </View>
          <View style={{ marginTop: 14 }}>
            <Btn label="Publier" icon="Megaphone" color={accent} onPress={post} disabled={!title.trim()} />
          </View>
        </Card>
      )}

      {feed.length ? feed.map(n => (
        <Card key={n.id} style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: BRAND + '1A', alignItems: 'center', justifyContent: 'center' }}>
            <Ic n="Megaphone" size={18} color={BRAND} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontWeight: '700', color: C.ink, fontSize: 14 }}>{n.title}</Text>
            {!!n.body && <Text style={{ color: C.muted, fontSize: 13, marginTop: 1 }}>{n.body}</Text>}
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{ago(n.at)} · {AUD_FR[n.role] || 'à vous'}</Text>
          </View>
        </Card>
      )) : (
        <Card>
          <EmptyState icon="Megaphone" title="Aucune annonce" sub="Les communications de l'école apparaîtront ici." />
        </Card>
      )}
    </Screen>
  )
}
