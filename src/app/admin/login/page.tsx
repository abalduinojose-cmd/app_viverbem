"use client";
// Tela de login do painel administrativo.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoViverBem } from "@/components/totem/LogoViverBem";

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
      router.push("/admin/produtos");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-royal-claro px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-grafite/10 w-full max-w-md p-8 md:p-10">
        <div className="scale-90">
          <LogoViverBem tamanho="grande" />
        </div>
        <h1 className="text-center text-grafite font-semibold mt-6">Painel Administrativo</h1>

        <form onSubmit={entrar} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-grafite">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
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
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
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
            className="bg-royal hover:bg-royal-escuro disabled:opacity-60 text-white font-bold rounded-xl px-4 py-3.5 mt-2 transition-colors"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
