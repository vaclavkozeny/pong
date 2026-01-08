import { defineConfig } from 'vite';

export default defineConfig({
    base: '/pong/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
});