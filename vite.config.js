import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://20.244.40.188/dev',
        changeOrigin: true,
        secure: false, // allow HTTP
        rewrite: (path) => path.replace(/^\/api/, '') // remove /api prefix when sending to backend
      }
    }
  }
})
