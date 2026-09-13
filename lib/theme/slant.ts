/**
 * El sesgo de las etiquetas, como recorte en vez de transformación.
 *
 * Toda la interfaz comparte un sesgo de ~12°. Durante mucho tiempo se conseguía
 * con `-skew-x-12` en la caja y `skew-x-12` en el texto para devolverlo a la
 * vertical: a la vista se cancelan, pero el navegador acaba rasterizando la
 * letra a través de una transformación y pierde el suavizado subpíxel. En una
 * pantalla al 125% de escala, a 10-11px, eso se lee directamente como texto
 * borroso.
 *
 * Recortando la silueta la forma es exactamente la misma y el texto no se
 * transforma. Vive aquí, junto a la geometría del rayo, para que el ángulo se
 * decida en un solo sitio: `Tag`, `TechColumn` y la chapa de Experiencia usan
 * estas mismas funciones.
 */

/** Desplazamiento por defecto entre el borde superior y el inferior, en px.
 *  Equivale al sesgo de ~12° a la altura típica de una etiqueta (~30px). */
export const SLANT = 7;

/** Silueta de la etiqueta: un paralelogramo inclinado hacia la derecha. */
export function slantClip(slant: number = SLANT) {
  return `polygon(${slant}px 0, 100% 0, calc(100% - ${slant}px) 100%, 0 100%)`;
}

/** Filo de acento siguiendo el corte izquierdo, en lugar de un `border-left`
 *  recto que el recorte se llevaría por delante. */
export function slantEdgeClip(width = 2, slant: number = SLANT) {
  return `polygon(${slant}px 0, ${slant + width}px 0, ${width}px 100%, 0 100%)`;
}
