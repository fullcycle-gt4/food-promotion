import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../frontend-alternativo/src/context/AuthContext.jsx'
import { CartProvider } from '../frontend-alternativo/src/context/CartContext.jsx'
import { ToastProvider } from '../frontend-alternativo/src/components/Toast.jsx'
import App from './App.jsx'
import '../frontend-alternativo/src/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
