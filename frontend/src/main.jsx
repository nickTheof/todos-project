import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LogContextProvider from './store/LogContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <LogContextProvider>
    <App />
  </LogContextProvider>,
)
