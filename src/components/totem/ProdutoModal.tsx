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
        className="bg-white rounded-[1.75rem] shadow-2xl w-full max-w-3xl max-h-full overflow-y-auto relative animar-surgir"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar — grande para toque */}
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-10 bg-white/95 border border-linha text-grafite-medio hover:text-grafite rounded-full w-12 h-12 flex items-center justify-center sombra-card active:scale-90 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="bg-royal-nevoa flex items-center justify-center h-60 md:h-72 p-6">
          <FotoProduto fotoUrl={produto.fotoUrl} nome={produto.nome} className="max-w-full max-h-full !object-contain" />
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {produto.novidade && (
              <span className="bg-escarlate text-white text-xs font-semibold tracking-wide px-3 py-1 rounded-full">
                NOVIDADE
              </span>
            )}
            {produto.tipo === TIPO_COMBO && (
              <span className="bg-royal text-white text-xs font-semibold tracking-wide px-3 py-1 rounded-full">
                COMBO
              </span>
            )}
            {produto.categoriaNome && (
              <span className="bg-royal-claro text-royal text-xs font-medium px-3 py-1 rounded-full">
                {produto.categoriaNome}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-grafite mt-3 tracking-tight">{produto.nome}</h2>
          <p className="text-grafite-medio text-base md:text-lg mt-3 leading-relaxed">
            {produto.descricao}
          </p>

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
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 bg-royal-nevoa border border-linha rounded-2xl p-5">
            <div>
              <p className="text-sm text-grafite-claro">Valor</p>
              <p className="text-3xl md:text-4xl font-bold text-royal tracking-tight tabular-nums">
                {formatarPreco(produto.precoCentavos)}
              </p>
            </div>

            {/* Seletor de quantidade — botões grandes para toque */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="w-14 h-14 rounded-2xl bg-white border border-linha text-grafite text-3xl font-semibold active:scale-90 transition-transform hover:border-royal/40"
              >
                −
              </button>
              <span className="text-3xl font-bold text-grafite w-10 text-center tabular-nums">{quantidade}</span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.min(20, q + 1))}
                aria-label="Aumentar quantidade"
                className="w-14 h-14 rounded-2xl bg-white border border-linha text-grafite text-3xl font-semibold active:scale-90 transition-transform hover:border-royal/40"
              >
                +
              </button>
            </div>
          </div>

          {/* Ação principal */}
          <div className="mt-5">
            <button
              type="button"
              onClick={adicionarAoCarrinho}
              className={`w-full flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-6 py-5 transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(224,33,41,0.28)] ${
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
