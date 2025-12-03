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
      // Externalize peer dependencies
      external: ["react", "react-dom", "react/jsx-runtime"],      output: {
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
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Clean output directory before build
    emptyOutDir: true,
    // Output directory
    outDir: "dist",
    // CSS code splitting
    cssCodeSplit: false,
  },
});
