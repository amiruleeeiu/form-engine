import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Library build configuration
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/form-engine/**/*"],
      outDir: "dist",
      rollupTypes: true,
      tsconfigPath: "./tsconfig.lib.json",
    }),
  ],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/form-engine/index.ts"),
      name: "ReactFormEngine",
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // Externalize peer dependencies and heavy libraries
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react-hook-form",
        "react-phone-input-2",
        "@hookform/resolvers",
        "zod",
        "react-day-picker",
        "lucide-react",
        "tailwind-merge",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Preserve module structure for better tree-shaking
        preserveModules: false,
        // CSS will be extracted to styles.css
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "styles.css";
          return assetInfo.name || "asset";
        },
      },
    },
    // Generate sourcemaps only in development
    sourcemap: false,
    // Minify for smaller size
    minify: "esbuild",
    // Clean output directory before build
    emptyOutDir: true,
    // Output directory
    outDir: "dist",
    // CSS code splitting
    cssCodeSplit: false,
  },
});
