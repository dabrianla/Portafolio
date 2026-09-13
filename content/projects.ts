/**
 * Fuente única de verdad de la selección de proyectos.
 *
 * Igual que `menu.ts` y `cv.ts`: añadir un proyecto es añadir una entrada aquí.
 * Las casillas bloqueadas del selector también viven en esta lista, para que la
 * rejilla y la navegación se deriven de un único array y no haya que cuadrar
 * dos sitios.
 */

export type ProjectStatus = "live" | "coming-soon";

/** Un acceso que se muestra al visitante para que pueda entrar en la demo. */
export type DemoCredential = {
  label: string;
  value: string;
  /** Para qué sirve: ayuda a saber qué probar primero. */
  hint: string;
};

export type ProjectDemo = {
  /** Ruta de la app empotrada, servida desde `public/`. */
  src: string;
  credentials: DemoCredential[];
  /**
   * Prefijo de las claves que la demo guarda en localStorage. Se usa para
   * reiniciarla dejándola como recién sembrada.
   */
  storagePrefix: string;
};

export type Project = {
  id: string;
  status: ProjectStatus;
  /** Nombre corto para la casilla del selector. */
  code: string;
  name: string;
  tagline: string;
  /** Para quién es y qué resuelve. */
  description: string;
  stack: string[];
  /** Lo que el visitante debería mirar dentro de la demo. */
  highlights: string[];
  demo?: ProjectDemo;
};

export const PROJECTS: Project[] = [
  {
    id: "marcacion-rosa-spa",
    status: "live",
    code: "MRS",
    name: "MARCACIÓN ROSA SPA",
    tagline: "Control de horas para un minimarket",
    description:
      "El equipo marca entrada y salida con un PIN en la tablet del mostrador, " +
      "cada persona revisa sus horas y su contrato, y el administrador planifica " +
      "turnos en un calendario y saca los totales semanales y mensuales con las " +
      "horas extra ya calculadas. De esas horas salen las liquidaciones de sueldo: " +
      "AFP, salud, seguro de cesantía, semana corrida e impuesto único, con la " +
      "hoja lista para imprimir.",
    stack: ["Ionic", "Angular", "TypeScript", "Firestore", "Capacitor"],
    highlights: [
      "Marca con el PIN 1111 y mira cómo aparece el turno abierto",
      "Entra a Administración para ver el calendario de turnos",
      "Revisa Reportes: totales semanales con horas extra calculadas",
      "Abre Sueldos y mira una liquidación: cada descuento legal, al peso",
    ],
    demo: {
      src: "/demos/marcacion/",
      storagePrefix: "mrs:",
      credentials: [
        { label: "PIN de empleada", value: "1111", hint: "Rosa Álvarez, en el kiosco" },
        { label: "Administración", value: "admin@rosaspa.cl", hint: "Correo de acceso" },
        { label: "Contraseña", value: "rosa2026", hint: "Solo para esta demostración" },
      ],
    },
  },

  {
    id: "miniapp-inventario",
    status: "live",
    code: "INV",
    name: "MINIAPP INVENTARIO",
    tagline: "Inventario y punto de venta",
    description:
      "Control de stock con lector de códigos de barras y caja registradora para " +
      "un minimarket: catálogo con lotes y vencimientos, punto de venta con " +
      "vuelto y varios medios de pago, turnos de caja con su cierre, avisos de " +
      "stock bajo y venta de cigarros por unidad.",
    stack: ["Ionic", "Angular", "TypeScript", "Firestore", "Capacitor"],
    highlights: [
      "Abre el Punto de venta y arma un carrito: el escáner está simulado",
      "Mira Productos: hay lotes, vencimientos cercanos y stock bajo el mínimo",
      "Entra con la cuenta de administración para ver el panel y el historial",
    ],
    demo: {
      src: "/demos/miniapp/",
      storagePrefix: "miniapp:",
      credentials: [
        { label: "Administración", value: "admin@miniapp.cl", hint: "Correo de acceso" },
        { label: "Contraseña", value: "miniapp2026", hint: "Solo para esta demostración" },
        { label: "Vendedor", value: "vendedor@miniapp.cl", hint: "Misma contraseña, rol limitado" },
      ],
    },
  },

  // Casillas por llenar: completan la primera página del selector y dejan claro
  // que la sección va a crecer, en lugar de dejar huecos vacíos. A partir del
  // séptimo proyecto la rejilla crea una segunda página sola y las flechas de
  // paso se activan.
  ...Array.from({ length: 4 }, (_, i): Project => ({
    id: `proximamente-${i + 1}`,
    status: "coming-soon",
    code: "??",
    name: "PRÓXIMAMENTE",
    tagline: "Ranura libre",
    description: "Este espacio está reservado para el siguiente proyecto.",
    stack: [],
    highlights: [],
  })),
];

/** Los proyectos que se pueden seleccionar; las casillas bloqueadas no cuentan. */
export function isSelectable(project: Project): boolean {
  return project.status === "live";
}
