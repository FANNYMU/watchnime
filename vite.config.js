import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Biarkan server dapat diakses dari luar
    allowedHosts: ["d8dc-103-160-69-95.ngrok-free.app"], // Tambahkan host Ngrok
  },
});
