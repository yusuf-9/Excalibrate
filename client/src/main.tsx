import React from 'react'
import ReactDOM from 'react-dom/client'

// main app
import App from './App.tsx'

// css files
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
