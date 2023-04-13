import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  build: {
    outDir: "dist",
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
