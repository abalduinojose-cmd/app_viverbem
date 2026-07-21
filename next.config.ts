import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Esconde o indicador de desenvolvimento do Next.js (o botão flutuante
  // no canto da tela) — no totem ele não deve aparecer.
  devIndicators: false,

  // Permite abrir o app em outros aparelhos da mesma rede (tablet do
  // balcão) durante o desenvolvimento. Ajuste o IP se a rede mudar.
  allowedDevOrigins: ["192.168.10.4", "192.168.10.*"],
};

export default nextConfig;
