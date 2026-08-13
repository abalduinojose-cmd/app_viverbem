"use client";
// Disponibiliza o carrinho (estado + botão flutuante + gaveta) em todas
// as páginas do site. O pedido é finalizado pelo WhatsApp da farmácia.
import { CarrinhoProvider } from "@/lib/carrinho";
import { CarrinhoDrawer } from "@/components/totem/CarrinhoDrawer";

export function CarrinhoGlobal({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoProvider>
      {children}
      <CarrinhoDrawer />
    </CarrinhoProvider>
  );
}
