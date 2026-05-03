import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./v2.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ether.fi Cash · v2 · Simulador",
  description:
    "Versão modernista brasileira do simulador ether.fi Cash — concreto cru, vermelho tijolo, curvas.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`v2-root ${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      {children}
    </div>
  );
}
