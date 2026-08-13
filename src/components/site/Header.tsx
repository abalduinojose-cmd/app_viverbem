"use client";
// Cabeçalho do site: fixo no topo, transparente sobre o hero da home e
// sólido (branco com sombra) ao rolar ou nas demais páginas.
// Menu: A Viver Bem (dropdown) · Produtos · Lojas · Contatos.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { asset } from "@/lib/asset";

// Itens do dropdown "A Viver Bem" (âncoras da página Sobre)
const MENU_SOBRE = [
  { href: "/sobre#historia", rotulo: "Nossa história" },
  { href: "/sobre#como-pedir", rotulo: "Como fazer o pedido" },
  { href: "/sobre#avaliacoes", rotulo: "O que dizem os clientes" },
];

const LINKS = [
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/contato", rotulo: "Contatos" },
];

function Seta({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const naHome = pathname === "/";
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [sobreAberto, setSobreAberto] = useState(false);
  // Pequena tolerância ao tirar o mouse, senão o menu fecha no caminho
  const fechamento = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Fecha os menus ao trocar de página
  useEffect(() => {
    setMenuAberto(false);
    setSobreAberto(false);
  }, [pathname]);

  function abrirSobre() {
    if (fechamento.current) clearTimeout(fechamento.current);
    setSobreAberto(true);
  }
  function fecharSobre() {
    fechamento.current = setTimeout(() => setSobreAberto(false), 160);
  }

  const solido = !naHome || rolou || menuAberto;
  const sobreAtivo = pathname.startsWith("/sobre");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solido ? "bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(16,42,74,0.08)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16 md:h-[4.5rem]">
        {/* Logo */}
        <Link href="/" className="shrink-0 active:scale-95 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Manipulação Viver Bem"
            draggable={false}
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Navegação (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {/* A Viver Bem, com dropdown */}
          <div
            className="relative"
            onMouseEnter={abrirSobre}
            onMouseLeave={fecharSobre}
          >
            <button
              type="button"
              onClick={() => setSobreAberto((a) => !a)}
              aria-expanded={sobreAberto}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.95rem] font-medium transition-colors ${
                sobreAtivo || sobreAberto
                  ? "text-royal bg-royal-claro"
                  : "text-grafite-medio hover:text-royal hover:bg-royal-nevoa"
              }`}
            >
              A Viver Bem
              <Seta aberto={sobreAberto} />
            </button>

            {sobreAberto && (
              <div className="absolute left-0 top-full pt-2 animar-surgir">
                <div className="w-60 bg-white rounded-2xl border border-linha shadow-[0_16px_44px_rgba(16,42,74,0.14)] p-2">
                  {MENU_SOBRE.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setSobreAberto(false)}
                      className="block px-4 py-2.5 rounded-xl text-[0.95rem] text-grafite-medio hover:text-royal hover:bg-royal-nevoa transition-colors"
                    >
                      {l.rotulo}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {LINKS.map((l) => {
            const ativo = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-xl text-[0.95rem] font-medium transition-colors ${
                  ativo
                    ? "text-royal bg-royal-claro"
                    : "text-grafite-medio hover:text-royal hover:bg-royal-nevoa"
                }`}
              >
                {l.rotulo}
              </Link>
            );
          })}
          <a
            href="https://wa.me/5524988733934"
            target="_blank"
            rel="noopener noreferrer"
            className="degrade-marca ml-3 inline-flex items-center gap-2 text-white text-sm font-semibold rounded-xl px-5 py-2.5 active:scale-95 transition-transform"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
            </svg>
            Fale conosco
          </a>
        </nav>

        {/* Hambúrguer (celular) */}
        <button
          type="button"
          onClick={() => setMenuAberto((m) => !m)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-grafite transition-colors"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuAberto ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu do celular */}
      {menuAberto && (
        <nav className="md:hidden bg-white border-t border-linha px-4 pb-4 pt-2 flex flex-col gap-1 animar-surgir">
          {/* Grupo A Viver Bem, já aberto (no toque, dropdown só atrapalha) */}
          <p className="px-4 pt-2 pb-1 selo-secao text-grafite-claro">A Viver Bem</p>
          {MENU_SOBRE.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-3 rounded-xl text-base font-medium text-grafite-medio hover:bg-royal-nevoa transition-colors"
            >
              {l.rotulo}
            </Link>
          ))}

          <div className="border-t border-linha my-1.5" aria-hidden="true" />

          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                pathname.startsWith(l.href)
                  ? "text-royal bg-royal-claro"
                  : "text-grafite-medio hover:bg-royal-nevoa"
              }`}
            >
              {l.rotulo}
            </Link>
          ))}
          <a
            href="https://wa.me/5524988733934"
            target="_blank"
            rel="noopener noreferrer"
            className="degrade-marca mt-1 inline-flex items-center justify-center gap-2 text-white font-semibold rounded-xl px-5 py-3.5"
          >
            Fale conosco no WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
