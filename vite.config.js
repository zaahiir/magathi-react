import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Optimize bundle size
    minify: 'esbuild', // Changed from terser to esbuild for better performance
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') && !id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            // Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Chart libraries (recharts)
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Animation libraries
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            // UI libraries
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Helmet for SEO
            if (id.includes('react-helmet')) {
              return 'vendor-helmet';
            }
            // Other large vendor libraries
            if (id.includes('axios') || id.includes('firebase')) {
              return 'vendor-utils';
            }
            // All other node_modules
            return 'vendor';
          }
        },
      },
    },
    // Asset optimization
    assetsInlineLimit: 4096,
    // Source maps for production debugging
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    cors: true,
    // Prevent timeout issues
    hmr: {
      timeout: 30000,
    },
    // Proxy API requests to backend server
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
