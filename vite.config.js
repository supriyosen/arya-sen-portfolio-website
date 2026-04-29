import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root: './',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                blog: resolve(__dirname, 'blog.html'),
                tools: resolve(__dirname, 'tools.html'),
                blogVibeCoding: resolve(__dirname, 'blog-vibe-coding.html'),
                blogInvisibleRetouching: resolve(__dirname, 'blog-invisible-retouching.html'),
            },
        },
    },
});
