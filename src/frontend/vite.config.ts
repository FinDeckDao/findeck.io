/// <reference types="vitest" />
import { mergeConfig } from "vite";
import { fileURLToPath, URL } from "url";
import dotenv from "dotenv";
import environment from "vite-plugin-environment";
import react from "@vitejs/plugin-react";
import path from "path";

dotenv.config({ path: "../../.env" });

const viteConfig = {
  build: {
    emptyOutDir: true,
    target: "esnext",
    cache: true,
    minify: "terser",
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ["/public/currency-icons/**"],
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      declarations: fileURLToPath(new URL("../declarations", import.meta.url)),
    },
  },
  cacheDir: ".vite_cache",
  publicDir: path.resolve(__dirname, "static"),
};

const vitestConfig = {
  test: {
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    css: true,
  },
};

export default mergeConfig(viteConfig, vitestConfig);
