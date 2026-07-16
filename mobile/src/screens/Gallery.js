// « Moments » — portage natif de app/src/pages/Gallery.jsx, côté PARENT.
// Le parent voit les photos de la journée de SES enfants (la vie privée est
// tenue par le cœur : feedForParent) et met un cœur. Le PARTAGE (photo +
// légende) reste sur le web pour l'instant — on le dit.
import { useReducer } from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { studentById } from '@core/db.js'
import { feedForParent, moments, toggleLike } from '@core/gallery.js'
import { ROLE } from '@core/theme.js'
import { Ic } from '../icons.js'
import { Screen, Card, Avatar, EmptyState, C, tap } from '../components.js'

const ago = at => {
  const h = Math.round((Date.now() - at) / 3600000)
  return h < 1 ? "à l'instant" : h < 24 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`
}

export default function Gallery({ user }) {
  const [, force] = useReducer(x => x + 1, 0)
  const accent = ROLE[user.role]?.color || '#7539E4'
  const feed = user.role === 'parent' ? feedForParent(user) : moments()

  return (
    <Screen title="Moments" sub={user.role === 'parent' ? 'La journée de vos enfants, en photos.' : 'Le partage se fait sur le web pour l\'instant.'}>
      {feed.length === 0 && (
        <Card><EmptyState icon="Camera" title="Aucun moment pour l'instant"
          sub="Les photos de la journée apparaîtront ici dès qu'elles seront partagées." /></Card>
      )}
      {feed.map(m => {
        const kids = (m.childIds || []).map(studentById).filter(Boolean)
        const liked = (m.likes || []).includes(user.id)
        return (
          <Card key={m.id} style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
            {(m.media || []).slice(0, 1).map((med, i) => (
              <Image key={i} source={{ uri: med.data }} style={{ width: '100%', aspectRatio: 4 / 3 }} resizeMode="cover" />
            ))}
            <View style={{ padding: 14, gap: 8 }}>
              {!!m.caption && <Text style={{ color: C.ink, fontSize: 14, fontWeight: '600' }}>{m.caption}</Text>}
              {kids.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {kids.map(k => (
                    <Text key={k.id} style={{ fontSize: 11, fontWeight: '800', color: accent, backgroundColor: accent + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
                      {k.name.split(' ')[0]}
                    </Text>))}
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar name={m.byName} color={accent} size={24} />
                <Text style={{ flex: 1, color: C.muted, fontSize: 12 }}>{m.byName} · {ago(m.at)}</Text>
                <Pressable onPress={() => { tap(); toggleLike(m.id, user.id); force() }}
                  style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: pressed ? 0.6 : 1, padding: 4 })}>
                  <Ic n="Heart" size={18} color={liked ? '#DC4B54' : C.muted} fill={liked ? '#DC4B54' : 'none'} />
                  <Text style={{ color: liked ? '#DC4B54' : C.muted, fontWeight: '800', fontSize: 13 }}>{(m.likes || []).length || ''}</Text>
                </Pressable>
              </View>
            </View>
          </Card>)
      })}
    </Screen>
  )
}
