import AboutScreen from "@/components/about/AboutScreen";
import SectionShell from "@/components/ui/SectionShell";

export default function Page() {
  return (
    <SectionShell title="SOBRE MÍ" sub="Perfil del jugador" layout="wide">
      <AboutScreen />
    </SectionShell>
  );
}
