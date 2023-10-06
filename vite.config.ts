import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-dom", "react-dom/server"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "shoppa-ui/styles/abstracts" as *;',
      },
    },
  },
});
