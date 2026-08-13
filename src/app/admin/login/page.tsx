"use client";
// Tela de login do painel administrativo.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";

export default function PaginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível entrar.");
        return;
      }
      // /admin decide o destino pelo papel: gestor vai para a visao
      // geral, operador para os produtos
      router.push("/admin");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-royal-nevoa px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-[1.75rem] border border-linha sombra-card p-7 sm:p-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Manipulação Viver Bem"
            draggable={false}
            className="h-11 w-auto object-contain mx-auto"
          />
          <h1 className="font-display text-xl font-semibold text-grafite text-center mt-5">
            Painel do gestor
          </h1>
          <p className="text-grafite-claro text-sm text-center mt-1">
            Entre para gerenciar produtos e pedidos.
          </p>

          <form onSubmit={entrar} className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                className="bg-white border border-linha rounded-xl px-4 py-3 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition-shadow"
                placeholder="admin@viverbem.com.br"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">Senha</span>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-white border border-linha rounded-xl px-4 py-3 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition-shadow"
                placeholder="••••••••"
              />
            </label>

            {erro && (
              <p className="bg-escarlate/10 text-escarlate text-sm font-medium rounded-xl px-4 py-3">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="degrade-marca disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-3.5 mt-1 transition-all active:scale-[0.98]"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <a
          href="/"
          className="mt-5 flex items-center justify-center gap-2 text-sm text-grafite-claro hover:text-royal transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar para o site
        </a>
      </div>
    </div>
  );
}
