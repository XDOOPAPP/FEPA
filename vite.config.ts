import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - chạy `npm run build` để tạo file stats.html
    visualizer({
      open: false, // Không tự động mở browser
      filename: 'dist/stats.html', // File output
      gzipSize: true, // Hiển thị gzip size
      brotliSize: true, // Hiển thị brotli size
    }),
  ],
  server: {
    host: true,
    port: 5174
  },
  build: {
    chunkSizeWarningLimit: 1300,
    sourcemap: false, // Tắt sourcemap trong production để giảm bundle size & bảo mật
    minify: 'terser', // Minify code tốt hơn
    terserOptions: {
      compress: {
        drop_console: true, // Xóa console.log trong production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core dependencies
          react: ['react', 'react-dom', 'react-router-dom'],
          
          // UI library
          antd: ['antd'],
          
          // Charts
          recharts: ['recharts'],
          
          // HTTP & state management
          vendor: ['@tanstack/react-query', 'axios', 'dayjs'],
          
          // Socket
          socket: ['socket.io-client'],
        },
        // Thêm hash vào filename để cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', '@tanstack/react-query'],
  },
})
