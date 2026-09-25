import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EucaristíaViva — 3 minutos al día con la Eucaristía",
  description:
    "Vive la Eucaristía a fondo en 3 minutos al día. La Autopista de 3 Minutos: el pensamiento diario de los santos, un milagro eucarístico, tu diario espiritual privado y tu novena con la comunidad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${dmSans.variable} min-h-dvh antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=zodiak@400,700&display=swap"
        />
      </head>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
