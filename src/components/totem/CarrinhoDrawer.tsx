"use client";
// Carrinho do site, em duas etapas:
//   1) "itens"      -> revisar itens (com foto), quantidades e total
//   2) "finalizar"  -> nome, WhatsApp, forma de pagamento e observação
// No final, o pedido inteiro vira uma mensagem pronta no WhatsApp da loja,
// com código, dados do cliente e todas as especificações — para a equipe
// receber e mandar preparar.

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/preco";
import { linkWhatsAppPedido, gerarCodigoPedido } from "@/lib/whatsapp";
import { FotoProduto } from "./FotoProduto";

type Etapa = "itens" | "finalizar";

const ETAPAS: { chave: Etapa; rotulo: string }[] = [
  { chave: "itens", rotulo: "Seus itens" },
  { chave: "finalizar", rotulo: "Seus dados" },
];

export function CarrinhoDrawer() {
  const { itens, totalItens, totalCentavos, mudarQuantidade, remover, limpar } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("itens");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [pagamento, setPagamento] = useState("");
  const [observacao, setObservacao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviado, setEnviado] = useState(false);

  const FORMAS_PAGAMENTO = ["Dinheiro", "Pix", "Cartão de débito", "Cartão de crédito"];
  // Só libera o envio com nome, WhatsApp (10+ dígitos) e forma de pagamento
  const digitosWhats = whatsapp.replace(/\D/g, "");
  const podeEnviar =
    nome.trim().length > 0 && digitosWhats.length >= 10 && pagamento.length > 0;

  function abrir() {
    setEtapa("itens");
    setEnviado(false);
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
  }

  function irParaFinalizar() {
    setCodigo(gerarCodigoPedido());
    setEtapa("finalizar");
  }

  // Abre o WhatsApp com o pedido completo e limpa o carrinho.
  // Antes, registra o cliente na base (nome, WhatsApp e itens) para o
  // painel do gestor — sem travar o envio caso o registro falhe.
  function enviarPedido() {
    if (!podeEnviar) return;

    fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        pagamento,
        codigo,
        totalCentavos,
        itens: itens.map((i) => ({
          nome: i.nome,
          dosagem: i.dosagem,
          quantidade: i.quantidade,
          precoCentavos: i.precoCentavos,
        })),
      }),
    }).catch(() => {
      /* o pedido segue para o WhatsApp mesmo sem o registro */
    });

    const url = linkWhatsAppPedido(itens, {
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      pagamento,
      observacao,
      codigo,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(true);
    limpar();
  }

  // Campo de texto no mesmo padrão nos três usos
  const classeCampo =
    "bg-white border border-linha rounded-2xl px-4 py-3.5 text-base placeholder:text-grafite-claro/70 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition-shadow";

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={abrir}
        aria-label="Abrir carrinho"
        className="degrade-suave fixed bottom-6 right-6 z-40 text-white rounded-full h-14 pl-5 pr-6 flex items-center gap-3 shadow-[0_10px_30px_rgba(224,33,41,0.35)] active:scale-95 transition-all"
      >
        <span className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          {totalItens > 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-white text-escarlate text-[0.7rem] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
              {totalItens}
            </span>
          )}
        </span>
        <span className="font-semibold tabular-nums">
          {totalItens > 0 ? formatarPreco(totalCentavos) : "Carrinho"}
        </span>
      </button>

      {/* Gaveta lateral */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 bg-noite/60 backdrop-blur-sm flex justify-end md:p-3"
          onClick={fechar}
        >
          <div
            className="bg-[#f7f9fc] w-full max-w-md h-full flex flex-col animar-surgir shadow-2xl md:rounded-[1.75rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---------- Cabeçalho ---------- */}
            <div className="bg-noite text-white px-6 pt-6 pb-5 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {etapa === "finalizar" && !enviado && (
                    <button
                      type="button"
                      onClick={() => setEtapa("itens")}
                      aria-label="Voltar ao carrinho"
                      className="shrink-0 text-white/70 hover:text-white -ml-1 active:scale-90 transition-transform"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M19 12H5m0 0 6-6m-6 6 6 6"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                  <h2 className="font-display text-2xl font-semibold tracking-tight truncate">
                    {enviado ? "Tudo certo" : etapa === "itens" ? "Meu pedido" : "Finalizar pedido"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={fechar}
                  aria-label="Fechar carrinho"
                  className="shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center active:scale-90 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Passos do pedido */}
              {!enviado && itens.length > 0 && (
                <div className="flex items-center gap-2 mt-5">
                  {ETAPAS.map((e, i) => {
                    const atual = e.chave === etapa;
                    const passou = e.chave === "itens" && etapa === "finalizar";
                    return (
                      <div key={e.chave} className="flex-1 flex flex-col gap-1.5">
                        <span
                          className={`h-1 rounded-full transition-colors ${
                            atual || passou ? "bg-escarlate" : "bg-white/15"
                          }`}
                        />
                        <span
                          className={`text-[0.7rem] tracking-wide transition-colors ${
                            atual ? "text-white" : "text-white/45"
                          }`}
                        >
                          {i + 1}. {e.rotulo}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Resumo: itens e total */}
              {!enviado && itens.length > 0 && (
                <div className="flex items-end justify-between mt-5 pt-4 border-t border-white/10">
                  <span className="text-white/60 text-sm">
                    {totalItens} {totalItens === 1 ? "item" : "itens"}
                    {etapa === "finalizar" && codigo ? ` · ${codigo}` : ""}
                  </span>
                  <span className="font-display text-3xl font-semibold tracking-tight tabular-nums">
                    {formatarPreco(totalCentavos)}
                  </span>
                </div>
              )}
            </div>

            {/* ---------- Confirmação de envio ---------- */}
            {enviado ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-semibold text-grafite">Pedido enviado</h3>
                <p className="text-grafite-medio leading-relaxed">
                  Abrimos o WhatsApp com o seu pedido <b className="text-grafite">{codigo}</b>.
                  Envie a mensagem e a nossa equipe combina o pagamento e a entrega com você.
                </p>
                <button
                  type="button"
                  onClick={fechar}
                  className="mt-2 bg-royal hover:bg-royal-escuro text-white font-semibold rounded-2xl px-8 py-3.5 active:scale-95 transition-all"
                >
                  Concluir
                </button>
              </div>
            ) : etapa === "itens" ? (
              /* ---------- Etapa 1: itens ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
                  {itens.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                      <span className="w-20 h-20 rounded-full bg-royal-claro text-royal flex items-center justify-center">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 2-1.6L21 8H6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <div>
                        <p className="font-display text-xl font-semibold text-grafite">
                          Seu carrinho está vazio
                        </p>
                        <p className="text-grafite-medio mt-1">
                          Escolha os produtos e monte o seu pedido.
                        </p>
                      </div>
                      <Link
                        href="/produtos"
                        onClick={fechar}
                        className="bg-royal hover:bg-royal-escuro text-white font-semibold rounded-2xl px-7 py-3.5 active:scale-95 transition-all"
                      >
                        Ver produtos
                      </Link>
                    </div>
                  )}

                  {itens.map((item) => (
                    <div
                      key={`${item.produtoId}-${item.dosagem ?? ""}`}
                      className="bg-white border border-linha rounded-[1.35rem] p-3.5 flex gap-3.5"
                    >
                      {/* Foto do produto */}
                      <div className="shrink-0 w-20 h-20 rounded-2xl bg-royal-nevoa overflow-hidden flex items-center justify-center p-1.5">
                        <FotoProduto
                          fotoUrl={item.fotoUrl ?? null}
                          nome={item.nome}
                          className="max-w-full max-h-full !object-contain"
                        />
                      </div>

                      {/* Dados + controles */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-grafite leading-snug line-clamp-2">
                              {item.nome}
                            </p>
                            {item.dosagem && (
                              <span className="inline-block mt-1 bg-royal-claro text-royal text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full">
                                {item.dosagem}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remover(item.produtoId, item.dosagem)}
                            aria-label={`Remover ${item.nome}`}
                            className="shrink-0 text-grafite-claro hover:text-escarlate p-1 -mr-1 -mt-1 transition-colors"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2.5">
                          {/* Contador de quantidade */}
                          <div className="flex items-center border border-linha rounded-full">
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, -1)}
                              aria-label="Diminuir"
                              className="w-8 h-8 rounded-full text-grafite-medio hover:text-royal hover:bg-royal-claro text-lg flex items-center justify-center active:scale-90 transition-all"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold text-grafite w-6 text-center tabular-nums">
                              {item.quantidade}
                            </span>
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, 1)}
                              aria-label="Aumentar"
                              className="w-8 h-8 rounded-full text-grafite-medio hover:text-royal hover:bg-royal-claro text-lg flex items-center justify-center active:scale-90 transition-all"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-grafite font-bold tabular-nums">
                            {formatarPreco(item.precoCentavos * item.quantidade)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {itens.length > 0 && (
                  <div className="bg-white border-t border-linha px-5 py-5">
                    <button
                      type="button"
                      onClick={irParaFinalizar}
                      className="degrade-suave w-full flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-6 py-4 active:scale-[0.98] transition-transform"
                    >
                      Continuar
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={limpar}
                      className="w-full mt-1.5 text-grafite-claro hover:text-escarlate font-medium py-2 text-sm transition-colors"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* ---------- Etapa 2: finalizar ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite text-sm">Seu nome *</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      autoFocus
                      placeholder="Como podemos te chamar?"
                      className={classeCampo}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite text-sm">Seu WhatsApp *</span>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      inputMode="tel"
                      placeholder="(24) 99999-9999"
                      className={classeCampo}
                    />
                  </label>

                  {/* Forma de pagamento */}
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite text-sm">Forma de pagamento *</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {FORMAS_PAGAMENTO.map((forma) => (
                        <button
                          key={forma}
                          type="button"
                          onClick={() => setPagamento(forma)}
                          className={`rounded-2xl px-4 py-3.5 text-sm font-medium border transition-all active:scale-95 ${
                            pagamento === forma
                              ? "bg-royal text-white border-royal"
                              : "bg-white text-grafite border-linha hover:border-royal/40"
                          }`}
                        >
                          {forma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite text-sm">
                      Observação <span className="text-grafite-claro font-normal">(opcional)</span>
                    </span>
                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      rows={3}
                      placeholder="Alguma preferência ou informação para a equipe?"
                      className={`${classeCampo} resize-y`}
                    />
                  </label>

                  {/* Resumo com miniaturas */}
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite text-sm">Resumo</span>
                    {itens.map((item) => (
                      <div
                        key={`r-${item.produtoId}-${item.dosagem ?? ""}`}
                        className="bg-white border border-linha rounded-2xl p-2.5 flex items-center gap-3"
                      >
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-royal-nevoa overflow-hidden flex items-center justify-center p-1">
                          <FotoProduto
                            fotoUrl={item.fotoUrl ?? null}
                            nome={item.nome}
                            className="max-w-full max-h-full !object-contain"
                          />
                        </div>
                        <span className="flex-1 min-w-0 text-sm text-grafite truncate">
                          {item.quantidade}× {item.nome}
                          {item.dosagem ? ` (${item.dosagem})` : ""}
                        </span>
                        <span className="text-sm font-semibold text-grafite tabular-nums">
                          {formatarPreco(item.precoCentavos * item.quantidade)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-t border-linha px-5 py-5">
                  <button
                    type="button"
                    onClick={enviarPedido}
                    disabled={!podeEnviar}
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb857] disabled:opacity-40 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-2xl px-6 py-4 transition-colors active:scale-[0.98]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                    </svg>
                    Enviar pedido no WhatsApp
                  </button>
                  <p className="text-xs text-grafite-claro text-center mt-3 leading-relaxed">
                    Seus dados (nome e WhatsApp) ficam com a Viver Bem apenas para
                    atendimento e ofertas, conforme a LGPD.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
