import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { capsule } from "@capsule-css/vite";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default defineConfig({
  css: {
    postcss: { plugins: [autoprefixer(), cssnano()] },
  },
  plugins: [
    capsule({ target: "react" }),
    react(),
  ],
});
