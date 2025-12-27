
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // This allows you to import files without using .ts or .tsx extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ''),
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  }
});
