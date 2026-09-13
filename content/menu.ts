/**
 * Fuente única de verdad del menú principal.
 * Añadir, quitar o reordenar secciones se hace SOLO aquí: la lista, la
 * navegación por teclado, el contador del HUD y las rutas destino derivan
 * todos de este array.
 */
export type MenuEntry = {
  /** Identificador estable, usado como key de React y en los data-attributes. */
  id: string;
  /** Etiqueta grande que ve el usuario. */
  label: string;
  /** Subtítulo pequeño en la fila del item. */
  sub: string;
  /** Ruta destino. */
  href: string;
  /** Color de acento de la sección: tiñe el ki, el borde y el wipe de entrada. */
  accent: string;
  /** Segundo color del wipe diagonal hacia esa sección. */
  accentAlt: string;
};

export const MENU: MenuEntry[] = [
  {
    id: "proyectos",
    label: "PROYECTOS",
    sub: "Selecciona tu personaje",
    href: "/proyectos",
    accent: "#00E5FF",
    accentAlt: "#FF2D95",
  },
  {
    id: "curriculum",
    label: "CURRICULUM",
    sub: "Ficha de combate",
    href: "/cv",
    accent: "#FF2D95",
    accentAlt: "#00E5FF",
  },
  {
    id: "logros",
    label: "LOGROS",
    sub: "Sala de trofeos",
    href: "/logros",
    accent: "#00E5FF",
    accentAlt: "#7C4DFF",
  },
  {
    id: "sobre-mi",
    label: "SOBRE MÍ",
    sub: "Perfil del jugador",
    href: "/sobre-mi",
    accent: "#FF2D95",
    accentAlt: "#7C4DFF",
  },
  {
    id: "contacto",
    label: "CONTACTO",
    sub: "Enviar señal",
    href: "/contacto",
    accent: "#00E5FF",
    accentAlt: "#FF2D95",
  },
];

/** Busca la entrada del menú que corresponde a una ruta. */
export function entryByHref(href: string): MenuEntry | undefined {
  return MENU.find((entry) => entry.href === href);
}
