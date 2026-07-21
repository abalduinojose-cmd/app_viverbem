"use client";
// Carrinho do totem: botão flutuante com contador + gaveta com os itens.
// Tem 2 etapas:
//   1) "itens"      -> revisar itens, quantidades e total
//   2) "finalizar"  -> cliente informa o nome (e observação) e confirma
// No final, o pedido inteiro vira uma mensagem pronta no WhatsApp da loja,
// com código, nome do cliente e todas as especificações — para a recepção
// receber e mandar preparar.

import { useState } from "react";
import { useCarrinho } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/preco";
import { linkWhatsAppPedido, gerarCodigoPedido } from "@/lib/whatsapp";

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

  // Abre o WhatsApp com o pedido completo e limpa o carrinho
  function enviarPedido() {
    if (!podeEnviar) return;
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
      {/* Botão flutuante — sempre visível no catálogo */}
      <button
        type="button"
        onClick={abrir}
        aria-label="Abrir carrinho"
        className="fixed bottom-6 right-6 z-40 degrade-marca text-white rounded-2xl shadow-xl h-16 pl-5 pr-6 flex items-center gap-3 active:scale-95 transition-transform"
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
            <span className="absolute -top-2 -right-2 bg-white text-escarlate text-xs font-extrabold rounded-full min-w-6 h-6 px-1 flex items-center justify-center">
              {totalItens}
            </span>
          )}
        </span>
        <span className="font-semibold text-base">
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
            className="bg-[#fbfcfe] w-full max-w-md h-full flex flex-col animar-surgir shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho — faixa de degradê da marca no topo */}
            <span className="h-1.5 degrade-marca shrink-0" aria-hidden="true" />
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-linha">
              <div className="flex items-center gap-3">
                {etapa === "finalizar" && !enviado && (
                  <button
                    type="button"
                    onClick={() => setEtapa("itens")}
                    aria-label="Voltar ao carrinho"
                    className="text-grafite-medio hover:text-grafite -ml-1"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                <h2 className="text-2xl font-bold text-grafite tracking-tight">
                  {etapa === "itens" ? "Meu pedido" : "Finalizar pedido"}
                </h2>
              </div>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar carrinho"
                className="bg-royal-nevoa text-grafite-medio hover:text-grafite rounded-full w-11 h-11 flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
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
                  className="mt-2 bg-royal text-white font-semibold rounded-2xl px-8 py-3.5 active:scale-95 transition-transform"
                >
                  Concluir
                </button>
              </div>
            ) : etapa === "itens" ? (
              /* ---------- Etapa 1: itens ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                  {itens.length === 0 && (
                    <p className="text-grafite-claro text-center py-16 text-lg">
                      Seu carrinho está vazio.
                      <br />
                      Toque num produto para adicionar!
                    </p>
                  )}

                  {itens.map((item) => (
                    <div
                      key={`${item.produtoId}-${item.dosagem ?? ""}`}
                      className="bg-white border border-linha rounded-2xl p-4 sombra-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-grafite leading-snug">{item.nome}</p>
                          {item.dosagem && (
                            <span className="inline-block mt-1 bg-royal-claro text-royal text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {item.dosagem}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => remover(item.produtoId, item.dosagem)}
                          aria-label={`Remover ${item.nome}`}
                          className="text-grafite-claro hover:text-escarlate p-2"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => mudarQuantidade(item.produtoId, item.dosagem, -1)}
                            aria-label="Diminuir"
                            className="w-11 h-11 rounded-xl bg-royal-nevoa text-royal text-2xl font-semibold active:scale-90 transition-transform"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-grafite w-8 text-center tabular-nums">
                            {item.quantidade}
                          </span>
                          <button
                            type="button"
                            onClick={() => mudarQuantidade(item.produtoId, item.dosagem, 1)}
                            aria-label="Aumentar"
                            className="w-11 h-11 rounded-xl bg-royal-nevoa text-royal text-2xl font-semibold active:scale-90 transition-transform"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-royal font-bold text-xl tabular-nums">
                          {formatarPreco(item.precoCentavos * item.quantidade)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {itens.length > 0 && (
                  <div className="bg-white border-t border-linha px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg text-grafite-medio">Total</span>
                      <span className="text-3xl font-bold text-royal tabular-nums">
                        {formatarPreco(totalCentavos)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={irParaFinalizar}
                      className="w-full flex items-center justify-center gap-3 bg-escarlate hover:bg-escarlate-escuro text-white text-lg font-semibold rounded-2xl px-6 py-5 active:scale-[0.98] transition-all shadow-[0_8px_24px_rgba(224,33,41,0.3)]"
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
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  <div className="bg-royal-nevoa border border-linha rounded-2xl px-4 py-3">
                    <p className="text-sm text-grafite-medio">
                      Pedido <b className="text-grafite">{codigo}</b> · {totalItens}{" "}
                      {totalItens === 1 ? "item" : "itens"} ·{" "}
                      <b className="text-royal">{formatarPreco(totalCentavos)}</b>
                    </p>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite">Seu nome *</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      autoFocus
                      placeholder="Como a recepção vai te chamar?"
                      className="border border-linha rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite">Seu WhatsApp *</span>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      inputMode="tel"
                      placeholder="(24) 99999-9999"
                      className="border border-linha rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40"
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
                    <span className="font-semibold text-grafite">
                      Observação <span className="text-grafite-claro font-normal">(opcional)</span>
                    </span>
                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      rows={3}
                      placeholder="Alguma preferência ou informação para a equipe?"
                      className="border border-linha rounded-2xl px-4 py-3 text-base resize-y focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40"
                    />
                  </label>

                  {/* Resumo dos itens */}
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-grafite">Resumo</span>
                    {itens.map((item) => (
                      <div
                        key={`r-${item.produtoId}-${item.dosagem ?? ""}`}
                        className="flex justify-between text-sm text-grafite-medio"
                      >
                        <span>
                          {item.quantidade}× {item.nome}
                          {item.dosagem ? ` (${item.dosagem})` : ""}
                        </span>
                        <span className="tabular-nums">
                          {formatarPreco(item.precoCentavos * item.quantidade)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-t border-linha px-6 py-5">
                  <p className="text-sm text-grafite-claro text-center mb-3">
                    Ao enviar, abriremos o WhatsApp com seu pedido para a recepção preparar.
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
