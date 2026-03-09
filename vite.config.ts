/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { runTypesGenerator } from "i18next-cli";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import i18nextConfig from "./i18next.config";

const i18nTypesPlugin = () => ({
  name: "i18n-types-watcher",
  apply: "serve" as const,
  async configureServer(server: import("vite").ViteDevServer) {
    const generate = async () => {
      try {
        await runTypesGenerator(i18nextConfig);
      } catch (e) {
        console.error("[i18n-types]", e);
      }
    };

    await generate();

    server.watcher.on("change", (file) => {
      if (file.includes("/locales/") && file.endsWith(".json")) {
        generate();
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), i18nTypesPlugin()],
  test: {
    include: ["./**/*.{test,spec}.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 15_000,
  },
  resolve: {
    alias: {
      "@": new URL("src", import.meta.url).pathname,
    },
  },
});
