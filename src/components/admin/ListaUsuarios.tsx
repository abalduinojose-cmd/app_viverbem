"use client";
// Controle de acessos ao painel, exclusivo do gestor: criar acesso de
// operador, desligar quem saiu da equipe e trocar senha esquecida.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAPEL_ADMIN, PAPEL_OPERADOR } from "@/lib/tipos";
import { CabecalhoAdmin } from "./PecasAdmin";

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
  ultimoAcesso: string | null;
  criadoEm: string;
}

function formatarData(iso: string | null) {
  if (!iso) return "nunca entrou";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ListaUsuarios({
  usuarios,
  meuId,
}: {
  usuarios: UsuarioDTO[];
  meuId: number;
}) {
  const router = useRouter();
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState(PAPEL_OPERADOR);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setOcupado(true);
    try {
      const r = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, papel }),
      });
      const dados = await r.json();
      if (!r.ok) {
        setErro(dados.erro ?? "Não foi possível criar o acesso.");
        return;
      }
      setNome("");
      setEmail("");
      setSenha("");
      setPapel(PAPEL_OPERADOR);
      setCriando(false);
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function alternarAtivo(u: UsuarioDTO) {
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !u.ativo }),
    });
    const dados = await r.json();
    if (!r.ok) setErro(dados.erro ?? "Não foi possível alterar.");
    router.refresh();
  }

  async function trocarSenha(u: UsuarioDTO) {
    const nova = window.prompt(`Nova senha para ${u.nome} (mínimo 6 caracteres):`);
    if (!nova) return;
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: nova }),
    });
    const dados = await r.json();
    if (!r.ok) setErro(dados.erro ?? "Não foi possível trocar a senha.");
    else window.alert(`Senha de ${u.nome} atualizada.`);
  }

  async function remover(u: UsuarioDTO) {
    if (!window.confirm(`Remover o acesso de ${u.nome} de vez?`)) return;
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, { method: "DELETE" });
    const dados = await r.json();
    if (!r.ok) setErro(dados.erro ?? "Não foi possível remover.");
    router.refresh();
  }

  const campo =
    "bg-white border border-linha rounded-xl px-4 py-3 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition-shadow";

  return (
    <div className="max-w-3xl">
      <CabecalhoAdmin
        titulo="Acessos ao painel"
        descricao="Quem pode entrar e o que cada um consegue fazer."
        acao={!criando ? (
          <button
            type="button"
            onClick={() => setCriando(true)}
            className="degrade-marca inline-flex items-center justify-center gap-2 text-white font-semibold rounded-xl px-5 py-3.5 active:scale-95 transition-transform"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Novo acesso
          </button>
        ) : undefined}
      />

      {erro && (
        <p className="bg-escarlate/10 text-escarlate text-sm font-medium rounded-xl px-4 py-3 mt-5">
          {erro}
        </p>
      )}

      {/* Criação */}
      {criando && (
        <form
          onSubmit={criar}
          className="bg-white rounded-2xl border border-linha p-5 mt-5 flex flex-col gap-4 animar-surgir"
        >
          <h2 className="font-semibold text-grafite">Novo acesso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">Nome</span>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required className={campo} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={campo}
                placeholder="pessoa@viverbem.com.br"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">Senha</span>
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className={campo}
                placeholder="mínimo 6 caracteres"
              />
            </label>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-grafite">Permissão</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: PAPEL_OPERADOR, r: "Operador" },
                  { v: PAPEL_ADMIN, r: "Gestor" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setPapel(o.v)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium border transition-colors ${
                      papel === o.v
                        ? "bg-royal text-white border-royal"
                        : "bg-white text-grafite border-linha hover:border-royal/40"
                    }`}
                  >
                    {o.r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-grafite-claro text-xs leading-relaxed">
            O <b className="text-grafite-medio">operador</b> só mexe em produtos e preços,
            sem apagar nem reordenar. O <b className="text-grafite-medio">gestor</b> vê os
            números, os clientes captados, o log e controla os acessos.
          </p>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={ocupado}
              className="bg-royal hover:bg-royal-escuro disabled:opacity-60 text-white font-semibold rounded-xl px-5 py-3 transition-colors"
            >
              {ocupado ? "Criando..." : "Criar acesso"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCriando(false);
                setErro("");
              }}
              className="text-grafite-medio hover:text-grafite font-medium px-5 py-3"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      <div className="flex flex-col gap-3 mt-5">
        {usuarios.map((u) => {
          const souEu = u.id === meuId;
          return (
            <div
              key={u.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 ${
                u.ativo ? "border-linha" : "border-linha opacity-70"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-white ${
                    u.ativo ? "degrade-marca" : "bg-grafite-claro"
                  }`}
                >
                  {u.nome.charAt(0).toUpperCase()}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-grafite truncate">{u.nome}</p>
                    <span
                      className={`text-[0.65rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        u.papel === PAPEL_ADMIN
                          ? "bg-royal-claro text-royal"
                          : "bg-royal-nevoa text-grafite-medio border border-linha"
                      }`}
                    >
                      {u.papel === PAPEL_ADMIN ? "Gestor" : "Operador"}
                    </span>
                    {souEu && (
                      <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-grafite-claro">
                        você
                      </span>
                    )}
                    {!u.ativo && (
                      <span className="text-[0.65rem] font-semibold tracking-wider uppercase bg-escarlate/10 text-escarlate px-2 py-0.5 rounded-full">
                        desligado
                      </span>
                    )}
                  </div>
                  <p className="text-grafite-medio text-sm truncate mt-0.5">{u.email}</p>
                  <p className="text-grafite-claro text-xs mt-1">
                    Último acesso: {formatarData(u.ultimoAcesso)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-linha">
                <button
                  type="button"
                  onClick={() => trocarSenha(u)}
                  className="text-sm font-medium text-grafite-medio hover:text-royal border border-linha hover:border-royal/40 rounded-xl px-4 py-2.5 transition-colors"
                >
                  Trocar senha
                </button>
                {!souEu && (
                  <>
                    <button
                      type="button"
                      onClick={() => alternarAtivo(u)}
                      className="text-sm font-medium text-grafite-medio hover:text-royal border border-linha hover:border-royal/40 rounded-xl px-4 py-2.5 transition-colors"
                    >
                      {u.ativo ? "Desligar acesso" : "Religar acesso"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remover(u)}
                      className="text-sm font-medium text-grafite-claro hover:text-escarlate border border-linha hover:border-escarlate/40 rounded-xl px-4 py-2.5 transition-colors ml-auto"
                    >
                      Remover
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
