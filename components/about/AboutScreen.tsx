import PanelHeading from "@/components/ui/PanelHeading";
import Tag from "@/components/ui/Tag";
import { ATTRIBUTES, EDUCATION, IDENTITY, PROFILE, SKILLS } from "@/content/cv";

/** Datos rápidos de la ficha. Todos salen del CV; ninguno es inventado. */
const STATS = [
  { label: "Título", value: IDENTITY.title },
  { label: "Casa de estudios", value: `${EDUCATION.institution}, ${EDUCATION.location}` },
  { label: "Formación", value: EDUCATION.period },
  {
    // Los lenguajes de nivel avanzado, tomados de la misma lista que alimenta
    // los medidores del CV: si allí cambia un nivel, esto se actualiza solo.
    label: "Stack principal",
    value: SKILLS.filter((skill) => skill.level === "Avanzado")
      .map((skill) => skill.name)
      .join(" · "),
  },
];

/**
 * Ficha de jugador: quién es, en el mismo lenguaje visual que el resto.
 *
 * Sin foto a propósito. La única que hay es la del currículum, y repetirla aquí
 * no aportaba nada: cada sección tiene lo suyo.
 */
export default function AboutScreen() {
  return (
    // El scroll interno que había aquí en móvil ya no hace falta: la página
    // scrollea. Era además un parche sobre el síntoma —dejaba alcanzable el
    // final de la ficha, pero no el título de la sección, que quedaba recortado
    // por arriba fuera de este contenedor.
    //
    // El `pr` de escritorio reserva la esquina del interruptor de sonido, que
    // va fijo ahí abajo a la derecha: sin él, el último dato de la ficha acaba
    // por debajo del botón.
    <div className="w-full space-y-8 lg:pr-24 xl:pr-32">
      {/* Sin `backdrop-blur`: desenfocar el fondo obliga al navegador a sacar
          la caja a su propia capa, y el texto de dentro pierde el suavizado
          subpíxel. Un fondo algo más opaco calma igual las vetas de detrás sin
          costar nitidez. */}
      <div className="clip-blade max-w-3xl border-l-4 border-l-[var(--accent)] bg-steel-900/85 py-6 pl-7 pr-12">
        <p className="font-tech text-[0.92rem] leading-relaxed text-steel-200 sm:text-[1rem]">
          {PROFILE}
        </p>
      </div>

      <div>
        <PanelHeading>Atributos</PanelHeading>
        <div className="flex flex-wrap gap-2.5">
          {ATTRIBUTES.map((attribute) => (
            <Tag key={attribute}>{attribute}</Tag>
          ))}
        </div>
      </div>

      <dl className="grid max-w-3xl gap-x-10 gap-y-5 sm:grid-cols-2">
        {STATS.map((stat) => (
          <div key={stat.label} className="border-l-2 border-l-steel-600 pl-4">
            <dt className="font-tech text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-steel-400">
              {stat.label}
            </dt>
            <dd className="mt-1.5 font-tech text-[0.92rem] text-steel-100">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
