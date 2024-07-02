// vite.config.js
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPack from 'vite-plugin-zip-pack';
import entryPoint from './vite.entry-point';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    build: {
      sourcemap: !isProduction,
      minify: isProduction,
      target: 'es2015',
      lib: {
        entry: 'src/App.ts',
        fileName: (format, entryName) => 'scripts/' + entryName + '.js',
        name: 'amo-widget',
        formats: ['amd'], // iife
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: [
          '$',
          '_',
          'jquery',
          'backbone',
          'underscore',
          'clipboard',
          'twigjs',
          'moment',
          'lib/components/base/modal',
          'intl-tel-input',
          'intl-tel-input-utils',
        ],
        output: {
          externalLiveBindings: false,
          extend: true,
          freeze: false,
          globals: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'lib/components/base/modal': 'Modal',
            'moment': 'moment',
          },
          amd: {
            forceJsExtensionForImports: true
          },
        },
        watch: {
          include: [
            './vite.config.js',
            './resources/script.js',
            './resources/**/*'
          ],
          patterns: [
            'src',
            'resources'
          ],
          extensions: 'ts,json,sass,js,twig',
        },
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    plugins: [
      vue(),
      viteStaticCopy({
        targets: [
          {
            src: [
              'resources/images/',
              'resources/i18n/',
              'resources/templates/',
            ],
            dest: '',
          },
          {
            src: 'resources/external/*.js',
            dest: 'external',
          },
          {
            src: `resources/manifest.json`,
            dest: '',
            rename: 'manifest.json',
          },
          {
            src: `resources/script.js`,
            dest: '',
            rename: 'script.js'
          },
        ],
      }),
      entryPoint({pattern: 'scripts/*.js', mode: mode}),
      zipPack({
        outFileName: 'widget.zip',
        outDir: 'dist',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../src', import.meta.url)),
        '@core': fileURLToPath(
            new URL('../frontend-widget-core', import.meta.url)
        ),
        '@resources': fileURLToPath(new URL('../resources', import.meta.url)),
        '@assets': fileURLToPath(new URL('../src/assets', import.meta.url)),
        '@t': fileURLToPath(new URL('../src/Templates', import.meta.url)),
        '@shared': fileURLToPath(new URL('../src/shared', import.meta.url)),
      },
    },
    define: {
      'process.env': {
        NODE_ENV: mode,
      },
    },
  };
});
