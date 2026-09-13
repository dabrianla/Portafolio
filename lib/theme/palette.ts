/**
 * Tokens de color en JS, para lo que no puede vivir en CSS: timelines de GSAP
 * y estilos inline calculados. Los mismos valores están declarados como
 * variables CSS en `app/globals.css` (@theme) — si cambias uno, cambia ambos.
 */
export const PALETTE = {
  /** Grises metálicos, de la sombra más profunda al brillo del acero. */
  steel: {
    950: "#07090c",
    900: "#0e1116",
    800: "#171b22",
    700: "#232932",
    600: "#333b47",
    500: "#4a5462",
    400: "#6b7686",
    300: "#98a2b0",
  },
  /** Acentos. */
  cyan: "#00E5FF",
  magenta: "#FF2D95",
  violet: "#7C4DFF",
  white: "#F2F5F8",
} as const;

/**
 * Aplica el acento de una sección como variables CSS globales.
 * Lo consumen los componentes vía `var(--accent)` / `var(--accent-alt)`,
 * lo que permite recolorear toda la pantalla en un solo escritura de estilo
 * en lugar de propagar props de color por todo el árbol.
 */
export function applyAccent(accent: string, accentAlt: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-alt", accentAlt);
}
