"use client";

import { motion } from "framer-motion";

/**
 * Envoltorio de entrada de cada ruta.
 *
 * Next remonta `template.tsx` en cada navegación, lo que lo hace ideal para la
 * animación de *entrada*. La de *salida* no se hace aquí: la cubren los paneles
 * diagonales de `TransitionProvider`, que sobreviven al cambio de página.
 *
 * El fundido es corto a propósito: ocurre por debajo del wipe, y su único
 * trabajo es evitar que un frame de contenido sin estilar asome si la ruta
 * monta antes de tiempo.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
