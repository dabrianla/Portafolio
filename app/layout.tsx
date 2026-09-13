import type { Metadata, Viewport } from "next";
import { Anton, Chakra_Petch } from "next/font/google";
import "./globals.css";
import MetalBackground from "@/components/fx/MetalBackground";
import NoiseOverlay from "@/components/fx/NoiseOverlay";
import AudioToggle from "@/components/ui/AudioToggle";
import { AudioProvider } from "@/lib/audio/AudioProvider";
import { TransitionProvider } from "@/lib/transition/TransitionProvider";
import { IDENTITY } from "@/content/cv";

// Anton para los titulares: condensada, muy pesada, con la contundencia de un
// logo de juego de pelea.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

// Chakra Petch para HUD y texto de apoyo: angular y técnica, contrasta con
// Anton sin pelearse con ella.
const chakra = Chakra_Petch({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${IDENTITY.fullName} | ${IDENTITY.title}`,
  description:
    "Portafolio interactivo de Dabrian Labraña, Ingeniero en Informática: proyectos, demos jugables, currículum y sala de logros.",
};

export const viewport: Viewport = {
  themeColor: "#07090c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${anton.variable} ${chakra.variable}`}>
      <body className="antialiased">
        {/* El fondo y el grano viven en el layout, fuera del árbol de rutas:
            así no se remontan en cada navegación y su animación nunca se
            reinicia a mitad de una transición. */}
        <MetalBackground />
        <NoiseOverlay />

        <AudioProvider>
          {/* TransitionProvider consume useAudio, por eso va dentro. */}
          <TransitionProvider>
            {children}
            <div className="fixed bottom-7 right-8 z-30">
              <AudioToggle />
            </div>
          </TransitionProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
