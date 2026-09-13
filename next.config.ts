import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [],
      /**
       * Las demos son SPAs de Angular servidas desde `public/demos/`. Su router
       * usa `pushState`, así que al navegar dentro del iframe la URL pasa a ser
       * `/demos/marcacion/calendario`, que no existe como fichero: una recarga
       * daría 404.
       *
       * Van en `afterFiles` a propósito — ese bloque corre *después* de buscar
       * el fichero real, de modo que los chunks y los assets se siguen sirviendo
       * tal cual y solo las rutas inventadas caen en el index.
       */
      afterFiles: [
        {
          source: "/demos/marcacion/:path*",
          destination: "/demos/marcacion/index.html",
        },
        {
          source: "/demos/miniapp/:path*",
          destination: "/demos/miniapp/index.html",
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
