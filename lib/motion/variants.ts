import type { Variants } from "framer-motion";

/**
 * Variants compartidos por el menú.
 *
 * Todas las propiedades animadas son `transform` y `opacity` (más `filter` en
 * la salida, que también está acelerado): ninguna dispara layout ni repaint,
 * que es lo que mantiene la secuencia a 60fps.
 */

/** Contenedor de la lista: escalona la entrada de los items. */
export const menuListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.25 },
  },
  /**
   * Salida al confirmar. El escalonado invertido hace que los items de abajo
   * salgan primero, lo que lee como un latigazo en lugar de un bloque plano.
   */
  leaving: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

/** Item individual del menú. */
export const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -80, skewX: -18 },
  visible: {
    opacity: 1,
    x: 0,
    skewX: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
  /** No seleccionado al confirmar: sale disparado a la derecha con blur. */
  leaving: {
    opacity: 0,
    x: 420,
    skewX: -24,
    filter: "blur(8px)",
    transition: { duration: 0.26, ease: [0.4, 0, 0.9, 0.4] },
  },
  /** Seleccionado al confirmar: destello y arranque hacia la izquierda. */
  chosen: {
    opacity: 0,
    x: -260,
    scale: 1.08,
    filter: "blur(4px)",
    transition: { duration: 0.38, ease: [0.6, 0, 0.2, 1], delay: 0.08 },
  },
};

/** Bloque del nombre en la columna izquierda. */
export const brandVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
  leaving: {
    opacity: 0,
    x: -120,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};
