/**
 * Rótulo de grupo dentro de un panel: "Valores fundamentales", "Lenguajes",
 * "Certificaciones".
 *
 * Existe para que el tamaño mínimo de la letra del CV se decida en un sitio y
 * no en cuatro. Repetido a mano en cada panel había quedado en 0,62rem con
 * 0,32em de interletraje —9,9px con 3,2px de separación—, que en una pantalla
 * al 125% de escala se lee borroso más que pequeño: cada letra cae entre
 * píxeles y el ojo tiene que reconstruirla.
 */
export default function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3.5 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
      {children}
    </p>
  );
}
