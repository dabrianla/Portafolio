"use client";

import SkillMeter from "@/components/cv/SkillMeter";
import PanelHeading from "@/components/ui/PanelHeading";
import Tag from "@/components/ui/Tag";
import { SKILLS, TOOLS } from "@/content/cv";

export default function SkillsPanel() {
  return (
    <div className="space-y-8">
      <div>
        <PanelHeading>Lenguajes</PanelHeading>
        <ul className="max-w-2xl space-y-3">
          {SKILLS.map((skill, i) => (
            <SkillMeter key={skill.name} skill={skill} index={i} />
          ))}
        </ul>
      </div>

      <div>
        <PanelHeading>Herramientas y frameworks</PanelHeading>
        <div className="flex flex-wrap gap-2.5">
          {TOOLS.map((tool) => (
            <Tag key={tool}>{tool}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
