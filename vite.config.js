import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/steamapi': {
        target: 'https://api.steampowered.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/steamapi/, ''),
        secure: false, // Set to true if using HTTPS for the target
      },
      '/api/GetOwnedGames': {
        target: 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/GetOwnedGames/, ''),
      },
    },
  },
})
