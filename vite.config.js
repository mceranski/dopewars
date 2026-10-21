import { fileURLToPath, URL } from 'node:url'
import { loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/dopewars/',
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    define: {
      'process.env': env
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Silence specific deprecation warnings
          silenceDeprecations: ['if-function'],
          // Or use the quietDeps option to silence all warnings from dependencies
          // quietDeps: true,
        },
      },
    },
    // server: {
    //   host: true, //bind to all network interface
    //   port: 5173, // default vite port
    // },
  }
})
