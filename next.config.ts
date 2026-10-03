import type { NextConfig } from "next";

const enDesarrollo = process.env.NODE_ENV !== "production";

/**
 * Política de seguridad de contenido.
 *
 * Lo que de verdad gana aquí no es `script-src` —las demos de Angular y el
 * streaming de Next meten scripts y estilos en línea, así que `'unsafe-inline'`
 * es obligatorio y eso deja la política coja contra inyección en línea—. Lo que
 * gana es acotar *a dónde* puede hablar la página: `connect-src` y `img-src`
 * cierran la vía de exfiltración, `base-uri` impide secuestrar las rutas
 * relativas con un `<base>` inyectado, y `frame-ancestors` quita el clickjacking.
 *
 * `frame-ancestors 'self'` y no `'none'`: esta cabecera va también a
 * `/demos/*`, y esas páginas las enmarca el propio portafolio en `DemoFrame`.
 * Con `'none'` el iframe de las demos quedaría en blanco.
 *
 * En desarrollo se relaja lo justo: Next usa `eval` para Fast Refresh y un
 * websocket para HMR.
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${enDesarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // `generativelanguage` es Gemini en MiniApp Inventario; `mindicador.cl` es la
  // UF y el dólar que consulta el inventario. Nada más sale de aquí.
  `connect-src 'self' https://generativelanguage.googleapis.com https://mindicador.cl${
    enDesarrollo ? " ws: wss:" : ""
  }`,
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Falta `upgrade-insecure-requests` a propósito.
  //
  // Comprobado que rompe las demos en cualquier servidor local: asciende el
  // iframe a `https://localhost:3000`, que ya no es el mismo origen que
  // `'self'`, y el navegador lo bloquea —el iframe se queda vacío—. Pasa tanto
  // con `next dev` como con `next start`, así que condicionarlo a
  // `NODE_ENV` no sirve: `next start` también es producción.
  //
  // Y no se pierde nada por no tenerlo: Vercel ya manda
  // `Strict-Transport-Security` con `preload`, que fuerza HTTPS para todo el
  // dominio, y aquí no hay ni un subrecurso en `http://` que ascender.
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          // Legado, por los navegadores que no leen `frame-ancestors`.
          // SAMEORIGIN y no DENY, por el mismo motivo: las demos van en iframe.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nada de esto lo usa el portafolio ni las demos: comprobado que
          // `navigator.geolocation` solo aparece en el parche de Zone.js, que
          // pregunta antes de tocarlo.
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "camera=()",
              "geolocation=()",
              "gyroscope=()",
              "magnetometer=()",
              "microphone=()",
              "payment=()",
              "usb=()",
            ].join(", "),
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },

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
