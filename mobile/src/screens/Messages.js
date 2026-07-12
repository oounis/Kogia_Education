// Messagerie — port natif de app/src/pages/Messages.jsx.
// Liste des conversations → la conversation s'ouvre DANS ce fichier (état
// interne, pas de route) : bulles + envoi. Mêmes règles que le web : un parent
// n'écrit qu'au personnel, jamais aux autres parents ; le personnel écrit à tous.
import { useState, useReducer } from 'react'
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { db, mutate, uid, userById } from '@core/db.js'
import { ROLE } from '@core/theme.js'
import { notify } from '@core/notify.js'
import { Screen, Card, Avatar, Row, Btn, Input, EmptyState, C, S } from '../components.js'
import { Ic } from '../icons.js'

// « il y a … » sans date-fns (interdit côté natif — cf. core/clock.js).
const ago = at => {
  const m = Math.round((Date.now() - at) / 60000)
  if (m < 1) return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `il y a ${h} h`
  return `il y a ${Math.round(h / 24)} j`
}

export default function Messages({ user, params, nav }) {
  const me = user
  const [, force] = useReducer(x => x + 1, 0)
  const d = db()
  const accent = ROLE[me.role]?.color || '#4F57DE'

  const mine = d.messages.filter(m => m.from === me.id || m.to === me.id)
  const partnerIds = [...new Set(mine.map(m => (m.from === me.id ? m.to : m.from)))]
  const [active, setActive] = useState(null)      // conversation ouverte
  const [picking, setPicking] = useState(false)   // choix du destinataire
  const [text, setText] = useState('')

  // Un parent ne peut écrire qu'au personnel de l'école, jamais aux autres parents
  // (le répertoire complet des familles ne doit pas lui être exposé). Le personnel
  // écrit à tout le monde. — mêmes règles que le web.
  const STAFF = ['schooladmin', 'admin', 'teacher', 'supervisor']
  const others = d.users.filter(u => u.id !== me.id && (me.role !== 'parent' || STAFF.includes(u.role)))
  const lastWith = id => mine.filter(m => m.from === id || m.to === id).sort((a, b) => b.at - a.at)[0]

  const send = () => {
    if (!text.trim() || !active) return
    const body = text.trim()
    mutate(db => { db.messages.push({ id: uid('m'), from: me.id, to: active, text: body, at: Date.now(), read: false }) })
    notify({ to: active, kind: 'message', title: `Nouveau message de ${me.name}`, body: body.slice(0, 60), link: '/app/messages' })
    setText('')
    force()
  }

  // ── Choix du destinataire (équivalent du modal « Nouveau message » du web) ──
  if (picking) return (
    <Screen title="Nouveau message" sub="Choisissez un destinataire."
      right={<Btn small kind="line" label="Annuler" color={accent} onPress={() => setPicking(false)} />}>
      {others.length === 0
        ? <Card><EmptyState icon="Users" title="Personne à contacter" sub="Aucun destinataire disponible pour le moment." /></Card>
        : <Card style={{ paddingVertical: 4 }}>
            {others.map((u, i) => (
              <Row key={u.id}
                avatar={<Avatar name={u.name} color={ROLE[u.role]?.color} />}
                title={u.name} sub={ROLE[u.role]?.label}
                right={<Ic n="ChevronRight" size={15} color={C.muted} />}
                onPress={() => { setActive(u.id); setPicking(false) }}
                style={i === others.length - 1 ? { borderBottomWidth: 0 } : null} />
            ))}
          </Card>}
    </Screen>
  )

  // ── Conversation ─────────────────────────────────────────────────────────
  if (active) {
    const partner = userById(active)
    const thread = mine.filter(m => m.from === active || m.to === active).sort((a, b) => a.at - b.at)
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={[S.screen, { flex: 1, paddingTop: 56 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
            <Pressable onPress={() => setActive(null)} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 999, padding: 9 }}>
              <Ic n="ArrowLeft" size={16} color={C.ink} />
            </Pressable>
            <Avatar name={partner?.name || '?'} color={ROLE[partner?.role]?.color} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={{ fontWeight: '800', color: C.ink, fontSize: 15 }}>{partner?.name || 'Utilisateur'}</Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>{ROLE[partner?.role]?.label || ''}</Text>
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 8, flexGrow: 1 }}>
            {thread.length ? thread.map(m => {
              const mineMsg = m.from === me.id
              return (
                <View key={m.id} style={{ alignItems: mineMsg ? 'flex-end' : 'flex-start' }}>
                  <View style={{
                    maxWidth: '78%', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14,
                    backgroundColor: mineMsg ? accent : '#fff',
                    borderWidth: mineMsg ? 0 : 1, borderColor: C.line,
                  }}>
                    <Text style={{ color: mineMsg ? '#fff' : C.ink, fontSize: 14 }}>{m.text}</Text>
                    <Text style={{ color: mineMsg ? '#FFFFFFB3' : C.muted, fontSize: 10, marginTop: 2 }}>{ago(m.at)}</Text>
                  </View>
                </View>
              )
            }) : <EmptyState icon="MessageSquare" title="Aucun message" sub="Envoyez le premier message pour démarrer la conversation." />}
          </ScrollView>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: '#fff' }}>
            <Input style={{ flex: 1 }} value={text} onChangeText={setText}
              placeholder="Écrivez un message…" onSubmitEditing={send} returnKeyType="send" />
            <Pressable onPress={send} style={({ pressed }) => ({
              width: 46, height: 46, borderRadius: 23, backgroundColor: accent,
              alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1,
            })}>
              <Ic n="Send" size={19} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  // ── Liste des conversations ──────────────────────────────────────────────
  return (
    // Un parent n'écrit qu'au personnel — le sous-titre ne doit pas promettre plus.
    <Screen title="Messages" sub={me.role === 'parent' ? "Échangez avec l'équipe de l'école." : 'Échangez avec le personnel et les parents.'}
      right={<Btn small icon="Plus" label="Nouveau" color={accent} onPress={() => setPicking(true)} />}>
      {partnerIds.length === 0
        ? <Card><EmptyState icon="MessageSquare" title="Aucune conversation" sub="Démarrez une nouvelle conversation pour la voir ici." /></Card>
        : <Card style={{ paddingVertical: 4 }}>
            {partnerIds.map((pid, i) => {
              const u = userById(pid)
              const last = lastWith(pid)
              return (
                <Row key={pid}
                  avatar={<Avatar name={u?.name || '?'} color={ROLE[u?.role]?.color} />}
                  title={u?.name || 'Utilisateur'} sub={last?.text}
                  right={<Text style={{ color: C.muted, fontSize: 11 }}>{last ? ago(last.at) : ''}</Text>}
                  onPress={() => setActive(pid)}
                  style={i === partnerIds.length - 1 ? { borderBottomWidth: 0 } : null} />
              )
            })}
          </Card>}
    </Screen>
  )
}
