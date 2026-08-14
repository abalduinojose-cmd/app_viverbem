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
  const [verSenha, setVerSenha] = useState(false);

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

  const campo =
    "w-full bg-white border border-linha rounded-xl pl-11 pr-4 py-3.5 text-grafite placeholder:text-grafite-claro/70 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition-shadow";

  return (
    <div className="flex-1 flex items-center justify-center bg-noite px-4 py-10 relative overflow-hidden">
      {/* Mesmo brilho das seções escuras do site */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 20% 0%, rgba(47,124,196,0.45), transparent 60%), radial-gradient(70% 50% at 100% 100%, rgba(224,33,41,0.2), transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-[1.75rem] shadow-[0_24px_60px_rgba(5,17,33,0.35)] p-7 sm:p-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Manipulação Viver Bem"
            draggable={false}
            width={220}
            height={97}
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
              <div className="relative">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grafite-claro"
                >
                  <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m3.8 7 7.2 5.4a1.7 1.7 0 0 0 2 0L20.2 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  className={campo}
                  placeholder="voce@viverbem.com.br"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">Senha</span>
              <div className="relative">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grafite-claro"
                >
                  <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  type={verSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`${campo} pr-12`}
                  placeholder="••••••••"
                />
                {/* Ver a senha evita metade dos erros de digitação */}
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg text-grafite-claro hover:text-royal hover:bg-royal-nevoa flex items-center justify-center transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7" />
                    {verSenha && (
                      <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
              </div>
            </label>

            {erro && (
              <p className="bg-escarlate/10 text-escarlate text-sm font-medium rounded-xl px-4 py-3 animar-surgir">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="degrade-marca disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-3.5 mt-1 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              {carregando && (
                <span
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                />
              )}
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-white/40 text-xs text-center mt-6 leading-relaxed">
          Esqueceu a senha? Peça ao gestor para gerar uma nova
          <br />
          em Acessos ao painel.
        </p>

        <a
          href="/"
          className="mt-4 flex items-center justify-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
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
