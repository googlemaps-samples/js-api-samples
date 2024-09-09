// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    root: '../',
    build: {
        emptyOutDir: true,
        outDir: '../dist',
    },

    define: {
        'import.meta.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)
    }
});