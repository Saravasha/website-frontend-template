import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// MULTI-COMMITTER:PROTECTED:START DefineConfig
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "__PROFILE_BASE__",
    // if parent then base: "/", else "myapps/*childapp*"
    plugins: [tailwindcss(), react()],
    server: {
      headers: {
        "Content-Security-Policy": `frame-ancestors ${env.VITE_DOTNET_API_BASE}`,
      },
    },
  };
});
// MULTI-COMMITTER:PROTECTED:END DefineConfig
