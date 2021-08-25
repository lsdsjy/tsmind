import reactRefresh from '@vitejs/plugin-react-refresh'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tsmind/',
  optimizeDeps: {
    include: ['rxjs/operators'],
  },
  plugins: [
    reactRefresh(),
    autoImport({
      imports: ['react'],
    }),
  ],
})
