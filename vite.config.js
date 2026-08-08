import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[\\/]three[\\/]src[\\/]renderers[\\/]shaders[\\/]/.test(id)) return "three-shaders";
          return undefined;
        },
      },
    },
  },
});
