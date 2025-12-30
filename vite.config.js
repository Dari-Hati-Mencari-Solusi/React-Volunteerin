import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false, // Auto-open hanya saat build production
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ],
  
  // ============================================
  // OPTIMASI TBT & LCP: Manual Chunk Splitting
  // ============================================
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - library besar dipisah
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Swiper di chunk terpisah (library berat)
          'swiper-vendor': ['swiper'],
          
          // Icon library
          'icon-vendor': ['@iconify/react', 'lucide-react'],
        }
      }
    },
    
    // Compress assets
    // minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log di production
        drop_debugger: true,
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  }
})