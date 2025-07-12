import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),        // ✅ critical for JSX to work
    tailwindcss(),  // ✅ optional, for Tailwind
  ],
});
