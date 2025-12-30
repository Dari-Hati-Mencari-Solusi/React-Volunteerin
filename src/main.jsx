import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

import ReactGA from 'react-ga4';

// ============================================
// OPTIMASI TBT: Defer Google Analytics initialization
// ============================================
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize GA after page load (tidak block initial render)
if (gaMeasurementId) {
  // Use requestIdleCallback untuk initialize saat browser idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      ReactGA.initialize(gaMeasurementId);
      console.log("Google Analytics initialized (deferred).");
    });
  } else {
    // Fallback untuk browser yang tidak support requestIdleCallback
    setTimeout(() => {
      ReactGA.initialize(gaMeasurementId);
      console.log("Google Analytics initialized (deferred).");
    }, 1000);
  }
}

// ============================================
// Render aplikasi - prioritas tertinggi
// ============================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)