import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Cargar las variables de entorno
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/Gemini-Clone/",

    // Definir variables de entorno personalizadas
    define: {
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY
      ),
    },
  };
});
