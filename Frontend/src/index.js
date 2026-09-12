import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { store } from './store/store'
import { RootCmp } from './root-cmp'
import './assets/styles/main.scss'

// Your Google OAuth Client ID from https://console.cloud.google.com
// Set this in Frontend/.env as REACT_APP_GOOGLE_CLIENT_ID=your_id_here
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

const root = ReactDOM.createRoot(document.getElementById('root'))

const app = (
  <Provider store={store}>
    <Router>
      <RootCmp />
    </Router>
  </Provider>
)

root.render(
  GOOGLE_CLIENT_ID
    ? <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
    : app
)

serviceWorkerRegistration.register()
