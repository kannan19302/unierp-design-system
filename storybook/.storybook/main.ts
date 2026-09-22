import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../../src/core/**/*.stories.@(ts|tsx)',
    '../../src/platforms/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  typescript: {
    reactDocgen: "react-docgen",
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
          '@kannan19302/ui/core': path.resolve(__dirname, '../../src/core'),
          '@kannan19302/ui/platforms': path.resolve(__dirname, '../../src/platforms'),
          '@kannan19302/ui/tokens': path.resolve(__dirname, '../../src/core/tokens'),
          '@kannan19302/ui/styles': path.resolve(__dirname, '../../src/core/styles'),
          '@kannan19302/ui/primitives': path.resolve(__dirname, '../../src/core/primitives'),
          '@kannan19302/ui/inputs': path.resolve(__dirname, '../../src/core/inputs'),
          '@kannan19302/ui/overlays': path.resolve(__dirname, '../../src/core/overlays'),
          '@kannan19302/ui/navigation': path.resolve(__dirname, '../../src/core/navigation'),
          '@kannan19302/ui/data-display': path.resolve(__dirname, '../../src/core/data-display'),
          '@kannan19302/ui/data-grid': path.resolve(__dirname, '../../src/core/data-grid'),
          '@kannan19302/ui/forms': path.resolve(__dirname, '../../src/core/forms'),
          '@kannan19302/ui/layout': path.resolve(__dirname, '../../src/core/layout'),
          '@kannan19302/ui/shell': path.resolve(__dirname, '../../src/core/shell'),
          '@kannan19302/ui/studio': path.resolve(__dirname, '../../src/core/studio'),
          '@kannan19302/ui/dashboard': path.resolve(__dirname, '../../src/core/dashboard'),
          '@kannan19302/ui/charts': path.resolve(__dirname, '../../src/core/charts'),
          '@kannan19302/ui/theme': path.resolve(__dirname, '../../src/core/theme'),
          '@kannan19302/ui/blocks': path.resolve(__dirname, '../../src/core/blocks'),
          '@kannan19302/ui/brand': path.resolve(__dirname, '../../src/core/brand'),
          '@kannan19302/ui/hooks': path.resolve(__dirname, '../../src/core/hooks'),
          '@kannan19302/ui/utils': path.resolve(__dirname, '../../src/core/utils'),
          '@kannan19302/ui/icons': path.resolve(__dirname, '../../src/core/icons'),
          '@kannan19302/ui/workflow': path.resolve(__dirname, '../../src/core/workflow'),
          '@kannan19302/ui/form-engine': path.resolve(__dirname, '../../src/core/form-engine'),
          '@kannan19302/ui/notifications': path.resolve(__dirname, '../../src/core/notifications'),
          '@kannan19302/ui/components': path.resolve(__dirname, '../../src/core/components'),
          '@kannan19302/ui': path.resolve(__dirname, '../../src'),
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
