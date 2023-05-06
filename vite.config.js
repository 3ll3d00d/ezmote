import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import circleDependency from 'vite-plugin-circular-dependency'

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [
            react(),
            circleDependency({
                include: '**/*.js*'
            })
        ],
        server: {
            proxy: {
                '/api': 'http://127.0.0.1:53199',
                '/icons': 'http://127.0.0.1:53199',
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
