"use client";
// Carrinho do totem — visual premium alinhado à marca.
// Tem 2 etapas:
//   1) "itens"      -> revisar itens (com foto), quantidades e total
//   2) "finalizar"  -> nome, WhatsApp, forma de pagamento e observação
// No final, o pedido inteiro vira uma mensagem pronta no WhatsApp da loja,
// com código, dados do cliente e todas as especificações — para a recepção
// receber e mandar preparar.

import { useState } from "react";
import { useCarrinho } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/preco";
import { linkWhatsAppPedido, gerarCodigoPedido } from "@/lib/whatsapp";
import { FotoProduto } from "./FotoProduto";

type Etapa = "itens" | "finalizar";

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

  return (
    <>
      {/* Botão flutuante — vermelho da marca */}
      <button
        type="button"
        onClick={abrir}
        aria-label="Abrir carrinho"
        className="degrade-suave fixed bottom-6 right-6 z-40 text-white rounded-2xl h-16 pl-5 pr-6 flex items-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(224,33,41,0.35)]"
      >
        <span className="relative">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            <span className="absolute -top-2 -right-2 bg-white text-escarlate text-xs font-extrabold rounded-full min-w-6 h-6 px-1 flex items-center justify-center shadow-sm">
              {totalItens}
            </span>
          )}
        </span>
        <span className="font-semibold text-base tabular-nums">
          {totalItens > 0 ? formatarPreco(totalCentavos) : "Carrinho"}
        </span>
      </button>

      {/* Gaveta lateral */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 bg-grafite/50 backdrop-blur-sm flex justify-end"
          onClick={fechar}
        >
          <div
            className="bg-[#f7f9fc] w-full max-w-md h-full flex flex-col animar-surgir shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---------- Cabeçalho premium (azul da marca) ---------- */}
            <div className="relative bg-royal text-white px-6 pt-6 pb-7 overflow-hidden shrink-0">
              {/* Elementos decorativos suaves */}
              <div
                className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-white/5"
                aria-hidden="true"
              />
              <div
                className="absolute -left-10 -bottom-20 w-40 h-40 rounded-full bg-white/5"
                aria-hidden="true"
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {etapa === "finalizar" && !enviado && (
                    <button
                      type="button"
                      onClick={() => setEtapa("itens")}
                      aria-label="Voltar ao carrinho"
                      className="text-white/80 hover:text-white -ml-1 active:scale-90 transition-transform"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                  <div>
                    <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-white/60">
                      Viver Bem
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight leading-tight">
                      {etapa === "itens" ? "Meu pedido" : "Finalizar pedido"}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fechar}
                  aria-label="Fechar carrinho"
                  className="bg-white/15 hover:bg-white/25 text-white rounded-full w-11 h-11 flex items-center justify-center active:scale-90 transition-all"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Resumo dentro do cabeçalho */}
              {!enviado && itens.length > 0 && (
                <div className="relative mt-5 flex items-end justify-between">
                  <span className="text-white/70 text-sm">
                    {totalItens} {totalItens === 1 ? "item" : "itens"}
                    {etapa === "finalizar" && codigo ? ` · ${codigo}` : ""}
                  </span>
                  <span className="text-3xl font-bold tracking-tight tabular-nums">
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
                <h3 className="text-2xl font-bold text-grafite">Pedido enviado!</h3>
                <p className="text-grafite-medio leading-relaxed">
                  Abrimos o WhatsApp com o seu pedido <b className="text-grafite">{codigo}</b>.
                  Envie a mensagem e dirija-se à recepção — sua listinha já está a caminho. 🙏
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
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3.5">
                  {itens.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
                      <span className="w-20 h-20 rounded-full bg-royal-claro text-royal flex items-center justify-center">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 2-1.6L21 8H6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <p className="text-grafite-medio text-lg">
                        Seu carrinho está vazio.
                        <br />
                        <span className="text-grafite-claro text-base">
                          Toque num produto para adicionar.
                        </span>
                      </p>
                    </div>
                  )}

                  {itens.map((item) => (
                    <div
                      key={`${item.produtoId}-${item.dosagem ?? ""}`}
                      className="bg-white border border-linha rounded-[1.35rem] p-3.5 sombra-card flex gap-3.5"
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
                            className="shrink-0 text-grafite-claro hover:text-escarlate p-1 -mr-1 -mt-1"
                          >
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                          {/* Stepper compacto */}
                          <div className="flex items-center bg-royal-nevoa rounded-full p-1 gap-1">
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, -1)}
                              aria-label="Diminuir"
                              className="w-9 h-9 rounded-full bg-white text-royal text-xl font-semibold flex items-center justify-center active:scale-90 transition-transform sombra-card"
                            >
                              −
                            </button>
                            <span className="text-base font-bold text-grafite w-7 text-center tabular-nums">
                              {item.quantidade}
                            </span>
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, 1)}
                              aria-label="Aumentar"
                              className="w-9 h-9 rounded-full bg-white text-royal text-xl font-semibold flex items-center justify-center active:scale-90 transition-transform sombra-card"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-royal font-bold text-lg tabular-nums">
                            {formatarPreco(item.precoCentavos * item.quantidade)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {itens.length > 0 && (
                  <div className="bg-white border-t border-linha px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-grafite-medio">Total do pedido</span>
                      <span className="text-3xl font-bold text-royal tabular-nums tracking-tight">
                        {formatarPreco(totalCentavos)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={irParaFinalizar}
                      className="degrade-suave w-full flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-6 py-5 active:scale-[0.98] transition-all"
                    >
                      Finalizar pedido
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={limpar}
                      className="w-full mt-2 text-grafite-claro hover:text-escarlate font-medium py-2 text-sm"
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
                    <span className="font-semibold text-grafite">Seu nome *</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      autoFocus
                      placeholder="Como a recepção vai te chamar?"
                      className="bg-white border border-linha rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite">Seu WhatsApp *</span>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      inputMode="tel"
                      placeholder="(24) 99999-9999"
                      className="bg-white border border-linha rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40"
                    />
                  </label>

                  {/* Forma de pagamento */}
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite">Forma de pagamento *</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {FORMAS_PAGAMENTO.map((forma) => (
                        <button
                          key={forma}
                          type="button"
                          onClick={() => setPagamento(forma)}
                          className={`rounded-2xl px-4 py-3.5 text-base font-medium border transition-all active:scale-95 ${
                            pagamento === forma
                              ? "bg-royal text-white border-royal shadow-[0_6px_18px_rgba(28,105,181,0.3)]"
                              : "bg-white text-grafite border-linha hover:border-royal/40"
                          }`}
                        >
                          {forma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite">
                      Observação <span className="text-grafite-claro font-normal">(opcional)</span>
                    </span>
                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      rows={3}
                      placeholder="Alguma preferência ou informação para a equipe?"
                      className="bg-white border border-linha rounded-2xl px-4 py-3 text-base resize-y focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40"
                    />
                  </label>

                  {/* Resumo com miniaturas */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-semibold text-grafite">Resumo</span>
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

                <div className="bg-white border-t border-linha px-6 py-5">
                  <p className="text-sm text-grafite-claro text-center mb-3">
                    Ao enviar, abriremos o WhatsApp com seu pedido para a nossa equipe preparar.
                    Seus dados (nome e WhatsApp) ficam com a Viver Bem apenas para atendimento
                    e ofertas, conforme a LGPD.
                  </p>
                  <button
                    type="button"
                    onClick={enviarPedido}
                    disabled={!podeEnviar}
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-2xl px-6 py-5 transition-colors active:scale-[0.98]"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                    </svg>
                    Enviar pedido no WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
