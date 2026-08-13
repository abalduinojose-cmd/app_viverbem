// Layout do SITE público: header fixo, rodapé premium e o carrinho
// disponível em todas as páginas (o pedido fecha pelo WhatsApp).
// O painel administrativo (/admin) tem layout próprio, fora deste grupo.
import { CarrinhoGlobal } from "@/components/site/CarrinhoGlobal";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoGlobal>
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </CarrinhoGlobal>
  );
}
