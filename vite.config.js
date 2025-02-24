import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        esbuild: false,
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
    },
    server: {
        port: 8082,
        host: '0.0.0.0',
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
