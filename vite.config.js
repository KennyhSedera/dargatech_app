import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    build: {
        manifest: true,
    },
    server: {
        // host: "0.0.0.0",
        port: 8080,
        // hmr: {
        //     host: "0cf22b8cb163.ngrok-free.app",
        //     protocol: "wss",
        // },
    },
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
});
