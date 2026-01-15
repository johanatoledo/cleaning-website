import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true, // Habilita websockets por si acaso
        // Esta función ayuda a debuguear si el proxy está fallando
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Verifica si el servidor está intentando setear una cookie
            console.log('RAW Response from the target:', proxyRes.headers['set-cookie']);
          });
        },
      }
    }
  }
})
