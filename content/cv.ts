/**
 * Datos del currículum: fuente única de verdad para las pantallas de CV,
 * Sobre mí y Contacto.
 *
 * Nota de privacidad: aquí solo va el email. El teléfono del CV en PDF queda
 * deliberadamente fuera del repositorio — un número personal publicado en una
 * web no se puede retirar de los cachés que lo indexen.
 */

export type SkillLevel = "Avanzado" | "Intermedio" | "Básico";

export type Skill = {
  name: string;
  level: SkillLevel;
};

export type Experience = {
  id: string;
  role: string;
  /**
   * Etiqueta corta que distingue el puesto: el proyecto concreto o el matiz de
   * la relación laboral. Con dos puestos del mismo cargo para el mismo cliente,
   * es lo único que los diferencia de un vistazo en la línea de tiempo.
   */
  tag: string;
  /** Empresa, si el CV la declara. */
  company?: string;
  /** Periodo, si el CV lo declara. */
  period?: string;
  bullets: string[];
};

export const IDENTITY = {
  firstName: "DABRIAN",
  lastName: "LABRAÑA",
  fullName: "Dabrian Labraña",
  title: "Ingeniero en Informática",
  email: "dabrianla@gmail.com",
} as const;

/**
 * Enlace de redacción de Gmail, ya con el destinatario puesto.
 *
 * `mailto:` abre el cliente que el sistema tenga por defecto, que en un móvil
 * puede ser uno que la persona no usa —o ninguno, y entonces no pasa nada al
 * pulsar—. Esta URL va directa a Gmail: en Android la intercepta la propia app
 * y en escritorio abre Gmail en el navegador. `mailto:` sigue disponible en la
 * dirección de arriba, para quien prefiera su propio cliente.
 */
export const GMAIL_COMPOSE =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(IDENTITY.email)}`;

/**
 * Perfiles públicos, en el orden en que aparecen en Contacto.
 * `handle` es lo que se lee en pantalla; `href` es adónde lleva.
 */
export const LINKS = [
  {
    id: "github",
    label: "GitHub",
    handle: "dabrianla",
    href: "https://github.com/dabrianla",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/dabrian",
    href: "https://www.linkedin.com/in/dabrian/",
  },
] as const;

export const PROFILE =
  "Ingeniero en Informática con experiencia en atención al público y destacadas " +
  "habilidades de comunicación. Combino competencias técnicas con capacidad para " +
  "relacionarme efectivamente en equipos multidisciplinarios. Cuento con experiencia " +
  "en desarrollo web y aplicaciones (WordPress, Elementor, Python/Django, HTML, CSS, " +
  "JavaScript, Ionic) y en documentación técnica de proyectos. Valores fundamentales: " +
  "amabilidad, respeto y adaptabilidad, desarrollados tanto en entornos académicos " +
  "como laborales demandantes.";

/** Los tres valores que el propio CV declara como fundamentales. */
export const VALUES = ["Amabilidad", "Respeto", "Adaptabilidad"] as const;

/**
 * Atributos de la ficha de jugador (pantalla Sobre mí).
 *
 * Deliberadamente **no** son los mismos que `VALUES`. Aquellos son los tres
 * valores que declara el currículum y se quedan en su pestaña de Perfil; estos
 * son los rasgos que le sirven a Dabrian delante de quien contrata, y van
 * ordenados del más empleable al más general porque se leen de izquierda a
 * derecha.
 *
 * Ninguno está inventado: cada uno sale de una frase que ya está en `PROFILE` o
 * en `EXPERIENCE`, aquí arriba.
 */
export const ATTRIBUTES = [
  "Liderazgo de equipo", // EXPERIENCE: coordinación de equipos de practicantes
  "Comunicación", // PROFILE: destacadas habilidades de comunicación
  "Resolución de problemas", // EXPERIENCE: soluciones a problemas emergentes
  "Documentación técnica", // PROFILE: documentación técnica de proyectos
  "Trabajo multidisciplinario", // PROFILE: equipos multidisciplinarios
  "Adaptabilidad", // VALUES
  "Atención al público", // PROFILE: experiencia en atención al público
] as const;

/** Lenguajes con nivel declarado, ordenados de mayor a menor dominio. */
export const SKILLS: Skill[] = [
  { name: "Python", level: "Avanzado" },
  { name: "HTML", level: "Avanzado" },
  { name: "CSS", level: "Avanzado" },
  { name: "Java", level: "Intermedio" },
  { name: "SQL", level: "Intermedio" },
  { name: "JavaScript", level: "Intermedio" },
  { name: "PHP", level: "Básico" },
];

/** Herramientas y frameworks del perfil. El CV no les asigna nivel. */
export const TOOLS = ["WordPress", "Elementor", "Django", "Ionic"] as const;

/**
 * Trayectoria, **de lo más reciente a lo más antiguo**: la pantalla la dibuja
 * como una línea de tiempo descendente y respeta este orden tal cual.
 */
export const EXPERIENCE: Experience[] = [
  {
    id: "rosa-spa-marcacion",
    role: "Desarrollador full stack",
    tag: "Control de horas",
    company: "La Rosa SpA",
    period: "Agosto — Septiembre 2026",
    bullets: [
      "Aplicación de control de horas para el equipo del minimarket: cada persona marca entrada y salida con un PIN en la tablet del mostrador y consulta sus propias horas y su contrato.",
      "Panel de administración con calendario de turnos y reportes semanales y mensuales, con las horas extra ya calculadas.",
      "Liquidaciones de sueldo conformes a la normativa chilena a partir de esas horas: cotizaciones de AFP y salud, seguro de cesantía, gratificación, semana corrida e impuesto único de segunda categoría, con los parámetros guardados por mes de vigencia para que una liquidación emitida no cambie nunca.",
      "Desarrollo completo con Ionic y Angular sobre TypeScript, Firestore como base de datos y Capacitor para empaquetarla como aplicación Android.",
      "Modo local de demostración que corre la lógica real sin tocar los datos del cliente, para poder enseñarla en cualquier navegador.",
    ],
  },
  {
    id: "rosa-spa-inventario",
    role: "Desarrollador full stack",
    tag: "Inventario y punto de venta",
    company: "La Rosa SpA",
    period: "Marzo — Julio 2026",
    bullets: [
      "Sistema de catálogo y precios para el minimarket, con control de stock por lotes y fechas de vencimiento.",
      "Punto de venta con lector de códigos de barras, cálculo de vuelto, varios medios de pago y venta por unidad para productos que se despachan sueltos.",
      "Turnos de caja con apertura y cierre, historial de ventas y avisos automáticos cuando un producto baja del mínimo.",
      "Mismo stack que el proyecto anterior —Ionic, Angular, TypeScript, Firestore y Capacitor—, reutilizando lo aprendido en él.",
    ],
  },
  {
    id: "ofertas-imperdibles",
    role: "Diseñador y programador web · Líder de proyecto",
    tag: "Práctica profesional",
    company: "Ofertas Imperdibles SPA",
    period: "Abril — Julio 2025",
    bullets: [
      "Desarrollo de páginas web con WordPress y Elementor según requerimientos de clientes.",
      "Coordinación y liderazgo de equipos de practicantes en informática, distribuyendo tareas para optimizar tiempos y eficiencia.",
      "Implementación de nuevas soluciones web utilizando Python y Django.",
      "Documentación de los proyectos y elaboración de reportes semanales.",
      "Participación en reuniones de líderes, proponiendo mejoras y soluciones a problemas emergentes.",
    ],
  },
];

export const EDUCATION = {
  institution: "Duoc UC",
  location: "Viña del Mar",
  degree: "Ingeniería en Informática",
  period: "2019 — 2025",
} as const;

export const CERTIFICATIONS = [
  "Gestión de proyectos informáticos",
  "Análisis y desarrollo de modelos de datos",
  "Programación de software",
  "Arquitectura de software",
  "Calidad de software",
  "Inteligencia de negocios",
  "Análisis y planificación de requerimientos informáticos",
] as const;
