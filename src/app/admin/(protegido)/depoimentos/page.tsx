// Gestão de avaliações — DESATIVADA a pedido do cliente.
// A tela saiu do menu e o acesso direto pela URL é redirecionado.
// As avaliações continuam aparecendo no totem (cadastradas no seed).
// Para reativar: restaure a listagem e devolva o item no menu do
// layout em src/app/admin/(protegido)/layout.tsx.
import { redirect } from "next/navigation";

export default function PaginaDepoimentos() {
  redirect("/admin/produtos");
}
