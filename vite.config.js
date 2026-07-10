import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env') });

export default defineConfig(() => {
    const projectRepoRoot = resolve(__dirname);
    const workspaceDir = process.cwd();
    const isSample =
        workspaceDir !== projectRepoRoot && workspaceDir.includes('/samples/');

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

    return {
        root: isSample ? workspaceDir : projectRepoRoot,
        plugins: [
            {
                name: 'html-transform',
                enforce: 'pre',
                transformIndexHtml(html) {
                    return html.replace(/GOOGLE_MAPS_API_KEY/g, apiKey);
                },
            },
            {
                name: 'code-transform',
                enforce: 'pre',
                transform(code) {
                    if (code.includes('GOOGLE_MAPS_API_KEY')) {
                        return {
                            code: code.replace(/GOOGLE_MAPS_API_KEY/g, apiKey),
                            map: null,
                        };
                    }
                },
            },
        ],
        build: {
            emptyOutDir: false, // Prevents clearing other files
            // We do not override outDir or rollupOptions.input here!
            // Vite automatically outputs to the local 'dist' folder (which dist.sh expects)
            // and automatically uses 'index.html' as the input because root is the workspaceDir.
        },
        preview: {
            port: 8080,
        },
        define: {
            'import.meta.env.GOOGLE_MAPS_API_KEY': JSON.stringify(apiKey),
        },
    };
});
