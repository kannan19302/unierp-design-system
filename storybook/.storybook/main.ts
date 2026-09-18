import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../../design-system/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
  viteFinal: async (config) => {
    return {
      ...config,
      server: {
        ...config.server,
        watch: {
          usePolling: true,
          interval: 1000,
        },
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@kannan19302/ui': path.resolve(__dirname, '../../design-system/src'),
          'lucide-react': path.resolve(__dirname, '../node_modules/lucide-react'),
          '@radix-ui/react-slot': path.resolve(__dirname, '../node_modules/@radix-ui/react-slot'),
          'recharts': path.resolve(__dirname, '../node_modules/recharts'),
          'next/link': path.resolve(__dirname, './mocks/next-link.tsx'),
          'next/navigation': path.resolve(__dirname, './mocks/next-navigation.ts'),
        },
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include || []),
          'lucide-react',
          '@radix-ui/react-slot',
          'recharts',
        ],
      },
      // The stories and components live OUTSIDE this Vite project root
      // (../../design-system/src, i.e. /design-system in the container while the
      // root is /app). @vitejs/plugin-react only applies its JSX transform to
      // files under the root, so every component here was served with raw JSX
      // and the classic runtime's implicit `React` reference — which nothing
      // imports, because the codebase is written for the automatic runtime.
      // Every story rendered as "React is not defined".
      //
      build: {
        ...config.build,
        sourcemap: false,
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
            manualChunks(id) {
              if (id.includes('node_modules/recharts')) {
                return 'vendor-recharts';
              }
              if (id.includes('node_modules/axe-core')) {
                return 'vendor-axe';
              }
              if (id.includes('node_modules/lucide-react')) {
                return 'vendor-lucide';
              }
            },
          },
          onwarn(warning, warn) {
            if (
              warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
              warning.code === 'SOURCEMAP_ERROR' ||
              warning.message?.includes('use client') ||
              warning.message?.includes('sourcemap')
            ) {
              return;
            }
            warn(warning);
          },
        },
      },
      // Setting the transform on esbuild covers files wherever they live.
      esbuild: {
        ...config.esbuild,
        jsx: 'automatic',
        jsxImportSource: 'react',
      },
      define: {
        ...config.define,
        'process.env': {},
      },
    };
  },
};

export default config;
