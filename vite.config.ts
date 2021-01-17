import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    base: '/tsmind/'
  },
  plugins: [reactRefresh()]
})
