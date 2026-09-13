import FullFigure from "@/components/cv/FullFigure";
import PanelHeading from "@/components/ui/PanelHeading";
import Tag from "@/components/ui/Tag";
import { PROFILE, VALUES } from "@/content/cv";

export default function ProfilePanel() {
  return (
    // `items-start` en todos los tamaños, no solo desde `sm`: al apilar en
    // columna, el valor por defecto (`stretch`) ensanchaba la figura a la
    // columna entera y descuadraba las capas del glitch que lleva dentro.
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-7">
      <FullFigure />

      <div className="min-w-0 space-y-7">
        <p className="max-w-2xl font-tech text-[0.92rem] leading-relaxed text-steel-200 sm:text-[1rem]">
          {PROFILE}
        </p>

        <div>
          <PanelHeading>Valores fundamentales</PanelHeading>
          <div className="flex flex-wrap gap-2.5">
            {VALUES.map((value) => (
              <Tag key={value}>{value}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
