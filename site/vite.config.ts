import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { capsule } from "@capsule-css/vite";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/capsule-css/" : "/",
  server: { port: 5175, strictPort: true },
  css: {
    postcss: { plugins: [autoprefixer(), cssnano()] },
  },
  plugins: [
    capsule({ target: "react" }),
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, "index.html"),
        docs:    resolve(__dirname, "docs.html"),
        starter: resolve(__dirname, "starter.html"),
      },
    },
  },
});
