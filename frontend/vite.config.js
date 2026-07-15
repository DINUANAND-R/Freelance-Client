import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'vendor-framer': ['framer-motion'],
          // Charts
          'vendor-recharts': ['recharts'],
          // Icons
          'vendor-icons': ['react-icons'],
          // HTTP & socket
          'vendor-network': ['axios', 'socket.io-client'],
        },
      },
    },
  },
})

