import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  }
})

// vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { qrcode } from 'vite-plugin-qrcode';

// export default defineConfig({
//   plugins: [react(), qrcode()],
//   server: {
//     host: '0.0.0.0',    // listen on all network interfaces
//     port: 5173,        // your dev port
//     strictPort: true,  // fail if 5173 is taken
//   },
// });
