import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { fileURLToPath } from 'url'
// import dotenv from 'dotenv'

// const _dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '')
// const toNumber = (val, def) => isNaN(val) ? def : Number(val)
// const { PORT } = dotenv.config({ path: `${_dirname}/../server/.env` }).parsed
// const port = toNumber(PORT, 3030)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ]
  // server: {
  //   proxy: { // proxy requests to server
  //     '/api': {
  //       target: `http://localhost:${port}`,
  //       changeOrigin: true
  //     }
  //   }
  // }
})
