/**
 * Fuente única de verdad de la sala de trofeos.
 *
 * Igual que `menu.ts`, `cv.ts` y `projects.ts`: la rejilla, el contador de
 * progreso y la navegación por teclado salen todos de este array.
 *
 * **Casi nada se escribe aquí a mano.** Las certificaciones, el título, la
 * práctica y las apps con demo se derivan del currículum y de la lista de
 * proyectos, de modo que si mañana cambia un dato allí, el logro cambia solo y
 * no hay dos versiones que cuadrar.
 *
 * Los certificados vivían antes en la pestaña Formación del currículum. Se han
 * movido, no copiado: verlos en dos pantallas debilitaba las dos.
 */

import { CERTIFICATIONS, EDUCATION, EXPERIENCE } from "@/content/cv";
import { PROJECTS } from "@/content/projects";

export type AchievementKind = "certificacion" | "hito" | "objetivo";

export type Achievement = {
  id: string;
  kind: AchievementKind;
  /** `false` en los objetivos: son los que la pantalla dibuja bloqueados. */
  unlocked: boolean;
  title: string;
  /** Qué acredita o qué se consiguió. Es lo que lee el panel de detalle. */
  detail: string;
  /** Quién lo emite o dónde ocurrió. */
  source?: string;
  /** Solo cuando hay una fecha real que la respalde. */
  date?: string;
};

/**
 * Qué acredita cada certificación, en una frase.
 *
 * Son descripciones del área de competencia que nombra cada certificado, no
 * datos añadidos: el currículum solo declara los títulos. Si alguna no
 * describe bien lo que cursaste, se corrige aquí.
 */
const QUE_ACREDITA: Record<string, string> = {
  "Gestión de proyectos informáticos":
    "Planificación, seguimiento y cierre de proyectos de software, con reparto de tareas y control de plazos.",
  "Análisis y desarrollo de modelos de datos":
    "Diseño de modelos de datos y su implementación en bases relacionales.",
  "Programación de software":
    "Construcción de software a partir de requerimientos, aplicando buenas prácticas de codificación.",
  "Arquitectura de software":
    "Decisiones de estructura de un sistema: cómo se separan sus partes y cómo se comunican entre sí.",
  "Calidad de software":
    "Verificación y validación del producto: pruebas, criterios de aceptación y control de defectos.",
  "Inteligencia de negocios":
    "Explotación de datos para apoyar decisiones: indicadores, informes y tableros.",
  "Análisis y planificación de requerimientos informáticos":
    "Levantamiento de necesidades con la contraparte y su traducción a requerimientos verificables.",
};

/** Las siete certificaciones de la carrera, derivadas del currículum. */
const CERTIFICACIONES: Achievement[] = CERTIFICATIONS.map((nombre, i) => ({
  id: `cert-${i + 1}`,
  kind: "certificacion",
  unlocked: true,
  title: nombre,
  detail: QUE_ACREDITA[nombre] ?? "Certificación de la carrera de Ingeniería en Informática.",
  source: EDUCATION.institution,
}));

/** La práctica profesional, tal y como la declara el currículum. */
const practica = EXPERIENCE.find((puesto) => puesto.id === "ofertas-imperdibles");

const HITOS: Achievement[] = [
  {
    id: "titulo",
    kind: "hito",
    unlocked: true,
    title: EDUCATION.degree,
    detail:
      "Carrera completa en " +
      `${EDUCATION.institution}, ${EDUCATION.location}, incluidas las siete ` +
      "certificaciones de competencia de esta misma sala.",
    source: EDUCATION.institution,
    date: EDUCATION.period,
  },

  ...(practica
    ? [
        {
          id: "practica",
          kind: "hito" as const,
          unlocked: true,
          title: "Práctica profesional completada",
          detail:
            "Desarrollo web con WordPress, Elementor, Python y Django, " +
            "coordinando además un equipo de practicantes.",
          source: practica.company,
          date: practica.period,
        },
      ]
    : []),

  // Una entrada por proyecto que el visitante puede abrir y usar aquí mismo.
  // Sale de la misma lista que alimenta el selector de Proyectos.
  //
  // Se usa el `tagline` y no el `description`: ese último es un párrafo escrito
  // para la ficha expandida del selector, y aquí desbordaba la franja de
  // detalle. Quien quiera la explicación larga la tiene en Proyectos.
  ...PROJECTS.filter((proyecto) => proyecto.status === "live").map((proyecto) => ({
    id: `proyecto-${proyecto.id}`,
    kind: "hito" as const,
    unlocked: true,
    title: `${proyecto.name}: demo jugable`,
    detail: `${proyecto.tagline}, con demostración que se abre y se usa desde el navegador, sin instalar nada.`,
    source: proyecto.tagline,
  })),
];

/**
 * Lo que queda por delante.
 *
 * Estos no son hechos comprobables como los de arriba, así que se escriben en
 * positivo —metas en curso, no carencias— y se limitan a cosas que el propio
 * repositorio o el currículum ya dan por pendientes.
 */
const OBJETIVOS: Achievement[] = [
  {
    id: "objetivo-publicar",
    kind: "objetivo",
    unlocked: false,
    title: "Portafolio en línea",
    detail: "Publicar este sitio con una dirección propia que se pueda compartir.",
  },
  {
    id: "objetivo-repositorio",
    kind: "objetivo",
    unlocked: false,
    title: "Código abierto en GitHub",
    detail: "Publicar el repositorio del portafolio para que se pueda revisar el código.",
  },
  {
    id: "objetivo-tercer-proyecto",
    kind: "objetivo",
    unlocked: false,
    title: "Tercer proyecto con demo",
    detail:
      "Llenar la siguiente casilla del selector con otra aplicación que se " +
      "pueda probar desde el navegador, sin instalar nada.",
  },
  {
    id: "objetivo-concurso",
    kind: "objetivo",
    unlocked: false,
    title: "Presentación en concurso municipal",
    detail:
      "Retomar la aplicación para emprendedores de zonas recreativas y " +
      "presentarla al concurso para el que se desarrolló.",
  },
];

export const ACHIEVEMENTS: Achievement[] = [...HITOS, ...CERTIFICACIONES, ...OBJETIVOS];

/** Cuántos hay conseguidos, para el marcador de la pantalla. */
export const UNLOCKED_COUNT = ACHIEVEMENTS.filter((logro) => logro.unlocked).length;

/** Etiqueta corta de cada tipo, para la insignia de la tarjeta. */
export const KIND_LABEL: Record<AchievementKind, string> = {
  certificacion: "Certificación",
  hito: "Hito",
  objetivo: "Objetivo",
};
