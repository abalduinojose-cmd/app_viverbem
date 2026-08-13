import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Kaushan_Script } from "next/font/google";
import "./globals.css";

// Fraunces: títulos — serif expressiva que ecoa o serif do logo
// ("MANIPULAÇÃO E HOMEOPATIA") e dá o ar de boticário premium
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Inter: corpo — altamente legível, moderna e neutra
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Kaushan Script: usada só no fallback do wordmark "Viver Bem"
const kaushan = Kaushan_Script({
  variable: "--font-kaushan",
  subsets: ["latin"],
  weight: "400",
});

// Endereço público do site (troque pela URL do domínio próprio no deploy,
// via variável NEXT_PUBLIC_SITE_URL — usada nos links de compartilhamento)
const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Manipulação Viver Bem · Manipulação e Homeopatia em Petrópolis",
    template: "%s",
  },
  description:
    "Há 19 anos em Petrópolis: fórmulas manipuladas, homeopatia e saúde personalizada. Monte seu pedido pelo site e finalize no WhatsApp.",
  openGraph: {
    siteName: "Manipulação Viver Bem",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} ${kaushan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
