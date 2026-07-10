import React from 'react'
import ReactDOM from 'react-dom/client'
import { setAssetBase } from '@core/livestatus.js'
import App from './App.jsx'
setAssetBase(import.meta.env.BASE_URL)
import './index.css'
import '@fontsource-variable/nunito'
import '@fontsource-variable/plus-jakarta-sans'
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
