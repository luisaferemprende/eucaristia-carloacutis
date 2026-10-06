import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El indicador de dev de Next.js se superponía sobre la barra de navegación
  // inferior en las capturas a 375px (hallazgo real del revisor-visual).
  devIndicators: false,
};

export default nextConfig;
