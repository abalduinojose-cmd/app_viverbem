// Monta os links de WhatsApp (wa.me) com mensagem pronta.
// Usado nos botões do totem: interesse num produto e envio do pedido.
import { WHATSAPP_NUMERO, ENTREGA_RETIRADA } from "./tipos";
import { formatarPreco } from "./preco";
import { ItemCarrinho } from "./carrinho";

function linkComMensagem(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/** Link de interesse em UM produto (botão do detalhe do produto). */
export function linkWhatsAppProduto(nome: string, dosagem?: string | null): string {
  const item = dosagem ? `${nome} (${dosagem})` : nome;
  return linkComMensagem(
    `Olá! 👋 Vi no site da Viver Bem e tenho interesse em: *${item}*. Pode me ajudar?`
  );
}

/** Gera um código curto de pedido para a recepção referenciar (ex.: "VB-8F3A"). */
export function gerarCodigoPedido(): string {
  return "VB-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export interface DadosPedido {
  nome: string;
  whatsapp: string;
  pagamento: string; // "Dinheiro" | "Pix" | "Cartão de débito" | "Cartão de crédito"
  entrega: string; // "Retirada na loja" | "Entrega em casa"
  local: string; // a loja escolhida, ou o endereço da entrega
  observacao?: string;
  codigo: string;
}

/** Link com o PEDIDO completo do carrinho, com todas as especificações
 *  para a equipe da farmácia receber e preparar. */
export function linkWhatsAppPedido(itens: ItemCarrinho[], dados: DadosPedido): string {
  const linhas = itens.map((item, i) => {
    const dosagem = item.dosagem ? ` (dosagem ${item.dosagem})` : "";
    const unit = formatarPreco(item.precoCentavos);
    const subtotal = formatarPreco(item.precoCentavos * item.quantidade);
    return `${i + 1}) *${item.nome}*${dosagem}\n    Qtd: ${item.quantidade} × ${unit} = ${subtotal}`;
  });
  const total = itens.reduce((soma, i) => soma + i.precoCentavos * i.quantidade, 0);

  const partes = [
    "🧾 *NOVO PEDIDO · SITE VIVER BEM*",
    `*Pedido:* ${dados.codigo}`,
    `*Cliente:* ${dados.nome}`,
  ];

  if (dados.whatsapp && dados.whatsapp.trim()) {
    partes.push(`*WhatsApp:* ${dados.whatsapp.trim()}`);
  }
  partes.push(`*Pagamento:* ${dados.pagamento}`);

  // Como o pedido chega: a equipe precisa disso antes de preparar
  if (dados.entrega) {
    partes.push(`*Como receber:* ${dados.entrega}`);
    if (dados.local && dados.local.trim()) {
      const rotulo = dados.entrega === ENTREGA_RETIRADA ? "Loja" : "Endereço";
      partes.push(`*${rotulo}:* ${dados.local.trim()}`);
    }
  }

  partes.push("", "*Itens:*", ...linhas, "", `*TOTAL: ${formatarPreco(total)}*`);

  if (dados.observacao && dados.observacao.trim()) {
    partes.push("", `*Observação:* ${dados.observacao.trim()}`);
  }

  partes.push("", "_Pedido feito pelo site. Favor conferir e preparar._ 🙏");

  return linkComMensagem(partes.join("\n"));
}
