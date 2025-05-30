import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from 'vite-plugin-eslint';
import path from "path";

export default defineConfig({
  plugins: [react(), eslint()],
  root: "src/client",
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src/client"),
      "@server": path.resolve(__dirname, "./src/server"),
    },
  },
  server: {
    port: 3000,
  },
});
