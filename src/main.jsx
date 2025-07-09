import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

import ReactGA from 'react-ga4';

// Pastikan file .env  berisi: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

// 3. Lakukan inisialisasi jika Measurement ID ada
if (gaMeasurementId) {
  ReactGA.initialize(gaMeasurementId);
  console.log("Google Analytics is initialized.");
}

// Render aplikasi Anda
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)