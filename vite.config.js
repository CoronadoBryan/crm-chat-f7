import path from "path";
import framework7 from "rollup-plugin-framework7";

const SRC_DIR = path.resolve(__dirname, "./src");
const PUBLIC_DIR = path.resolve(__dirname, "./public");
const BUILD_DIR = path.resolve(__dirname, "./www");
export default async () => {
  return {
    plugins: [framework7({ emitCss: false })],
    root: SRC_DIR,
    base: "",
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        "@": SRC_DIR,
      },
    },
    server: {
      host: true,
      // Agregar configuración para permitir hosts de ngrok
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        ".ngrok-free.app", // Permite todos los subdominios de ngrok
        ".ngrok.io", // Si usas dominios anteriores de ngrok
        "7fb7-161-132-87-56.ngrok-free.app", // Tu dominio específico actual
      ],
    },
    esbuild: {
      jsxFactory: "$jsx",
      jsxFragment: '"Fragment"',
    },
  };
};
