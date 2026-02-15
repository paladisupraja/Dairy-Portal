import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  
  server: {
    proxy: {
      '/prod': 'http://20.244.40.188'
    }
  }
,
  plugins: [react()],
})
