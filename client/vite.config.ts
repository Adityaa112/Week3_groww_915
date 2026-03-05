import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Week3_groww_915/",
  resolve: {
    alias: { "@": "/src" },
  },
  server: {
    proxy: {
      // Proxies /v1/api requests to the OmneNest server
      "/v1": {
        target: "https://preprodapisix.omnenest.com",
        changeOrigin: true,
        secure: false,
      },
      // Proxies /v2/api requests to the OmneNest server
      "/v2": {
        target: "https://preprodapisix.omnenest.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});