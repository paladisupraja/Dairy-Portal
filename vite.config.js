// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
    
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: "/Dairy-Portal/", // important for GitHub Pages
  server: {
    proxy: {
      '/prod': 'http://20.244.40.188', // for development only
    },
  },
})