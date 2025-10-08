import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from 'rollup-plugin-visualizer'
import type { Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Bundle analyzer (only in analyze mode)
    ...(process.env.ANALYZE ? [visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }) as Plugin] : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Build optimizations
    minify: 'terser',
    sourcemap: process.env.NODE_ENV === 'development',
    target: 'es2020',
    cssCodeSplit: true,
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'firebase-vendor': [
            'firebase/app',
            'firebase/auth', 
            'firebase/firestore',
            'firebase/storage'
          ],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-form',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip'
          ],
          'motion-vendor': ['framer-motion'],
          'utils-vendor': ['zustand', 'clsx', 'tailwind-merge']
        }
      }
    },
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Optimized dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage'
    ]
  },
  
  // Server configuration
  server: {
    host: true,
    port: 5175,
    open: true
  },
  
  // Preview server configuration
  preview: {
    host: true,
    port: 4173
  }
})
