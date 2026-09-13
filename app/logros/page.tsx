import AchievementsScreen from "@/components/achievements/AchievementsScreen";
import SectionShell from "@/components/ui/SectionShell";

export default function Page() {
  return (
    <SectionShell title="LOGROS" sub="Sala de trofeos" layout="wide">
      <AchievementsScreen />
    </SectionShell>
  );
}
