/// <reference types="vitest" />
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      treeshake: "safest",
    },
  },

  plugins: [
    splitVendorChunkPlugin(),
    tsconfigPaths(),
    react({
      babel: {
        plugins: [
          "babel-plugin-macros",
          [
            "auto-import",
            { declarations: [{ default: "React", path: "react" }] },
          ],
          [
            "@emotion/babel-plugin-jsx-pragmatic",
            { export: "jsx", import: "__cssprop", module: "@emotion/react" },
          ],
          [
            "@babel/plugin-transform-react-jsx",
            { pragma: "__cssprop" },
            "twin.macro",
          ],
        ],
      },
    }),
    compression({
      include: [/\.js$/, /\.css$/],
      threshold: 1400,
    }),
  ],
  test: {
    root: "./src/__test__",
    environment: "jsdom",
  },
});
