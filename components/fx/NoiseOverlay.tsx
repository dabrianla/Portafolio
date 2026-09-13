/**
 * Capa de grano fílmico sobre toda la interfaz.
 *
 * El ruido es un SVG (`feTurbulence`) embebido como data URI y usado como
 * `background-image`: el navegador lo rasteriza una sola vez, a diferencia de
 * un `<svg>` con filtro en el DOM, que se recalcularía en cada frame. El
 * temblor lo produce una animación CSS de `transform` con `steps()`, que es
 * gratis y da el parpadeo entrecortado de textura analógica.
 */
export default function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="noise-layer pointer-events-none fixed inset-0 z-40 opacity-[0.14] mix-blend-overlay"
    />
  );
}
