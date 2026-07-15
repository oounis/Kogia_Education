import React from 'react'
import ReactDOM from 'react-dom/client'
import { setAssetBase } from '@core/livestatus.js'
import { getItem } from '@core/storage.js'
import { setDemoLive } from '@core/clock.js'
import App from './App.jsx'
import RemoteGate from './RemoteGate.jsx'
import { isRemote } from './remote.js'
setAssetBase(import.meta.env.BASE_URL)
// Tant qu'aucune vraie école n'utilise le produit : première visite en mode
// démonstration (journée de classe simulée), comme sur mobile. ?live=0 ou le
// bouton « revenir au réel » désactivent, et le choix est mémorisé.
// En mode SERVEUR (coreon_api posé), jamais : une vraie école vit au réel.
if (!isRemote() && getItem('coreon_demo_live') == null) setDemoLive(true)
import './index.css'
import '@fontsource-variable/nunito'
import '@fontsource-variable/plus-jakarta-sans'
// Tajawal : le Nunito de l'arabe — rond, chaleureux. Chargé localement comme les
// autres (jamais de CDN). Les trois graisses que l'interface utilise vraiment.
import '@fontsource/tajawal/400.css'
import '@fontsource/tajawal/500.css'
import '@fontsource/tajawal/700.css'
import { locale, dir } from '@core/i18n.js'
// L'arabe n'est pas une traduction, c'est une DIRECTION : la langue et le sens
// de lecture se posent sur <html> avant le premier rendu.
document.documentElement.lang = locale()
document.documentElement.dir = dir()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isRemote() ? <RemoteGate/> : <App/>}</React.StrictMode>)
