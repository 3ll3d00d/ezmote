import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [react()],
        server: {
            proxy: {
                '/api': 'http://127.0.0.1:53199',
                '/ws': {
                    target: 'ws://127.0.0.1:53199',
                    ws: true
                }
            }
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/setupTests.js'],
        }
    };
});
