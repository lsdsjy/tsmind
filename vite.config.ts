import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tsmind/',
  optimizeDeps: {
    include: ['rxjs/operators']
  },
  plugins: [reactRefresh()]
})
