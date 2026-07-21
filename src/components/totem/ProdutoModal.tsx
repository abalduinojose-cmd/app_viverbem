"use client";
// Detalhe do produto em tela cheia (modal) — aberto ao tocar num card.
// Aqui o cliente escolhe a dosagem (se houver), a quantidade, e pode:
//  - adicionar ao carrinho (pedido enviado por WhatsApp no final), ou
//  - chamar direto no WhatsApp com mensagem pronta sobre o item.

import { useState } from "react";
import { ProdutoDTO, TIPO_COMBO, listarDosagens } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { useCarrinho } from "@/lib/carrinho";
import { FotoProduto } from "./FotoProduto";

export function ProdutoModal({
  produto,
  aoFechar,
}: {
  produto: ProdutoDTO;
  aoFechar: () => void;
}) {
  const { adicionar } = useCarrinho();
  const dosagens = listarDosagens(produto.dosagens);
  const [dosagem, setDosagem] = useState<string | null>(dosagens[0] ?? null);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  function adicionarAoCarrinho() {
    adicionar(
      {
        produtoId: produto.id,
        nome: produto.nome,
        precoCentavos: produto.precoCentavos,
        dosagem,
        fotoUrl: produto.fotoUrl,
      },
      quantidade
    );
    // Feedback rápido e fecha para o cliente continuar navegando
    setAdicionado(true);
    setTimeout(aoFechar, 700);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-grafite/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      onClick={aoFechar}
    >
      <div
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto relative animar-surgir md:grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar — flutuante, discreto */}
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur border border-linha text-grafite-medio hover:text-grafite rounded-full w-11 h-11 flex items-center justify-center sombra-card active:scale-90 transition-transform"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* ---------- Coluna da foto ---------- */}
        <div className="relative bg-gradient-to-b from-royal-nevoa to-royal-claro/70 flex items-center justify-center h-64 md:h-full md:min-h-[26rem] p-8">
          {/* Selos sobre a foto */}
          <div className="absolute top-5 left-5 flex flex-col gap-2 items-start">
            {produto.novidade && (
              <span className="bg-escarlate text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                NOVIDADE
              </span>
            )}
            {produto.tipo === TIPO_COMBO && (
              <span className="bg-royal text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                COMBO
              </span>
            )}
          </div>
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="max-w-full max-h-full !object-contain drop-shadow-lg"
          />
        </div>

        {/* ---------- Coluna das informações ---------- */}
        <div className="p-6 md:p-8 flex flex-col">
          {produto.categoriaNome && (
            <span className="self-start text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-royal bg-royal-claro px-3 py-1.5 rounded-full">
              {produto.categoriaNome}
            </span>
          )}

          <h2 className="text-2xl md:text-[2rem] font-bold text-grafite mt-4 tracking-tight leading-tight">
            {produto.nome}
          </h2>
          <p className="text-grafite-medio text-base mt-3 leading-relaxed">{produto.descricao}</p>

          {/* Escolha da dosagem (só aparece se o produto tiver opções) */}
          {dosagens.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-grafite mb-2.5">Escolha a dosagem</p>
              <div className="flex flex-wrap gap-2.5">
                {dosagens.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDosagem(d)}
                    className={`rounded-xl px-6 py-3 text-lg font-semibold border transition-all active:scale-95 ${
                      dosagem === d
                        ? "bg-royal text-white border-royal"
                        : "bg-white text-grafite border-linha hover:border-royal/40"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preço + quantidade */}
          <div className="mt-auto pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-grafite-claro">
                  Valor
                </p>
                <p className="text-4xl font-bold text-royal tracking-tight tabular-nums leading-none mt-1">
                  {formatarPreco(produto.precoCentavos)}
                </p>
              </div>

              {/* Seletor de quantidade — pílula compacta */}
              <div className="flex items-center bg-royal-nevoa border border-linha rounded-full p-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  className="w-11 h-11 rounded-full bg-white text-royal text-2xl font-semibold flex items-center justify-center active:scale-90 transition-transform sombra-card"
                >
                  −
                </button>
                <span className="text-xl font-bold text-grafite w-8 text-center tabular-nums">
                  {quantidade}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.min(20, q + 1))}
                  aria-label="Aumentar quantidade"
                  className="w-11 h-11 rounded-full bg-white text-royal text-2xl font-semibold flex items-center justify-center active:scale-90 transition-transform sombra-card"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Ação principal */}
          <div className="mt-5">
            <button
              type="button"
              onClick={adicionarAoCarrinho}
              className={`w-full flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-6 py-5 transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(28,105,181,0.28)] ${
                adicionado ? "bg-green-600" : "degrade-suave"
              }`}
            >
              {adicionado ? (
                "✓ Adicionado!"
              ) : (
                <>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 2-1.6L21 8H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="10" cy="20.5" r="1.5" fill="currentColor" />
                    <circle cx="17" cy="20.5" r="1.5" fill="currentColor" />
                  </svg>
                  Adicionar ao carrinho
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
