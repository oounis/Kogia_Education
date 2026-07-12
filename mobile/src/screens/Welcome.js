// Le rituel d'ouverture — cinq secondes de marque avant l'école.
// Fond indigo→violet (dégradé SVG : expo-linear-gradient n'est pas installé),
// le cachalot blanc entre en scène, la marque se pose, puis on passe à Login.
import { useEffect, useRef } from 'react'
import { BRAND } from '@core/tokens.js'
import { PURPLE } from '@core/tokens.js'
import { View, Text, Pressable, Animated, Easing, Platform, StyleSheet, Dimensions } from 'react-native'
import Svg, { Rect, Circle, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg'
import { getItem, setItem } from '@core/storage.js'
import { F, tap } from '../components.js'
import { KogiaMark } from '../kmark.js'

const NATIVE = Platform.OS !== 'web'
const WHALE_W = 168

export default function Welcome({ onDone }) {
  // Le rituel reste, mais un habitué ne doit pas attendre : cadence resserrée.
  const seen = useRef(getItem('coreon_welcomed') != null).current
  const k = seen ? 0.7 : 1 // facteur de cadence

  const whaleO = useRef(new Animated.Value(0)).current
  const whaleS = useRef(new Animated.Value(0.85)).current
  const sprayO = useRef(new Animated.Value(0)).current
  const wordO = useRef(new Animated.Value(0)).current
  const wordY = useRef(new Animated.Value(12)).current
  const tagO = useRef(new Animated.Value(0)).current
  const btnO = useRef(new Animated.Value(0)).current
  const btnY = useRef(new Animated.Value(10)).current
  const float = useRef(new Animated.Value(0)).current
  const screenO = useRef(new Animated.Value(1)).current
  const leaving = useRef(false)

  const leave = () => {
    if (leaving.current) return
    leaving.current = true
    Animated.timing(screenO, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE })
      .start(() => onDone())
  }

  useEffect(() => {
    setItem('coreon_welcomed', '1')
    const ease = Easing.out(Easing.cubic)
    // 1. le cachalot émerge (fondu + ressort doux, sans rebond)
    Animated.parallel([
      Animated.timing(whaleO, { toValue: 1, duration: 400 * k, easing: ease, useNativeDriver: NATIVE }),
      Animated.spring(whaleS, { toValue: 1, friction: 9, tension: 46, useNativeDriver: NATIVE }),
    ]).start()
    // 2. le jet souffle juste après
    Animated.timing(sprayO, { toValue: 1, duration: 300 * k, delay: 420 * k, easing: ease, useNativeDriver: NATIVE }).start()
    // 3. le nom se pose, 4. la promesse, 5. la porte d'entrée
    Animated.parallel([
      Animated.timing(wordO, { toValue: 1, duration: 350 * k, delay: 560 * k, easing: ease, useNativeDriver: NATIVE }),
      Animated.timing(wordY, { toValue: 0, duration: 350 * k, delay: 560 * k, easing: ease, useNativeDriver: NATIVE }),
      Animated.timing(tagO, { toValue: 1, duration: 300 * k, delay: 840 * k, easing: ease, useNativeDriver: NATIVE }),
      Animated.timing(btnO, { toValue: 1, duration: 280 * k, delay: 1080 * k, easing: ease, useNativeDriver: NATIVE }),
      Animated.timing(btnY, { toValue: 0, duration: 280 * k, delay: 1080 * k, easing: ease, useNativeDriver: NATIVE }),
    ]).start()
    // Flottaison perpétuelle : ±4 px sur 3 s, respiration marine.
    Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: NATIVE }),
      Animated.timing(float, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: NATIVE }),
    ])).start()
    const t = setTimeout(leave, seen ? 1900 : 2600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [4, -4] })
  const { width, height } = Dimensions.get('window')

  return (
    <Animated.View style={{ flex: 1, opacity: screenO, backgroundColor: BRAND.indigo }}>
      {/* Le sol : indigo profond → violet, avec un halo derrière la marque. */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="ground" x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor={PURPLE[700]} />
            <Stop offset="0.5" stopColor={PURPLE[600]} />
            <Stop offset="1" stopColor={PURPLE[500]} />
          </LinearGradient>
          <RadialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#ground)" />
        <Circle cx={width / 2} cy={height * 0.4} r={width * 0.62} fill="url(#halo)" />
      </Svg>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <View style={{ flex: 1 }} />

        <Animated.View style={{ opacity: whaleO, transform: [{ translateY: floatY }, { scale: whaleS }] }}>
          <View style={{ width: WHALE_W, height: WHALE_W * 96 / 132 }}>
            <KogiaMark size={WHALE_W} color="#FFFFFF" />
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: sprayO }]}>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.Text style={{
          opacity: wordO, transform: [{ translateY: wordY }], marginTop: 22,
          fontFamily: F.black, fontWeight: '800', fontSize: 36, letterSpacing: 0.5, color: '#FFFFFF',
        }}>
          coreon <Text style={{ color: '#C7D2FE' }}>edu</Text>
        </Animated.Text>

        <Animated.Text style={{
          opacity: tagO, marginTop: 10, textAlign: 'center',
          fontFamily: F.semi, fontSize: 15.5, lineHeight: 22, color: 'rgba(255,255,255,0.82)',
        }}>
          {"L'école qu'on a envie d'ouvrir."}
        </Animated.Text>

        <View style={{ flex: 1 }} />

        <Animated.View style={{ opacity: btnO, transform: [{ translateY: btnY }], marginBottom: 64 }}>
          <Pressable
            onPress={() => { tap(); leave() }}
            style={({ pressed }) => ({
              backgroundColor: '#FFFFFF', borderRadius: 999, paddingVertical: 14, paddingHorizontal: 44,
              opacity: pressed ? 0.88 : 1,
            })}>
            <Text style={{ fontFamily: F.bold, fontWeight: '700', fontSize: 16, color: BRAND.indigo }}>Commencer</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  )
}
