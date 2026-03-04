import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add the base path matching your GitHub repository name
  base: "/Week3_groww_915/",
  resolve: {
    alias: { "@": "/src" },
  },
});
